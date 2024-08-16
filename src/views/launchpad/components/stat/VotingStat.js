import styles from './Stat.module.scss';
import Data from '@/components/ui/Icons/Data';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import dynamic from 'next/dynamic';
import Stopwatch from '@/components/ui/Icons/Stopwatch';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import Link from 'next/link';
import GuideButton from '@/components/ui/Button/GuideButton';
import moment from 'moment';
import Users from '@/components/ui/Icons/Users';
import useOpen from '@/hooks/useOpen';

const SelectedArtistModal = dynamic(() =>
  import('../modals/SelectedArtistModal')
);
const Timer = dynamic(() => import('@/components/ui/Timer/Timer'), {
  ssr: false,
});

const VotingStat = ({
  liveRoundInfo,
  checkWhiteList,
  myVotingInfo,
  winners,
  onRefetchLiveRoundInfo,
}) => {
  const { roundNo, endTimeAt, accumVoters, accumVp } = liveRoundInfo || {};
  const { spentVp, totalVp } = myVotingInfo || {};
  const [previousModalOpen, handleOpenPreviousModal, handleClosePreviousModal] =
    useOpen();

  return (
    <>
      <div className={`${styles.statDiv} ${styles.votingStat}`}>
        <div className={styles.statCard}>
          <div className={styles.flexDiv}>
            <StatusLabel label="LIVE" />
            <button
              aria-label="view previous episodes button"
              className={styles.viewButton}
              onClick={handleOpenPreviousModal}
            >
              Previous Rounds <ArrowIcon />
            </button>
          </div>
          <div>
            <div className={styles.episode}>
              Round <span className={styles.episodeNo}>{roundNo}</span>
              <Link
                aria-label="go to about seeding page"
                href="/launchpad/about"
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

        <div className={styles.statCard}>
          <div className={styles.label}>
            <Stopwatch /> Time Remaining
          </div>
          <div>
            <Timer
              expiryTimestamp={endTimeAt}
              needDayCounter
              onHandleExpired={onRefetchLiveRoundInfo}
            />
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.label}>
            <Users /> Voters
          </div>
          <div>
            <div className={styles.value}>
              <InfoTypography content={accumVoters} decimals={0} size="md" />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.label}>
            <Data /> Accum. VP
          </div>
          <div>
            <div
              className={styles.value}
              style={{ display: 'flex', alignItems: 'flex-end' }}
            >
              <InfoTypography content={accumVp} decimals={0} size="md" />
              <div style={{ fontSize: 20 }}>VP</div>
            </div>
          </div>
        </div>
      </div>
      {checkWhiteList && (
        <div className={styles.infoDiv}>
          <div className={styles.infoCard}>
            <div className={styles.label}>My Voting Info</div>
            <div>
              <div
                className={styles.value}
                style={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <InfoTypography content={spentVp} decimals={0} size="md" />
                <div style={{ fontSize: 20 }}>VP</div>
              </div>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.infoCard}>
            <div className={styles.label}>
              Total{' '}
              <span className={styles.unit}>(Used VP + Remaining VP)</span>
            </div>
            <div>
              <div
                className={styles.value}
                style={{ display: 'flex', alignItems: 'flex-end' }}
              >
                <InfoTypography content={totalVp} decimals={0} size="md" />
                <div style={{ fontSize: 20 }}>VP</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {previousModalOpen && (
        <SelectedArtistModal
          winners={winners}
          open={previousModalOpen}
          onClose={handleClosePreviousModal}
        />
      )}
    </>
  );
};

export default VotingStat;
