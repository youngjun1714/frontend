import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import styles from '@/views/artwork/Artwork.module.scss';
import { useQuery, gql, useMutation } from '@apollo/client';
import tokenStore from '@/adf-connect/utils/token-store';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import {
  CircularProgress,
  Container,
  Unstable_Grid2 as Grid,
} from '@mui/material';

import stores from '@/store';
import useLikeArtwork from '@/hooks/useLikeArtwork';
import ArtworkInfoSection from '@/views/artwork/components/artwork-info-section/ArtworkInfoSection';
import ArtworkDataSection from './components/artwork-data-section/ArtworkDataSection';
import ArtworkCategories from './components/artwork-data-section/artwork-categories/ArtworkCategories';
import ArtworkMoreBy from './components/artwork-data-section/artwork-more-by/ArtworkMoreBy';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import ImageDetail from '@/components/ui/ImageDetail/ImageDetail';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import { useRouter } from 'next/router';
import ArtworkCardHidden from '@/components/ui/Card/ArtworkCard/ArtworkCardHidden';
import { customToast } from '@/utils/customToast';
import MobileArtworkTitle from './components/mobile/MobileArtworkTitle/MobileArtworkTitle';
import MobileArtworkSection from './components/mobile/MobileArtworkSection/MobileArtworkSection';
import MobileArtworkStickySection from './components/mobile/MobileArtworkStickySection/MobileArtworkStickySection';
import MobileArtworkOwner from './components/mobile/MobileArtworkOwner/MobileArtworkOwner';
import Media from '@/components/ui/Media/Media';

// query
// artwork info
const GET_ARTWORK = gql`
  query getArtwork($artworkId: ID!) {
    getArtwork(artworkId: $artworkId) {
      artworkId
      name
      tokenId
      likeCount
      viewCount
      favoriteCount
      commentCount
      artworkUrl
      mediaType
      thumbnailUrl
      metaUrl
      category
      isArtisideVisible
      artisideHiddenAt
      artworkInfo {
        title
        creationYear
        edition
        medium
        width
        height
        about
      }
      createdAt
      importedAt
      creator {
        id
        wallet
        nickname
        artistName
        profileImgUrl
        isPartner
      }
      owner {
        id
        wallet
        nickname
        profileImgUrl
        isPartner
        artistName
      }
      isLiked
      isBookmarked
      lastBoostedAt
      boostedCount
      isArtisideVisible
      artisideHiddenAt
      isOnSale
      metaUrl
    }
  }
`;

const ArtworkDetail = (props) => {
  const { artworkId } = props;

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const router = useRouter();

  // GET_ARTWORK
  const { loading, data, error, refetch } = useQuery(GET_ARTWORK, {
    variables: {
      artworkId,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getArtwork } = data || {};
  const { category, creator, artworkInfo, owner } = getArtwork || {};
  const categories = category?.split('#')?.filter((item) => !!item);

  // LIKE_ARTWORK
  const [submit, { loading: likeMutationLoading }] = useLikeArtwork(artworkId);
  const handleLike = () => submit();

  useEffect(() => {
    if (!artworkId) {
      return;
    }
    const token = tokenStore.get('accessToken');
    const headers = !!token ? { Authorization: `Bearer ${token}` } : {};
    axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/pageview/artwork`,
      {
        artworkId,
      },
      {
        headers,
      }
    );
  }, [artworkId]);

  // View image detail
  const [open, setOpen] = useState(false);

  if (error && error.message.includes('not found')) {
    router.replace('/');
  }

  if (getArtwork?.isArtisideVisible === false) {
    if (!me?.id === creator?.id) {
      customToast({
        toastType: 'error',
        msg: <>This artwork is hidden</>,
        autoClose: 1000,
      });
      router.back();
    }
  }

  // hidden sticky section
  const [isHidden, setIsHidden] = useState(false);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      },
      { threshold: 1 }
    );
    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget]);

  return (
    <>
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
          <div className={styles.topMenu} onClick={() => router.push('/')}>
            <ArrowIcon
              direction="left"
              dimension={30}
              color="var(--artiside-neutral1)"
            />
          </div>
          <MobileArtworkTitle
            data={getArtwork}
            creator={creator}
            isMe={creator?.id === me?.id}
          />
          <Grid container spacing={3} xs={12} sx={{ margin: 0 }}>
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
                  <div
                    className={styles.image}
                    onClick={() =>
                      getArtwork.mediaType === 'IMAGE' && setOpen(true)
                    }
                  >
                    {getArtwork?.isArtisideVisible === false && (
                      <ArtworkCardHidden
                        hiddenAt={getArtwork?.artisideHiddenAt}
                        borderRadius={false}
                      />
                    )}
                    <Media
                      url={getArtwork.artworkUrl}
                      mediaType={getArtwork.mediaType}
                      objectFit="contain"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
                      sizes="(max-width: 768px) 80vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      alt={getArtwork.name}
                    />
                  </div>
                  <ImageDetail
                    open={open}
                    onClose={() => {
                      setOpen(false);
                    }}
                    title={(getArtwork || {}).name}
                    imageUrl={getArtwork.artworkUrl}
                  />
                </>
              )}
            </Grid>
            <MobileArtworkSection
              likeCount={getArtwork?.likeCount}
              viewCount={getArtwork?.viewCount}
              artworkId={artworkId}
              createdAt={getArtwork?.createdAt}
              text={artworkInfo?.about}
              commentCount={getArtwork?.commentCount}
              isBookmarked={getArtwork?.isBookmarked}
            />
            <Grid xs={12} sm={12} md={5.5}>
              <ArtworkInfoSection
                data={getArtwork}
                toggleLike={handleLike}
                dataLoading={loading}
              />
            </Grid>
            <Grid xs={12} sm={12} md={6.1}>
              <ArtworkDataSection data={getArtwork} dataLoading={loading} />
            </Grid>
            {/* <MobileArtworkOwner creator={creator} owner={owner} /> */}
            <Grid xs={12} sm={12} md={6.1}>
              <ArtworkCategories data={categories} />
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={12}
              sx={{
                marginBottom: 20,
                '@media(max-width: 480px)': { marginBottom: 3 },
              }}
            >
              <ArtworkMoreBy data={getArtwork} dataLoading={loading} />
            </Grid>
          </Grid>
        </Container>
        <MobileArtworkStickySection
          isHidden={isHidden}
          artworkId={artworkId}
          isOnSale={getArtwork?.isOnSale}
          onClick={handleLike}
          isLiked={getArtwork?.isLiked}
        />
      </section>
      <div ref={observerTarget} style={{ width: '100%' }} />
    </>
  );
};

export default ArtworkDetail;
