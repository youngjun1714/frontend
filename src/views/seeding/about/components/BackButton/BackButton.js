import styles from './BackButton.module.scss';

import AboutSeedingBackArrow from '@/components/ui/Icons/AboutSeedingBackArrow';

const BackButton = () => (
  <button
    aria-label="back button"
    className={styles.button}
    onClick={() => window.close()}
  >
    <AboutSeedingBackArrow />
  </button>
);
export default BackButton;
