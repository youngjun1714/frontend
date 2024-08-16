import CoinMarketCapButton from '@/components/ui/Icons/CoinMarketCapButton';
import styles from './Stat.module.scss';
import Data from '@/components/ui/Icons/Data';
import Graph from '@/components/ui/Icons/Graph';
import Stopwatch from '@/components/ui/Icons/Stopwatch';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import numberFormat from '@/utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';

const StakingStat = ({ stakingInfo, adfToUsd }) => {
  const { totalStakedAmt, totalDistReward, endTimeAt } = stakingInfo || {};

  return (
    <div className={styles.statDiv}>
      <div className={styles.statCard}>
        <div className={styles.label}>
          <Data /> Total Staked
          <span className={styles.unit}>ADF</span>
        </div>
        <div>
          <div className={styles.value}>
            <InfoTypography
              content={totalStakedAmt}
              decimals={0}
              size="md"
              endDecorator="ADF"
            />
          </div>
          <div className={styles.subValue}>
            ${numberFormat(totalStakedAmt * adfToUsd, 2)}
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.label}>
          <Graph /> ADF Reward for the Round
          <span className={styles.unit}>ADF</span>
        </div>
        <div>
          <div className={styles.value}>
            <InfoTypography content={totalDistReward} decimals={2} size="md" />
          </div>
          <div className={styles.subValue}>
            ${numberFormat(totalDistReward * adfToUsd, 2)}
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.label}>
          <Stopwatch /> End date
        </div>
        <div>
          <div className={styles.value}>
            (UTC) {moment(endTimeAt).utc().format('MMM DD, YYYY')}
          </div>
          <div className={styles.subValue}>
            {moment(endTimeAt).utc().format('HH:mm:ss')}
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.label}>
          <Data /> ADF Price (1 $ ADF = USDT)
        </div>
        <div>
          <div className={styles.value}>
            <InfoTypography content={adfToUsd} decimals={2} size="md" />
          </div>
          {/* <div className={styles.subValue}>${numberFormat(adfToUsd, 2)}</div> */}
        </div>
        <Link
          className={styles.cmcButton}
          href="https://coinmarketcap.com/currencies/art-de-finance/"
          target="_blank"
        >
          <CoinMarketCapButton />
        </Link>
      </div>
    </div>
  );
};

export default StakingStat;
