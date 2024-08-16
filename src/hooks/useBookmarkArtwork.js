import { gql, useMutation } from '@apollo/client';

const BOOKMARK_ARTWORK = gql`
  mutation BookmarkArtwork($artworkId: ID!) {
    bookmarkArtwork(artworkId: $artworkId) {
      artworkId
      favoriteCount
      isBookmarked
    }
  }
`;

const useBookmarkArtwork = (artworkId) => {
  const [submit, { loading, data }] = useMutation(BOOKMARK_ARTWORK, {
    variables: {
      artworkId,
    },
  });

  return [submit, { loading, data }];
};

export default useBookmarkArtwork;
