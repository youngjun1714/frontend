import { useState, useEffect, useCallback } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import styles from './MobileArtistFollow.module.scss';

import MobileArtistFollowRow from './MobileArtistFollowRow';

const GET_TOP_FOLLOWINGS = gql`
  query GetTopFollowings {
    getTopFollowings {
      id
      nickname
      isPartner
      profileImgUrl
    }
  }
`;

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const MobileArtistFollowingNodata = ({ onClose, isMe }) => {
  const { loading, data: followerData } = useQuery(GET_TOP_FOLLOWINGS, {
    fetchPolicy: 'cache-and-network',
  });
  const { getTopFollowings: users } = followerData || {};

  const [followingStatus, setFollowingStatus] = useState([]);
  const [loadFollowingStatus, { loading: followLoading }] =
    useLazyQuery(GET_FOLLOWING_STATUS);

  useEffect(() => {
    if (loading) {
      return;
    }
    if ((users || []).length > followingStatus.length) {
      const userIds = users
        .map((n) => n.id)
        .filter((n) => followingStatus.every((x) => x.userId !== n));
      setFollowingStatus((status) => [
        ...status,
        ...userIds.map((n) => ({ userId: n })),
      ]);
      handleFollowingUpdate(userIds);
    }
  }, [loading, users]);

  const handleFollowingUpdate = useCallback(async (userIds) => {
    try {
      const { data, error } = await loadFollowingStatus({
        variables: {
          userIds,
        },
        fetchPolicy: 'no-cache',
      });
      // without authentication
      if (error && error.message.includes('Access Denied')) {
        return;
      }
      const { getFollowingStatus } = data || {};
      setFollowingStatus((status) => {
        const newStatus = [...status];
        for (const followInfo of getFollowingStatus) {
          const idx = newStatus.findIndex(
            (n) => n.userId === followInfo.userId
          );
          // console.log(followInfo, newStatus[idx]);
          if (idx === -1) {
            newStatus.push({
              userId: followInfo.userId,
              isFollowedByYou: followInfo.isFollowedByYou,
            });
          } else {
            if (newStatus[idx].isFollowedByYou !== followInfo.isFollowedByYou) {
              newStatus[idx].isFollowedByYou = followInfo.isFollowedByYou;
            }
          }
        }
        return newStatus;
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSetIsFollow = (userId) => (isFollow) => {
    const idx = followingStatus.findIndex((n) => n.userId === userId);
    if (idx !== -1) {
      setFollowingStatus([
        ...followingStatus.slice(0, idx),
        { userId, isFollowedByYou: isFollow },
        ...followingStatus.slice(idx + 1),
      ]);
    }
  };

  const RecommendFollowList = () => (
    <>
      {users?.map((user) => {
        const followInfo = followingStatus.find((n) => n.userId === user.id);
        const isFollow = followInfo && followInfo.isFollowedByYou;
        const loading =
          followInfo && typeof followInfo.isFollowedByYou === 'undefined';
        return (
          <MobileArtistFollowRow
            key={user?.id}
            id={user?.id}
            nickname={user?.nickname}
            isPartner={user?.isPartner}
            profileImgUrl={user?.profileImgUrl}
            onClose={onClose}
            isFollow={isFollow}
            setIsFollow={handleSetIsFollow(user.id)}
            loading={loading}
          />
        );
      })}
    </>
  );

  return (
    <section>
      {isMe && (
        <>
          <div className={styles.nodata}>
            <>You are not following anyone yet</>
          </div>
          <div className={`${styles.table} ${styles.recommend}`}>
            <h1>You might like</h1>
            <article>{RecommendFollowList()}</article>
          </div>
        </>
      )}
      {!isMe && (
        <div className={styles.nodata}>
          <>No following yet</>
        </div>
      )}
    </section>
  );
};

export default MobileArtistFollowingNodata;
