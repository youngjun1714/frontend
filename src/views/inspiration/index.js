import { useState } from 'react';
import styles from './Inspiration.module.scss';
import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useRecoilValue } from 'recoil';

import { Container, Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import InspirationInfoSection from './components/inspiration-info-section/InspirationInfoSection';
import useLikePost from '@/hooks/useLikePost';
import { useEffect } from 'react';
import tokenStore from '@/adf-connect/utils/token-store';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import InspirationMoreBy from './components/inspiration-more-by/InspirationMoreBy';
import ImageDetail from '@/components/ui/ImageDetail/ImageDetail';
import ImageDetails from '@/components/ui/ImageDetail/ImageDetails';
import { useRouter } from 'next/router';
import MobileInspirationTitle from './components/mobile/MobileInspirationTitle/MobileInspirationTitle';
import MobileInspirationSection from './components/mobile/MobileInspirationSection/MobileInspirationSection';
import Picture from '@/components/ui/Picture/Picture';

const GET_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      user {
        id
        wallet
        nickname
        profileImgUrl
        coverImgUrl
        isPartner
        artistName
      }
      title
      description
      tags
      mainImage
      images
      likeCount
      viewCount
      favoriteCount
      commentCount
      createdAt
      updatedAt
      isLiked
      isBookmarked
    }
  }
`;

const InspirationDetail = (props) => {
  const { postId } = props;

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const router = useRouter();

  // GET_POST
  const {
    loading,
    data,
    refetch: postRefetch,
    error,
  } = useQuery(GET_POST, {
    variables: {
      postId,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getPost } = data || {};
  const { user } = getPost || {};

  // LIKE_POST
  const [submit, { loading: likeMutationLoading }] = useLikePost(postId);
  const handleLike = () => submit();

  useEffect(() => {
    if (!postId) {
      return;
    }
    const token = tokenStore.get('accessToken');
    const headers = !!token ? { Authorization: `Bearer ${token}` } : {};
    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/pageview/post`,
      {
        postId,
      },
      {
        headers,
      }
    );
  }, [postId]);

  const renderImages = () =>
    getPost?.images?.map((image, i) => (
      <SwiperSlide
        key={i}
        onClick={() => setOpen(true)}
        style={{ backgroundColor: '#FFF' }}
      >
        <Picture
          url={image}
          objectFit="contain"
          alt="image"
          loading="eager"
          sizes="(max-width: 768px) 80vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ cursor: 'pointer' }}
        />
      </SwiperSlide>
    ));

  // View image detail
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  if (error && error.message.includes('not found')) {
    router.replace('/');
  }

  return (
    <>
      <Head>
        <title>{getPost?.title || 'Inspiration'} | Artiside</title>
      </Head>
      <section>
        <Container
          sx={{
            maxWidth: '1600px !important',
            padding: 0,
            '@media (min-width: 600px)': {
              paddingLeft: '0 !important',
              paddingRight: '0 !important',
            },
          }}
        >
          <button
            className={styles.topMenu}
            onClick={() => {
              router.push('/?tab=inspiration');
            }}
            aria-label="back"
          >
            <ArrowIcon
              direction="left"
              dimension={30}
              color="var(--artiside-neutral1)"
            />
          </button>
          <MobileInspirationTitle
            data={getPost}
            user={user}
            me={me}
            isMe={user?.id === me?.id}
          />
          <Grid
            container
            spacing={3}
            xs={12}
            sx={{
              margin: 0,
            }}
          >
            <Grid
              xs={12}
              sm={12}
              md={6.5}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              {loading ? (
                <div className={styles.image}>
                  <Skeleton width="100%" height="100%" />
                </div>
              ) : (
                <>
                  <div className={styles.image}>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={30}
                      loop={true}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={true}
                      preventClicks={false}
                      modules={[Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {renderImages()}
                    </Swiper>
                  </div>
                </>
              )}
            </Grid>
            <MobileInspirationSection
              likeCount={getPost?.likeCount}
              viewCount={getPost?.viewCount}
              toggleLike={handleLike}
              postId={postId}
              createdAt={getPost?.createdAt}
              text={getPost?.description}
              title={getPost?.title}
              author={user?.nickname}
              commentCount={getPost?.commentCount}
              isBookmarked={getPost?.isBookmarked}
              isLiked={getPost?.isLiked}
            />
            <Grid xs={12} sm={12} md={5.5}>
              <InspirationInfoSection
                postId={postId}
                data={getPost}
                toggleLike={handleLike}
                postRefetch={postRefetch}
                dataLoading={loading}
              />
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={12}
              marginBottom={20}
              sx={{
                marginBottom: 20,
                '@media(max-width: 480px)': { marginBottom: 3 },
              }}
            >
              <InspirationMoreBy data={getPost} dataLoading={loading} />
            </Grid>
          </Grid>
        </Container>
      </section>

      {getPost?.images?.length === 1 && (
        <ImageDetail
          open={open}
          onClose={handleClose}
          imageUrl={getPost?.images[0]}
        />
      )}
      {getPost?.images?.length > 1 && (
        <ImageDetails
          open={open}
          onClose={handleClose}
          imageUrls={getPost?.images}
        />
      )}
    </>
  );
};

export default InspirationDetail;
