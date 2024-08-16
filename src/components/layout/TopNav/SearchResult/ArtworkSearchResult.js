import { useRouter } from 'next/router';
import SearchTableRow from './SearchTableRow';
import styles from './SearchResult.module.scss';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const SEARCH_ARTWORK = gql`
  query searchArtwork($q: String!, $take: Int) {
    searchArtwork(q: $q, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      artworks {
        artworkId
        name
        artworkUrl
        mediaType
        creator {
          id
          nickname
        }
      }
    }
  }
`;

const ArtworkSearchResult = (props) => {
  const { q, loading: propsLoading } = props;
  // searchArtwork data
  const { loading, data } = useQuery(SEARCH_ARTWORK, {
    variables: {
      q,
      take: 10,
    },
    fetchPolicy: 'network-only',
  });
  const { searchArtwork } = data || {};
  const { artworks, pageInfo } = searchArtwork || {};
  const router = useRouter();
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
        {artworks?.length !== 0 ? (
          artworks.map((data) => (
            <SearchTableRow data={data} type="artwork" key={data.artworkId} />
          ))
        ) : (
          <SearchTableRow nodata={true} />
        )}
      </div>
      {(artworks || []).length < pageInfo.totalCount && (
        <div className={styles.footer}>
          <button onClick={() => router.push(`/creation?tab=artworks&q=${q}`)}>
            See all Artworks
          </button>
        </div>
      )}
    </>
  );
};

ArtworkSearchResult.propTypes = {
  q: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ArtworkSearchResult;
