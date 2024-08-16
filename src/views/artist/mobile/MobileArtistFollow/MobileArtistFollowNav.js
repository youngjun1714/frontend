import styles from './MobileArtistFollow.module.scss';

const MobileArtistFollowNav = (props) => {
  const { menu, onChangeNav } = props;

  return (
    <nav className={styles.nav}>
      <button
        className={menu === 'followers' ? styles.active : ''}
        onClick={() => onChangeNav('followers')}
      >
        Followers
      </button>
      <button
        className={menu === 'following' ? styles.active : ''}
        onClick={() => onChangeNav('following')}
      >
        Following
      </button>
      <div
        className={styles.line}
        style={{
          transform: menu === 'followers' ? 'translate(0)' : 'translate(100%)',
        }}
      />
    </nav>
  );
};

export default MobileArtistFollowNav;
