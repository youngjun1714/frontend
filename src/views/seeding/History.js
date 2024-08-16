import React, { useState, useRef, useCallback, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

import SeedingSearch from './components/seeding-search/SeedingSearch';
import HistorySearch from './components/history-search/HistorySearch';
import HistoryTable from './components/tables/HistoryTable';

const dropdownItems = [
  {
    id: 'NEWEST',
    title: 'Newest',
  },

  {
    id: 'OLDEST',
    title: 'Oldest',
  },
];

const GET_SEED_HISTORY = gql`
  query getHistoryList(
    $episodeNo: Long
    $orderField: SeedingPartnersOrderBy
    $seedEvent: [SeedEvent]
    $currentPage: Int
    $take: Int
    $searchKeyword: String
  ) {
    getHistoryList(
      episodeNo: $episodeNo
      orderField: $orderField
      seedEvent: $seedEvent
      currentPage: $currentPage
      take: $take
      searchKeyword: $searchKeyword
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      seedActivities {
        episodeNo
        seederUserId
        event
        seederUserName
        partnerId
        artistName
        seedAmt
        unseedAmt
        group
        rewardPercentage
        profileImgUrl
        event
        seedingAt
        createdAt
        rewardAmt
        unLockEndAt
        artistUserName
        requestAt
        unseedingAt
      }
    }
  }
`;

const PAGE_SIZE = 10;

const History = ({ useEpisodeList }) => {
  const [sort, setSort] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [episodeNo, setEpisodeNo] = useState('all');
  const [activities, setActivities] = useState(['SEEDING', 'UNSEEDING']);

  const handleSelectActivity = (activity) => {
    const index = activities.findIndex((arr) => arr === activity);

    if (index === -1) {
      setActivities((prev) => [...prev, activity]);
    } else {
      setActivities((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]);
    }
  };

  const { data, loading, fetchMore } = useQuery(GET_SEED_HISTORY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      episodeNo: episodeNo === 'all' ? null : episodeNo,
      orderField: sort,
      searchKeyword: search,
      seedEvent: activities?.length
        ? activities
        : ['SEEDING', 'UNSEEDING', 'REQUEST'],
      take: PAGE_SIZE,
    },
    context: { clientName: 'seed' },
  });

  const { getHistoryList } = data || {};
  const { seedActivities, pageInfo } = getHistoryList || {};

  const observerTarget = useRef(null);

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

  return (
    <div>
      <HistorySearch
        useEpisodeList={useEpisodeList}
        episode={episodeNo}
        onChangeEpisode={setEpisodeNo}
        onSelectActivity={handleSelectActivity}
        activities={activities}
      />
      <SeedingSearch
        dropdownItems={dropdownItems}
        sort={sort}
        onChangeSort={setSort}
        search={search}
        onChangeSearch={setSearch}
      />
      <HistoryTable items={seedActivities} loading={loading} />
      <div ref={observerTarget} style={{ width: '100%' }} />
    </div>
  );
};

export default History;
