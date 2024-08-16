import Image from 'next/image';
import styles from './AboutSeedingProgram.module.scss';

const AboutSeedingProgram = () => (
  <div className={styles.wrapper}>
    <div className={styles.imgWrapper}>
      <Image
        className={styles.web}
        width={900}
        height={450}
        src={'/assets/images/about-seeding/about-seeding-title.svg'}
        alt={'About Seeding program'}
      />
      <Image
        className={styles.mobile}
        fill
        src={'/assets/images/about-seeding/mobile/about-seeding-title.svg'}
        alt={'About Seeding program'}
      />
      <Image
        className={`${styles.mobile} ${styles.star}`}
        width={17}
        height={17}
        src={'/assets/images/about-seeding/mobile/about-seeding-star.svg'}
        alt={'About Seeding program'}
      />
    </div>
    <p className={styles.text}>
      The Seeding Program is a program designed for artists and stakers
      (Seeders) to share and obtain $ADF staking profits.
    </p>
  </div>
);

export default AboutSeedingProgram;
