import React from 'react';
import styles from './NavMenu.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import Notebook from '@/components/ui/Icons/Notebook';

const NavLi = ({ label, value, tab }) => (
  <li>
    <Link
      aria-label={label}
      className={classNames(styles.navButton, {
        [styles.isSelected]: tab === value,
      })}
      size="sm"
      href={`/launchpad?tab=${value}`}
    >
      {label}
    </Link>
  </li>
);

const NavMenu = (props) => {
  const { tab, navItems } = props;

  return (
    <nav className={styles.nav}>
      <ul>
        {navItems.map((item) => (
          <NavLi
            key={item.value}
            label={item.label}
            value={item.value}
            tab={tab}
          />
        ))}
      </ul>
      <Link className={styles.howBtn} href="/launchpad/about" target="_blank">
        <div className={styles.iconWrapper}>
          <Notebook />
        </div>
        <div>
          <b>How to use</b> Launchpad
          <span>&gt;</span>
        </div>
      </Link>
    </nav>
  );
};

export default NavMenu;
