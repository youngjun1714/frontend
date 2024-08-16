import { useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import styles from './MobileArtistArtworks.module.scss';
import { useQuery, gql } from '@apollo/client';

import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import MobileCardSkeleton from '../MobileArtistFavorites/MobileCardSkeleton';
import ArtistArtworkNodata from '../../components/artist-nodata/ArtistArtworkNodata';

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

const MobileArtistArtworks = (props) => {
  const { artistId } = props;

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
    return <MobileCardSkeleton type="artworks" />;
  }

  return (
    <section className={styles.section}>
      {(artworks || []).length <= 0 ? (
        <ArtistArtworkNodata />
      ) : (
        (artworks || []).map((artwork) => (
          <Link key={artwork.artworkId} href={`/artwork/${artwork.artworkId}`}>
            <ArtworkCard data={artwork} />
          </Link>
        ))
      )}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </section>
  );
};

export default MobileArtistArtworks;
