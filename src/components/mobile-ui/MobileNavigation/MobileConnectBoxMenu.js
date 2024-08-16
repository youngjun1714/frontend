import { useState } from 'react';
import styles from './MobileConnectBoxMenu.module.scss';
import { useRouter } from 'next/router';

import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import MobileConnectBoxIcons from '../MobileIcons/MobileConnectBoxIcons';
import MobileRightChevron from '../MobileIcons/MobileRightChevron';
import dynamic from 'next/dynamic';

const ConfirmModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/ConfirmModal')
);

const MobileConnectBoxMenu = ({ id, wallet, onClose }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { logOutAdf, openModalPage } = useConnectModalContext();

  const router = useRouter();

  const handleConfirmOpen = (e) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmOpen(false);
  };

  const handleLogout = () => {
    logOutAdf();
    handleConfirmClose();
    location.href = '/';
  };

  const moveTo = (url) => {
    router.push(url);
  };

  const handleMoveToWallet = () => {
    if (wallet) {
      moveTo('/wallet');
      onClose && onClose();
    } else {
      openModalPage('ASK_ADD_WALLET');
    }
  };

  return (
    <>
      <div className={styles.table}>
        <List
          onClick={() => {
            moveTo(`/artist/${id}?list=favorites`);
            onClose && onClose();
          }}
          title="favorites"
        />
        <List onClick={handleMoveToWallet} title="wallet" />
        {/* <List url="/notifications" title="notifications" /> */}
        {/* {!isPartner && (
          <List
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_PARTNERS_URL);
            }}
            title="upgrade to partner"
          />
        )} */}
        <List
          onClick={() => {
            window.open('/help');
          }}
          title="help"
        />
      </div>

      {/* sign out */}
      <div style={{ borderTop: '1px solid var(--artiside-neutral5)' }}>
        <List
          title="sign out"
          color="var(--artiside-neutral2)"
          onClick={handleConfirmOpen}
        />
        {isConfirmOpen && (
          <ConfirmModal
            open={isConfirmOpen}
            onCancel={handleConfirmClose}
            onConfirm={handleLogout}
            title="Do you want to sign out?"
          />
        )}
      </div>
    </>
  );
};

// Sub Component
function List({ title, onClick, color }) {
  return (
    <div className={styles.list} onClick={onClick}>
      <div className={styles.left}>
        <MobileConnectBoxIcons shape={title} />
        <h1 style={{ color: color ? color : 'var(--artiside-neutral1)' }}>
          {title}
        </h1>
      </div>
      <div className={styles.right}>
        <MobileRightChevron />
      </div>
    </div>
  );
}

export default MobileConnectBoxMenu;
