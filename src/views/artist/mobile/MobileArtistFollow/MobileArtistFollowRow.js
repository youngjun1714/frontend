import styles from './MobileArtistFollow.module.scss';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';
import MobileIsPartnerBadge from '@/components/mobile-ui/MobileIcons/MobileIsPartnerBadge';
import MobileFollowButton from '@/components/mobile-ui/MobileFollowButton/MobileFollowButton';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import MobileFollowIcon from '@/components/mobile-ui/MobileIcons/MobileFollowIcon';

const MobileArtistFollowRow = (props) => {
  const {
    id,
    nickname,
    profileImgUrl,
    isPartner,
    onClose,
    isFollow,
    setIsFollow,
    loading,
  } = props;
  const router = useRouter();

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const handleClick = () => {
    router.push(`/artist/${id}`);
    onClose();
  };

  const [follow, { loading: followLoading }] = useFollowUser(id);
  const handleFollow = async () => {
    try {
      await follow();
      setIsFollow(true);
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow, { loading: unfollowLoading }] = useUnfollowUser(id);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      setIsFollow(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.user} onClick={handleClick}>
        <Avatar type="mobile-md" username={nickname} image={profileImgUrl} />
        <div className={styles.name}>
          <h1>
            {nickname} {isPartner && <MobileIsPartnerBadge size="sm" />}
          </h1>
        </div>
      </div>

      <div className={styles.button}>
        {me?.id === undefined ? (
          <AuthRequiredButtonWrapper>
            <button className={styles.followButton}>
              <MobileFollowIcon size="sm" /> follow
            </button>
          </AuthRequiredButtonWrapper>
        ) : me?.id !== id ? (
          <>
            <MobileFollowButton
              onClick={() => {
                if (!isFollow) {
                  handleFollow();
                } else {
                  handleUnfollow();
                }
              }}
              isFollow={isFollow}
              icon={true}
              loading={loading}
              disabled={loading || followLoading || unfollowLoading}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MobileArtistFollowRow;
