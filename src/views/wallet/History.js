import { useCallback, useEffect, useRef, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Stack } from '@mui/material';

import BarChart from '@/components/ui/Icons/BarChart';
import styles from './Wallet.module.scss';
import HistoryTable from './components/tables/HistoryTable';
import Dropdown from '@/components/ui/Dropdown/Dropdown';
import Checkbox from '@/components/ui/Checkbox/Checkbox';

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

const GET_ACTIVITY_HISTORY = gql`
  query GetTotalActivityHistory(
    $totalEvent: [TotalEvent]
    $orderField: CommonOrderBy
    $currentPage: Int
    $take: Int
  ) {
    GetTotalActivityHistory(
      totalEvent: $totalEvent
      orderField: $orderField
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      totalActivities {
        event
        createdAt
        txHash
        status
        amt
      }
    }
  }
`;

const PAGE_SIZE = 10;

const History = (props) => {
  const [sort, setSort] = useState('NEWEST');
  const [activities, setActivities] = useState(['SEEDING', 'UNSEEDING']);

  const { data, loading, fetchMore } = useQuery(GET_ACTIVITY_HISTORY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      totalEvent: activities?.length
        ? activities
        : ['SEEDING', 'UNSEEDING', 'REQUEST', 'CLAIMED'],
      orderField: sort,
      take: PAGE_SIZE,
    },
    context: { clientName: 'seed' },
  });

  const { GetTotalActivityHistory } = data || {};
  const { pageInfo, totalActivities } = GetTotalActivityHistory || {};

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

  return (
    <div>
      <Stack
        className={styles.activityButtons}
        direction="row"
        gap="20px"
        alignItems="center"
      >
        <div className={styles.label}>
          <BarChart />
          Activity
        </div>

        <Checkbox
          checked={activities.includes('SEEDING')}
          onClick={() => handleSelectActivity('SEEDING')}
          label="Seed"
        />
        <Checkbox
          checked={activities.includes('UNSEEDING')}
          onClick={() => handleSelectActivity('UNSEEDING')}
          label="Unseed"
        />
        <Checkbox
          checked={activities.includes('REQUEST')}
          onClick={() => handleSelectActivity('REQUEST')}
          label="Request"
        />
        <Checkbox
          checked={activities.includes('CLAIMED')}
          onClick={() => handleSelectActivity('CLAIMED')}
          label="Seeding Claim"
        />
        <Checkbox
          checked={activities.includes('STAKING')}
          onClick={() => handleSelectActivity('STAKING')}
          label="Stake"
        />
        <Checkbox
          checked={activities.includes('UNSTAKING')}
          onClick={() => handleSelectActivity('UNSTAKING')}
          label="Unstake"
        />
        <Checkbox
          checked={activities.includes('STAKING_CLAIMED')}
          onClick={() => handleSelectActivity('STAKING_CLAIMED')}
          label="Stake Claim"
        />
        <Checkbox
          checked={activities.includes('VOTING_CLAIMED')}
          onClick={() => handleSelectActivity('VOTING_CLAIMED')}
          label="Voting Claim"
        />
      </Stack>
      <Stack alignItems="flex-end" mb="65px">
        <Dropdown
          dropWidth="208px"
          dropHeight="40px"
          dropTitle={dropdownItems[0].title}
          defaultValue={sort}
          content={dropdownItems}
          onChange={setSort}
          value={sort}
        />
      </Stack>
      <HistoryTable items={totalActivities} dropdownItems={dropdownItems} />
      <div ref={observerTarget} style={{ width: '100%' }} />
    </div>
  );
};

export default History;
