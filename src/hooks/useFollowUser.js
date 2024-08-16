import { gql, useMutation } from '@apollo/client';
import stores from '@/store';
import { useRecoilValue } from 'recoil';

const FOLLOWER_COUNT_FRAGMENT = gql`
  fragment FollowCountUser on UserDetail {
    followerCount
  }
`;

const FOLLOWING_COUNT_FRAGMENT = gql`
  fragment FollowingCountUser on UserDetail {
    followingCount
  }
`;

const FOLLOW_USER = gql`
  mutation followUser($userId: ID!) {
    followUser(userId: $userId) {
      id
    }
  }
`;

const useFollowUser = (userId) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);
  const [submit, { loading, data }] = useMutation(FOLLOW_USER, {
    refetchQueries: ['getFollowingStatus'],
    variables: {
      userId,
    },
    update: (cache) => {
      const existData = cache.readFragment({
        id: `UserDetail:${userId}`,
        fragment: FOLLOWER_COUNT_FRAGMENT,
      });
      if (existData) {
        cache.updateFragment(
          {
            id: `UserDetail:${userId}`,
            fragment: FOLLOWER_COUNT_FRAGMENT,
          },
          (data) => ({ ...data, followerCount: data.followerCount + 1 })
        );
      }
      const meData = cache.readFragment({
        id: `UserDetail:${me.id}`,
        fragment: FOLLOWING_COUNT_FRAGMENT,
      });
      if (meData) {
        cache.updateFragment(
          {
            id: `UserDetail:${me.id}`,
            fragment: FOLLOWING_COUNT_FRAGMENT,
          },
          (data) => ({ ...data, followingCount: data.followingCount + 1 })
        );
      }
    },
  });

  return [submit, { loading, data }];
};

export default useFollowUser;
