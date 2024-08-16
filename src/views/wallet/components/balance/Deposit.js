import React from 'react';
import { useRecoilValue } from 'recoil';

import styles from './index.module.scss';

import stores from '@/store';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import WalletTokenRow from '../wallet-token-row/WalletTokenRow';
import { getShortAddress } from '@/utils/contractUtil';
import CopyButton from '@/components/ui/CopyButton/CopyButton';
import WalletBadge from '../wallet-badge/WalletBadge';

const Deposit = ({ currency, balances }) => {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const { adf, tether, polygon } = balances || {};

  const getTotalUsdBalance = () =>
    Number(adf) * currency?.adf +
    Number(tether) * currency?.tether +
    Number(polygon) * currency?.matic;

  return (
    <div className={styles.deposit}>
      <div className={styles.top}>
        <WalletBadge type="black" label="Deposit Balance" />
        <div className={styles.price}>
          <InfoTypography
            content={getTotalUsdBalance()}
            startDecorator="$"
            endDecorator="USD"
            decimals={2}
            size="lg"
          />
        </div>
        <div className={styles.wallet}>
          <p>{getShortAddress(me?.wallet)}</p>
          <CopyButton text={me?.wallet} height="26px" />
        </div>
      </div>

      <div className={styles.bottom}>
        <WalletTokenRow
          token="ADF"
          unit="ADF"
          content={adf}
          toUsd={currency?.adf}
        />
        <WalletTokenRow
          token="polygon"
          unit="MATIC"
          content={polygon}
          toUsd={currency?.matic}
        />
        <WalletTokenRow
          token="tether"
          unit="USDT"
          content={tether}
          toUsd={currency?.tether}
        />
      </div>
    </div>
  );
};

export default Deposit;
