import PropTypes from 'prop-types';
import SearchTableRow from './SearchTableRow';
import styles from './SearchResult.module.scss';
import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';

const SEARCH_USER = gql`
  query searchUser($q: String!, $currentPage: Int, $take: Int) {
    searchUser(q: $q, currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      users {
        id
        nickname
        artistName
        profileImgUrl
        isPartner
      }
    }
  }
`;

const UserSearchResult = (props) => {
  const { q, loading: propsLoading } = props;
  // searchUser data
  const { loading, data, fetchMore } = useQuery(SEARCH_USER, {
    variables: {
      q,
      take: 10,
    },
    fetchPolicy: 'network-only',
  });
  const { searchUser } = data || {};
  const { users, pageInfo } = searchUser || {};

  const handleMore = () => {
    fetchMore({
      variables: {
        currentPage: ((pageInfo || {}).currentPage || 0) + 1,
      },
    });
  };

  if (loading || propsLoading)
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

  return (
    <>
      <div className={styles.resultTable}>
        {users?.length !== 0 ? (
          users?.map((data) => (
            <SearchTableRow data={data} type="Artist" key={data.id} />
          ))
        ) : (
          <SearchTableRow nodata={true} />
        )}
      </div>
      {(users || []).length < (pageInfo || {}).totalCount && (
        <div className={styles.footer}>
          <button onClick={handleMore}>More</button>
        </div>
      )}
    </>
  );
};

UserSearchResult.propTypes = {
  q: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UserSearchResult;
