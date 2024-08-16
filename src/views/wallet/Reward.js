import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import styles from './Wallet.module.scss';
import RewardTable from './components/tables/RewardTable';
import useOpen from '@/hooks/useOpen';
import usePolling from '@/hooks/usePolling';
import RewardBox from './components/reward-box/RewardBox';
import dynamic from 'next/dynamic';
import useCheckConnected from '@/hooks/useCheckConnected';

const RequestRewardWalletModal = dynamic(() =>
  import('../seeding/components/modals/RequestRewardWalletModal')
);

const GET_REWARD_AMT = gql`
  query getRewardAmt {
    getRewardAmt {
      unClaimedReward
      pendingReward
      claimableReward
    }
    getStakingRewardInfo {
      unClaimedReward
      claimableReward
    }
    getVotingRewardInfo {
      claimableReward
    }
  }
`;

const GET_PENDING_REWARD_AMT = gql`
  query getPendingRewardAmt {
    getPendingRewardAmt {
      rewardInfos {
        episodeNo
        requestAt
        rewardAmt
        unlockTimeAt
        rewardStatus
        rewardTarget
        episodeRewardRequestAmt
      }
    }
  }
`;

const Reward = () => {
  const handleCheckConnected = useCheckConnected();

  const {
    data: rewardData,
    startPolling: startPollingRewardAmt,
    stopPolling: stopPollingRewardAmt,
  } = useQuery(GET_REWARD_AMT, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getRewardAmt, getStakingRewardInfo, getVotingRewardInfo } =
    rewardData || {};

  const {
    data: pendingRewardData,
    startPolling: startPollingPendingRewardAtm,
    stopPolling: stopPollingPendingRewardAtm,
  } = useQuery(GET_PENDING_REWARD_AMT, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getPendingRewardAmt } = pendingRewardData || {};
  const { rewardInfos } = getPendingRewardAmt || {};

  const { handleStartPolling, isPolling } = usePolling({
    startPolling: (interval) => {
      startPollingPendingRewardAtm(interval);
      startPollingRewardAmt(interval);
    },
    stopPolling: () => {
      stopPollingPendingRewardAtm();
      stopPollingRewardAmt();
    },
    dependencies: [
      getRewardAmt,
      getStakingRewardInfo,
      getVotingRewardInfo,
      rewardInfos,
    ],
  });

  const handleRefetch = () => {
    handleStartPolling();
  };

  const [isImmediateClaim, setIsImmediateClaim] = useState(false);
  const [
    requestRewardModalOpen,
    handleOpenRequestRewardModal,
    handleCloseRequestRewardModal,
  ] = useOpen();

  const handleRequestSeedingReward = () => {
    handleCheckConnected(handleOpenRequestRewardModal);
  };

  return (
    <div>
      <RewardBox
        seedingReward={getRewardAmt}
        stakingReward={getStakingRewardInfo}
        votingReward={getVotingRewardInfo}
        isPolling={isPolling}
        setIsImmediateClaim={setIsImmediateClaim}
        onRequestSeedingReward={handleRequestSeedingReward}
        onRefetch={handleRefetch}
      />

      <div className={styles.tableTitle}>Pending Reward History</div>
      <RewardTable items={rewardInfos} />
      {requestRewardModalOpen && (
        <RequestRewardWalletModal
          open={requestRewardModalOpen}
          onClose={handleCloseRequestRewardModal}
          isImmediateClaim={isImmediateClaim}
          onRefetch={handleRefetch}
          claimAmt={
            isImmediateClaim
              ? getRewardAmt?.pendingReward
              : getRewardAmt?.claimableReward
          }
        />
      )}
    </div>
  );
};

export default Reward;
