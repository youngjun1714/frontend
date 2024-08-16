import React, { useState } from 'react';
import styles from '@/views/creation/components/creation-nav-menu/CreationNavMenu.module.scss';
import { useRouter } from 'next/router';

import Dropdown from '@/components/ui/Dropdown/Dropdown';
import MobileSortIcon from '@/components/mobile-ui/MobileIcons/MobileSortIcon';
import MobileCreationNavMenu from './MobileCreationNavMenu';

const content = [
  {
    id: 'NEWEST',
    title: 'Newest',
  },
  {
    id: 'POPULAR',
    title: 'Popular',
  },
  {
    id: 'OLDEST',
    title: 'Oldest',
  },
];

function CreationNavMenu(props) {
  const { tab, sort, onChangeTab, onChangeSort } = props;

  const [sortOpen, setSortOpen] = useState(false);

  const router = useRouter();
  const { query } = router;
  const { setSort: querySort } = query;

  return (
    <>
      {/* web */}
      <nav className={styles.nav}>
        <ul>
          <li
            className={tab === 'artworks' ? styles.active : ''}
            onClick={() => onChangeTab('artworks')}
          >
            Artworks
          </li>
          <li
            className={tab === 'inspiration' ? styles.active : ''}
            onClick={() => onChangeTab('inspiration')}
          >
            Inspiration
          </li>
        </ul>
        {tab === 'artworks' && (
          <Dropdown
            dropWidth="215px"
            dropHeight="48px"
            dropTitle={content[0].title}
            defaultValue={sort}
            content={content}
            dropFontSize="16px"
            dropFontColor={content ? '#000000' : '#bbbbbb'}
            onChange={onChangeSort}
            value={sort}
          />
        )}
      </nav>

      {/* mobile */}
      <nav
        className={styles.mobileNav}
        style={{ paddingBottom: tab === 'artworks' ? 0 : 8 }}
      >
        <ul className={styles.mobileNavList}>
          <li
            onClick={() => onChangeTab('artworks')}
            className={tab === 'artworks' ? styles.mobileActive : ''}
          >
            Artworks
          </li>
          <li
            onClick={() => onChangeTab('inspiration')}
            className={tab === 'inspiration' ? styles.mobileActive : ''}
          >
            Inspiration
          </li>
        </ul>
      </nav>
      {tab === 'artworks' && (
        <div className={styles.mobileSortButton}>
          <button
            onClick={() => {
              router.push(
                {
                  query: { ...query, setSort: true },
                },
                undefined,
                { shallow: true }
              );
              setSortOpen(!sortOpen);
            }}
          >
            Sort by <MobileSortIcon />
          </button>
          <MobileCreationNavMenu
            open={!!querySort}
            onClose={() => router.back({ shallow: true })}
            onChange={onChangeSort}
            content={content}
            defaultValue={sort}
            value={sort}
          />
        </div>
      )}
    </>
  );
}

export default CreationNavMenu;
