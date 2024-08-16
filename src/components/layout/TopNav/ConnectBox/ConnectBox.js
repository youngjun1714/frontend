import { useState } from 'react';
import styles from './ConnectBox.module.scss';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import dynamic from 'next/dynamic';

import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import Avatar from '@/components/ui/Avatar/Avatar';
import Profile from '@/components/ui/Profile/Profile';
import stores from '@/store';
import VerifiedOutline from '@/components/ui/Icons/VerifiedOutline';
import MenuFavorites from '@/components/ui/Icons/MenuFavorites';
import MenuWallet from '@/components/ui/Icons/MenuWallet';
import MenuHelp from '@/components/ui/Icons/MenuHelp';
import MenuSignOut from '@/components/ui/Icons/MenuSignOut';
import Google from '@/components/ui/Icons/Google';
import Polygon from '@/components/ui/Icons/Polygon';

const ConfirmModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/ConfirmModal')
);
const Menu = dynamic(() => import('@mui/material/Menu'));

function ConnectBox(props) {
  const router = useRouter();
  const { logOutAdf, openModalPage } = useConnectModalContext();
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);
  const { wallet } = me || {};
  // Dropdown toggle
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Confirm Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmOpen = () => {
    handleClose();
    setIsConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmOpen(false);
  };

  const moveTo = (url) => {
    handleClose();
    router.push(url);
  };

  const handleLogout = () => {
    logOutAdf();
    handleConfirmClose();
    location.href = '/';
  };

  const handleMoveToWallet = () => {
    if (me.wallet) {
      moveTo('/wallet');
    } else {
      openModalPage('ASK_ADD_WALLET');
      handleClose();
    }
  };

  return (
    <>
      <button
        className={styles.connector}
        onClick={handleClick}
        aria-label="user"
      >
        {!wallet ? (
          <>
            <Google />
            <h1>{me?.nickname}</h1>
          </>
        ) : (
          <>
            <Polygon />
            <h1>{wallet.substring(0, 6)}...</h1>
          </>
        )}

        <Avatar image={me?.profileImgUrl} username={me?.nickname} type="md" />
      </button>
      {isConfirmOpen && (
        <ConfirmModal
          open={isConfirmOpen}
          onCancel={handleConfirmClose}
          onConfirm={handleLogout}
          title="Do you want to sign out?"
        />
      )}
      {open && (
        <Menu
          id="create-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'create-button',
          }}
          sx={{
            '& .MuiPaper-root': {
              width: 282,
              top: '74px !important',
              padding: '20px 25px',
              backrgroundColor: '#ffffff',
              boxShadow: '0px 26px 80px rgba(18, 18, 23, 0.1)',
              borderRadius: 10,
              boxSizing: 'border-box',
            },
          }}
        >
          {me && (
            <Profile
              username={me.nickname}
              name={me.isPartner && me.partner.artistName}
              profileUrl={me.profileImgUrl}
              isArtist={me.isPartner}
              wallet={me.wallet}
              id={me.id}
              onClick={moveTo}
            />
          )}
          <ul className={styles.list}>
            <li
              onClick={() =>
                moveTo(`/artist/${me?.id}?list=favorites&tab=artworks`)
              }
            >
              <MenuFavorites />
              <span>Favorites</span>
            </li>
            <li onClick={handleMoveToWallet}>
              <MenuWallet /> <span>Wallet</span>
            </li>
            {/* <li onClick={() => moveTo(`/artist/${me?.id}?list=notifications`)}>
            <MenuNotifications /> <span>Notifications</span>
          </li> */}
            {!me?.isPartner && (
              <li
                onClick={() => {
                  window.open(process.env.NEXT_PUBLIC_PARTNERS_URL);
                }}
              >
                <VerifiedOutline /> <span>Upgrade to Partners</span>
              </li>
            )}

            <li
              onClick={() => {
                window.open('/help', '_blank');
                handleClose();
              }}
            >
              <MenuHelp /> <span>Help</span>
            </li>
            <li onClick={handleConfirmOpen}>
              <MenuSignOut />
              <span>Sign out</span>
            </li>
          </ul>
        </Menu>
      )}
    </>
  );
}

export default ConnectBox;
