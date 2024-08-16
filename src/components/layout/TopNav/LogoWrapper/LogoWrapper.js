import React, { useState, useRef, useEffect } from 'react';
import styles from './LogoWrapper.module.scss';
import Link from 'next/link';

import NavArrow from './NavArrow';
import { isMainnet } from '@/utils/contractUtil';
import ArtisideLogo from '@/components/ui/Assets/ArtisideLogo';
import ArtisideTestnetLogo from '@/components/ui/Assets/ArtisideTestnetLogo';
import ArtDeFinanceLogoGray from '@/components/ui/Assets/ArtDeFinanceLogoGray';
import PartnersLogoGray from '@/components/ui/Assets/PartnersLogoGray';
import FluxLogoGray from '@/components/ui/Assets/FluxLogoGray';

function LogoWrapper(props) {
  const { onChangePath } = props;

  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className={styles.logoWrapper} ref={menuRef}>
      <div className={styles.logo}>
        <Link href="/">
          <button aria-label="artiside logo" onClick={() => onChangePath('/')}>
            {isMainnet ? <ArtisideLogo /> : <ArtisideTestnetLogo />}
          </button>
        </Link>
        <div className={styles.button} onClick={handleToggleClick}>
          <NavArrow className={open ? styles.open : ''} />
        </div>
      </div>
      <ul className={open ? `${styles.menu} ${styles.active}` : styles.menu}>
        <li
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_THE_FLUX_URL);
          }}
        >
          <FluxLogoGray />
        </li>
        <li
          className={styles.fillStroke}
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_PARTNERS_URL);
          }}
        >
          <PartnersLogoGray />
        </li>
        <li
          aria-label="fix"
          onClick={() => {
            window.open('https://artdefinance.io');
          }}
        >
          <ArtDeFinanceLogoGray />
        </li>
      </ul>
    </div>
  );
}

export default LogoWrapper;
