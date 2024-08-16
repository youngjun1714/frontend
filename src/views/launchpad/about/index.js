import styles from './about.module.scss';

import BackButton from './components/BackButton/BackButton';
import AboutLaunchpadProgram from './components/AboutLaunchpadProgram/AboutLaunchpadProgram';
import AboutLaunchpad1 from './components/AboutLaunchpad1';
import AboutLaunchpad2 from './components/AboutLaunchpad2';
import AboutLaunchpad3 from './components/AboutLaunchpad3';
import AboutLaunchpad4 from './components/AboutLaunchpad4';
import AboutLaunchpad5 from './components/AboutLaunchpad5';
import AboutLaunchpad6 from './components/AboutLaunchpad6';

const About = () => (
  <section className={styles.section}>
    <BackButton />
    <AboutLaunchpadProgram />
    <AboutLaunchpad1 />
    <AboutLaunchpad2 />
    <AboutLaunchpad3 />
    <AboutLaunchpad4 />
    <AboutLaunchpad5 />
    <AboutLaunchpad6 />
  </section>
);

export default About;
