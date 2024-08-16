import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import InspirationCard from '@/components/ui/Card/ArtworkCard/InspirationCard';
import ArtistInspirationNodata from '../artist-nodata/ArtistInspirationNodata';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';

const GET_POSTS = gql`
  query getPosts($userId: ID, $currentPage: Int, $take: Int) {
    getPosts(userId: $userId, currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      posts {
        id
        isLiked
        isBookmarked
        mainImage
        images
        title
        viewCount
        likeCount
        commentCount
        user {
          id
          nickname
          profileImgUrl
          isPartner
          artistName
        }
      }
    }
  }
`;

const PAGE_SIZE = 6;

const ArtistInspirations = ({ artistId }) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);
  // GET_POSTS
  const {
    loading,
    data: postsData,
    fetchMore,
  } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: artistId,
      take: PAGE_SIZE,
    },
  });
  const { getPosts } = postsData || {};
  const { pageInfo, posts } = getPosts || {};

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
    return <CardWrapperSkeleton />;
  }

  return (
    <Grid container spacing={2} xs={12} md={9}>
      {!loading && (posts || []).length === 0 && (
        <ArtistInspirationNodata me={me?.id === artistId} />
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

export default ArtistInspirations;
