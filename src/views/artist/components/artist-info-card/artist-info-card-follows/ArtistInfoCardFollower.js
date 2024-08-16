import { useCallback, useEffect, useState, useRef } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import ArtistInfoFollowsRow from './ArtistInfoCardFollowsRow';
import ArtistInfoCardFollowNodata from './ArtistInfoCardFollowNodata';

const GET_USER_FOLLOWERS = gql`
  query getUserFollowers($userId: ID!, $currentPage: Int, $take: Int) {
    getUserFollowers(userId: $userId, currentPage: $currentPage, take: $take) {
      pageInfo {
        currentPage
        totalCount
      }
      users {
        id
        nickname
        profileImgUrl
        isPartner
      }
    }
  }
`;

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowedByYou
    }
  }
`;

const PAGE_SIZE = 10;

const ArtistInfoCardFollower = ({ userId, onClose }) => {
  const { loading, data, fetchMore } = useQuery(GET_USER_FOLLOWERS, {
    variables: {
      userId,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getUserFollowers } = data || {};
  const { pageInfo, users } = getUserFollowers || {};
  const observerTarget = useRef(null);

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
      const { getFollowingStatus } = data;
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
  }, [observerTarget, handleMore]);

  if (users?.length === 0) {
    return <ArtistInfoCardFollowNodata type="followers" />;
  }

  return (
    <>
      {(users || []).map((user) => {
        const followInfo = followingStatus.find((n) => n.userId === user.id);
        const isFollow = followInfo && followInfo.isFollowedByYou;
        const loading =
          followInfo && typeof followInfo.isFollowedByYou === 'undefined';

        return (
          <ArtistInfoFollowsRow
            key={`follower-${user.id}`}
            data={user}
            loading={loading}
            isFollow={isFollow}
            setIsFollow={handleSetIsFollow(user.id)}
            onClose={onClose}
          />
        );
      })}
      <div ref={observerTarget} style={{ width: '100%' }} />
    </>
  );
};

export default ArtistInfoCardFollower;
