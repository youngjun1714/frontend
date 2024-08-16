import React, { useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Stack } from '@mui/material';

import RoundList from './components/round-list/RoundList';
import MyLaunchpadStat from './components/stat/MyLaunchpadStat';
import MyLaunchpadTable from './components/tables/MyLaunchpadTable';
import usePolling from '@/hooks/usePolling';
import useInterval from '@/hooks/useInterval';
import moment from 'moment';

const GET_ROUND_LIST = gql`
  query getRoundList($currentPage: Int, $take: Int) {
    getRoundList(currentPage: $currentPage, take: $take) {
      pageInfo {
        take
        currentPage
        totalCount
      }
      roundInfos {
        roundNo
        isLiveRound
      }
    }
  }
`;

const GET_MY_VOTING_INFO = gql`
  query getMyVotingInfo($roundNo: Long) {
    getMyVotingInfo(roundNo: $roundNo) {
      participatedCnt
      votedArtistsCnt
      stakingAmt
      rewardAmtByStaking
    }
  }
`;

const GET_MY_LAUNCHPAD_PARTNERS = gql`
  query getMyLaunchpadPartnerList($roundNo: Long!) {
    getMyLaunchpadPartnerList(roundNo: $roundNo) {
      votingPartnerInfos {
        spentVp
        isPartner
        artistName
        userName
        profileImgUrl
        promotionThumbnailUrl
        result
        rewardAmtByVp
        launchpadPartnerInfo {
          artistWallet
          userId
        }
      }
    }
  }
`;

const PAGE_SIZE = 10;

const MyLaunchpad = () => {
  const [selectedRoundNo, setSelectedRoundNo] = useState(null);

  const {
    data: roundData,
    loading: loadingRound,
    fetchMore: fetchMoreRound,
  } = useQuery(GET_ROUND_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: {
      take: PAGE_SIZE,
    },
    context: { clientName: 'launchpad' },
  });

  const { getRoundList } = roundData || {};
  const { roundInfos, pageInfo: roundPageInfo } = getRoundList || {};

  useEffect(() => {
    if (roundInfos?.length) setSelectedRoundNo(roundInfos[0].roundNo);
  }, [roundInfos]);

  const handleSelectRound = (roundNo) => {
    setSelectedRoundNo(roundNo);
  };

  const selectedRound = useMemo(
    () => roundInfos?.find((item) => item.roundNo === selectedRoundNo),
    [selectedRoundNo, roundInfos]
  );

  const DISABLE_VOTING_MIN = 5;
  const [disableVoting, setDisableVoting] = useState(false);

  useInterval(
    () => {
      if (
        selectedRound &&
        selectedRound?.endTimeAt &&
        moment(selectedRound?.endTimeAt)
          .subtract(DISABLE_VOTING_MIN, 'minutes')
          .isBefore(moment()) &&
        !disableVoting &&
        selectedRound?.isLiveEpisode
      ) {
        setDisableVoting(true);
      }
    },
    disableVoting ? null : 1000
  );

  const {
    data: myVotingData,
    startPolling: startPollingMyVoting,
    stopPolling: stopPollingMyVoting,
  } = useQuery(GET_MY_VOTING_INFO, {
    fetchPolicy: 'cache-and-network',
    variables: {
      roundNo: selectedRoundNo,
    },
    context: { clientName: 'launchpad' },
  });

  const { getMyVotingInfo } = myVotingData || {};

  const {
    data: myLaunchpadPartnersData,
    loading,
    startPolling: startPollingMyLaunchpadPartner,
    stopPolling: stopPollingMyLaunchpadPartner,
  } = useQuery(GET_MY_LAUNCHPAD_PARTNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      roundNo: selectedRoundNo,
    },
    context: { clientName: 'launchpad' },
  });

  const { getMyLaunchpadPartnerList } = myLaunchpadPartnersData || {};
  const { votingPartnerInfos } = getMyLaunchpadPartnerList || {};

  const { handleStartPolling } = usePolling({
    startPolling: (interval) => {
      startPollingMyLaunchpadPartner(interval);
      startPollingMyVoting(interval);
    },
    stopPolling: () => {
      stopPollingMyLaunchpadPartner();
      stopPollingMyVoting();
    },
    dependencies: [votingPartnerInfos, getMyVotingInfo],
  });

  const handleRefetch = () => {
    handleStartPolling();
  };

  return (
    <>
      <Stack direction="row" gap="24px">
        <RoundList
          items={roundInfos}
          onSelectRound={handleSelectRound}
          selectedRoundNo={selectedRoundNo}
          pageInfo={roundPageInfo}
          loading={loadingRound}
          fetchMore={fetchMoreRound}
        />
        <Stack sx={{ width: 'calc(100% - 370px - 24px)' }}>
          <MyLaunchpadStat
            data={getMyVotingInfo}
            isLiveRound={selectedRound?.isLiveRound}
            onRefetch={handleRefetch}
            selectedRoundNo={selectedRoundNo}
            roundCount={roundPageInfo?.totalCount}
          />
          <MyLaunchpadTable
            isLiveRound={selectedRound?.isLiveRound}
            endTimeAt={selectedRound?.endTimeAt}
            items={votingPartnerInfos}
            onRefetch={handleRefetch}
            loading={loading}
            disableVoting={disableVoting}
            selectedRoundNo={selectedRoundNo}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default MyLaunchpad;
