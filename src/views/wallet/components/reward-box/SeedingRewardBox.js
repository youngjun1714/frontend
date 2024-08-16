import InfoTypography from '@/components/ui/Typography/InfoTypography';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';
import styles from './RewardBox.module.scss';
import WalletBadge from '../wallet-badge/WalletBadge';
import { Tooltip } from '@mui/material';

const SeedingRewardBox = ({
  reward,
  isPolling,
  setIsImmediateClaim,
  onRequestSeedingReward,
}) => {
  const { unClaimedReward, pendingReward, claimableReward } = reward || {};

  return (
    <div className={styles.rewardBox}>
      <div className={styles.unclaimedDiv}>
        <WalletBadge type="blue" label="Seeding Reward" />
        <div className={styles.priceDesc}>Unclaimed Reward</div>
        <div className={styles.price}>
          <InfoTypography
            content={unClaimedReward}
            endDecorator="ADF"
            size="lg"
            decimals={5}
          />
        </div>
      </div>
      <div className={styles.claimableDiv}>
        <div className={styles.rewardRow}>
          <div className={styles.label}>
            Pending Reward
            <Tooltip
              arrow
              title="The amount that has not exceeded +12 weeks from the day the reward was requested. Only 10% of the amount will be paid to your wallet if you choose to receive it immediately."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div>
            <div className={styles.price}>
              <InfoTypography
                content={pendingReward}
                size="lg"
                endDecorator="ADF"
                decimals={5}
              />
            </div>
            <button
              onClick={() => {
                setIsImmediateClaim(true);
                onRequestSeedingReward();
              }}
              disabled={!pendingReward || isPolling}
            >
              Claim Immediately
            </button>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.rewardRow}>
          <div className={styles.label}>
            Claimable Reward
            <Tooltip
              arrow
              title="This is the total amount that can be received in the wallet within +12 weeks from the day the reward was requested."
            >
              <span>
                <QuestionCircle color="var(--artiside-neutral2)" />
              </span>
            </Tooltip>
          </div>
          <div>
            <div className={styles.price}>
              <InfoTypography
                content={claimableReward}
                size="lg"
                endDecorator="ADF"
                decimals={5}
              />
            </div>
            <button
              onClick={() => {
                setIsImmediateClaim(false);
                onRequestSeedingReward();
              }}
              disabled={!claimableReward || isPolling}
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedingRewardBox;
