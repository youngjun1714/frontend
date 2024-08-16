import { useState } from 'react';
import styles from './ArtistInfoCardFollows.module.scss';

import ArtistInfoFollowsRow from './ArtistInfoCardFollowsRow';

import { Modal } from '@mui/material';
import ArtistInfoCardFollower from './ArtistInfoCardFollower';
import ArtistInfoCardFollowing from './ArtistInfoCardFollowing';
import Close from '@/components/ui/Icons/Close';

function ArtistInfoCardFollows(props) {
  const { onClose, open, userId } = props;
  const [menu, setMenu] = useState(open);

  return (
    <Modal
      open={!!open}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={onClose} aria-label="close">
            <Close />
          </button>
        </div>
        <div className={styles.menu}>
          <button
            className={menu === 'follower-list' ? styles.active : ''}
            onClick={() => setMenu('follower-list')}
          >
            Followers
          </button>
          <button
            className={menu === 'following-list' ? styles.active : ''}
            onClick={() => setMenu('following-list')}
          >
            Following
          </button>
          <div
            className={styles.bar}
            style={{
              transform:
                menu === 'follower-list'
                  ? 'translateX(-50%)'
                  : 'translateX(50%)',
            }}
          />
        </div>

        <section className={styles.table}>
          {menu === 'follower-list' && (
            <ArtistInfoCardFollower userId={userId} onClose={onClose} />
          )}
          {menu === 'following-list' && (
            <ArtistInfoCardFollowing userId={userId} onClose={onClose} />
          )}
        </section>
      </div>
    </Modal>
  );
}

export default ArtistInfoCardFollows;
