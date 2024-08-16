import { Unstable_Grid2 as Grid } from '@mui/material';
import styles from '@/views/artist/Artist.module.scss';
import FavoriteArtworks from './FavoriteArtworks';
import FavoriteInspirations from './FavoriteInspirations';

const ArtistFavorites = ({ artistId, user, tab, handleChangeTab }) => (
  <Grid
    container
    xs={12}
    md={9}
    style={{ display: 'flex', flexDirection: 'column' }}
  >
    <ul className={styles.tabMenu}>
      <li
        className={tab === 'artworks' ? styles.active : ''}
        onClick={() => handleChangeTab('artworks')}
      >
        Artwork({user?.bookmarkArtworkCount || 0})
      </li>
      <li
        className={tab === 'inspiration' ? styles.active : ''}
        onClick={() => handleChangeTab('inspiration')}
      >
        Inspiration({user?.bookmarkPostCount || 0})
      </li>
    </ul>
    {tab === 'artworks' && <FavoriteArtworks userId={artistId} />}

    {tab === 'inspiration' && <FavoriteInspirations userId={artistId} />}
  </Grid>
);

export default ArtistFavorites;
