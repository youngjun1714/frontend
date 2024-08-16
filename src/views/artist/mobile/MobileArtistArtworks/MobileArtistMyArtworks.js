import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './MobileArtistArtworks.module.scss';
import { useQuery, gql } from '@apollo/client';

import MyArtworkCard from '@/components/ui/Card/ArtworkCard/MyArtworkCard';
import ArtistArtworkNodata from '../../components/artist-nodata/ArtistArtworkNodata';
import MobileCardSkeleton from '../MobileArtistFavorites/MobileCardSkeleton';

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

const MobileArtistMyArtworks = (props) => {
  const { artistId } = props;

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
    return <MobileCardSkeleton type="artworks" />;
  }

  return (
    <section className={styles.section}>
      {(artworks || []).length <= 0 ? (
        <ArtistArtworkNodata me />
      ) : (
        (artworks || []).map((artwork) => (
          <Link key={artwork.artworkId} href={`/artwork/${artwork.artworkId}`}>
            <MyArtworkCard data={artwork} />
          </Link>
        ))
      )}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </section>
  );
};

export default MobileArtistMyArtworks;
