import { gql, useMutation } from '@apollo/client';

const LIKE_ARTWORK = gql`
  mutation LikeArtwork($artworkId: ID!) {
    likeArtwork(artworkId: $artworkId) {
      artworkId
      likeCount
      isLiked
    }
  }
`;

const useLikeArtwork = (artworkId) => {
  const [submit, { loading, data }] = useMutation(LIKE_ARTWORK, {
    variables: {
      artworkId,
    },
  });

  return [submit, { loading, data }];
};

export default useLikeArtwork;
