import { gql, useMutation } from '@apollo/client';

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likeCount
      isLiked
    }
  }
`;

const useLikePost = (postId) => {
  const [submit, { loading, data }] = useMutation(LIKE_POST, {
    variables: {
      postId,
    },
  });

  return [submit, { loading, data }];
};

export default useLikePost;
