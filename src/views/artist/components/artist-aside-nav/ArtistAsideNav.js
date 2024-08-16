import styles from '@/views/artist/components/artist-aside-nav/ArtistAsideNav.module.scss';
import { useRecoilValue } from 'recoil';

import stores from '@/store';
import { Badge } from '@mui/material';
import NotificationBadge from '../artist-notifications/NotificationBadge';

function ArtistAsideNav(props) {
  const { menu, onClick, isMe, isPartner, nickname } = props;

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const handleMoveToMarket = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_THE_FLUX_URL}/user/${nickname}?tab=OWNED`
    );
  };

  return (
    <aside className={styles.aside}>
      <ul>
        {isPartner && (
          <>
            <li
              onClick={() => onClick('short-bio')}
              className={menu === 'short-bio' ? styles.active : ''}
            >
              Short Bio
            </li>
            <li
              onClick={() => onClick('philosophy')}
              className={menu === 'philosophy' ? styles.active : ''}
            >
              Philosophy
            </li>
            <li
              onClick={() => onClick('artworks')}
              className={menu === 'artworks' ? styles.active : ''}
            >
              Artworks
            </li>
          </>
        )}
        <li
          onClick={() => onClick('inspiration')}
          className={menu === 'inspiration' ? styles.active : ''}
        >
          Inspiration
        </li>
        <li
          onClick={() => onClick('favorites')}
          className={menu === 'favorites' ? styles.active : ''}
        >
          Favorites
        </li>
        {isMe && (
          <li
            onClick={handleMoveToMarket}
            className={menu === 'owned' ? styles.active : ''}
          >
            Owned
          </li>
        )}
        {/* {isMe && (
          <li
            onClick={() => onClick('notifications')}
            className={menu === 'notifications' ? styles.active : ''}
          >
            {me.hasNotification ? (
              <NotificationBadge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                Notifications
              </NotificationBadge>
            ) : (
              <span>Notifications</span>
            )}
          </li>
        )} */}
      </ul>
    </aside>
  );
}

export default ArtistAsideNav;
