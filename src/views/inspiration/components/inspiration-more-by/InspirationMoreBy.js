import styles from './InspirationMoreBy.module.scss';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import Picture from '@/components/ui/Picture/Picture';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import MobileRightChevron from '@/components/mobile-ui/MobileIcons/MobileRightChevron';

const GET_POSTS = gql`
  query getPosts($userId: ID, $take: Int, $excludeIds: [ID]) {
    getPosts(userId: $userId, take: $take, excludeIds: $excludeIds) {
      posts {
        id
        title
        description
        likeCount
        viewCount
        commentCount
        favoriteCount
        mainImage
        images
        createdAt
        user {
          id
          wallet
          nickname
          artistName
          isPartner
          profileImgUrl
        }
      }
    }
  }
`;

const TAKE = 4;

function InspirationMoreBy(props) {
  const router = useRouter();
  const { data } = props;
  const { user } = data || {};
  const {
    loading: postsLoading,
    data: postsData,
    refetch,
  } = useQuery(GET_POSTS, {
    variables: {
      userId: user?.id,
      take: TAKE,
      excludeIds: [data?.id],
    },
    fetchPolicy: 'cache-and-network',
  });
  const { getPosts } = postsData || {};
  const { posts } = getPosts || {};

  if (posts?.length === 0) {
    return;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          More by <span>{user?.nickname}</span>
        </h1>
        <button
          onClick={() => router.push(`/artist/${user?.id}?list=inspiration`)}
        >
          More <ArrowIcon direction="right" />
        </button>
      </div>
      <div
        className={styles.mobileHeader}
        onClick={() => router.push(`/artist/${user?.id}?list=inspiration`)}
      >
        <h1>
          More by&nbsp;<span> {user?.nickname}</span>{' '}
          <button>
            <MobileRightChevron />
          </button>
        </h1>
      </div>
      <article className={styles.article}>
        {posts?.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/inspiration/${post.id}`)}
          >
            <Picture
              url={post.mainImage}
              objectFit="cover"
              alt={post.title}
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              placeholder="blur"
            />
          </div>
        ))}
      </article>
    </div>
  );
}

export default InspirationMoreBy;
