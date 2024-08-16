import styles from './about.module.scss';

import BackButton from './components/BackButton/BackButton';
import AboutSeedingProgram from './components/AboutSeedingProgram/AboutSeedingProgram';
import AboutSeedingSeeder from './components/AboutSeedingSeeder';
import AboutSeedingEpisode from './components/AboutSeedingEpisode';
import AboutSeedingReward from './components/AboutSeedingReward';
import AboutSeedingAmount from './components/AboutSeedingAmount';
import AboutSeedingPending from './components/AboutSeedingPending';
import AboutSeedingUnseeding from './components/AboutSeedingUnseeding';

const About = () => (
  <section className={styles.section}>
    <BackButton />
    <AboutSeedingProgram />
    <AboutSeedingSeeder />
    <AboutSeedingEpisode />
    <AboutSeedingReward />
    <AboutSeedingAmount />
    <AboutSeedingPending />
    <AboutSeedingUnseeding />
  </section>
);

export default About;
