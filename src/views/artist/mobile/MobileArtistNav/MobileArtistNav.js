import styles from './MobileArtistNav.module.scss';

const MobileArtistNav = (props) => {
  const { isMe, isPartner, menu, onClick } = props;

  return (
    <nav
      className={styles.nav}
      style={{ justifyContent: isPartner ? 'flex-start' : 'center' }}
    >
      {isPartner && (
        <button
          onClick={() => onClick('short-bio')}
          className={menu === 'short-bio' ? styles.active : ''}
        >
          Short Bio
        </button>
      )}
      {isPartner && (
        <button
          onClick={() => onClick('philosophy')}
          className={menu === 'philosophy' ? styles.active : ''}
        >
          Philosophy
        </button>
      )}
      {isPartner && (
        <button
          onClick={() => onClick('artworks')}
          className={menu === 'artworks' ? styles.active : ''}
        >
          Artworks
        </button>
      )}
      <button
        onClick={() => onClick('inspiration')}
        className={menu === 'inspiration' ? styles.active : ''}
      >
        Inspiration
      </button>
      <button
        onClick={() => onClick('favorites')}
        className={menu === 'favorites' ? styles.active : ''}
      >
        Favorites
      </button>
    </nav>
  );
};

export default MobileArtistNav;
