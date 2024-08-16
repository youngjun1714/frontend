import styles from './ArtistNotifications.module.scss';
import moment from 'moment';

import Avatar from '@/components/ui/Avatar/Avatar';
import Link from 'next/link';
import NotificationBadge from './NotificationBadge';
import Media from '@/components/ui/Media/Media';

const NewArtworkRow = ({ notification }) => {
  const { content, isRead } = notification;
  const {
    newArtwork: { user, artwork },
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
            <span>{user.nickname}</span> created <span>{artwork.name}</span>
          </h1>
          <h2>{moment(notification.createdAt).fromNowOrNow()}</h2>
        </div>
      </div>
      <div className={styles.rowRight}>
        <Link href={`/inspiration/${post.id}`}>
          <div className={styles.picture}>
            <Media
              url={artwork.artworkUrl}
              mediaType={artwork.mediaType}
              objectFit="cover"
              alt={artwork.name}
              sizes="(max-width: 768px) 33vw, 10vw"
            />
          </div>
        </Link>
      </div>
    </article>
  );
};

export default NewArtworkRow;
