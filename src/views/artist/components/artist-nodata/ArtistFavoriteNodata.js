import styles from './ArtistNodata.module.scss';
import Link from 'next/link';

import BookmarkOutline from '@/components/ui/Icons/BookmarkOutline';

function ArtistFavoriteNodata({ me, type }) {
  return (
    <section className={styles.section}>
      <div>
        <BookmarkOutline color="var(--artiside-neutral4)" />
        {me ? (
          <>
            <h1>You have not added anything yet!</h1>
            <h2>Bookmark to store your favorite artworks.</h2>
            <Link
              href={type === 'Artworks' ? '/' : '/?tab=inspiration'}
              style={{ maxWidth: 224, width: '100%' }}
            >
              <button className={styles.button}>{`Go See ${type}`}</button>
            </Link>
          </>
        ) : (
          <h1>No Favorites yet</h1>
        )}
      </div>
    </section>
  );
}

export default ArtistFavoriteNodata;
