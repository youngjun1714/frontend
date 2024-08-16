import { gql, useMutation } from '@apollo/client';

const BOOKMARK_POST = gql`
  mutation bookmarkPost($postId: ID!) {
    bookmarkPost(postId: $postId) {
      id
      isBookmarked
    }
  }
`;

const useBookmarkPost = (postId) => {
  const [submit, { loading, data }] = useMutation(BOOKMARK_POST, {
    variables: {
      postId,
    },
  });
  return [submit, { loading, data }];
};

export default useBookmarkPost;
