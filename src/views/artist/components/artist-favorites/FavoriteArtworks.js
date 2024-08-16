import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import ArtistFavoriteNodata from '../artist-nodata/ArtistFavoriteNodata';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';

const GET_USER_FAVORITE_ARTWORKS = gql`
  query getUserFavoriteArtworks($userId: ID!, $currentPage: Int, $take: Int) {
    getUserFavoriteArtworks(
      userId: $userId
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      artworks {
        artworkId
        artworkUrl
        mediaType
        name
        likeCount
        viewCount
        tokenId
        creator {
          id
          artistName
          nickname
          isPartner
          profileImgUrl
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

const FavoriteArtworks = ({ userId }) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const {
    loading,
    data: favoriteData,
    fetchMore,
  } = useQuery(GET_USER_FAVORITE_ARTWORKS, {
    variables: {
      userId,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getUserFavoriteArtworks } = favoriteData || {};
  const { pageInfo, artworks } = getUserFavoriteArtworks || {};

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
      {!loading && (artworks || []).length === 0 && (
        <ArtistFavoriteNodata me={me?.id === userId} type="Artworks" />
      )}
      {!loading &&
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
        ))}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </Grid>
  );
};

export default FavoriteArtworks;
