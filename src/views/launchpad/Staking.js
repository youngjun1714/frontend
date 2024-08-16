import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';

import BoostBanner from './components/boost-banner/BoostBanner';
import StakingForm from './components/staking-form';
import StakingStat from './components/stat/StakingStat';
import usePrice from '@/hooks/usePrice';
import usePolling from '@/hooks/usePolling';
import ComingSoonStaking from './components/coming-soon/ComingSoonStaking';
import useInterval from '@/hooks/useInterval';

const GET_STAKING_INFO = gql`
  query getStakingInfo {
    getStakingInfo {
      totalStakedAmt
      totalDistReward
      price_adf
      price_usdt
      endTimeAt
    }
  }
`;

const GET_STAKING_STATUS_INFO = gql`
  query getStakingStatus {
    getStakingStatus {
      curStakingAmt
      curVpAmt
      rewardAmtByStaking
      vpPerHour
    }
  }
`;

const POLL_INTERVAL = 60_000;
const DISABLE_TIME = 1;

const Staking = ({
  checkWhiteList,
  liveRoundInfo,
  nextRoundInfo,
  launchpadPartnerInfos,
  onRefetchLiveRoundInfo,
}) => {
  const {
    data: stakingInfoData,
    startPolling: startPollingStakingInfo,
    stopPolling: stopPollingStakingInfo,
  } = useQuery(GET_STAKING_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
    pollInterval: POLL_INTERVAL,
  });

  const { getStakingInfo } = stakingInfoData || {};
  const { totalStakedAmt, endTimeAt } = getStakingInfo || {};

  const {
    data: stakingStatusData,
    startPolling: startPollingStakingStatus,
    stopPolling: stopPollingStakingStatus,
  } = useQuery(GET_STAKING_STATUS_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
    pollInterval: POLL_INTERVAL,
  });

  const { getStakingStatus } = stakingStatusData || {};

  const adfToUsd = usePrice('adf');

  const { handleStartPolling } = usePolling({
    startPolling: (interval) => {
      startPollingStakingInfo(interval);
      startPollingStakingStatus(interval);
    },
    stopPolling: () => {
      stopPollingStakingInfo();
      stopPollingStakingStatus();
    },
    dependencies: [totalStakedAmt],
  });

  const [disableStaking, setDisableStaking] = useState(false);

  useInterval(
    () => {
      if (
        endTimeAt &&
        moment(endTimeAt).subtract(DISABLE_TIME, 'hours').isBefore(moment()) &&
        !disableStaking
      ) {
        setDisableStaking(true);
      }
    },
    disableStaking ? null : 1000
  );

  return (
    <div>
      {liveRoundInfo &&
      liveRoundInfo?.isLiveRound &&
      moment().isBefore(liveRoundInfo?.endTimeAt) &&
      moment().isAfter(liveRoundInfo?.startTimeAt) ? (
        <>
          <StakingStat stakingInfo={getStakingInfo} adfToUsd={adfToUsd} />
          <StakingForm
            checkWhiteList={checkWhiteList}
            stakingStatus={getStakingStatus}
            adfToUsd={adfToUsd}
            onRefetch={handleStartPolling}
            disableStaking={disableStaking}
          />
          <BoostBanner />
        </>
      ) : (
        <>
          <ComingSoonStaking
            nextStartTimeAt={nextRoundInfo?.nextStartTimeAt}
            launchpadPartnerInfos={launchpadPartnerInfos}
            onRefetchLiveRoundInfo={onRefetchLiveRoundInfo}
          />
          <BoostBanner />
        </>
      )}
    </div>
  );
};

export default Staking;
