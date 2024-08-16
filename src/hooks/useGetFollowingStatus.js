import { gql, useQuery } from '@apollo/client';

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const useGetFollowingStatus = (userIds) => {
  const { loading, data, refetch } = useQuery(GET_FOLLOWING_STATUS, {
    variables: {
      userIds,
    },
  });
  return { loading, data, refetch };
};

export default useGetFollowingStatus;
