import React from 'react';
import styles from './SeedingNavMenu.module.scss';
import Link from 'next/link';
import classNames from 'classnames';

const NavLi = ({ label, value, tab }) => (
  <li>
    <Link
      aria-label={label}
      className={classNames(styles.navButton, {
        [styles.isSelected]: tab === value,
      })}
      size="sm"
      href={`/seeding?tab=${value}`}
    >
      {label}
    </Link>
  </li>
);

const SeedingNavMenu = (props) => {
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
    </nav>
  );
};

export default SeedingNavMenu;
