import styles from './StakingStatus.module.scss';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import { Tooltip } from '@mui/material';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';
import { useRouter } from 'next/router';

const StakingStatus = ({ stakingStatus, onCheckConnected }) => {
  const router = useRouter();
  const { curStakingAmt, curVpAmt, rewardAmtByStaking, vpPerHour } =
    stakingStatus || {};

  const handleVisitClaimPage = () => {
    onCheckConnected(() => router.push('/wallet?tab=reward'));
  };

  return (
    <div className={styles.box}>
      <div>
        <div className={styles.title}>My Staking Status</div>
        <div className={styles.statDiv}>
          <div className={styles.statTitle}>
            Staked{' '}
            <Tooltip
              arrow
              title="The total amount of $ADF that the user has staked."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div className={styles.statValue}>
            <InfoTypography
              content={curStakingAmt}
              endDecorator="ADF"
              size="md"
              decimals={4}
            />
          </div>
        </div>
        <div className={styles.statDiv}>
          <div className={styles.statTitle}>
            Current VP
            <Tooltip
              arrow
              title="The total amount of VP that the user has received so far."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div className={styles.statValue}>
            <InfoTypography
              content={curVpAmt}
              endDecorator="VP"
              size="md"
              decimals={0}
            />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.statDiv}>
          <div className={styles.statTitle}>
            VP Distribution / HR
            <Tooltip
              arrow
              title="The total amount of VP that the user is receiving per hour."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div className={styles.statValue}>
            <InfoTypography
              content={vpPerHour}
              endDecorator="VP"
              size="md"
              decimals={0}
            />
          </div>
        </div>
        <div className={styles.statDiv}>
          <div className={styles.statTitle}>
            <span>
              Staking Reward
              <br />
              Distribution / Day
            </span>
            <Tooltip
              arrow
              title="The total amount of rewards that the user will receive through staking per day."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div className={styles.statValue}>
            <InfoTypography
              content={rewardAmtByStaking}
              endDecorator="ADF"
              size="md"
              decimals={4}
            />
          </div>
        </div>
      </div>
      <button className={styles.requestButton} onClick={handleVisitClaimPage}>
        Visit and look around the Claim Page
      </button>
    </div>
  );
};
export default StakingStatus;
