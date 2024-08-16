import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import styles from './MobileUserSearchResult.module.scss';

import { CircularProgress } from '@mui/material';

import Avatar from '@/components/ui/Avatar/Avatar';
import MobileSearchNodata from '../MobileSearchNodata';

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

const MobileUserSearchResult = (props) => {
  const { q, loading, onClose } = props;
  const {
    loading: searchLoading,
    data,
    fetchMore,
  } = useQuery(SEARCH_USER, {
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

  if (loading || searchLoading)
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

  return (
    <section className={styles.section}>
      {users?.length !== 0 ? (
        users?.map((user) => (
          <Row user={user} key={user.id} onClose={onClose} />
        ))
      ) : (
        <MobileSearchNodata />
      )}
      {(users || []).length < (pageInfo || {}).totalCount && (
        <div className={styles.footer}>
          <button onClick={handleMore}>More</button>
        </div>
      )}
    </section>
  );
};

// Sub Component
function Row(props) {
  const { user, onClose } = props;
  return (
    <Link href={`/artist/${user?.id}`}>
      <div className={styles.row}>
        <Avatar
          type="md"
          username={user?.nickname}
          image={user?.profileImgUrl}
        />
        <article>
          <h1>{user?.nickname}</h1>
          {user?.isPartner && <h2>@{user?.artistName}</h2>}
        </article>
      </div>
    </Link>
  );
}

export default MobileUserSearchResult;
