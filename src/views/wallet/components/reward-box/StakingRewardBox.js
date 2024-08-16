import InfoTypography from '@/components/ui/Typography/InfoTypography';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';
import styles from './RewardBox.module.scss';
import WalletBadge from '../wallet-badge/WalletBadge';
import { CircularProgress, Tooltip } from '@mui/material';
import useLaunchpad from '@/hooks/useLaunchpad';
import { useState } from 'react';
import { customToast } from '@/utils/customToast';
import useCheckConnected from '@/hooks/useCheckConnected';

const StakingRewardBox = ({ reward, isPolling, onRefetch }) => {
  const { unClaimedReward, claimableReward } = reward || {};

  const { claimStakingReward } = useLaunchpad();

  const [loading, setLoading] = useState(false);

  const claimReward = async () => {
    setLoading(true);
    try {
      await claimStakingReward();
      setLoading(false);
      customToast({
        msg: <>Reward has been successfully claimed</>,
        autoClose: 2000,
      });
      onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
      customToast({
        msg: <>Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleCheckConnected = useCheckConnected();

  const handleRequestReward = () => {
    handleCheckConnected(claimReward);
  };

  return (
    <div className={styles.halfRewardBox}>
      <div className={styles.unclaimedDiv}>
        <WalletBadge type="purple" label="Staking Reward" />
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
            Claimable Reward
            <Tooltip
              arrow
              title="This is the total amount that can be received in the wallet once the voting has ended and the users unstake their $ADF."
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
              onClick={handleRequestReward}
              disabled={!claimableReward || isPolling || loading}
            >
              {loading && (
                <CircularProgress
                  thickness={5}
                  sx={{
                    width: '24px !important',
                    height: '24px !important',
                    color: 'var(--artiside-neutral2) !important',
                    marginRight: 2,
                  }}
                />
              )}{' '}
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingRewardBox;
