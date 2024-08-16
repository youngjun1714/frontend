import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import Head from 'next/head';

import { initializeApollo } from '@/library/apollo-client';
import ArtistDetail from '@/views/artist';

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      wallet
      nickname
      profileImgUrl
      coverImgUrl
      followingCount
      followerCount
      artworkCreatedCount
      artworkOwnedCount
      artworkCreatedAndOwnedCount
      postCount
      bookmarkArtworkCount
      bookmarkPostCount
      isPartner
      createdAt
      partner {
        artistName
        birth
        instagram
        facebook
        twitter
        youtube
        discord
        bio {
          intro
          artStyle
          representativeArtwork
          rememberAs
          recommendArtist
          futureActivities
        }
        philosophy {
          values
          consideration
          message
          goodArtwork
        }
      }
    }
  }
`;

const Page = (props) => {
  const { nickname, profileImgUrl, intro, artistId } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <Head>
        {nickname && (
          <>
            <title>{`${nickname} | Artiside`}</title>
            <meta
              property="og:title"
              content={`${nickname} | Artiside`}
              key="og-title"
            />
            <meta
              property="og:url"
              content={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/artist/${artistId}`}
              key="og-url"
            />
            <link
              rel="canonical"
              href={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/artist/${artistId}`}
            />
          </>
        )}

        {intro && (
          <>
            <meta name="description" content={intro} key="description" />
            <meta
              property="og:description"
              content={intro}
              key="og-description"
            />
          </>
        )}

        {profileImgUrl && (
          <meta property="og:image" content={profileImgUrl} key="og-image" />
        )}
      </Head>
      {mounted && <ArtistDetail artistId={artistId} />}
    </>
  );
};

export async function getServerSideProps(context) {
  const { artistId } = context.params;

  const apolloClient = initializeApollo(null, context);

  const result = await apolloClient.query({
    query: GET_USER,
    variables: {
      userId: artistId,
    },
  });

  if (result?.data) {
    return {
      props: {
        initialApolloState: apolloClient.cache.extract(),
        nickname: result?.data?.getUser?.nickname,
        intro: result?.data?.getUser?.partner
          ? result?.data?.getUser?.partner?.bio?.intro
          : null,
        profileImgUrl: result?.data?.getUser?.profileImgUrl,
        artistId,
      },
    };
  }
  return {
    props: { artistId },
  };
}

export default Page;
