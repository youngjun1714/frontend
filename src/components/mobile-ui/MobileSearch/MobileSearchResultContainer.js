import { useState, useEffect, useCallback } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import styles from './MobileSearchResultContainer.module.scss';
import debounce from 'lodash/debounce';

import MobileSearchNav from './MobileSearchNav';
import MobileUserSearchResult from './MobileSearchData/MobileUserSearchResult';
import MobileArtworkSearchResult from './MobileSearchData/MobileArtworkSearchResult';
import MobileInspirationSearchResult from './MobileSearchData/MobileInspirationSearchResult';

const SEARCH_COUNT = gql`
  query searchCount($q: String!) {
    searchCount(q: $q) {
      userCount
      artworkCount
      postCount
    }
  }
`;

const MobileSearchResultContainer = (props) => {
  const { search, onClose } = props;

  const [menu, setMenu] = useState('creators');
  const [q, setQ] = useState(search);
  const [isLoading, setIsLoading] = useState(false);

  const [getCount, { data }] = useLazyQuery(SEARCH_COUNT, {
    fetchPolicy: 'network-only',
  });
  const { searchCount } = data || {};

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
    <div className={styles.container}>
      <MobileSearchNav
        menu={menu}
        setMenu={setMenu}
        search={search}
        count={searchCount}
      />

      {menu === 'creators' && (
        <MobileUserSearchResult q={q} loading={isLoading} onClose={onClose} />
      )}
      {menu === 'artworks' && (
        <MobileArtworkSearchResult
          q={q}
          loading={isLoading}
          onClose={onClose}
        />
      )}
      {menu === 'inspiration' && (
        <MobileInspirationSearchResult
          q={q}
          loading={isLoading}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default MobileSearchResultContainer;
