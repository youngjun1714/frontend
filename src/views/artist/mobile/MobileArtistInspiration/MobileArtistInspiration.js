import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './MobileArtistInspiration.module.scss';
import { useQuery, gql } from '@apollo/client';

import InspirationCard from '@/components/ui/Card/ArtworkCard/InspirationCard';
import ArtistInspirationNodata from '../../components/artist-nodata/ArtistInspirationNodata';
import MobileCardSkeleton from '../MobileArtistFavorites/MobileCardSkeleton';

const GET_POSTS = gql`
  query getPosts($userId: ID, $currentPage: Int, $take: Int) {
    getPosts(userId: $userId, currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      posts {
        id
        isLiked
        isBookmarked
        mainImage
        images
        title
        viewCount
        likeCount
        commentCount
        user {
          id
          nickname
          profileImgUrl
          isPartner
          artistName
        }
      }
    }
  }
`;

const PAGE_SIZE = 6;

const MobileArtistInspiration = (props) => {
  const { artistId, isMe } = props;

  // GET_POSTS
  const {
    loading,
    data: postsData,
    fetchMore,
  } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: artistId,
      take: PAGE_SIZE,
    },
  });
  const { getPosts } = postsData || {};
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
  }, [observerTarget, handleMore]);

  if (loading) {
    return <MobileCardSkeleton type="inspiration" />;
  }

  return (
    <section className={styles.section}>
      {(posts || []).length <= 0 ? (
        <ArtistInspirationNodata me={isMe} />
      ) : (
        <div className={styles.grid}>
          {(posts || []).map((post) => (
            <Link key={post?.id} href={`/inspiration/${post?.id}`}>
              <InspirationCard data={post} />
            </Link>
          ))}
          <div ref={observerTarget} style={{ width: '100%' }} />
        </div>
      )}
    </section>
  );
};

export default MobileArtistInspiration;
