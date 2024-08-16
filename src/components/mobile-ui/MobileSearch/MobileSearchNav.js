import styles from './MobileSearchNav.module.scss';

const MobileSearchNav = (props) => {
  const { menu, setMenu, count } = props;
  const { userCount, artworkCount, postCount } = count || {};

  const menuList = [
    { name: 'creators', count: userCount },
    { name: 'artworks', count: artworkCount },
    { name: 'inspiration', count: postCount },
  ];

  return (
    <nav className={styles.nav}>
      {menuList.map((item) => (
        <button
          key={item.name}
          className={menu === item.name ? styles.active : ''}
          onClick={() => setMenu(item.name)}
        >
          {item.name}
          {`(${item.count || 0})`}
        </button>
      ))}
    </nav>
  );
};

// Sub Component

export default MobileSearchNav;
