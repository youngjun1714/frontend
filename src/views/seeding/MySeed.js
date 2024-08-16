import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { gql, useQuery } from '@apollo/client';
import { Stack } from '@mui/material';

import SeedingEpisodeList from './components/seeding-episode-list/SeedingEpisodeList';
import MySeedStat from './components/my-seed-stat/MySeedStat';
import MySeedSearch from './components/my-seed-search/MySeedSearch';
import MySeedTable from './components/tables/MySeedTable';
import usePolling from '@/hooks/usePolling';
import useInterval from '@/hooks/useInterval';
import moment from 'moment';

const dropdownItems = [
  {
    id: 'SEED',
    title: 'Seed: High to Low',
  },
  {
    id: 'SEEDERS',
    title: 'Seeders: High to Low',
  },
  {
    id: 'NAME',
    title: 'Name A-Z',
  },
];

const GET_SEED_MY_INFO = gql`
  query getSeedMyInfo($episodeNo: Long) {
    getSeedMyInfo(episodeNo: $episodeNo) {
      totalSeedAmt
      episodeNo
      totalPartners
      requestableTimeAt
      rewardRequestType
      totalRewardAmt
    }
  }
`;

const GET_SEED_MY_PARTNERS = gql`
  query getSeedMyPartners(
    $episodeNo: Long
    $orderField: SeedingPartnersOrderBy
    $searchKeyword: String
    $currentPage: Int
    $take: Int
  ) {
    getSeedMyPartners(
      episodeNo: $episodeNo
      orderField: $orderField
      searchKeyword: $searchKeyword
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      partners {
        userName
        artistName
        seeders
        seed
        group
        rewardPercentage
        isParticipate
        partnerId
        episodeNo
        profileImgUrl
        artistWallet
        partnerUserId
        seedAmt
        seedRewardAmt
      }
    }
  }
`;

const PAGE_SIZE = 10;

const MySeed = ({
  useEpisodeList,
  onCheckConnected,
  onStartPollingEpisode,
  episodeNoToRefetch,
  setEpisodeNoToRefetch,
}) => {
  const [sort, setSort] = useState('SEED');
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(true);
  const [selectedEpisodeNo, setSelectedEpisodeNo] = useState(null);

  const handleSelectEpisode = (episodeNo) => {
    setSelectedEpisodeNo(episodeNo);
  };

  const { episodeList } = useEpisodeList || {};

  const selectedEpisode = useMemo(
    () => episodeList?.find((item) => item.episodeNo === selectedEpisodeNo),
    [selectedEpisodeNo, episodeList]
  );

  const DISABLE_SEEDING_MIN = 5;
  const [disableSeeding, setDisableSeeding] = useState(false);

  useInterval(
    () => {
      if (
        selectedEpisode &&
        selectedEpisode?.endTimeAt &&
        moment(selectedEpisode?.endTimeAt)
          .subtract(DISABLE_SEEDING_MIN, 'minutes')
          .isBefore(moment()) &&
        !disableSeeding &&
        selectedEpisode?.isLiveEpisode
      ) {
        setDisableSeeding(true);
      }
    },
    disableSeeding ? null : 1000
  );

  const {
    data: seedMyInfoData,
    startPolling: startPollingSeedMyInfo,
    stopPolling: stopPollingSeedMyInfo,
  } = useQuery(GET_SEED_MY_INFO, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo: selectedEpisodeNo,
    },
    context: { clientName: 'seed' },
  });

  const { getSeedMyInfo: myStatData } = seedMyInfoData || {};
  const { totalSeedAmt, totalRewardAmt } = myStatData || {};

  const {
    data: seedMyPartnersData,
    loading,
    fetchMore,
    startPolling: startPollingSeedMyPartner,
    stopPolling: stopPollingSeedMyPartner,
  } = useQuery(GET_SEED_MY_PARTNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo: selectedEpisodeNo,
      orderField: sort,
      searchKeyword: search,
      take: PAGE_SIZE,
    },
    context: { clientName: 'seed' },
  });

  const { handleStartPolling, isPolling } = usePolling({
    startPolling: (interval) => {
      startPollingSeedMyInfo(interval);
      startPollingSeedMyPartner(interval);
    },
    stopPolling: () => {
      stopPollingSeedMyInfo();
      stopPollingSeedMyPartner();
    },
    dependencies: [totalSeedAmt, totalRewardAmt],
  });

  const { getSeedMyPartners } = seedMyPartnersData || {};
  const { partners, pageInfo: partnersPageInfo } = getSeedMyPartners || {};

  const handleRefetch = () => {
    handleStartPolling();
    onStartPollingEpisode();
  };

  useEffect(() => {
    if (episodeNoToRefetch && selectedEpisodeNo === episodeNoToRefetch) {
      setEpisodeNoToRefetch(null);
      handleRefetch();
    }
  }, [episodeNoToRefetch]);

  useEffect(() => {
    if (!selectedEpisodeNo && episodeList?.length) {
      setSelectedEpisodeNo(episodeList[0].episodeNo);
    }
  }, [selectedEpisodeNo, episodeList]);

  const observerTarget = useRef(null);

  const handleMore = useCallback(() => {
    if (
      ((partnersPageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (partnersPageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: partnersPageInfo.currentPage + 1,
        },
      });
    }
  }, [partnersPageInfo, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleMore();
        }
      },
      { threshold: 1 }
    );
    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget, loading, handleMore]);

  return (
    <>
      <Stack direction="row" gap="24px">
        <SeedingEpisodeList
          useEpisodeList={useEpisodeList}
          onSelectEpisode={handleSelectEpisode}
          selectedEpisodeNo={selectedEpisodeNo}
          onRefetch={handleRefetch}
          onCheckConnected={onCheckConnected}
          isPolling={isPolling}
        />
        <Stack sx={{ width: 'calc(100% - 370px - 24px)' }}>
          <MySeedStat
            selectedEpisode={selectedEpisode}
            useEpisodeList={useEpisodeList}
            myStatData={myStatData}
            onRefetch={handleRefetch}
            onCheckConnected={onCheckConnected}
            isPolling={isPolling}
          />
          <MySeedSearch
            dropdownItems={dropdownItems}
            sort={sort}
            onChangeSort={setSort}
            search={search}
            onChangeSearch={setSearch}
            showDetail={showDetail}
            onChangeShowDetail={setShowDetail}
          />
          <MySeedTable
            isLiveEpisode={selectedEpisode?.isLiveEpisode}
            endTimeAt={selectedEpisode?.endTimeAt}
            items={partners}
            showDetail={showDetail}
            onRefetch={handleRefetch}
            loading={loading}
            disableSeeding={disableSeeding}
          />
        </Stack>
      </Stack>
      <div ref={observerTarget} style={{ width: '100%' }} />
    </>
  );
};

export default MySeed;
