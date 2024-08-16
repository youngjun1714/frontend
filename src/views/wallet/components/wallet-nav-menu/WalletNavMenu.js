import React from 'react';
import styles from './WalletNavMenu.module.scss';
import classNames from 'classnames';
import Link from 'next/link';

const navItems = [
  {
    label: 'Balance',
    value: 'balance',
  },
  {
    label: 'Reward',
    value: 'reward',
  },
  {
    label: 'History',
    value: 'history',
  },
];

const NavLi = ({ label, value, tab }) => (
  <li>
    <Link
      className={classNames(styles.navButton, {
        [styles.isSelected]: tab === value,
      })}
      href={`/wallet?tab=${value}`}
    >
      {label}
    </Link>
  </li>
);

const WalletNavMenu = (props) => {
  const { tab } = props;

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

export default WalletNavMenu;
