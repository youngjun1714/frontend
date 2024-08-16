import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import SearchTableRow from './SearchTableRow';
import styles from './SearchResult.module.scss';
import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';

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

const InspirationSearchResult = (props) => {
  const { q, loading: propsLoading } = props;
  //searchPost data
  const { loading, data } = useQuery(SEARCH_POST, {
    variables: {
      q,
      take: 10,
    },
    fetchPolicy: 'network-only',
  });
  const { searchPost } = data || {};
  const { posts, pageInfo } = searchPost || {};
  const router = useRouter();
  if (loading || propsLoading) {
    return (
      <div
        className={styles.resultTables}
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
    <>
      <div className={styles.resultTable}>
        {posts?.length !== 0 ? (
          posts.map((data) => (
            <SearchTableRow data={data} type="inspiration" key={data.id} />
          ))
        ) : (
          <SearchTableRow nodata={true} />
        )}
      </div>
      {(posts || []).length < pageInfo.totalCount && (
        <div className={styles.footer}>
          <button
            onClick={() => router.push(`/creation?tab=inspiration&q=${q}`)}
          >
            See all Inspirations
          </button>
        </div>
      )}
    </>
  );
};

InspirationSearchResult.propTypes = {
  q: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default InspirationSearchResult;
