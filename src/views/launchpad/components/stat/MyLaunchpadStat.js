import styles from './Stat.module.scss';
import Users from '@/components/ui/Icons/Users';
import numberFormat from '@/utils/numberFormat';
import Episode from '@/components/ui/Icons/Episode';
import Data from '@/components/ui/Icons/Data';
import useLaunchpad from '@/hooks/useLaunchpad';
import { useState } from 'react';
import { customToast } from '@/utils/customToast';
import { CircularProgress } from '@mui/material';
import useCheckConnected from '@/hooks/useCheckConnected';
import InfoTypography from '@/components/ui/Typography/InfoTypography';

const MyLaunchpadStat = ({
  data,
  isLiveRound,
  onRefetch,
  selectedRoundNo,
  roundCount,
}) => {
  const [loading, setLoading] = useState(false);

  const { prevUnstaking } = useLaunchpad();
  const handleCheckConnected = useCheckConnected();

  const handleUnstake = async () => {
    setLoading(true);
    try {
      await prevUnstaking({
        launchPadId: selectedRoundNo,
      });
      setLoading(false);
      customToast({
        msg: <>Unstaking has been successfully activated</>,
        autoClose: 2000,
      });
      onRefetch && onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
      customToast({
        msg: <>Unstaking Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleCheckAndUnstake = () => {
    handleCheckConnected(handleUnstake);
  };

  return (
    <>
      {!isLiveRound ? (
        <div
          className={`${styles.statDiv} ${styles.myVotingStat}`}
          style={{ marginBottom: 16 }}
        >
          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data />
              Staked Amount
            </div>
            <div className={styles.value}>
              {numberFormat(data?.stakingAmt, 0)}
              {data?.stakingAmt ? (
                <button
                  className={styles.submitBtn}
                  disabled={loading}
                  onClick={handleCheckAndUnstake}
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
                  )}
                  Unstake
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data />
              Staking Reward
            </div>
            <div className={styles.value}>
              <InfoTypography
                content={data?.rewardAmtByStaking}
                decimals={5}
                size="md"
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className={`${styles.statDiv} ${styles.myVotingStat}`}>
        <div className={styles.statCard}>
          <div className={styles.label}>
            <Episode color="var(--artiside-neutral2)" />
            The total number of participated voting rounds
          </div>
          <div className={styles.value}>
            {numberFormat(data?.participatedCnt, 0)}/
            {numberFormat(roundCount, 0)}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>
            <Users />
            Voted Artists
          </div>
          <div className={styles.value}>
            {numberFormat(data?.votedArtistsCnt, 0)}
          </div>
        </div>
      </div>
    </>
  );
};
export default MyLaunchpadStat;
