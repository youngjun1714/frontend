import { useMemo } from 'react';
import merge from 'deepmerge';
import { ApolloClient, InMemoryCache, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import tokenStore from '@/adf-connect/utils/token-store';

const isServer = () => typeof window === 'undefined';

const authLink = setContext((_, { headers }) => {
  const token = isServer() ? null : tokenStore.get('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`,
});

const seedLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_SEED_SERVER_URL}/graphql`,
});

const launchpadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_LAUNCHPAD_SERVER_URL}/graphql`,
});

const paginationCacheMerge =
  (
    /** @type {String} field name of target list (ex artworks, users) */ listFieldName
  ) =>
  (existing, incoming, { args: { currentPage = 0, take } }) => {
    /** @type {[]} */
    let merged =
      existing && existing[listFieldName]
        ? existing[listFieldName].slice(0)
        : [];
    for (let i = 0; i < (incoming[listFieldName] || []).length; i++) {
      merged[currentPage * take + i] = incoming[listFieldName][i];
    }
    if ((incoming[listFieldName] || []).length < take) {
      const removeCount = take - (incoming[listFieldName] || []).length;
      merged.splice(currentPage * take + (take - removeCount), removeCount);
    }

    return {
      [listFieldName]: merged,
      pageInfo: incoming.pageInfo,
    };
  };

let apolloClient = null;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: isServer(),
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === 'seed',
      from([authLink, seedLink]),
      ApolloLink.split(
        (operation) => operation.getContext().clientName === 'launchpad',
        from([authLink, launchpadLink]),
        from([authLink, uploadLink])
      )
    ),
    cache: new InMemoryCache({
      typePolicies: {
        Artwork: {
          keyFields: ['artworkId'],
        },
        Post: {
          keyFields: ['id'],
        },
        FollowingStatus: {
          keyFields: ['userId'],
        },
        SeedingPartners: {
          keyFields: ['partnerId', 'episodeNo'],
        },
        Query: {
          fields: {
            getArtworks: {
              keyArgs: ['q', 'orderField', 'userId', 'excludeIds'],
              merge: paginationCacheMerge('artworks'),
            },
            getPosts: {
              keyArgs: ['userId', 'excludeIds', 'q'],
              merge: paginationCacheMerge('posts'),
            },
            getFeeds: {
              keyArgs: false,
              merge: paginationCacheMerge('feeds'),
            },
            searchUser: {
              keyArgs: ['q'],
              merge: paginationCacheMerge('users'),
            },
            searchArtwork: {
              keyArgs: ['q'],
              merge: paginationCacheMerge('artworks'),
            },
            getArtworkComments: {
              keyArgs: ['artworkId', 'parentCommentId'],
              merge: paginationCacheMerge('comments'),
            },
            getPostComments: {
              keyArgs: ['postId', 'parentCommentId'],
              merge: paginationCacheMerge('comments'),
            },
            getMyArtworks: {
              keyArgs: false,
              merge: paginationCacheMerge('artworks'),
            },
            getUserFavoriteArtworks: {
              keyArgs: ['userId'],
              merge: paginationCacheMerge('artworks'),
            },
            getUserFavoritePosts: {
              keyArgs: ['userId'],
              merge: paginationCacheMerge('posts'),
            },
            getUserFollowers: {
              keyArgs: ['userId'],
              merge: paginationCacheMerge('users'),
            },
            getUserFollowings: {
              keyArgs: ['userId'],
              merge: paginationCacheMerge('users'),
            },
            getNotifications: {
              keyArgs: false,
              merge: paginationCacheMerge('notifications'),
            },
            getPrevEpisodeInfos: {
              keyArgs: false,
              merge: paginationCacheMerge('seedEpisodeInfos'),
            },
            getEpisodeList: {
              keyArgs: false,
              merge: paginationCacheMerge('seedEpisodeInfos'),
            },
            getSeedPartners: {
              keyArgs: ['episodeNo', 'searchKeyword', 'orderField'],
              merge: paginationCacheMerge('partners'),
            },
            getSeedMyPartners: {
              keyArgs: ['episodeNo', 'searchKeyword', 'orderField'],
              merge: paginationCacheMerge('partners'),
            },
            getHistoryList: {
              keyArgs: [
                'episodeNo',
                'seedEvent',
                'orderField',
                'searchKeyword',
              ],
              merge: paginationCacheMerge('seedActivities'),
            },
            getSeedersToPartner: {
              keyArgs: ['episodeNo', 'partnerId'],
              merge: paginationCacheMerge('seedingInfos'),
            },
            getSeedingHistory: {
              keyArgs: ['episodeNo', 'searchKeyword'],
              merge: paginationCacheMerge('seedActivities'),
            },
            getRequestHistory: {
              keyArgs: null,
              merge: paginationCacheMerge('seedActivities'),
            },
            GetActivityHistory: {
              keyArgs: ['seedEvent', 'orderField'],
              merge: paginationCacheMerge('seedActivities'),
            },
          },
        },
      },
    }),
  });
}
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // Next.js에서 Apollo Client를 이용해 데이터를 가져오는 함수가 있다면, 초기 상태값이 여기에서 합쳐진다.
  if (initialState) {
    // 클라이언트에서의 받은 데이터인 현재 캐시 데이터를 가져온다.
    const existingCache = _apolloClient.extract();

    const overwriteMerge = (destinationArray, sourceArray, options) =>
      sourceArray;

    // 현재 캐시와 SSR 메소드인 getStaticProps/getServerSideProps로 부터 받은 데이터를 합친다.
    const data = merge(initialState, existingCache, {
      arrayMerge: overwriteMerge,
    });

    // 합쳐진 데이터를 저장한다.
    _apolloClient.cache.restore(data);
  }

  // SSG(Server Side Generation)와 SSR(Server Side Rendering)은 항상 새로운 Apollo Client를 생성한다.
  if (isServer()) return _apolloClient;
  // 클라이언트의 Apollo Client는 한 번만 생성한다.
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
