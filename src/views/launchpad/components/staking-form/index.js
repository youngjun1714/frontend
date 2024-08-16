import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { gql, useLazyQuery } from '@apollo/client';

import StakeForm from './StakeForm';
import UnstakeForm from './UnstakeForm';
import styles from './index.module.scss';
import Switch from './Switch';
import Reward from './Reward';
import NotWhitelisted from './NotWhitelisted';
import StakingStatus from './StakingStatus';
import stores from '@/store';
import useCheckConnected from '@/hooks/useCheckConnected';
import { debounce } from 'lodash';
import useTokenBalance from '@/hooks/useTokenBalance';

const GET_EXPECTED_REWARD_INFO = gql`
  query getExpectedRewardInfo($stakingAmt: Float, $isStaking: Boolean) {
    getExpectedRewardInfo(stakingAmt: $stakingAmt, isStaking: $isStaking) {
      rewardAmtPerHour
      rewardAmtPerDay
      totalVp
    }
  }
`;

const StakingForm = ({
  checkWhiteList,
  stakingStatus,
  adfToUsd,
  onRefetch,
  disableStaking,
}) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const { balance, refetchBalance } = useTokenBalance(me?.wallet, 'adf');

  const [tab, setTab] = useState('stake');

  const { curStakingAmt: stakedAmount = 0 } = stakingStatus || {};

  const [stakeAmount, setStakeAmount] = useState(0);
  const [unstakeAmount, setUnstakeAmount] = useState(0);

  const expectedStakeAmount = useMemo(
    () => (tab === 'stake' ? stakeAmount : unstakeAmount),
    [tab, stakeAmount, unstakeAmount]
  );

  const [getExpectecReward] = useLazyQuery(GET_EXPECTED_REWARD_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const [expectedRewardInfo, setExpectedRewardInfo] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (propSearch, tab) => {
      const result = await getExpectecReward({
        variables: {
          stakingAmt: propSearch,
          isStaking: tab === 'stake',
        },
      });
      setExpectedRewardInfo(result?.data?.getExpectedRewardInfo);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(expectedStakeAmount, tab);
  }, [expectedStakeAmount, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeTab = (tab) => {
    setTab(tab);
    setStakeAmount(0);
    setUnstakeAmount(0);
  };

  const handleCheckConnected = useCheckConnected();

  const handleRefetch = () => {
    onRefetch();
    refetchBalance();
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.stakingForm}>
      <StakingStatus
        stakingStatus={stakingStatus}
        onCheckConnected={handleCheckConnected}
      />
      <div className={styles.wrapper}>
        <Switch tab={tab} onChangeTab={handleChangeTab} disabled={loading} />
        <div className={styles.formContainer}>
          {!checkWhiteList ? (
            <NotWhitelisted />
          ) : tab === 'stake' ? (
            <StakeForm
              amount={stakeAmount}
              onChangeAmount={setStakeAmount}
              adfToUsd={adfToUsd}
              availableAmount={balance}
              onRefetch={handleRefetch}
              onCheckConnected={handleCheckConnected}
              loading={loading}
              setLoading={setLoading}
              disableStaking={disableStaking}
            />
          ) : (
            <UnstakeForm
              amount={unstakeAmount}
              onChangeAmount={setUnstakeAmount}
              adfToUsd={adfToUsd}
              stakedAmount={stakedAmount}
              onRefetch={handleRefetch}
              onCheckConnected={handleCheckConnected}
              stakingStatus={stakingStatus}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          <Reward
            expectedReward={expectedRewardInfo}
            currentVP={stakingStatus?.curVpAmt}
          />
        </div>
      </div>
    </div>
  );
};

export default StakingForm;
