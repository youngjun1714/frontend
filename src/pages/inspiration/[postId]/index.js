import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import Head from 'next/head';

import { initializeApollo } from '@/library/apollo-client';
import InspirationDetail from '@/views/inspiration';

const GET_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      user {
        id
        wallet
        nickname
        profileImgUrl
        coverImgUrl
        isPartner
        artistName
      }
      title
      description
      tags
      mainImage
      images
      likeCount
      viewCount
      favoriteCount
      commentCount
      createdAt
      updatedAt
      isLiked
      isBookmarked
    }
  }
`;

const Page = (props) => {
  const { post, postId } = props;
  const { title, description, mainImage, user } = post || {};

  const convertIpfs = mainImage?.includes('ipfs://')
    ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}${mainImage.split('ipfs://')[1]}`
    : mainImage;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {post && (
        <Head>
          <>
            <title>{`${title} by ${user.nickname} | Artiside`}</title>
            <meta
              property="og:title"
              content={`${title} by ${user.nickname} | Artiside`}
              key="og-title"
            />
            <meta
              name="description"
              content={description || `${title} by ${user.nickname} | Artiside`}
              key="description"
            />
            <meta
              property="og:description"
              content={description || `${title} by ${user.nickname} | Artiside`}
              key="og-description"
            />
            <meta
              property="og:url"
              content={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/inspiration/${postId}`}
              key="og-url"
            />
            <link
              rel="canonical"
              href={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}/inspiration/${postId}`}
            />
          </>

          {convertIpfs && (
            <meta property="og:image" content={convertIpfs} key="og-image" />
          )}
        </Head>
      )}
      {mounted && <InspirationDetail postId={postId} />}
    </>
  );
};

export async function getServerSideProps(context) {
  const { postId } = context.params;

  const apolloClient = initializeApollo(null, context);

  try {
    const result = await apolloClient.query({
      query: GET_POST,
      variables: {
        postId,
      },
    });

    if (result?.data) {
      return {
        props: {
          initialApolloState: apolloClient.cache.extract(),
          post: result?.data?.getPost,
          postId,
        },
      };
    }
  } catch (e) {}

  return {
    props: {
      postId,
    },
  };
}

export default Page;
