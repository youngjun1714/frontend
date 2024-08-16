import styles from './ArtistNotifications.module.scss';
import moment from 'moment';

import Avatar from '@/components/ui/Avatar/Avatar';
import { Badge } from '@mui/material';
import NotificationBadge from './NotificationBadge';

const CommentInspirationRow = ({ notification }) => {
  const { content, isRead } = notification;
  const {
    postComment: { user, post },
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
            <span>{user.nickname}</span> commented on <span>{post.title}</span>
          </h1>
          <h2>{moment(notification.createdAt).fromNowOrNow()}</h2>
        </div>
      </div>
    </article>
  );
};

export default CommentInspirationRow;
