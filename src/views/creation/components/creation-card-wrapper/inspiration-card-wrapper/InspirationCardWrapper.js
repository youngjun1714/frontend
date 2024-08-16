import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

import { Unstable_Grid2 as Grid } from '@mui/material';

import InspirationCard from '@/components/ui/Card/ArtworkCard/InspirationCard';
import { useCallback, useEffect, useRef } from 'react';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';
import IndexNodata from '@/components/ui/Nodata/IndexNodata';

const GET_POSTS = gql`
  query GetPosts($q: String, $currentPage: Int, $take: Int) {
    getPosts(q: $q, currentPage: $currentPage, take: $take) {
      pageInfo {
        currentPage
        take
        totalCount
      }
      posts {
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
        commentCount
        createdAt
        updatedAt
        isLiked
        isBookmarked
      }
    }
  }
`;

const PAGE_SIZE = 12;

function InspirationCardWrapper(props) {
  const { q, toast } = props;
  const { loading, data, fetchMore } = useQuery(GET_POSTS, {
    variables: {
      q,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { getPosts } = data || {};
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
  }, [observerTarget, loading, handleMore]);

  if (loading) {
    return <CardWrapperSkeleton type="inspiration" />;
  }

  if (!posts?.length) {
    return <IndexNodata />;
  }

  return (
    <>
      {(posts || []).map((post) => (
        <Grid key={post.id} xs={5.83} sm={6} md={4} lg={3} marginBottom={4}>
          <Link href={`/inspiration/${post.id}`}>
            <InspirationCard data={post} toast={toast} />
          </Link>
        </Grid>
      ))}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </>
  );
}

export default InspirationCardWrapper;
