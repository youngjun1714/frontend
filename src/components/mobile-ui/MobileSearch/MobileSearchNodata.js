import MobileNodataIcon from '../MobileIcons/MobileNodataIcon';
import styles from './MobileSearchNodata.module.scss';
const MobileSearchNodata = () => (
  <article className={styles.article}>
    <MobileNodataIcon />
    <p>No results found</p>
  </article>
);

export default MobileSearchNodata;
