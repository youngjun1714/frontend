import { useEffect, useCallback, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import styles from './MobileFavoriteArtworks.module.scss';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import ArtistFavoriteNodata from '../../components/artist-nodata/ArtistFavoriteNodata';
import ArtworkCard from '@/components/ui/Card/ArtworkCard/ArtworkCard';
import MobileCardSkeleton from './MobileCardSkeleton';

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

const MobileFavoriteArtworks = (props) => {
  const { userId } = props;
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
      <section className={styles.section}>
        <MobileCardSkeleton type="artworks" />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      {(artworks || []).length <= 0 ? (
        <ArtistFavoriteNodata me={me?.id === userId} type="Artworks" />
      ) : (
        <div className={styles.container}>
          {(artworks || []).map((artwork) => (
            <Link
              key={artwork.artworkId}
              href={`/artwork/${artwork.artworkId}`}
            >
              <ArtworkCard data={artwork} />
            </Link>
          ))}
        </div>
      )}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </section>
  );
};

export default MobileFavoriteArtworks;
