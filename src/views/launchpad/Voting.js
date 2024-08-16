import { gql, useLazyQuery, useQuery } from '@apollo/client';
import ComingSoonVoting from './components/coming-soon/ComingSoonVoting';
import PastVoting from './components/past-voting/PastVoting';
import VotingStat from './components/stat/VotingStat';
import VotingBoard from './components/voting-board';
import { useEffect } from 'react';
import moment from 'moment';
import usePolling from '@/hooks/usePolling';

const GET_VOTING_INFO = gql`
  query getVotingInfo {
    getVotingInfo {
      spentVp
      totalVp
    }
  }
`;

const GET_LAUNCHPAD_WINNERS = gql`
  query getLaunchpadWinnerList {
    getLaunchpadWinnerList {
      launchpadPartnerInfos {
        launchpadRoundInfo {
          roundNo
          endTimeAt
        }
        partnerId
        nickname
        artistName
        profileImgUrl
        accumVp
        rewardAmtByVp

        candidatePartnerInfo {
          intro
          promotionThumbnailUrl
        }
      }
    }
  }
`;

const Voting = ({
  checkWhiteList,
  liveRoundInfo,
  nextRoundInfo,
  launchpadPartnerInfos,
  onRefetchLiveRoundInfo,
}) => {
  const [
    getMyVotingInfo,
    { data: myVotingInfoData, startPolling, stopPolling },
  ] = useLazyQuery(GET_VOTING_INFO, {
    fetchPolicy: 'network-only',
    context: { clientName: 'launchpad' },
  });

  const { getVotingInfo } = myVotingInfoData || {};
  const { spentVp } = getVotingInfo || {};

  const { data: launchpadWinnersData } = useQuery(GET_LAUNCHPAD_WINNERS, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const { getLaunchpadWinnerList } = launchpadWinnersData || {};
  const { launchpadPartnerInfos: launchpadWinnerInfos } =
    getLaunchpadWinnerList || {};

  useEffect(() => {
    if (checkWhiteList) getMyVotingInfo();
  }, [checkWhiteList]);

  const { handleStartPolling } = usePolling({
    startPolling,
    stopPolling,
    dependencies: [spentVp],
  });

  const handleRefetch = () => {
    handleStartPolling();
  };

  return (
    <div>
      {liveRoundInfo &&
      liveRoundInfo?.isLiveRound &&
      moment().isAfter(liveRoundInfo?.votingStartTimeAt) &&
      moment().isBefore(liveRoundInfo?.endTimeAt) ? (
        <>
          <VotingStat
            liveRoundInfo={liveRoundInfo}
            checkWhiteList={checkWhiteList}
            myVotingInfo={getVotingInfo}
            winners={launchpadWinnerInfos}
            onRefetchLiveRoundInfo={onRefetchLiveRoundInfo}
          />
          <VotingBoard
            onRefetch={handleRefetch}
            myVotingInfo={getVotingInfo}
            roundNo={liveRoundInfo?.roundNo}
            launchpadPartnerInfos={launchpadPartnerInfos}
          />
          {launchpadWinnerInfos?.length ? (
            <PastVoting winners={launchpadWinnerInfos} />
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {launchpadWinnerInfos?.length ? (
            <PastVoting winners={launchpadWinnerInfos} />
          ) : (
            <></>
          )}
          <ComingSoonVoting
            nextStartTimeAt={
              nextRoundInfo?.votingStartTimeAt ||
              liveRoundInfo?.votingStartTimeAt
            }
            onRefetchLiveRoundInfo={onRefetchLiveRoundInfo}
            launchpadPartnerInfos={launchpadPartnerInfos}
          />
        </>
      )}
    </div>
  );
};

export default Voting;
