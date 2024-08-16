import styles from './AboutRedLabel.module.scss';
import RedLabel from '@/components/ui/Icons/RedLabel';

export default function AboutRedLabel() {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <h1>About Red Label?</h1>
      </div>
      <div className={styles.banner}>
        <RedLabel />
      </div>
      <div className={styles.body}>
        <p>
          Born in 1979, Jisan Ahn studied plastic art at
          <br />
          Korea National University of Arts and has a
          <br />
          degree with paintings at Frank Mohr
          <br />
          International in the Netherlands. He debuted
          <br />
          in the Netherlands first while he was staying in
        </p>
      </div>
    </div>
  );
}
