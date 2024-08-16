import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { CircularProgress, Unstable_Grid2 as Grid } from '@mui/material';

import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';
import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import IndexNodata from '@/components/ui/Nodata/IndexNodata';

const GET_ARTWORKS = gql`
  query getArtworks(
    $orderField: ArtworksOrderBy
    $q: String
    $currentPage: Int
    $take: Int
  ) {
    getArtworks(
      orderField: $orderField
      q: $q
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        currentPage
        totalCount
      }
      artworks {
        artworkId
        name
        tokenId
        lastBoostedAt
        boostedCount
        likeCount
        viewCount
        favoriteCount
        commentCount
        artworkUrl
        thumbnailUrl
        mediaType
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
        creator {
          id
          wallet
          nickname
          artistName
          isPartner
          profileImgUrl
          coverImgUrl
        }
        isLiked
        isBookmarked
        owner {
          profileImgUrl
          nickname
          artistName
          isPartner
        }
      }
    }
  }
`;
const PAGE_SIZE = 12;

const ArtworkCardWrapper = (props) => {
  const { onChangeSort, q, sort, toast } = props;

  const router = useRouter();

  const { loading, data, fetchMore } = useQuery(GET_ARTWORKS, {
    variables: {
      orderField: sort,
      q,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getArtworks } = data || {};
  const { pageInfo, artworks } = getArtworks || {};

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
    return <CardWrapperSkeleton />;
  }

  if (!artworks?.length) {
    return <IndexNodata />;
  }

  return (
    <>
      {(artworks || []).map((artwork) => (
        <Grid
          key={artwork.artworkId}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          marginBottom={4}
        >
          <div
            onClick={() => {
              router.push(`/artwork/${artwork.artworkId}`, undefined, {
                shallow: true,
              });
            }}
          >
            <ArtworkCard data={artwork} />
          </div>
        </Grid>
      ))}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </>
  );
};

export default ArtworkCardWrapper;
