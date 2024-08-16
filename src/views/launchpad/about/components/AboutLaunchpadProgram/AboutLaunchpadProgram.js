import Image from 'next/image';
import styles from './AboutLaunchpadProgram.module.scss';
import Link from 'next/link';

const AboutSeedingProgram = () => (
  <div className={styles.wrapper}>
    <div className={styles.imgWrapper}>
      <Image
        className={styles.web}
        width={900}
        height={450}
        src={'/assets/images/launchpad/launchpad-title.svg'}
        alt={'About Launchpad program'}
      />

      <Image
        className={styles.mobile}
        fill
        src={'/assets/images/launchpad/mobile-launchpad-title.svg'}
        alt={'About Launchpad program'}
      />

      <Image
        className={`${styles.mobile} ${styles.star}`}
        width={17}
        height={17}
        src={'/assets/images/about-seeding/mobile/about-seeding-star.svg'}
        alt={'About Seeding program'}
      />
    </div>
    <div className={styles.divider} />
    <p className={styles.text}>
      <b>
        Selecting artists to participate in the Seeding pool is extremely
        important.
      </b>
      <br />
      <br />
      Therefore, Art de Finance has launched a decentralized service where the
      selection of participants for this important task is determined by the
      votes of users contributing to ecosystem development.
    </p>
    <div className={styles.btnWrap}>
      <Link
        className={styles.goBtn}
        href="https://adf-team01.notion.site/Launchpad-2628c6f5aa68426297070c4e2f21f1bc"
        target="_blank"
      >
        <div>
          <b>Go to</b>
          <span>Launchpad Glossary</span>
        </div>
      </Link>
      <Link
        className={styles.goBtn}
        href="https://youtu.be/zIVDSQnWERI?si=3dq0gmf-Sy30GdMI"
        target="_blank"
      >
        <div>
          <b>Go to</b>
          <span>User Guide Contents</span>
        </div>
      </Link>
    </div>
  </div>
);

export default AboutSeedingProgram;
