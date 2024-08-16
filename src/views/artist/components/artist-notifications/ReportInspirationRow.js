import styles from './ArtistNotifications.module.scss';
import moment from 'moment';

import Avatar from '@/components/ui/Avatar/Avatar';
import Link from 'next/link';
import NotificationBadge from './NotificationBadge';

const ReportInspirationRow = ({ notification }) => {
  const { content, isRead } = notification;
  const {
    reportPost: { post, reason },
  } = content;
  return (
    <article className={styles.row}>
      <div className={styles.rowLeft}>
        {isRead ? (
          <Avatar type="sm" image="/assets/images/artiside-avatar.png" />
        ) : (
          <NotificationBadge>
            <Avatar type="sm" image="/assets/images/artiside-avatar.png" />
          </NotificationBadge>
        )}

        <div className={styles.rowInfo}>
          <h1>
            <span>{post.title}</span> has been reported for{' '}
            <span>{reason}</span>. You can learn more in the{' '}
            <Link href="/help" target="_blank">
              Help center.
            </Link>
          </h1>
          <h2>{moment(notification.createdAt).fromNowOrNow()}</h2>
        </div>
      </div>
      <div className={styles.rowRight}></div>
    </article>
  );
};

export default ReportInspirationRow;
