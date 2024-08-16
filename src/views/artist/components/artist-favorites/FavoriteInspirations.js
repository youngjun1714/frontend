import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import InspirationCard from '@/components/ui/Card/ArtworkCard/InspirationCard';
import ArtistFavoriteNodata from '../artist-nodata/ArtistFavoriteNodata';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';

const GET_USER_FAVORITE_POSTS = gql`
  query getUserFavoritePosts($userId: ID!, $currentPage: Int, $take: Int) {
    getUserFavoritePosts(
      userId: $userId
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      posts {
        id
        isLiked
        isBookmarked
        title
        likeCount
        viewCount
        mainImage
        user {
          id
          nickname
          profileImgUrl
          isPartner
        }
      }
    }
  }
`;

const PAGE_SIZE = 6;

const FavoriteInspirations = ({ userId }) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const {
    loading,
    data: favoritePostsData,
    fetchMore,
  } = useQuery(GET_USER_FAVORITE_POSTS, {
    variables: {
      userId,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getUserFavoritePosts } = favoritePostsData || {};
  const { pageInfo, posts } = getUserFavoritePosts || {};

  const observerTarget = useRef(null);

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (pageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: pageInfo.currentPage + 1,
        },
      });
    }
  }, [pageInfo, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleMore();
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
  }, [observerTarget, handleMore]);

  if (loading) {
    return (
      <Grid container spacing={2} xs={12} md={12}>
        <CardWrapperSkeleton />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} xs={12} md={12}>
      {!loading && (posts || []).length === 0 && (
        <ArtistFavoriteNodata me={me?.id === userId} type="Inspiration" />
      )}
      {!loading &&
        (posts || []).map((post) => (
          <Grid
            key={post.id}
            xs={12}
            sm={6}
            lg={4}
            sx={{ marginBottom: '40px' }}
          >
            <Link href={`/inspiration/${post?.id}`}>
              <InspirationCard data={post} />
            </Link>
          </Grid>
        ))}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </Grid>
  );
};

export default FavoriteInspirations;
