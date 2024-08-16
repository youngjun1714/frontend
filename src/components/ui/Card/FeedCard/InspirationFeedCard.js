import { useState } from 'react';
import styles from '@/components/ui/Card/FeedCard/FeedCard.module.scss';
import { useRecoilValue } from 'recoil';
import moment from 'moment';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import { Menu } from '@mui/material';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';

import useLikePost from '@/hooks/useLikePost';
import useBookmarkPost from '@/hooks/useBookmarkPost';
import { customToast } from '@/utils/customToast';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import shareArticle from '@/utils/shareArticle';
import MenuList from '../../MenuList/MenuList';
import ReportIcon from '../../Icons/ReportIcon';
import Dots from '../../Icons/Dots';
import CommentFilled from '../../Icons/CommentFilled';
import ViewFilled from '../../Icons/ViewFilled';
import ClapFilled from '../../Icons/ClapFilled';
import Verified from '../../Icons/Verified';
import MobileInteractionLargeIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionLargeIcon';
import Picture from '../../Picture/Picture';
import dynamic from 'next/dynamic';

const ArtworkReport = dynamic(() =>
  import('@/views/artwork/components/artwork-report/ArtworkReport')
);
const MobileReport = dynamic(() =>
  import('@/components/mobile-ui/MobileReport/MobileReport')
);

const REPORT_POST = gql`
  mutation ReportPost($postId: ID!, $input: ReportPostInput) {
    reportPost(postId: $postId, input: $input) {
      id
      reason
      description
      createdAt
    }
  }
`;

const InspirationFeedCard = ({ post }) => {
  const router = useRouter();
  // me
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // mui Menu open
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // modal contents
  const [clickModal, setClickModal] = useState('');

  const [likeSubmit, { loading: likeLoading }] = useLikePost(post.id);
  const [bookmarkSubmit, { loading: bookmarkLoading }] = useBookmarkPost(
    post.id
  );
  // like
  const handleLike = () => likeSubmit();
  const handleBookmark = async () => {
    const { data } = await bookmarkSubmit();
    const { bookmarkPost } = data;
    if (bookmarkPost.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  // report
  const [report, setReport] = useState('');
  const INPUT_MAX_LENGTH = 500;
  const handleInputReport = (e) => {
    if (e.target.value.length > INPUT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, INPUT_MAX_LENGTH);
    }
    setReport(e.target.value);
  };

  const [reportPost] = useMutation(REPORT_POST, {
    refetchQueries: ['GetFeeds', 'GetCurrentUser'],
  });

  const handleReport = async (value) => {
    try {
      await reportPost({
        variables: {
          postId: post.id,
          input: {
            reason: value[0].description,
            description: report,
          },
        },
      });
      customToast({
        msg: <>Your report has been successfully submitted.</>,
        autoClose: 2000,
      });

      setTimeout(() => {
        router.reload();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  const { user } = post;

  const renderImages = () =>
    post?.images?.map((image, i) => (
      <SwiperSlide key={i} style={{ backgroundColor: 'white' }}>
        <Picture
          url={image}
          objectFit="cover"
          alt="image"
          placeholder="blur"
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          style={{ cursor: 'pointer' }}
          loading={post.images.length === 1 ? 'lazy' : 'eager'}
          className={styles.image}
        />
      </SwiperSlide>
    ));

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.link}>
          <Link href={`/artist/${user?.id}`}>
            <Avatar
              type="mobile-md"
              image={user.profileImgUrl}
              username={user.nickname}
            />
          </Link>
          <Link href={`/artist/${user?.id}`}>
            <div className={styles.user}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <p className={styles.author}>
                  {user.nickname}&nbsp;
                  {user.isPartner && (
                    <>
                      <Verified />
                      &nbsp;
                    </>
                  )}
                  <span>· {moment(post?.createdAt).fromNowOrNow()}</span>
                </p>
                {user.isPartner && (
                  <p className={styles.nickname}>@{user.artistName}</p>
                )}
              </div>
            </div>
          </Link>
        </div>
        <AuthRequiredButtonWrapper onClick={handleMenuOpen}>
          <button className={styles.hoverBlack} type="button">
            <Dots color="var(--artiside-neutral2)" />
          </button>
        </AuthRequiredButtonWrapper>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <div className={styles.menu}>
            {me?.id === user?.id ? (
              <>
                <MenuList text="Edit" />
                <MenuList text="Delete" />
              </>
            ) : (
              <MenuList
                icon={<ReportIcon />}
                text="Report"
                onClick={() => {
                  if (
                    me.lastReportAt &&
                    moment(me.lastReportAt)
                      .add(24, 'hours')
                      .isAfter(moment.now())
                  ) {
                    customToast({
                      toastType: 'error',
                      msg: <>You can only report once a day</>,
                      autoClose: 2000,
                    });
                    return;
                  }
                  setClickModal('report');
                }}
              />
            )}
            {clickModal === 'report' && (
              <ArtworkReport
                onClick={handleReport}
                open={clickModal === 'report'}
                onHandleInput={handleInputReport}
                report={report}
                onClose={() => setClickModal('')}
              />
            )}
            {clickModal === 'report' && (
              <MobileReport
                onClick={handleReport}
                open={clickModal === 'report'}
                onHandleInput={handleInputReport}
                report={report}
                onClose={() => setClickModal('')}
              />
            )}
          </div>
        </Menu>
      </div>

      <div className={styles.cardImage}>
        <Link href={`/inspiration/${post.id}`}>
          <div className={styles.imageWrapper}>
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
        </Link>
      </div>
      <div className={styles.cardBottom}>
        <div>
          <div className={styles.count}>
            <ClapFilled />
            {post.likeCount || 0}
          </div>
          <div className={styles.count}>
            <ViewFilled />
            {post.viewCount || 0}
          </div>
          <div className={styles.count}>
            <CommentFilled />
            {post.commentCount || 0}
          </div>
        </div>
        <div className={styles.interactionButton}>
          <AuthRequiredButtonWrapper
            onClick={() => {
              handleLike();
            }}
          >
            <button
              className={post.isLiked ? styles.isLiked : ''}
              aria-label="like"
            >
              <MobileInteractionLargeIcon shape="clap" isLiked={post.isLiked} />
            </button>
          </AuthRequiredButtonWrapper>
          <AuthRequiredButtonWrapper onClick={() => handleBookmark()}>
            <button
              className={post.isBookmarked ? styles.isBookmarked : ''}
              aria-label="bookmark"
            >
              <MobileInteractionLargeIcon
                shape="bookmark"
                isBookmarked={post.isBookmarked}
              />
            </button>
          </AuthRequiredButtonWrapper>
          <button
            onClick={() => {
              try {
                shareArticle(post?.id, 'inspiration');
                customToast({
                  msg: <>Copied</>,
                });
              } catch (e) {
                console.log(e);
                customToast({
                  toastType: 'error',
                  msg: <>Error</>,
                });
              }
            }}
            aria-label="share"
          >
            <MobileInteractionLargeIcon shape="share" />
          </button>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h1>{post?.title}</h1>
        <div>
          <p className={styles.about}>{post?.description}</p>
          {post?.description.length > 192 && (
            <Link href={`/inspiration/${post.id}`}>
              <button className={styles.moreView} aria-label="more" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default InspirationFeedCard;
