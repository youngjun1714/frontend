import React from 'react';
import styles from '@/components/layout/TopNav/ConnectButton/ConnectButton.module.scss';

import Button from '@/components/ui/Button/Button';
import Wallet from '@/components/ui/Icons/Wallet';

function ConnectButton({ onConnect }) {
  return (
    <>
      <button
        className={styles.connectMobileBtn}
        onClick={onConnect}
        aria-label="connect"
      ></button>
      <Button onClick={onConnect} className={styles.connectWebBtn} size="sm">
        <Wallet color="white" dimension="20px" />
        &nbsp;&nbsp;Connect
      </Button>
    </>
  );
}

export default ConnectButton;
