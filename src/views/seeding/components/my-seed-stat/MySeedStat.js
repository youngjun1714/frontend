import useOpen from '@/hooks/useOpen';
import styles from './MySeedStat.module.scss';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import { Stack } from '@mui/material';
import Data from '@/components/ui/Icons/Data';
import Users from '@/components/ui/Icons/Users';
import Stopwatch from '@/components/ui/Icons/Stopwatch';
import ReceiveReward from '@/components/ui/Icons/ReceiveReward';
import numberFormat from '@/utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import dynamic from 'next/dynamic';

const SeedingHistoryModal = dynamic(() =>
  import('../modals/SeedingHistoryModal')
);
const RequestHistoryModal = dynamic(() =>
  import('../modals/RequestHistoryModal')
);
const RequestRewardModal = dynamic(() =>
  import('../modals/RequestRewardModal')
);

const MySeedStat = ({
  selectedEpisode,
  useEpisodeList,
  myStatData,
  onRefetch,
  onCheckConnected,
  isPolling,
}) => {
  const [
    seedingHistoryModalOpen,
    handleOpenSeedingHistoryModal,
    handleCloseSeedingHistoryModal,
  ] = useOpen();
  const [
    requestHistoryModalOpen,
    handleOpenRequestHistoryModal,
    handleCloseRequestHistoryModal,
  ] = useOpen();
  const [
    requestRewardModalOpen,
    handleOpenRequestRewardModal,
    handleCloseRequestRewardModal,
  ] = useOpen();

  const {
    totalSeedAmt,
    totalPartners,
    requestableTimeAt,
    rewardRequestType,
    totalRewardAmt,
  } = myStatData || {};

  const handleCheckConnectedAndOpenRequestRewardModal = () => {
    onCheckConnected(handleOpenRequestRewardModal);
  };

  const { episodeList } = useEpisodeList || {};

  return (
    <div className={styles.mySeedStat}>
      {selectedEpisode?.isLiveEpisode || !totalSeedAmt ? (
        <div className={styles.statDiv}>
          <div className={styles.statCard} style={{ width: '60%' }}>
            <div className={styles.label}>
              <Data />
              My Seeding Amount <span className={styles.adf}>ADF</span>
            </div>
            <div className={styles.value}>
              <InfoTypography content={totalSeedAmt} decimals={2} size="sm" />
            </div>
          </div>
          <div className={styles.statCard} style={{ width: '40%' }}>
            <div className={styles.label}>
              <Users />
              Seeding Artists
            </div>
            <div className={styles.value}>{numberFormat(totalPartners, 0)}</div>
          </div>
          <button
            className={styles.topButton}
            onClick={handleOpenSeedingHistoryModal}
          >
            Seed History <ArrowIcon />
          </button>
        </div>
      ) : (
        <Stack direction="row" gap="24px">
          <div className={styles.statDiv} style={{ width: '60%' }}>
            <div
              className={styles.statCard}
              style={{ flexDirection: 'column', gap: '32px' }}
            >
              <div className={styles.statRow}>
                <div className={styles.label}>
                  <Data />
                  My Seeding Amount <span className={styles.adf}>ADF</span>
                </div>
                <div className={styles.value}>
                  <InfoTypography
                    content={totalSeedAmt}
                    decimals={2}
                    size="sm"
                  />
                </div>
              </div>
              <div className={styles.statRow}>
                <div className={styles.label}>
                  <Stopwatch />
                  Request Period
                </div>
                <div className={styles.value}>
                  {rewardRequestType === 'REQUESTED' ? (
                    <b>Requested</b>
                  ) : (
                    <>
                      {moment(requestableTimeAt)
                        .utc()
                        .format('(UTC) MMM DD, YYYY')}
                    </>
                  )}
                </div>
              </div>
              <div className={styles.statRow}>
                <div className={styles.label}>
                  <Users />
                  Seeding Artists
                </div>
                <div className={styles.value}>
                  {numberFormat(totalPartners, 0)}
                </div>
              </div>
            </div>
            <button
              className={styles.topButton}
              onClick={handleOpenSeedingHistoryModal}
            >
              Seed History <ArrowIcon />
            </button>
          </div>
          <div className={styles.statDiv} style={{ width: '40%' }}>
            <div
              className={styles.statCard}
              style={{ flexDirection: 'column' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div className={styles.label} style={{ marginBottom: 8 }}>
                  {rewardRequestType === 'REQUESTED' && <ReceiveReward />}
                  Rewards
                  <span className={styles.adf}>ADF</span>
                </div>
                {rewardRequestType === 'REQUESTED' ? (
                  <div className={styles.value} style={{ paddingTop: 16 }}>
                    <InfoTypography
                      content={totalRewardAmt}
                      size="sm"
                      decimals={5}
                    />
                  </div>
                ) : (
                  <div style={{ paddingTop: 10 }}>
                    <ReceiveReward />
                    <div className={styles.rewardGuide}>
                      Rewards appear after the request
                    </div>
                  </div>
                )}
              </div>
              {rewardRequestType === 'REQUESTED' ? (
                <Link
                  aria-label="go to wallet reward page"
                  href="/wallet?tab=reward"
                >
                  <button className={styles.walletButton}>
                    My Wallet <ArrowIcon />
                  </button>
                </Link>
              ) : rewardRequestType === 'UNREQUESTED' ? (
                <button className={styles.requestRewardButton} disabled>
                  Unrequested
                </button>
              ) : (
                <button
                  className={styles.requestRewardButton}
                  onClick={handleCheckConnectedAndOpenRequestRewardModal}
                  disabled={
                    rewardRequestType !== 'NONE' ||
                    selectedEpisode?.isLiveEpisode ||
                    moment().isAfter(requestableTimeAt) ||
                    isPolling ||
                    episodeList?.[0]?.episodeNo === selectedEpisode?.episodeNo
                  }
                >
                  Request Reward
                </button>
              )}
            </div>
            <button
              className={styles.topButton}
              onClick={handleOpenRequestHistoryModal}
            >
              Request History <ArrowIcon />
            </button>
          </div>
        </Stack>
      )}
      {seedingHistoryModalOpen && (
        <SeedingHistoryModal
          open={seedingHistoryModalOpen}
          onClose={handleCloseSeedingHistoryModal}
          selectedEpisodeNo={selectedEpisode?.episodeNo}
          useEpisodeList={useEpisodeList}
        />
      )}
      {requestHistoryModalOpen && (
        <RequestHistoryModal
          open={requestHistoryModalOpen}
          onClose={handleCloseRequestHistoryModal}
        />
      )}
      {requestRewardModalOpen && (
        <RequestRewardModal
          open={requestRewardModalOpen}
          onClose={handleCloseRequestRewardModal}
          requestPeriod={selectedEpisode?.requestableTimeAt}
          episodeNo={selectedEpisode?.episodeNo}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
};

export default MySeedStat;
