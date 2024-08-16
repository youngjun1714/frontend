import moment from 'moment';
import styles from './ArtworkCardHidden.module.scss';

import ClosedEyes from '@/components/ui/Icons/ClosedEye';

const ArtworkCardHidden = ({ hiddenAt, borderRadius }) => (
  <div
    className={styles.cover}
    style={{ borderRadius: borderRadius ? '10px 10px 0 0' : 0 }}
  >
    <div>
      <ClosedEyes />
    </div>
    <div className={styles.data}>
      <h1>This artwork is hidden</h1>
      <h2>Hidden on : {moment(hiddenAt).local().format('MM/DD/YYYY hh:mm')}</h2>
    </div>
  </div>
);

export default ArtworkCardHidden;
