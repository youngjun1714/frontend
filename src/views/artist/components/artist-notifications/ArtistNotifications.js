import { useRef, useCallback, useEffect } from 'react';
import styles from './ArtistNotifications.module.scss';
import { useRouter } from 'next/router';

import ArtistNotificationRow from './ArtistNotificationRow';
import { Unstable_Grid2 as Grid } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import NewArtworkRow from './NewArtworkRow';
import NewInspirationRow from './NewInspirationRow';
import CommentArtworkRow from './CommentArtworkRow';
import CommentInspirationRow from './CommentInspirationRow';
import FollowRow from './FollowRow';
import ReportInspirationRow from './ReportInspirationRow';
import ArtistNotificationsNodata from '../artist-nodata/ArtistNotificationsNodata';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($currentPage: Int, $take: Int) {
    getNotifications(currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      notifications {
        id
        type
        message
        actor {
          id
          nickname
          profileImgUrl
        }
        content {
          type
          artworkComment {
            user {
              id
              nickname
              profileImgUrl
            }
            artwork {
              artworkId
              name
              artworkUrl
              mediaType
            }
          }
          postComment {
            user {
              id
              nickname
              profileImgUrl
            }
            post {
              id
              title
              mainImage
            }
          }
          newArtwork {
            user {
              id
              nickname
              profileImgUrl
            }
            artwork {
              artworkId
              name
              artworkUrl
              mediaType
            }
          }
          newPost {
            user {
              id
              nickname
              profileImgUrl
            }
            post {
              id
              title
              mainImage
            }
          }
          follow {
            follower {
              id
              nickname
              profileImgUrl
            }
          }
          reportPost {
            post {
              id
              title
              mainImage
            }
            postReportId
            reason
          }
        }
        isRead
        readAt
        createdAt
      }
    }
  }
`;

/**
 * @param {String} type
 * @returns {JSX.Element}
 */
const getRow = (type) => {
  switch (type) {
    case 'NEW_ARTWORK_FROM_FOLLOWING':
      return NewArtworkRow;
    case 'NEW_POST_FROM_FOLLOWING':
      return NewInspirationRow;
    case 'COMMENT_ARTWORK':
      return CommentArtworkRow;
    case 'COMMENT_POST':
      return CommentInspirationRow;
    case 'FOLLOW':
      return FollowRow;
    case 'REPORT_POST':
      return ReportInspirationRow;
  }
};

const PAGE_SIZE = 10;

function ArtistNotifications() {
  const { loading, data, fetchMore } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { getNotifications } = data || {};
  const { pageInfo, notifications } = getNotifications || {};

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

  if (!loading && (notifications || []).length === 0) {
    return (
      <Grid container xs={12} md={9}>
        <ArtistNotificationsNodata />
      </Grid>
    );
  }

  return (
    <Grid container xs={12} md={9}>
      <section className={styles.section}>
        {!loading &&
          (notifications || []).map((notification) => {
            const NotificationRow = getRow(notification.type);

            return (
              <NotificationRow
                key={notification.id}
                notification={notification}
              />
            );
          })}
      </section>
      <div className={styles.text} ref={observerTarget}>
        <h1>You can only view notifications from the past 3 months.</h1>
      </div>
    </Grid>
  );
}

export default ArtistNotifications;
