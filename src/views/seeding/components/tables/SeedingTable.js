import React, { Fragment } from 'react';
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
import GuideButton from '@/components/ui/Button/GuideButton';
import styles from './Table.module.scss';
import User from '@/components/ui/Icons/User';
import SeedingGroupChip from '@/components/ui/SeedingGroupChip/SeedingGroupChip';
import useOpen from '@/hooks/useOpen';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import Link from 'next/link';
import numberFormat from '@/utils/numberFormat';
import Seeding from '@/components/ui/Icons/Seeding';
import moment from 'moment';
import InfoFill from '@/components/ui/Icons/InfoFill';
import dynamic from 'next/dynamic';

const RewardPercentModal = dynamic(() =>
  import('../modals/RewardPercentModal')
);
const SeedGroupModal = dynamic(() => import('../modals/SeedGroupModal'));

const SeedingTable = ({
  items,
  onOpenSeederModal,
  onOpenSeedingModal,
  onChangePartnerToSeed,
  isLiveEpisode,
  liveEpisodeEndTimeAt,
  onCheckConnected,
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

  const handleCheckConnectedAndSeed = (partner) => {
    onCheckConnected(() => {
      onChangePartnerToSeed(partner);
      onOpenSeedingModal();
    });
  };

  const handleViewSeeders = (partner) => {
    onChangePartnerToSeed(partner);
    onOpenSeederModal();
  };

  return (
    <>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '35%' }}>Artists</TableCell>
            <TableCell>Seeders</TableCell>
            <TableCell align="right" sx={{ paddingRight: '110px !important' }}>
              Seed <span className={styles.adf}>ADF</span>
            </TableCell>
            <TableCell align="center">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                Group
                <GuideButton onClick={handleOpenSeedGroupModal} />
              </Stack>
            </TableCell>
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
            {isLiveEpisode && (
              <TableCell align="right" sx={{ width: 108 }}></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && !items?.length ? (
            <TableRow>
              <TableCell colSpan={6} className={styles.noItems}>
                <Stack alignItems="center" gap="16px">
                  <CircularProgress
                    sx={{
                      color: 'var(--primary-color)',
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            items?.map((item, idx) => (
              <Fragment key={`partners-${idx}`}>
                <TableRow hover>
                  <TableCell sx={{ width: '35%' }} className={styles.hoverCell}>
                    <Link href={`/artist/${item.partnerUserId}?list=artworks`}>
                      <Stack direction="row" alignItems="center">
                        <Avatar
                          image={item?.profileImgUrl}
                          username={item?.userName}
                          type="md"
                        />
                        <Stack mx="12px">
                          <div>{item.userName}</div>
                          <div className={styles.artistName}>
                            @{item.artistName}
                          </div>
                        </Stack>
                        <InfoFill />
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell className={styles.hoverCell}>
                    <Stack justifyContent="center">
                      <button
                        aria-label="seeders button"
                        className={styles.seedersButton}
                        onClick={() => {
                          handleViewSeeders(item);
                        }}
                      >
                        <User /> {numberFormat(item.seeders, 0)}
                        <Stack justifyContent="center" ml="6px">
                          <InfoFill />
                        </Stack>
                      </button>
                    </Stack>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ paddingRight: '110px !important' }}
                  >
                    {numberFormat(item.seed, 2)}
                  </TableCell>
                  <TableCell align="center">
                    <SeedingGroupChip group={item.group} />
                  </TableCell>
                  <TableCell align="center">{item.rewardPercentage}%</TableCell>
                  {isLiveEpisode && (
                    <TableCell align="right" sx={{ width: 108 }}>
                      <AuthRequiredButtonWrapper
                        onClick={() => {
                          handleCheckConnectedAndSeed(item);
                        }}
                        disabled={moment().isSameOrAfter(liveEpisodeEndTimeAt)}
                      >
                        <button
                          className={styles.seedingButton}
                          disabled={
                            moment().isSameOrAfter(liveEpisodeEndTimeAt) ||
                            disableSeeding
                          }
                        >
                          <Seeding /> Seed
                        </button>
                      </AuthRequiredButtonWrapper>
                    </TableCell>
                  )}
                </TableRow>
              </Fragment>
            ))
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
    </>
  );
};

export default SeedingTable;
