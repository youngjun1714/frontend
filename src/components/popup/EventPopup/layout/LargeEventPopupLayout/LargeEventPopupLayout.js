import styles from './LargeEventPopupLayout.module.scss';

import ArtisideLogo from '@/components/ui/Icons/ArtisideLogo';
import PopupImage from '@/components/ui/Icons/PopupImage';

const LargeEventPopupLayout = ({ title, description, onClick }) => (
  <div className={styles.section}>
    <div className={styles.layout}>
      <div className={styles.left}>
        <ArtisideLogo />
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div>
        <PopupImage />
      </div>
    </div>
    <div className={styles.buttonWrapper}>
      <button onClick={onClick}>Confirm</button>
    </div>
  </div>
);

export default LargeEventPopupLayout;
