import styles from './MobileConnectBox.module.scss';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import { Drawer } from '@mui/material';

import stores from '@/store';
import MobileConnectBoxWallet from './MobileConnectBoxWallet';
import MobileConnectBoxUsername from './MobileConnectBoxUsername';
import MobileConnectBoxMenu from './MobileConnectBoxMenu';
import MobileConnectWalletButton from './MobileConnectWalletButton';

const MobileConnectBox = (props) => {
  const { open, onClose } = props;

  const router = useRouter();

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);
  const { wallet } = me || {};

  return (
    <Drawer
      transitionDuration={200}
      anchor={'bottom'}
      open={open}
      onClose={() => router.back({ shallow: true })}
      sx={{
        '@media (min-width: 1025px)': {
          display: 'none',
        },
        '&': {
          zIndex: 1300,
        },
        '& > .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
        },
        '& > .MuiPaper-root': {
          bottom: '84px',
          backgroundColor: 'transparent',
          '@media (min-width: 600px)': {
            bottom: '0',
          },
        },
      }}
    >
      <div className={styles.box}>
        <div className={styles.bar} />
        <div className={styles.user}>
          <MobileConnectBoxUsername
            id={me?.id}
            nickname={me?.nickname}
            profileImgUrl={me?.profileImgUrl}
            isPartner={me?.isPartner}
            artistName={me?.partner?.artistName}
            onClose={onClose}
          />
          {wallet ? (
            <MobileConnectBoxWallet wallet={wallet} nickname={me?.nickname} />
          ) : (
            <MobileConnectWalletButton />
          )}
        </div>
        <div className={styles.menu}>
          <MobileConnectBoxMenu
            id={me?.id}
            wallet={me?.wallet}
            isPartner={me?.isPartner}
            onClose={onClose}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default MobileConnectBox;
