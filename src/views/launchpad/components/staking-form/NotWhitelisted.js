import ExclamaCircle from '@/components/ui/Icons/ExclamaCircle';
import styles from './index.module.scss';
import Link from 'next/link';

const NotWhitelisted = () => (
  <div className={styles.notWhitelisted}>
    <div>
      <ExclamaCircle />
      <div className={styles.title}>You are not Whitelisted</div>
      <div className={styles.desc}>
        You are not eligible to stake your $ADF.
        <br />
        Please participate in Seeding to stake and receive rewards.
      </div>
    </div>
    <Link href="/seeding">Go to Seeding</Link>
  </div>
);

export default NotWhitelisted;
