import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Unstable_Grid2 as Grid } from '@mui/material';

import stores from '@/store';
import MyArtworkCard from '@/components/ui/Card/ArtworkCard/MyArtworkCard';
import ArtistArtworkNodata from '../artist-nodata/ArtistArtworkNodata';
import CardWrapperSkeleton from '@/views/artwork/cardWrapperSkeleton/cardWrapperSkeleton';

const GET_MY_ARTWORKS = gql`
  query getMyArtworks($currentPage: Int, $take: Int) {
    getMyArtworks(currentPage: $currentPage, take: $take) {
      pageInfo {
        currentPage
        totalCount
      }
      artworks {
        artworkId
        name
        lastBoostedAt
        boostedCount
        likeCount
        viewCount
        isLiked
        isBookmarked
        isArtisideVisible
        artisideHiddenAt
        artworkUrl
        mediaType
        creator {
          id
          nickname
          artistName
          profileImgUrl
          isPartner
        }
        owner {
          id
          nickname
          isPartner
          profileImgUrl
        }
      }
    }
  }
`;

const PAGE_SIZE = 6;

const MyArtworks = ({ artistId }) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // GET_MY_ARTWORKS
  const {
    loading,
    data: myArtworksData,
    fetchMore,
  } = useQuery(GET_MY_ARTWORKS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      take: PAGE_SIZE,
    },
  });
  const { getMyArtworks } = myArtworksData || {};
  const { pageInfo, artworks } = getMyArtworks || {};
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
              <MyArtworkCard data={artwork} />
            </Link>
          </Grid>
        ))
      )}

      <div ref={observerTarget} style={{ width: '100%' }} />
    </Grid>
  );
};

export default MyArtworks;
