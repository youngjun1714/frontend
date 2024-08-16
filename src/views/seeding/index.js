import Head from 'next/head';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';

import SeedingNavMenu from './components/seeding-nav-menu/SeedingNavMenu';
import Seeding from './Seeding';
import MySeed from './MySeed';
import History from './History';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import { useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';
import useOpen from '@/hooks/useOpen';
import RequestRewardBanner from './components/request-reward-banner/RequestRewardBanner';
import usePolling from '@/hooks/usePolling';
import SeedingBanner from './components/seeding-banner/SeedingBanner';
import dynamic from 'next/dynamic';
import useCheckConnected from '@/hooks/useCheckConnected';

const RequestRewardModal = dynamic(() =>
  import('./components/modals/RequestRewardModal')
);

const GET_EPISODE_LIST = gql`
  query getEpisodeList($currentPage: Int, $take: Int) {
    getEpisodeList(currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedEpisodeInfos {
        episodeNo
        startTimeAt
        endTimeAt
        isLiveEpisode
        rewardRequestType
        requestPeriod
      }
    }
  }
`;

const TAKE = 100;

const Page = ({ isMobile }) => {
  const router = useRouter();
  const { query } = router;
  const { tab = 'seeding' } = query;

  const { account } = useConnectModalContext();
  const { isLoggedIn } = account;

  const {
    data,
    fetchMore,
    refetch: refetchEpisodeList,
    startPolling: startPollingEpisodeList,
    stopPolling: stopPollingEpisodeList,
    loading,
  } = useQuery(GET_EPISODE_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: {
      take: TAKE,
    },
    context: { clientName: 'seed' },
  });

  const { getEpisodeList } = data || {};
  const { seedEpisodeInfos, pageInfo } = getEpisodeList || {};

  const navItems = isLoggedIn
    ? [
        {
          label: 'Seeding',
          value: 'seeding',
        },
        {
          label: 'My Seed',
          value: 'mySeed',
        },
        {
          label: 'History',
          value: 'history',
        },
      ]
    : [
        {
          label: 'Seeding',
          value: 'seeding',
        },
      ];

  useEffect(() => {
    if (!isLoggedIn && tab !== 'seeding') router.push('/seeding?tab=seeding');
  }, []);

  useEffect(() => {
    if (isMobile) router.push('/');
  }, [isMobile]);

  const [episodeNoToRefetch, setEpisodeNoToRefetch] = useState(null);

  useEffect(() => {
    refetchEpisodeList();
    setEpisodeNoToRefetch(null);
  }, [tab]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckConnected = useCheckConnected();

  const needRequestReward = useMemo(
    () =>
      seedEpisodeInfos
        ?.filter(
          (item, idx) =>
            item.rewardRequestType === 'NONE' &&
            !item.isLiveEpisode &&
            moment().isBefore(item.requestPeriod) &&
            idx !== 0
        )
        ?.sort((a, b) => a.episodeNo - b.episodeNo),
    [seedEpisodeInfos]
  );

  const [
    requestRewardModalOpen,
    handleOpenRequestRewardModal,
    handleCloseRequestRewardModal,
  ] = useOpen();

  const [bannerOpen, setOpenBanner] = useState(true);

  const { handleStartPolling } = usePolling({
    startPolling: startPollingEpisodeList,
    stopPolling: stopPollingEpisodeList,
    dependencies: [seedEpisodeInfos],
  });

  const handleRefetch = () => {
    handleStartPolling();
    setEpisodeNoToRefetch(needRequestReward[0]?.episodeNo);
  };

  return mounted ? (
    <>
      <Head>
        <title>Seeding | Artiside</title>
      </Head>
      <Container
        sx={{
          padding:
            needRequestReward?.length && bannerOpen
              ? '92px 20px !important'
              : '56px 20px !important',
          maxWidth: '1600px !important',
          width: '100%',
          transition: 'padding 0.5s',
        }}
      >
        {needRequestReward?.length && bannerOpen ? (
          <RequestRewardBanner
            requestPeriod={needRequestReward[0].requestPeriod}
            onOpenRequestRewardModal={handleOpenRequestRewardModal}
            onSetOpenBanner={setOpenBanner}
          />
        ) : null}
        <SeedingBanner />
        <SeedingNavMenu tab={tab} navItems={navItems} />
        {tab === 'seeding' && (
          <Seeding onCheckConnected={handleCheckConnected} />
        )}
        {tab === 'mySeed' && (
          <MySeed
            useEpisodeList={{
              episodeList: seedEpisodeInfos,
              loading,
              fetchMore,
              pageInfo,
            }}
            onCheckConnected={handleCheckConnected}
            onStartPollingEpisode={handleStartPolling}
            episodeNoToRefetch={episodeNoToRefetch}
            setEpisodeNoToRefetch={setEpisodeNoToRefetch}
          />
        )}
        {tab === 'history' && (
          <History
            useEpisodeList={{
              episodeList: seedEpisodeInfos,
              loading,
              fetchMore,
              pageInfo,
            }}
          />
        )}
        {requestRewardModalOpen && needRequestReward?.length ? (
          <RequestRewardModal
            open={requestRewardModalOpen}
            onClose={handleCloseRequestRewardModal}
            requestPeriod={needRequestReward[0].requestPeriod}
            episodeNo={needRequestReward[0].episodeNo}
            onRefetch={handleRefetch}
          />
        ) : null}
      </Container>
    </>
  ) : (
    <></>
  );
};

export default Page;
