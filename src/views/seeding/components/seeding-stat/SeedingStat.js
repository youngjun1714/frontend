import moment from 'moment';
import styles from './SeedingStat.module.scss';
import dynamic from 'next/dynamic';
import useOpen from '@/hooks/useOpen';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import { Stack } from '@mui/material';
import Stopwatch from '@/components/ui/Icons/Stopwatch';
import Users from '@/components/ui/Icons/Users';
import Data from '@/components/ui/Icons/Data';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import numberFormat from '@/utils/numberFormat';
import usePrice from '@/hooks/usePrice';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import GuideButton from '@/components/ui/Button/GuideButton';
import Link from 'next/link';

const Timer = dynamic(() => import('@/components/ui/Timer/Timer'), {
  ssr: false,
});

const SelectEpisodeModal = dynamic(() =>
  import('../modals/SelectEpisodeModal')
);

const SeedingStat = ({ episode, onChangeEpisodeNo, liveEpisodeNo }) => {
  const [
    selectEpisodeModalOpen,
    handleOpenSelectEpisodeModal,
    handleCloseSelectEpisodeModal,
  ] = useOpen();

  const {
    episodeNo,
    endTimeAt,
    totalSeeders,
    totalSeedAmt,
    totalPartners,
    totalRewardAmt,
  } = episode || {};

  const isLiveEpisode = moment().isBefore(endTimeAt);

  const adfToUsd = usePrice('adf');

  return (
    <div className={styles.statDiv}>
      <div className={styles.statCard}>
        <Stack justifyContent="space-between" direction="row">
          <StatusLabel label={isLiveEpisode ? 'LIVE' : 'CLOSED'} />
          <button
            className={styles.viewButton}
            onClick={handleOpenSelectEpisodeModal}
          >
            Previous Episodes <ArrowIcon />
          </button>
        </Stack>
        <div>
          <div className={styles.episode}>
            Episode <span className={styles.episodeNo}>{episodeNo}</span>
            <Link
              aria-label="go to about seeding page"
              href="/seeding/about"
              target="_blank"
            >
              <GuideButton />
            </Link>
          </div>
          <div className={styles.endDate}>
            End Date: {moment(endTimeAt).utc().format('(UTC) MMM DD, YYYY')}
          </div>
        </div>
      </div>
      {isLiveEpisode ? (
        <>
          <div className={styles.statCard}>
            <div className={styles.label}>
              <Stopwatch /> Time Remaining
            </div>
            <div className={styles.value}>
              <Timer
                expiryTimestamp={endTimeAt}
                onHandleExpired={() => {}}
                needDayCounter
              />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Users /> Seeders
            </div>
            <div className={styles.value}>{numberFormat(totalSeeders, 0)}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data /> Accum. Seed <span className={styles.unit}>ADF</span>
            </div>
            <div>
              <div className={styles.value}>
                <InfoTypography content={totalSeedAmt} decimals={2} size="md" />
              </div>
              <div className={styles.subValue}>
                ${numberFormat(totalSeedAmt * adfToUsd, 2)}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data /> Accum. Seed <span className={styles.unit}>ADF</span>
            </div>
            <div className={styles.value}>
              <InfoTypography content={totalSeedAmt} decimals={2} size="md" />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Users /> Seeders
            </div>
            <div className={styles.value}>{numberFormat(totalSeeders, 0)}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Users /> Artists
            </div>
            <div className={styles.value}>{numberFormat(totalPartners, 0)}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data /> Total Reward <span className={styles.unit}>ADF</span>
            </div>
            <div className={styles.value}>
              <InfoTypography content={totalRewardAmt} size="md" />
            </div>
          </div>
        </>
      )}
      {selectEpisodeModalOpen && (
        <SelectEpisodeModal
          open={selectEpisodeModalOpen}
          onClose={handleCloseSelectEpisodeModal}
          onChangeEpisodeNo={onChangeEpisodeNo}
          liveEpisodeNo={liveEpisodeNo}
        />
      )}
    </div>
  );
};

export default SeedingStat;
