import { useCallback, useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import styles from './SearchResult.module.scss';

import debounce from 'lodash/debounce';
import UserSearchResult from './UserSearchResult';
import ArtworkSearchResult from './ArtworkSearchResult';
import InspirationSearchResult from './InspirationSearchResult';

const SEARCH_COUNT = gql`
  query searchCount($q: String!) {
    searchCount(q: $q) {
      userCount
      artworkCount
      postCount
    }
  }
`;

function SearchResult(props) {
  const { className, search } = props;
  const [menu, setMenu] = useState('Artist');
  const [q, setQ] = useState(search);

  // searchCount data
  const [getCount, { data }] = useLazyQuery(SEARCH_COUNT, {
    fetchPolicy: 'network-only',
  });
  const { searchCount } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((propSearch) => {
      if (propSearch === '') {
        setIsLoading(false);
        return;
      }
      setQ(propSearch);
      getCount({
        variables: {
          q: propSearch,
        },
      })
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }, 300),
    []
  );

  useEffect(() => {
    if (search === '') {
      setIsLoading(false);
      debouncedSearch.cancel();
    } else {
      setIsLoading(true);
      debouncedSearch(search);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={className}>
      <ul className={styles.resultHeader}>
        <li
          onClick={() => setMenu('Artist')}
          className={menu === 'Artist' ? styles.active : ''}
        >
          Creators({searchCount?.userCount || '0'})
        </li>
        <li
          onClick={() => setMenu('artwork')}
          className={menu === 'artwork' ? styles.active : ''}
        >
          Artworks({searchCount?.artworkCount || '0'})
        </li>
        <li
          onClick={() => setMenu('inspiration')}
          className={menu === 'inspiration' ? styles.active : ''}
        >
          Inspiration({searchCount?.postCount || '0'})
        </li>
      </ul>
      {menu === 'Artist' && <UserSearchResult q={q} loading={isLoading} />}
      {menu === 'artwork' && <ArtworkSearchResult q={q} loading={isLoading} />}
      {menu === 'inspiration' && (
        <InspirationSearchResult q={q} loading={isLoading} />
      )}
    </div>
  );
}

export default SearchResult;
