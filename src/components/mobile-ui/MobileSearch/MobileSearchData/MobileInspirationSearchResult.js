import { useRouter } from 'next/router';
import styles from './MobileArticleSearchResult.module.scss';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

import { CircularProgress } from '@mui/material';

import MobileSearchNodata from '../MobileSearchNodata';
import Picture from '@/components/ui/Picture/Picture';

const SEARCH_POST = gql`
  query searchPost($q: String!, $take: Int) {
    searchPost(q: $q, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      posts {
        id
        user {
          id
          nickname
        }
        title
        mainImage
      }
    }
  }
`;

const MobileInspirationSearchResult = (props) => {
  const { q, loading, onClose } = props;

  const router = useRouter();

  const { loading: searchLoading, data } = useQuery(SEARCH_POST, {
    variables: {
      q,
      take: 10,
    },
    fetchPolicy: 'network-only',
  });
  const { searchPost } = data || {};
  const { posts, pageInfo } = searchPost || {};

  if (loading || searchLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '40px 0',
        }}
      >
        <CircularProgress thickness={5} size={24} />
      </div>
    );
  }

  return (
    <section className={styles.section}>
      {posts?.length !== 0 ? (
        posts?.map((post) => (
          <Row post={post} key={post.id} onClose={onClose} />
        ))
      ) : (
        <MobileSearchNodata />
      )}
      {(posts || []).length < (pageInfo || {}).totalCount && (
        <div className={styles.footer}>
          <button
            onClick={() => {
              router.push(`/creation?tab=inspiration&q=${q}`);
              // onClose();
            }}
          >
            See all Inspiration
          </button>
        </div>
      )}
    </section>
  );
};

// Sub Component
function Row(props) {
  const { post, onClose } = props;
  const { user } = post || {};

  return (
    <Link href={`/inspiration/${post?.id}`}>
      <div className={styles.row}>
        <div className={styles.picture}>
          <Picture
            url={post.mainImage}
            alt={`${user?.nickname}'s inspiration`}
            sizes="25vw"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
            placeholder="blur"
            objectFit="cover"
          />
        </div>
        <article>
          <h1>{post?.title}</h1>
          <h2>Created by : {user?.nickname}</h2>
        </article>
      </div>
    </Link>
  );
}

export default MobileInspirationSearchResult;
