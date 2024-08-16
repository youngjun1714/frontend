import { useState } from 'react';
import styles from './MobileArtistFavorites.module.scss';
import MobileFavoriteArtworks from './MobileFavoriteArtworks';
import MobileFavoriteInspiration from './MobileFavoriteInspiration';

const MobileArtistFavorites = (props) => {
  const { artistId, tab, onClick } = props;

  return (
    <section className={styles.section}>
      <aside className={styles.menu}>
        <button
          onClick={() => onClick('artworks')}
          className={tab === 'artworks' ? styles.active : ''}
        >
          Artworks
        </button>
        <button
          onClick={() => onClick('inspiration')}
          className={tab === 'inspiration' ? styles.active : ''}
        >
          Inspiration
        </button>
      </aside>

      {tab === 'artworks' && <MobileFavoriteArtworks userId={artistId} />}
      {tab === 'inspiration' && <MobileFavoriteInspiration userId={artistId} />}
    </section>
  );
};

export default MobileArtistFavorites;
