import moment from 'moment';
import styles from './ArtistSeedStat.module.scss';
import useOpen from '@/hooks/useOpen';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import { Stack } from '@mui/material';
import Users from '@/components/ui/Icons/Users';
import Data from '@/components/ui/Icons/Data';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import numberFormat from '@/utils/numberFormat';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

const ArtistSeedHistoryModal = dynamic(() =>
  import('@/views/seeding/components/modals/ArtistSeedHistoryModal')
);
const SeedersModal = dynamic(() =>
  import('@/views/seeding/components/modals/SeedersModal')
);

const ArtistSeedStat = ({ statData, partnerId, isParticipate }) => {
  const [seederModalOpen, handleOpenSeederModal, handleCloseSeederModal] =
    useOpen();
  const [historyModalOpen, handleOpenHistoryModal, handleCloseHistoryModal] =
    useOpen();

  const {
    seed,
    seederAmt,
    seeders,
    episodeNo,
    endTimeAt,
    commission,
    rewardPercentage,
    userName,
  } = statData || {};

  return (
    <div className={styles.statDiv}>
      <div className={styles.statCard}>
        <Stack justifyContent="space-between" direction="row">
          <StatusLabel label="LIVE" />
          <button
            className={styles.viewButton}
            onClick={handleOpenHistoryModal}
            disabled={!isParticipate}
          >
            Previous Episodes <ArrowIcon />
          </button>
        </Stack>
        <div>
          <div className={styles.episode}>
            Episode <span className={styles.episodeNo}>{episodeNo}</span>
          </div>
          <div className={styles.endDate}>
            End Date: {moment(endTimeAt).utc().format('(UTC) MMM DD, YYYY')}
          </div>
        </div>
      </div>
      {isParticipate ? (
        <>
          <div className={styles.statCard}>
            <div className={styles.label}>Reward Distribution</div>
            <div className={styles.doubleSection}>
              <div>
                <div className={styles.value}>{rewardPercentage}%</div>
                <div className={styles.subValue}>Seeder</div>
              </div>
              <div>
                <div
                  className={styles.value}
                  style={{ color: 'var(--primary-color)' }}
                >
                  {commission}%
                </div>
                <div className={styles.subValue}>{userName}</div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.label}>
              <Data /> Amount Seed <span className={styles.unit}>ADF</span>
            </div>
            <div className={styles.doubleSection}>
              <div style={{ width: '80%' }}>
                <div className={styles.value}>
                  <InfoTypography
                    content={seed}
                    decimals={2}
                    size="md"
                    align="center"
                  />
                </div>
                <div className={styles.subValue}>Total Seed</div>
              </div>
              <div>
                <div className={classNames(styles.value, styles.primaryColor)}>
                  <InfoTypography
                    content={seederAmt}
                    decimals={2}
                    size="md"
                    align="center"
                  />
                </div>
                <div className={styles.subValue}>My Seed</div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.label}
              onClick={handleOpenSeederModal}
              style={{ cursor: 'pointer' }}
            >
              <Users /> Seeders
            </div>
            <div className={styles.value}>{numberFormat(seeders, 0)}</div>
          </div>
          {seederModalOpen && (
            <SeedersModal
              open={seederModalOpen}
              onClose={handleCloseSeederModal}
              episodeNo={episodeNo}
              partner={{
                userName: statData?.userName,
                artistName: statData?.artistName,
                seed: statData?.seed,
                seeders: statData?.seeders,
                partnerId,
                profileImgUrl: statData?.profileImgUrl,
              }}
              isLiveEpisode={true}
            />
          )}
        </>
      ) : (
        <div
          className={styles.statCard}
          style={{
            width: 'calc(100% - 320px - 16px)',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--artiside-neutral2)',
            fontSize: 18,
          }}
        >
          This artist is not participating for the episode. Please stay tuned
          until the next episode!
        </div>
      )}

      {historyModalOpen && (
        <ArtistSeedHistoryModal
          open={historyModalOpen}
          onClose={handleCloseHistoryModal}
          partnerId={partnerId}
        />
      )}
    </div>
  );
};

export default ArtistSeedStat;
