import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import Head from 'next/head';

import { initializeApollo } from '@/library/apollo-client';
import ArtworkDetail from '@/views/artwork';

const GET_ARTWORK = gql`
  query getArtwork($artworkId: ID!) {
    getArtwork(artworkId: $artworkId) {
      artworkId
      name
      tokenId
      likeCount
      viewCount
      favoriteCount
      commentCount
      artworkUrl
      mediaType
      thumbnailUrl
      metaUrl
      category
      isArtisideVisible
      artisideHiddenAt
      artworkInfo {
        title
        creationYear
        edition
        medium
        width
        height
        about
      }
      createdAt
      importedAt
      creator {
        id
        wallet
        nickname
        artistName
        profileImgUrl
        isPartner
      }
      owner {
        id
        wallet
        nickname
        profileImgUrl
        isPartner
      }
      isLiked
      isBookmarked
      lastBoostedAt
      boostedCount
      isArtisideVisible
      artisideHiddenAt
      isOnSale
      metaUrl
    }
  }
`;

const Page = (props) => {
  const { artwork, artworkId } = props;

  const { creator, artworkInfo, artworkUrl, mediaType, thumbnailUrl } =
    artwork || {};

  const { title } = artworkInfo || {};

  const previewUrl =
    mediaType === 'VIDEO' && thumbnailUrl ? thumbnailUrl : artworkUrl;

  const imageUrl = previewUrl?.includes('ipfs://')
    ? `https://ipfs.io/ipfs/${previewUrl.split('ipfs://')[1]}`
    : previewUrl;

  const videoUrl =
    mediaType === 'VIDEO' &&
    (artworkUrl?.includes('ipfs://')
      ? `https://ipfs.io/ipfs/${artworkUrl.split('ipfs://')[1]}`
      : artworkUrl);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {artwork && (
        <Head>
          <>
            <title>{`${title} by ${creator.nickname} | Artiside`}</title>
            <meta
              property="og:title"
              content={`${title} by ${creator.nickname} | Artiside`}
              key="og-title"
            />
            <meta
              name="description"
              content={artworkInfo.about}
              key="description"
            />
            <meta
              property="og:description"
              content={artworkInfo.about}
              key="og-description"
            />
            <meta
              property="og:url"
              content={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/artwork/${artworkId}`}
              key="og-url"
            />
            <link
              rel="canonical"
              href={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/artwork/${artworkId}`}
            />
          </>

          {imageUrl && (
            <meta property="og:image" content={imageUrl} key="og-image" />
          )}
          {mediaType === 'VIDEO' && (
            <>
              <meta
                property="og:video:url"
                content={videoUrl}
                key="og-video-url"
              />
              <meta
                property="og:video:secure_url"
                content={videoUrl}
                key="og-video-secure-url"
              />
            </>
          )}
        </Head>
      )}
      {mounted && <ArtworkDetail artworkId={artworkId} />}
    </>
  );
};

export async function getServerSideProps(context) {
  const artworkId = context.params.artworkId;

  const apolloClient = initializeApollo(null, context);

  try {
    const result = await apolloClient.query({
      query: GET_ARTWORK,
      variables: {
        artworkId,
      },
    });

    if (result?.data) {
      return {
        props: {
          initialApolloState: apolloClient.cache.extract(),
          artwork: result?.data?.getArtwork,
          artworkId,
        },
      };
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: { artworkId },
  };
}

export default Page;
