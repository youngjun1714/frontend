import useGetFollowingStatus from '@/hooks/useGetFollowingStatus';
import Avatar from '@/components/ui/Avatar/Avatar';
import FollowButton from '@/components/ui/Button/FollowButton';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import styles from './ArtistNotifications.module.scss';
import moment from 'moment';
import NotificationBadge from './NotificationBadge';

const FollowRow = ({ notification }) => {
  const { content, isRead } = notification;
  const {
    follow: { follower },
  } = content;
  const { loading, data, refetch } = useGetFollowingStatus([follower.id]);
  const { getFollowingStatus } = data || {};
  const [followInfo] = getFollowingStatus || [];

  const [follow, { loading: followLoading }] = useFollowUser(follower.id);
  const handleFollow = async () => {
    try {
      await follow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow, { loading: unfollowLoading }] = useUnfollowUser(follower.id);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <article className={styles.row}>
      <div className={styles.rowLeft}>
        {isRead ? (
          <Avatar type="sm" image={follower.profileImgUrl} />
        ) : (
          <NotificationBadge>
            <Avatar type="sm" image={follower.profileImgUrl} />
          </NotificationBadge>
        )}

        <div className={styles.rowInfo}>
          <h1>
            <span>{follower.nickname}</span> followed you.
          </h1>
          <h2>{moment(notification.createdAt).fromNowOrNow()}</h2>
        </div>
      </div>
      <div className={styles.rowRight}>
        <AuthRequiredButtonWrapper
          onClick={() => {
            if (!(followInfo || {}).isFollowedByYou) {
              handleFollow();
            } else {
              handleUnfollow();
            }
          }}
        >
          <FollowButton
            data={(followInfo || {}).isFollowedByYou}
            disabled={loading || followLoading || unfollowLoading}
          />
        </AuthRequiredButtonWrapper>
      </div>
    </article>
  );
};

export default FollowRow;
