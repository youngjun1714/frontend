import React, { Fragment, useEffect, useState } from 'react';
import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Avatar from '@/components/ui/Avatar/Avatar';
import styles from './Table.module.scss';
import User from '@/components/ui/Icons/User';
import GuideButton from '@/components/ui/Button/GuideButton';
import SeedingGroupChip from '@/components/ui/SeedingGroupChip/SeedingGroupChip';
import useOpen from '@/hooks/useOpen';
import Link from 'next/link';
import numberFormat from '@/utils/numberFormat';
import ReceiveReward from '@/components/ui/Icons/ReceiveReward';
import History from '@/components/ui/Icons/History';
import moment from 'moment';
import dynamic from 'next/dynamic';

const RewardPercentModal = dynamic(() =>
  import('../modals/RewardPercentModal')
);
const SeedGroupModal = dynamic(() => import('../modals/SeedGroupModal'));
const SeedersModal = dynamic(() => import('../modals/SeedersModal'));
const SeedingModal = dynamic(() => import('../modals/SeedingModal'));

const MySeedTable = ({
  items,
  isLiveEpisode,
  endTimeAt,
  showDetail,
  onRefetch,
  loading,
  disableSeeding,
}) => {
  const [
    seedGroupModalOpen,
    handleOpenSeedGroupModal,
    handleCloseSeedGroupModal,
  ] = useOpen();

  const [
    rewardPercentModalOpen,
    handleOpenRewardPercentModal,
    handleCloseRewardPercentModal,
  ] = useOpen();

  const [seederModalOpen, handleOpenSeederModal, handleCloseSeederModal] =
    useOpen();

  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleSelectAndOpenSeederModal = (partner) => {
    setSelectedPartner(partner);
    handleOpenSeederModal();
  };

  const [seedingModalOpen, handleOpenSeedingModal, handleCloseSeedingModal] =
    useOpen();

  const [menu, setMenu] = useState('seed');

  const handleSelectAndOpenSeedingModal = (partner) => {
    setSelectedPartner(partner);
    handleOpenSeedingModal();
  };

  useEffect(() => {
    if (disableSeeding) handleCloseSeedingModal();
  }, [disableSeeding]);

  return (
    <>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: showDetail ? '20%' : '60%' }}>
              Artists
            </TableCell>

            {showDetail && <TableCell>Seeders</TableCell>}
            {showDetail && (
              <TableCell align="right" sx={{ paddingRight: '80px !important' }}>
                Seed <span className={styles.adf}>ADF</span>
              </TableCell>
            )}
            <TableCell>
              <Stack direction="row" alignItems="center">
                Group
                <GuideButton onClick={handleOpenSeedGroupModal} />
              </Stack>
            </TableCell>
            {showDetail && (
              <TableCell align="center">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  Reward %
                  <GuideButton onClick={handleOpenRewardPercentModal} />
                </Stack>
              </TableCell>
            )}
            <TableCell align="right">
              My Seed <span className={styles.adf}>ADF</span>
            </TableCell>
            <TableCell align="right" sx={{ width: 160 }}>
              {isLiveEpisode ? (
                ''
              ) : (
                <>
                  Reward <span className={styles.adf}>ADF</span>
                </>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && !items?.length ? (
            <TableRow>
              <TableCell colSpan={7} className={styles.noItems}>
                <Stack alignItems="center" gap="16px">
                  <CircularProgress
                    sx={{
                      color: 'var(--primary-color)',
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ) : items && items?.length ? (
            items?.map((item) => (
              <Fragment key={`my-seed-row-${item.userName}-${item.episodeNo}`}>
                <TableRow hover>
                  <TableCell sx={{ width: showDetail ? '20%' : '60%' }}>
                    <Link href={`/artist/${item.partnerUserId}?list=artworks`}>
                      <Stack direction="row" alignItems="center">
                        <Avatar
                          image={item.profileImgUrl}
                          username={item.userName}
                          type="md"
                        />
                        <Stack ml="12px">
                          <div>{item.userName}</div>
                          <div className={styles.artistName}>
                            @{item.artistName}
                          </div>
                        </Stack>
                      </Stack>
                    </Link>
                  </TableCell>
                  {showDetail && (
                    <TableCell>
                      <button
                        aria-label="seeders button"
                        className={styles.seedersButton}
                        onClick={() => handleSelectAndOpenSeederModal(item)}
                      >
                        <User /> {numberFormat(item.seeders, 0)}
                      </button>
                    </TableCell>
                  )}
                  {showDetail && (
                    <TableCell
                      align="right"
                      sx={{ paddingRight: '80px !important' }}
                    >
                      {numberFormat(item.seed, 2)}
                    </TableCell>
                  )}
                  <TableCell>
                    <SeedingGroupChip group={item.group} />
                  </TableCell>
                  {showDetail && (
                    <TableCell align="center">
                      {item.rewardPercentage}%
                    </TableCell>
                  )}
                  <TableCell className={styles.mySeedValue} align="right">
                    {numberFormat(item.seedAmt, 2)}
                  </TableCell>
                  {isLiveEpisode ? (
                    <TableCell align="right" sx={{ width: 160 }}>
                      <button
                        className={styles.seedUnseedButton}
                        onClick={() => handleSelectAndOpenSeedingModal(item)}
                        disabled={
                          moment().isSameOrAfter(endTimeAt) || disableSeeding
                        }
                      >
                        Seed<span>/</span>Unseed
                      </button>
                    </TableCell>
                  ) : (
                    <TableCell className={styles.mySeedValue} align="right">
                      {item.seedRewardAmt === -1 ? (
                        <Stack
                          alignItems="flex-end"
                          style={{ paddingRight: '30px' }}
                        >
                          <ReceiveReward />
                        </Stack>
                      ) : (
                        numberFormat(item.seedRewardAmt, 5)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className={styles.noItems}>
                <Stack alignItems="center" gap="16px">
                  <History />
                  <div>You don&apos;t have any Seeding history.</div>
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {seedGroupModalOpen && (
        <SeedGroupModal
          open={seedGroupModalOpen}
          onClose={handleCloseSeedGroupModal}
        />
      )}
      {rewardPercentModalOpen && (
        <RewardPercentModal
          open={rewardPercentModalOpen}
          onClose={handleCloseRewardPercentModal}
        />
      )}
      {seederModalOpen && (
        <SeedersModal
          open={seederModalOpen}
          onClose={handleCloseSeederModal}
          episodeNo={selectedPartner?.episodeNo}
          partner={selectedPartner}
          isLiveEpisode={isLiveEpisode}
        />
      )}
      {seedingModalOpen && (
        <SeedingModal
          onClose={handleCloseSeedingModal}
          open={seedingModalOpen}
          menu={menu}
          onSetMenu={setMenu}
          episodeNo={selectedPartner?.episodeNo}
          partner={selectedPartner}
          onRefetch={onRefetch}
        />
      )}
    </>
  );
};

export default MySeedTable;
