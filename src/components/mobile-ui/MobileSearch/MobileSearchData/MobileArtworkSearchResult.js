import { useRouter } from 'next/router';
import styles from './MobileArticleSearchResult.module.scss';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

import { CircularProgress } from '@mui/material';

import MobileSearchNodata from '../MobileSearchNodata';
import MobileRightChevron from '../../MobileIcons/MobileRightChevron';
import Media from '@/components/ui/Media/Media';

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

const MobileArtworkSearchResult = (props) => {
  const { q, loading, onClose } = props;

  const router = useRouter();

  const { loading: searchLoading, data } = useQuery(SEARCH_ARTWORK, {
    variables: {
      q,
      take: 10,
    },
    fetchPolicy: 'network-only',
  });
  const { searchArtwork } = data || {};
  const { artworks, pageInfo } = searchArtwork || {};

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
      {artworks?.length !== 0 ? (
        artworks?.map((artwork) => (
          <Row artwork={artwork} key={artwork.artworkId} onClose={onClose} />
        ))
      ) : (
        <MobileSearchNodata />
      )}
      {(artworks || []).length < (pageInfo || {}).totalCount && (
        <div className={styles.footer}>
          <button
            onClick={() => {
              router.push(`/creation?tab=artworks&q=${q}`);
              // onClose();
            }}
          >
            See all Artworks
          </button>
        </div>
      )}
    </section>
  );
};

// Sub Component
function Row(props) {
  const { artwork, onClose } = props;
  const { creator } = artwork || {};

  return (
    <Link href={`/artwork/${artwork?.artworkId}`}>
      <div className={styles.row}>
        <div className={styles.picture}>
          <Media
            url={artwork.artworkUrl}
            mediaType={artwork.mediaType}
            objectFit="cover"
            alt={`${creator?.nickname}'s artwork`}
            sizes="25vw"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
            placeholder="blur"
          />
        </div>
        <article>
          <h1>{artwork?.name}</h1>
          <h2>Created by : {creator?.nickname}</h2>
        </article>
      </div>
    </Link>
  );
}

export default MobileArtworkSearchResult;
