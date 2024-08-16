import React from 'react';
import styles from '@/components/layout/TopNav/NavItems/NavItems.module.scss';
import Link from 'next/link';

function NavItems(props) {
  const { path, onChangePath } = props;

  return (
    <div className={styles.items}>
      <Link href="/creation">
        <div
          className={path === '/' || path === '/creation' ? styles.active : ''}
          onClick={() => onChangePath('/creation')}
        >
          Creation
        </div>
      </Link>
      <Link href="/feed">
        <div
          className={path === '/feed' ? styles.active : ''}
          onClick={() => onChangePath('/feed')}
        >
          Feed
        </div>
      </Link>
      <Link href="/seeding">
        <div
          className={path === '/seeding' ? styles.active : ''}
          onClick={() => onChangePath('/seeding')}
        >
          Seeding
        </div>
      </Link>
      <Link href="/launchpad">
        <div
          className={path === '/launchpad' ? styles.active : ''}
          onClick={() => onChangePath('/launchpad')}
        >
          Launchpad
        </div>
      </Link>
    </div>
  );
}

export default NavItems;
