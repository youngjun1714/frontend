import Link from 'next/link';
import styles from './ArtistInfoCardFollows.module.scss';
import { useRecoilValue } from 'recoil';
import stores from '@/store';

import Avatar from '@/components/ui/Avatar/Avatar';

import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import CircleAdd from '@/components/ui/Icons/CircleAdd';
import IsArtist from '@/components/ui/Icons/IsArtist';

function ArtistInfoFollowsRow(props) {
  const { data, loading, isFollow, onClose, setIsFollow } = props;

  const {
    common: { meState },
  } = stores;

  const me = useRecoilValue(meState);

  // mutation
  const [follow, { loading: followLoading }] = useFollowUser(data.id);
  const handleFollow = async () => {
    try {
      await follow();
      setIsFollow(true);
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow, { loading: unfollowLoading }] = useUnfollowUser(data.id);
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
      <div className={styles.left}>
        <Link
          href={
            data.isPartner
              ? `/artist/${data?.id}?list=artworks`
              : `/artist/${data?.id}?list=inspiration`
          }
          onClick={() => onClose()}
        >
          <Avatar
            type="sm"
            username={data?.nickname}
            image={data?.profileImgUrl}
          />
          <h1>{data?.nickname}</h1>
          {data?.isPartner && <IsArtist />}
        </Link>
      </div>
      {me?.id === undefined ? (
        <>
          <AuthRequiredButtonWrapper>
            <button>
              <CircleAdd dimension="16px" />
              Follow
            </button>
          </AuthRequiredButtonWrapper>
        </>
      ) : me?.id !== data?.id ? (
        <AuthRequiredButtonWrapper
          onClick={() => {
            if (!isFollow) {
              handleFollow();
            } else {
              handleUnfollow();
            }
          }}
        >
          <button
            className={isFollow ? styles.isFollow : styles.isNotFollow}
            disabled={loading || followLoading || unfollowLoading}
          >
            {loading && <Skeleton width="100%" height="100%" />}
            {!loading && !isFollow && <CircleAdd dimension="16px" />}
            {!loading && (isFollow ? 'Following' : 'Follow')}
          </button>
        </AuthRequiredButtonWrapper>
      ) : (
        ''
      )}
    </div>
  );
}

export default ArtistInfoFollowsRow;
