import BoostSeeding from '@/components/ui/Icons/BoostSeeding';
import styles from './BoostBanner.module.scss';
import BoostStake from '@/components/ui/Icons/BoostStake';
import BoostVP from '@/components/ui/Icons/BoostVP';
import BoostVote from '@/components/ui/Icons/BoostVote';
import BoostReward from '@/components/ui/Icons/BoostReward';
import Flag from '@/components/ui/Icons/Flag';
import { useRouter } from 'next/router';
import BoostUnstake from '@/components/ui/Icons/BoostUnstake';

const BoostBanner = () => {
  const router = useRouter();
  const handleGoVote = () => {
    router.push('/launchpad?tab=voting');
  };

  return (
    <div className={styles.boostBanner}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          Boost Your
          <br />
          <span>Rewards</span>
        </div>
        <div className={styles.subTitle}>Vote after staking!</div>
      </div>
      <div className={styles.stepWrapper}>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 01</div>
          <BoostSeeding />
          <div className={styles.title}>Seeding</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 02</div>
          <BoostStake />
          <div className={styles.title}>Staking</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 03</div>
          <BoostVP />
          <div className={styles.title}>Receive VP</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 04</div>
          <BoostVote />
          <div className={styles.title}>Go & Vote</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 05</div>
          <BoostUnstake />
          <div className={styles.title}>Unstake</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <div className={styles.step}>
          <div className={styles.stepNo}>Step 06</div>
          <BoostReward />
          <div className={styles.title}>Get Rewards</div>
        </div>
        <div className={styles.arrow}>&gt;</div>
        <button className={styles.voteBtn} onClick={handleGoVote}>
          <Flag /> Go to the
          <br />
          Voting page
        </button>
      </div>
    </div>
  );
};

export default BoostBanner;
