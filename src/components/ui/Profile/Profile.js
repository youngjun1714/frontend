import React from 'react';
import styles from './Profile.module.scss';
import Avatar from '../Avatar/Avatar';
import CopyButton from '../CopyButton/CopyButton';
import IsArtistNew from '../Icons/IsArtistNew';
import Polygon from '../Icons/Polygon';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import MobileWalletIcon from '@/components/mobile-ui/MobileIcons/MobileWalletIcon';

const Profile = ({
  className,
  type = 'fullName', // fullName, singleName
  username,
  name,
  profileUrl,
  isArtist,
  wallet,
  id,
  onClick,
}) => {
  const { openModalPage } = useConnectModalContext();

  return (
    <>
      <div
        className={`${styles.profile} ${styles[type]} ${className}`}
        onClick={() =>
          onClick(
            isArtist
              ? `/artist/${id}?list=artworks`
              : `/artist/${id}?list=inspiration`
          )
        }
      >
        <Avatar image={profileUrl} username={username} />
        <div className={styles.nameWrapper}>
          <div className={styles.userName}>
            {isArtist ? (
              <>
                <span>{username}</span>
                <IsArtistNew />
              </>
            ) : (
              <span>{username}</span>
            )}
          </div>
          {name && type === 'fullName' && (
            <div className={styles.artistName}>{`@${name}`}</div>
          )}
        </div>
      </div>
      <div className={styles.wallet}>
        {!wallet ? (
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            onClick={() => openModalPage('ADD_WALLET')}
          >
            <MobileWalletIcon />
            Connect Wallet
          </button>
        ) : (
          <>
            <div className={styles.network}>
              <Polygon />
              <h1>
                {wallet.slice(0, 6)}...{wallet.slice(wallet.length - 6)}
              </h1>
            </div>
            <CopyButton text={wallet} />
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
