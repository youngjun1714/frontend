import React from 'react';
import { gql, useQuery } from '@apollo/client';

import styles from './Wallet.module.scss';
import Deposit from './components/balance/Deposit';
import BalanceBox from './components/balance/BalanceBox';

const GET_BALANCE = gql`
  query getBalance {
    getSeedBalance {
      totalAmt
      isReceiveReward
    }
    getLaunchpadBalance {
      totalAmt
      isReceiveReward
    }
  }
`;

const Balance = ({ currency, balances, isMobile }) => {
  const { data } = useQuery(GET_BALANCE, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'seed' },
  });

  const { getSeedBalance, getLaunchpadBalance } = data || {};

  return (
    <div className={styles.balance}>
      <Deposit currency={currency} balances={balances} />
      {isMobile ? (
        <></>
      ) : (
        <div className={styles.seedingStakingWrap}>
          <BalanceBox
            type="seeding"
            balance={getSeedBalance?.totalAmt}
            claimableReward={getSeedBalance?.isReceiveReward}
          />
          <BalanceBox
            type="staking"
            balance={getLaunchpadBalance?.totalAmt}
            claimableReward={getLaunchpadBalance?.isReceiveReward}
          />
        </div>
      )}
    </div>
  );
};
export default Balance;
