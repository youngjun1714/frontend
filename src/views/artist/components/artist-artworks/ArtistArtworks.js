import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import ArtistArtworkNodata from '../artist-nodata/ArtistArtworkNodata';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';

const GET_ARTWORKS = gql`
  query getArtworks(
    $orderField: ArtworksOrderBy
    $currentPage: Int
    $take: Int
    $userId: ID
  ) {
    getArtworks(
      orderField: $orderField
      currentPage: $currentPage
      take: $take
      userId: $userId
    ) {
      pageInfo {
        currentPage
        totalCount
        take
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
        artworkUrl
        mediaType
        thumbnailUrl
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
        owner {
          id
          nickname
          isPartner
          profileImgUrl
        }
        isLiked
        isBookmarked
      }
    }
  }
`;

const PAGE_SIZE = 6;

const ArtistArtworks = ({ artistId }) => {
  // GET_ARTWORKS
  const {
    loading,
    data: artworksData,
    fetchMore,
  } = useQuery(GET_ARTWORKS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      orderField: 'NEWEST',
      take: PAGE_SIZE,
      userId: artistId,
    },
  });

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const { getArtworks } = artworksData || {};
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
  }, [observerTarget, handleMore]);

  if (loading) {
    return <CardWrapperSkeleton />;
  }

  return (
    <Grid container spacing={2} xs={12} md={9}>
      {(artworks || []).length <= 0 ? (
        <ArtistArtworkNodata me={me?.id === artistId} />
      ) : (
        (artworks || []).map((artwork) => (
          <Grid
            key={artwork.artworkId}
            xs={12}
            sm={6}
            lg={4}
            sx={{ marginBottom: '40px' }}
          >
            <Link href={`/artwork/${artwork.artworkId}`}>
              <ArtworkCard data={artwork} />
            </Link>
          </Grid>
        ))
      )}

      <div ref={observerTarget} style={{ width: '100%' }} />
    </Grid>
  );
};

export default ArtistArtworks;
