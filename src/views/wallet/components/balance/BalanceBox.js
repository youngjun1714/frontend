import React from 'react';

import styles from './index.module.scss';

import InfoTypography from '@/components/ui/Typography/InfoTypography';
import DataFilled from '@/components/ui/Icons/DataFilled';
import Link from 'next/link';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import WalletBadge from '../wallet-badge/WalletBadge';

const BalanceBox = ({ type, balance, claimableReward }) => (
  <div className={styles.balanceBox}>
    <div className={styles.flexDiv}>
      <WalletBadge
        type={type === 'seeding' ? 'blue' : 'purple'}
        label={type === 'seeding' ? 'Seeding Balance' : 'Staking Balance'}
      />
      <div className={styles.price}>
        <InfoTypography
          content={balance}
          endDecorator="ADF"
          decimals={5}
          size="lg"
        />
      </div>
    </div>
    {claimableReward ? (
      <div
        className={`${styles.claimable} ${
          styles[type === 'seeding' ? 'blue' : 'purple']
        }`}
      >
        <div className={styles.claimableText}>
          <DataFilled /> You have a {type === 'seeding' ? 'Seeding' : 'Staking'}{' '}
          reward to receive
        </div>
        <Link href="/wallet?tab=reward">
          <button>
            Receive <ArrowIcon />
          </button>
        </Link>
      </div>
    ) : (
      <div className={styles.noReward}>
        <DataFilled /> There is no reward
      </div>
    )}
  </div>
);

export default BalanceBox;
