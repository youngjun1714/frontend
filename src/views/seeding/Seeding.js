import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import dynamic from 'next/dynamic';
import { gql, useQuery } from '@apollo/client';

import styles from './index.module.scss';
import SeedingStat from './components/seeding-stat/SeedingStat';
import SeedingSearch from './components/seeding-search/SeedingSearch';
import useOpen from '@/hooks/useOpen';
import SeedingTable from './components/tables/SeedingTable';
import NextEpisodeTable from './components/tables/NextEpisodeTable';
import AlbumList from './components/album-list/AlbumList';
import usePolling from '@/hooks/usePolling';
import { useRouter } from 'next/router';
import moment from 'moment';
import useInterval from '@/hooks/useInterval';

const SeedingModal = dynamic(() => import('./components/modals/SeedingModal'));
const SeedersModal = dynamic(() => import('./components/modals/SeedersModal'));

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
  {
    id: 'NEWEST',
    title: 'Newest',
  },
];

const GET_SEED_INFO = gql`
  query getSeedInfo($episodeNo: Long) {
    getSeedInfo(episodeNo: $episodeNo) {
      episodeNo
      endTimeAt
      totalSeedAmt
      totalSeeders
      totalPartners
      totalRewardAmt
    }
  }
`;

const GET_SEED_PARTNERS = gql`
  query getSeedPartners(
    $orderField: SeedingPartnersOrderBy
    $currentPage: Int
    $take: Int
    $episodeNo: Long
    $searchKeyword: String
  ) {
    getSeedPartners(
      orderField: $orderField
      currentPage: $currentPage
      take: $take
      episodeNo: $episodeNo
      searchKeyword: $searchKeyword
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
        artworkPreviewInfos {
          artworkId
          mediaType
          artworkUrl
          thumbnailUrl
          title
        }
      }
    }
  }
`;

const GET_LIVE_EPISODE_INFO = gql`
  query getLiveEpisodeInfo {
    getLiveEpisodeInfo {
      episodeNo
      endTimeAt
    }
  }
`;

const PAGE_SIZE = 30;
const POLL_INTERVAL = 30000;

const Seeding = ({ onCheckConnected }) => {
  const [seedingModalOpen, handleOpenSeedingModal, handleCloseSeedingModal] =
    useOpen();
  const [seederModalOpen, handleOpenSeederModal, handleCloseSeederModal] =
    useOpen();

  const router = useRouter();
  const {
    query: { q },
  } = router || {};

  const [menu, setMenu] = useState('seed');
  const [viewType, setViewType] = useState('album'); // list | album
  const [search, setSearch] = useState(q || '');
  const [sort, setSort] = useState('SEED');

  const [episodeNo, setEpisodeNo] = useState(null);
  const [partnerToSeed, setPartnerToSeed] = useState({});

  const observerTarget = useRef(null);

  const { data: liveEpisodeData } = useQuery(GET_LIVE_EPISODE_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getLiveEpisodeInfo } = liveEpisodeData || {};
  const { episodeNo: liveEpisodeNo } = getLiveEpisodeInfo || {};

  const {
    data: seedData,
    startPolling: startPollingSeedData,
    stopPolling: stopPollingSeedData,
  } = useQuery(GET_SEED_INFO, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo,
    },
    pollInterval: POLL_INTERVAL,
    context: { clientName: 'seed' },
  });
  const { getSeedInfo: episode } = seedData || {};
  const { totalSeedAmt, endTimeAt } = episode || {};

  const DISABLE_SEEDING_MIN = 5;
  const [disableSeeding, setDisableSeeding] = useState(false);

  useInterval(
    () => {
      if (
        endTimeAt &&
        moment(endTimeAt)
          .subtract(DISABLE_SEEDING_MIN, 'minutes')
          .isBefore(moment()) &&
        !disableSeeding &&
        (!episodeNo || liveEpisodeNo === episodeNo)
      ) {
        setDisableSeeding(true);
        handleCloseSeedingModal();
      }
    },
    disableSeeding ? null : 1000
  );

  const {
    data: partnersData,
    loading,
    fetchMore,
    startPolling: startPollingPartners,
    stopPolling: stopPollingPartners,
  } = useQuery(GET_SEED_PARTNERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo,
      orderField: sort,
      searchKeyword: search,
      take: PAGE_SIZE,
    },
    pollInterval: POLL_INTERVAL,
    context: { clientName: 'seed' },
  });

  const { getSeedPartners } = partnersData || {};
  const { partners: allPartners, pageInfo } = getSeedPartners || {};

  const { handleStartPolling } = usePolling({
    startPolling: (interval) => {
      startPollingSeedData(interval);
      startPollingPartners(interval);
    },
    stopPolling: () => {
      stopPollingSeedData();
      stopPollingPartners();
    },
    dependencies: [totalSeedAmt],
  });

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (pageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: pageInfo.currentPage + 1,
        },
      });
    }
  }, [pageInfo, fetchMore]);

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

  const partners = useMemo(
    () => allPartners?.filter((partner) => partner.isParticipate),
    [allPartners]
  );

  const nextPartners = useMemo(
    () => allPartners?.filter((partner) => !partner.isParticipate),
    [allPartners]
  );

  const isLiveEpisode = useMemo(
    () => !episodeNo || episodeNo === liveEpisodeNo,
    [episodeNo, liveEpisodeNo]
  );

  return (
    <div>
      <SeedingStat
        episode={episode}
        liveEpisodeNo={liveEpisodeNo}
        onChangeEpisodeNo={setEpisodeNo}
      />
      <SeedingSearch
        dropdownItems={dropdownItems}
        sort={sort}
        onChangeSort={setSort}
        viewType={viewType}
        onChangeViewType={setViewType}
        search={search}
        onChangeSearch={setSearch}
      />

      <div className={styles.tableDiv}>
        {viewType === 'list' ? (
          <SeedingTable
            items={partners}
            onOpenSeederModal={handleOpenSeederModal}
            onOpenSeedingModal={handleOpenSeedingModal}
            onChangePartnerToSeed={setPartnerToSeed}
            isLiveEpisode={isLiveEpisode}
            liveEpisodeEndTimeAt={episode?.endTimeAt}
            onCheckConnected={onCheckConnected}
            loading={loading}
            disableSeeding={disableSeeding}
          />
        ) : (
          <AlbumList
            items={partners}
            loading={loading}
            onOpenSeederModal={handleOpenSeederModal}
            onOpenSeedingModal={handleOpenSeedingModal}
            onChangePartnerToSeed={setPartnerToSeed}
            isLiveEpisode={isLiveEpisode}
            liveEpisodeEndTimeAt={episode?.endTimeAt}
            onCheckConnected={onCheckConnected}
            disableSeeding={disableSeeding}
          />
        )}
      </div>

      {isLiveEpisode && nextPartners?.length ? (
        <div className={styles.tableDiv}>
          <div className={styles.nextEpisode}>Next Episode</div>
          <NextEpisodeTable items={nextPartners} />
        </div>
      ) : null}

      <div ref={observerTarget} style={{ width: '100%' }} />

      {seedingModalOpen && (
        <SeedingModal
          onClose={handleCloseSeedingModal}
          open={seedingModalOpen}
          menu={menu}
          onSetMenu={setMenu}
          episodeNo={episode?.episodeNo}
          partner={partnerToSeed}
          onRefetch={handleStartPolling}
          disableSeeding={disableSeeding}
        />
      )}
      {seederModalOpen && (
        <SeedersModal
          open={seederModalOpen}
          onClose={handleCloseSeederModal}
          episodeNo={episode?.episodeNo}
          partner={partnerToSeed}
          isLiveEpisode={isLiveEpisode}
        />
      )}
    </div>
  );
};

export default Seeding;
