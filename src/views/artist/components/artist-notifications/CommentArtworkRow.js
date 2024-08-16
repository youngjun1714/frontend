import styles from './ArtistNotifications.module.scss';
import moment from 'moment';

import Avatar from '@/components/ui/Avatar/Avatar';
import NotificationBadge from './NotificationBadge';

const CommentArtworkRow = ({ notification }) => {
  const { content, isRead } = notification;
  const {
    artworkComment: { user, artwork },
  } = content;
  return (
    <article className={styles.row}>
      <div className={styles.rowLeft}>
        {isRead ? (
          <Avatar type="sm" image={user.profileImgUrl} />
        ) : (
          <NotificationBadge>
            <Avatar type="sm" image={user.profileImgUrl} />
          </NotificationBadge>
        )}
        <div className={styles.rowInfo}>
          <h1>
            <span>{user.nickname}</span> commented on{' '}
            <span>{artwork.name}</span>
          </h1>
          <h2>{moment(notification.createdAt).fromNowOrNow()}</h2>
        </div>
      </div>
    </article>
  );
};

export default CommentArtworkRow;
