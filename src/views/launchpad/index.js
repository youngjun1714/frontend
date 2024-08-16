import Head from 'next/head';
import { Container } from '@mui/material';
import { useRouter } from 'next/router';

import NavMenu from './components/nav-menu/NavMenu';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Staking from './Staking';
import Voting from './Voting';
import MyLaunchpad from './MyLaunchpad';

const CHECK_WHITE_LIST = gql`
  query checkWhiteList {
    checkWhiteList
  }
`;

const GET_LIVE_ROUND_INFO = gql`
  query getLiveRoundInfo {
    getLiveRoundInfo {
      roundNo
      isLiveRound
      startTimeAt
      endTimeAt
      nextStartTimeAt
      accumVoters
      accumVp
      votingStartTimeAt
    }
    getNextRoundInfo {
      nextStartTimeAt
      votingStartTimeAt
    }
  }
`;

const GET_LIVE_ROUND_ARTISTS = gql`
  query getLiveLaunchpadArtists {
    getLiveLaunchpadArtists {
      launchpadPartnerInfos {
        partnerId
        userId
        nickname
        artistName
        profileImgUrl
        artistWallet
        candidatePartnerInfo {
          intro
          promotionVideoUrl
          promotionThumbnailUrl
          LaunchpadPartnerStatus
          partnerId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const POLL_INTERVAL = 60_000;

const Page = ({ isMobile }) => {
  const router = useRouter();
  const { query } = router;
  const { tab = 'staking' } = query;

  const { account } = useConnectModalContext();
  const { isLoggedIn } = account;

  const { data: checkWhiteListData } = useQuery(CHECK_WHITE_LIST, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const { checkWhiteList } = checkWhiteListData || {};

  const { data: liveRoundInfoData, refetch } = useQuery(GET_LIVE_ROUND_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
    pollInterval: POLL_INTERVAL,
  });

  const { getLiveRoundInfo, getNextRoundInfo } = liveRoundInfoData || {};

  const { data: liveLaunchpadArtistsData } = useQuery(GET_LIVE_ROUND_ARTISTS, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const { getLiveLaunchpadArtists } = liveLaunchpadArtistsData || {};
  const { launchpadPartnerInfos } = getLiveLaunchpadArtists || {};

  const navItems = isLoggedIn
    ? [
        {
          label: 'Staking',
          value: 'staking',
        },
        {
          label: 'Voting',
          value: 'voting',
        },
        {
          label: 'My Launchpad',
          value: 'myLaunchpad',
        },
      ]
    : [
        {
          label: 'Staking',
          value: 'staking',
        },
        {
          label: 'Voting',
          value: 'voting',
        },
      ];

  useEffect(() => {
    if (!isLoggedIn && tab === 'myVoting')
      router.push('/launchpad?tab=staking');
  }, []);

  useEffect(() => {
    if (isMobile) router.push('/');
  }, [isMobile]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <>
      <Head>
        <title>Launchpad | Artiside</title>
      </Head>
      <Container
        sx={{
          padding: '56px 20px !important',
          maxWidth: '1600px !important',
          width: '100%',
          transition: 'padding 0.5s',
        }}
      >
        <NavMenu tab={tab} navItems={navItems} />
        {tab === 'staking' && (
          <Staking
            checkWhiteList={checkWhiteList}
            liveRoundInfo={getLiveRoundInfo}
            nextRoundInfo={getNextRoundInfo}
            launchpadPartnerInfos={launchpadPartnerInfos}
            onRefetchLiveRoundInfo={refetch}
          />
        )}
        {tab === 'voting' && (
          <Voting
            checkWhiteList={checkWhiteList}
            liveRoundInfo={getLiveRoundInfo}
            nextRoundInfo={getNextRoundInfo}
            launchpadPartnerInfos={launchpadPartnerInfos}
            onRefetchLiveRoundInfo={refetch}
          />
        )}
        {tab === 'myLaunchpad' && <MyLaunchpad />}
      </Container>
    </>
  ) : (
    <></>
  );
};

export default Page;
