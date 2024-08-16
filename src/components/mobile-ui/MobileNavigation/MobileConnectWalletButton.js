import { useState } from 'react';
import styles from './MobileConnectWalletButton.module.scss';

import MobileWalletIcon from '../MobileIcons/MobileWalletIcon';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const MobileConnectWalletButton = (props) => {
  const [isHover, setIsHover] = useState(false);

  const { openModalPage } = useConnectModalContext();

  return (
    <div
      className={styles.wallet}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => openModalPage('ADD_WALLET')}
      style={{
        border: isHover
          ? '1px solid var(--artiside-neutral1)'
          : '1px solid var(--artiside-neutral5)',
      }}
    >
      <span>
        <MobileWalletIcon />
      </span>
      <p>Connect Wallet</p>
    </div>
  );
};

export default MobileConnectWalletButton;
