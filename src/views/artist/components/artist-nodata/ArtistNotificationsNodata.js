import Notifications from '@/components/ui/Icons/Notifications';
import styles from './ArtistNodata.module.scss';

const ArtistNotificationsNodata = () => (
  <section className={styles.section}>
    <div>
      <span className={styles.icon}>
        <Notifications />
      </span>
      <h1>No notifications yet</h1>
      <h2>We will remind you when you get notifications!</h2>
    </div>
  </section>
);

export default ArtistNotificationsNodata;
