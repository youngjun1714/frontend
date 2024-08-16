import styles from './RewardBox.module.scss';
import SeedingRewardBox from './SeedingRewardBox';
import StakingRewardBox from './StakingRewardBox';
import VotingRewardBox from './VotingRewardBox';

const RewardBox = ({
  seedingReward,
  stakingReward,
  votingReward,
  isPolling,
  setIsImmediateClaim,
  onRequestSeedingReward,
  onRequestStakingReward,
  loadingRequestStakingReward,
  onRefetch,
}) => (
  <div className={styles.rewardBoxWrap}>
    <SeedingRewardBox
      reward={seedingReward}
      isPolling={isPolling}
      setIsImmediateClaim={setIsImmediateClaim}
      onRequestSeedingReward={onRequestSeedingReward}
    />
    <div className={styles.stakinVotingRewardWrap}>
      <StakingRewardBox
        reward={stakingReward}
        isPolling={isPolling}
        onRequestReward={onRequestStakingReward}
        loadingRequestReward={loadingRequestStakingReward}
        onRefetch={onRefetch}
      />
      <VotingRewardBox
        reward={votingReward}
        isPolling={isPolling}
        onRequestReward={onRequestStakingReward}
        loadingRequestReward={loadingRequestStakingReward}
        onRefetch={onRefetch}
      />
    </div>
  </div>
);

export default RewardBox;
