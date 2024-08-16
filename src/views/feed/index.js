import { useEffect, useMemo, useRef, useCallback } from 'react';
import Head from 'next/head';
import { Container, CircularProgress } from '@mui/material';
import { useQuery, gql } from '@apollo/client';

import FeedContainer from '@/views/feed/components/feed-container/FeedContainer';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import IndexNodata from '@/components/ui/Nodata/IndexNodata';

const GET_PARTNERS = gql`
  query GetPartners {
    getPartners {
      pageInfo {
        totalCount
        take
        currentPage
      }
      partners {
        artistName
        user {
          id
          nickname
          artistName
          profileImgUrl
        }
      }
    }
  }
`;
const FEED_FRAGMENT = gql`
  fragment FeedPart on Feed {
    feedType
    artwork {
      artworkId
      name
      tokenId
      likeCount
      viewCount
      favoriteCount
      commentCount
      artworkUrl
      mediaType
      lastBoostedAt
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
      }
      isLiked
      isBookmarked
      lastBoostedAt
      boostedCount
    }
    post {
      id
      user {
        id
        wallet
        nickname
        artistName
        profileImgUrl
        isPartner
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
      isLiked
      isBookmarked
    }
  }
`;

const GET_FEEDS = gql`
  ${FEED_FRAGMENT}
  query GetFeeds($currentPage: Int, $take: Int) {
    getFeeds(currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      feeds {
        ...FeedPart
      }
    }
  }
`;

const GET_RECOMMEND_FEEDS = gql`
  ${FEED_FRAGMENT}
  query GetRecommendFeeds {
    getRecommendFeeds {
      ...FeedPart
    }
  }
`;

const FEED_TAKE = 5;

const Page = () => {
  const { account } = useConnectModalContext();
  const { isLoggedIn } = account;

  const observerTarget = useRef(null);

  const {
    loading,
    data: feedData,
    refetch,
    fetchMore,
  } = useQuery(GET_FEEDS, {
    variables: {
      take: FEED_TAKE,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const { loading: recommendLoading, data: recommendFeedData } = useQuery(
    GET_RECOMMEND_FEEDS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    }
  );
  const { getRecommendFeeds } = recommendFeedData || {};
  const { getFeeds } = feedData || {};
  const { pageInfo, feeds } = getFeeds || {};

  const { loading: partnersLoading, data: partnersData } =
    useQuery(GET_PARTNERS);
  const { getPartners } = partnersData || {};
  const { partners } = getPartners || {};
  const hasFeeds = useMemo(() => (feeds || []).length > 0, [feeds]);
  const hasRecommendFeeds = useMemo(
    () => (getRecommendFeeds || []).length > 0,
    [getRecommendFeeds]
  );
  const isSomeLoading = useMemo(
    () => loading || recommendLoading,
    [loading, recommendLoading]
  );

  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * FEED_TAKE <
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

  return (
    <>
      <Head>
        <title>Feed | Artiside</title>
      </Head>
      {!loading && !hasFeeds && !hasRecommendFeeds ? (
        <Container
          sx={{
            padding: '78px 20px',
            maxWidth: '1600px !important',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            '@media (max-width: 480px)': {
              padding: '10px 20px !important',
            },
          }}
        >
          <div style={{ marginTop: 60, width: '100%' }}>
            <IndexNodata />
          </div>
        </Container>
      ) : (
        <Container
          sx={{
            padding: '78px 20px',
            maxWidth: '554px !important',
            width: '100%',
            '@media (max-width: 480px)': {
              padding: '10px 20px !important',
            },
          }}
        >
          {hasFeeds && (
            <>
              {/* <FeedPopup /> */}
              {/* <FeedTopCreator data={partners} /> */}
              <FeedContainer feeds={feeds} />
              <div ref={observerTarget} style={{ width: '100%' }} />
            </>
          )}

          {!loading && !hasFeeds && hasRecommendFeeds && (
            <>
              {/* <FeedPopup /> */}
              {/* <FeedTopCreator /> */}
              <FeedContainer feeds={getRecommendFeeds || []} />
            </>
          )}
          {isSomeLoading && (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: 'var(--primary-color)' }} />
            </div>
          )}
        </Container>
      )}
    </>
  );
};

export default Page;
