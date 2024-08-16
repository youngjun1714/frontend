import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styles from './AlbumCard.module.scss';
import Avatar from '@/components/ui/Avatar/Avatar';
import { Stack } from '@mui/material';
import SeedingGroupChip from '@/components/ui/SeedingGroupChip/SeedingGroupChip';
import User from '@/components/ui/Icons/User';
import GuideButton from '@/components/ui/Button/GuideButton';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import FollowButton from '@/components/ui/Button/FollowButton';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import Seeding from '@/components/ui/Icons/Seeding';
import useOpen from '@/hooks/useOpen';
import moment from 'moment';
import AlbumPicture from './AlbumPicture';
import Link from 'next/link';
import numberFormat from '@/utils/numberFormat';
import dynamic from 'next/dynamic';

const RewardPercentModal = dynamic(() =>
  import('../modals/RewardPercentModal')
);
const SeedGroupModal = dynamic(() => import('../modals/SeedGroupModal'));

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const AlbumCard = ({
  artist,
  me,
  onOpenSeederModal,
  onOpenSeedingModal,
  onCheckConnected,
  onChangePartnerToSeed,
  liveEpisodeEndTimeAt,
  disableSeeding,
  onSelectPicture,
}) => {
  const {
    userName,
    artistName,
    group,
    seeders,
    seed,
    rewardPercentage,
    partnerUserId,
    profileImgUrl,
    artworkPreviewInfos,
  } = artist || {};

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

  // GET_FOLLOWING_STATUS
  const {
    loading: followListLoading,
    data: followListData,
    refetch,
  } = useQuery(GET_FOLLOWING_STATUS, {
    fetchPolicy: 'no-cache',
    variables: {
      userIds: [partnerUserId],
    },
  });

  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];
  const { isFollowedByYou: isFollow } = followInfo || {};

  const [follow] = useFollowUser(partnerUserId);
  const handleFollow = async () => {
    try {
      await follow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow] = useUnfollowUser(partnerUserId);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

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
    <div className={styles.albumCard}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack
          className={styles.artist}
          direction="row"
          alignItems="center"
          mb="16px"
          gap="16px"
        >
          <Link
            aria-label="go to artist detail page"
            href={`/artist/${partnerUserId}?list=artworks`}
          >
            <Avatar image={profileImgUrl} username={userName} type="md" />
          </Link>
          <div>
            <SeedingGroupChip
              group={group}
              GuideButton={<GuideButton onClick={handleOpenSeedGroupModal} />}
            />
            <div className={styles.names}>
              <span className={styles.nickname}>{userName}</span>{' '}
              <span className={styles.artistName}>/ @{artistName}</span>
            </div>
          </div>
        </Stack>
        <Stack direction="row" alignItems="center" gap="8px">
          {me && Number(me?.id) !== partnerUserId && (
            <AuthRequiredButtonWrapper
              onClick={(e) => {
                e.preventDefault();
                if (!isFollow) {
                  handleFollow();
                } else {
                  handleUnfollow();
                }
              }}
            >
              <FollowButton
                data={isFollow}
                disabled={followListLoading}
                style={{ width: 88, height: 32, padding: '0 16px' }}
              />
            </AuthRequiredButtonWrapper>
          )}
          <AuthRequiredButtonWrapper
            onClick={(e) => {
              e.preventDefault();
              handleCheckConnectedAndSeed(artist);
            }}
          >
            <button
              className={styles.seedingButton}
              disabled={
                moment().isSameOrAfter(liveEpisodeEndTimeAt) || disableSeeding
              }
            >
              <Seeding />
              Seed
            </button>
          </AuthRequiredButtonWrapper>
        </Stack>
      </Stack>
      <Stack direction="row" gap="16px">
        <div className={styles.mainImage}>
          <AlbumPicture
            artwork={artworkPreviewInfos?.[0]}
            onSelectPicture={onSelectPicture}
          />
        </div>
        <div style={{ width: '100%' }}>
          <div className={styles.seedingInfos}>
            <div className={styles.seedingInfo}>
              <div className={styles.label}>Seeders</div>
              <div className={styles.value}>
                <button
                  aria-label="seeders button"
                  className={styles.seedersButton}
                  onClick={() => {
                    handleViewSeeders(artist);
                  }}
                >
                  <User />
                  {numberFormat(seeders, 0)}
                </button>
              </div>
            </div>
            <div className={styles.seedingInfo}>
              <div className={styles.label}>
                Seed<span className={styles.adf}>ADF</span>
              </div>
              <div className={styles.value}>{numberFormat(seed, 2)}</div>
            </div>
            <div className={styles.seedingInfo}>
              <div className={styles.label}>
                Reward Percentage
                <GuideButton onClick={handleOpenRewardPercentModal} />
              </div>
              <div className={styles.value}>{rewardPercentage}%</div>
            </div>
          </div>
          <Stack direction="row" gap="16px">
            <div className={styles.image}>
              <AlbumPicture
                artwork={artworkPreviewInfos?.[1]}
                onSelectPicture={onSelectPicture}
              />
            </div>
            <div className={styles.image}>
              <AlbumPicture
                artwork={artworkPreviewInfos?.[2]}
                onSelectPicture={onSelectPicture}
              />
            </div>
          </Stack>
        </div>
      </Stack>
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
    </div>
  );
};
export default AlbumCard;
