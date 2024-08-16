import { useEffect, useCallback, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import styles from './MobileFavoriteArtworks.module.scss';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import ArtistFavoriteNodata from '../../components/artist-nodata/ArtistFavoriteNodata';
import InspirationCard from '@/components/ui/Card/ArtworkCard/InspirationCard';
import MobileCardSkeleton from './MobileCardSkeleton';

const GET_USER_FAVORITE_POSTS = gql`
  query getUserFavoritePosts($userId: ID!, $currentPage: Int, $take: Int) {
    getUserFavoritePosts(
      userId: $userId
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      posts {
        id
        isLiked
        isBookmarked
        title
        likeCount
        viewCount
        mainImage
        user {
          id
          nickname
          profileImgUrl
          isPartner
        }
      }
    }
  }
`;

const PAGE_SIZE = 6;

const MobileFavoriteInspiration = (props) => {
  const { userId } = props;
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const {
    loading,
    data: favoritePostsData,
    fetchMore,
  } = useQuery(GET_USER_FAVORITE_POSTS, {
    variables: {
      userId,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getUserFavoritePosts } = favoritePostsData || {};
  const { pageInfo, posts } = getUserFavoritePosts || {};

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
    return <MobileCardSkeleton type="inspiration" />;
  }

  return (
    <section className={styles.section}>
      {(posts || []).length <= 0 ? (
        <ArtistFavoriteNodata me={me?.id === userId} type="Inspiration" />
      ) : (
        <div className={styles.grid}>
          {(posts || []).map((post) => (
            <Link key={post.id} href={`/inspiration/${post.id}`}>
              <InspirationCard data={post} />
            </Link>
          ))}
        </div>
      )}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </section>
  );
};

export default MobileFavoriteInspiration;
