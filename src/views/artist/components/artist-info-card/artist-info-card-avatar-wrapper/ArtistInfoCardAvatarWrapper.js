import React, { useEffect, useState } from 'react';
import styles from '@/views/artist/components/artist-info-card/artist-info-card-avatar-wrapper/ArtistInfoCardAvatarWrapper.module.scss';
import { gql, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';
import FollowButton from '@/components/ui/Button/FollowButton';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

function ArtistInfoCardAvatarWrapper(props) {
  const { isMe, isPartner, data, userId } = props;

  const { loading, data: followListData } = useQuery(GET_FOLLOWING_STATUS, {
    variables: {
      userIds: [userId],
    },
  });
  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [loading, followInfo]);

  // mutation
  const [follow, { loading: followLoading }] = useFollowUser(data?.id);
  const handleFollow = async () => {
    try {
      await follow();
      setIsFollow(true);
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow, { loading: unfollowLoading }] = useUnfollowUser(data?.id);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      setIsFollow(false);
    } catch (e) {
      console.log(e);
    }
  };

  // me
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  return (
    <div className={styles.container}>
      <Avatar
        type="max"
        image={isMe ? me?.profileImgUrl : data?.profileImgUrl}
        username={data?.nickname}
        isSetting={isMe}
      />
      {!isMe && isPartner && (
        <AuthRequiredButtonWrapper
          onClick={() => {
            if (!isFollow) {
              handleFollow();
            } else {
              handleUnfollow();
            }
          }}
        >
          <FollowButton
            data={isFollow}
            style={{ width: '100%', height: 48, fontSize: 16 }}
            svgSize={24}
          />
        </AuthRequiredButtonWrapper>
      )}
    </div>
  );
}

export default ArtistInfoCardAvatarWrapper;
