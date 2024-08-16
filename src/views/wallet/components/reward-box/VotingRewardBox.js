import InfoTypography from '@/components/ui/Typography/InfoTypography';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';
import styles from './RewardBox.module.scss';
import WalletBadge from '../wallet-badge/WalletBadge';
import { CircularProgress, Tooltip } from '@mui/material';
import useLaunchpad from '@/hooks/useLaunchpad';
import { useState } from 'react';
import { customToast } from '@/utils/customToast';
import useCheckConnected from '@/hooks/useCheckConnected';
import ExclamaOutline from '@/components/ui/Icons/ExclamaOutline';

const VotingRewardBox = ({ reward, isPolling, onRefetch }) => {
  const { claimableReward } = reward || {};

  const { claimVotingReward } = useLaunchpad();

  const [loading, setLoading] = useState(false);

  const claimReward = async () => {
    setLoading(true);
    try {
      await claimVotingReward();
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
      <div className={styles.infoDiv}>
        <WalletBadge type="purple" label="Voting Reward" />
        <div className={styles.infoWrap}>
          <ExclamaOutline />
          <br />
          The Voting Reward will aggregate the
          <br />
          rewards after each Launchpad round.
        </div>
      </div>
      <div className={styles.claimableDiv}>
        <div className={styles.rewardRow}>
          <div className={styles.label}>
            Claimable Reward
            <Tooltip
              arrow
              title="This is the total amount that can be received in the wallet once the voting has ended."
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

export default VotingRewardBox;
