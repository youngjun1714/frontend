import styles from './SplashScreen.module.scss';
import ArtisideLogo from '@/components/ui/Assets/ArtisideLogo';

const SplashScreen = (props) => (
  <section className={styles.section}>
    <ArtisideLogo />
  </section>
);

export default SplashScreen;
