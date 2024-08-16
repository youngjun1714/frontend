import React, { useState, useEffect } from 'react';
import styles from '@/views/artist/components/artist-info-card/artist-info-card-info-wrapper/ArtistInfoCardInfoWrapper.module.scss';
import { gql, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { Tooltip } from '@mui/material';

import stores from '@/store';

import Button from '@/components/ui/Button/Button';
import FollowButton from '@/components/ui/Button/FollowButton';
import ArtistInfoCardFollows from '../artist-info-card-follows/ArtistInfoCardFollows';
import CopyButton from '@/components/ui/CopyButton/CopyButton';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import ArtistInfoCardSns from '../artist-info-card-sns/ArtistInfoCardSns';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import PartnerHelper from '@/components/tooltip/PartnerHelper/PartnerHelper';
import IsArtist from '@/components/ui/Icons/IsArtist';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

function ArtistInfoCardInfoWrapper(props) {
  const { isMe, isPartner, data, userLoading, userId } = props;
  const { partner, wallet } = data || {};

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // Modal open
  const [open, setOpen] = useState(false);
  const handleOpen = (value) => {
    setOpen(value);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // GET_FOLLOWING_STATUS
  const {
    loading: folloListLoading,
    data: followListData,
    refetch: followListRefetch,
  } = useQuery(GET_FOLLOWING_STATUS, {
    variables: {
      userIds: [userId],
    },
    fetchPolicy: 'cache-and-network',
  });

  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [followInfo]);

  // mutation
  const [follow, { loading: followLoading }] = useFollowUser(userId);
  const handleFollow = async () => {
    try {
      await follow();
      setIsFollow(true);
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow, { loading: unfollowLoading }] = useUnfollowUser(userId);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      setIsFollow(false);
    } catch (e) {
      console.log(e);
    }
  };

  const { openModalPage } = useConnectModalContext();

  const { instagram, twitter, facebook, discord, youtube } = partner || {};
  const hasSns =
    !!instagram?.trim() ||
    !!twitter?.trim() ||
    !!facebook?.trim() ||
    !!discord?.trim() ||
    !!youtube?.trim();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {userLoading ? (
          <Skeleton width={260} height={32} />
        ) : (
          <h1>
            {data?.nickname} {data?.isPartner && <IsArtist />}
          </h1>
        )}
        {userLoading ? (
          <Skeleton width={160} height={22} />
        ) : (
          data?.isPartner && <p>@{partner?.artistName}</p>
        )}
        {/* {data?.isPartner && <p>@{partner?.artistName}</p>} */}
        {/* {isMe && (
          <div
            style={{
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {!isPartner && (
              <p style={{ color: 'var(--artiside-neutral2)' }}>{data?.email}</p>
            )}
          </div>
        )} */}
      </div>
      <div className={styles.cardCenter}>
        <div
          className={styles.numbers}
          style={{
            borderBottom: isPartner
              ? '1px solid var(--artiside-neutral5)'
              : 'none',
          }}
        >
          <p onClick={() => handleOpen('follower-list')}>
            Followers <span>{data?.followerCount || 0}</span>
          </p>
          <p onClick={() => handleOpen('following-list')}>
            Following <span>{data?.followingCount || 0}</span>
          </p>
          <p>
            Posts{' '}
            <span>
              {(data?.postCount || 0) + (data?.artworkCreatedCount || 0)}
            </span>
          </p>
        </div>
        {/* {isPartner && (
          <div className={styles.email}>
            <EmailIcon />
            <div>{data?.email}</div>
          </div>
        )} */}
      </div>
      <div className={styles.cardBottom}>
        {!isMe && !isPartner && (
          <AuthRequiredButtonWrapper
            onClick={() => {
              if (!isFollow) {
                handleFollow();
              } else {
                handleUnfollow();
              }
            }}
          >
            <FollowButton
              data={isFollow}
              style={{ width: '100%', height: 48, fontSize: 16 }}
              svgSize={24}
            />
          </AuthRequiredButtonWrapper>
        )}

        {isMe && !isPartner && (
          <div
            className={styles.partnerHelper}
            type="primary"
            size="sm"
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_PARTNERS_URL);
            }}
          >
            Upgrade to Partner
            <Tooltip title={<PartnerHelper />} placement="top" arrow>
              <span>
                <QuestionCircle />
              </span>
            </Tooltip>
          </div>
        )}

        {wallet ? (
          <div className={styles.copyButton}>
            <span>
              {wallet?.slice(0, 6)}...
              {wallet?.slice(wallet?.length - 6)}
            </span>
            <CopyButton text={wallet} />
          </div>
        ) : isMe ? (
          <Button
            className={styles.needHover}
            type="secondary"
            size="sm"
            onClick={() => openModalPage('ADD_WALLET')}
          >
            Connect Wallet
          </Button>
        ) : (
          <></>
        )}

        {isPartner && hasSns && (
          <ArtistInfoCardSns
            instagram={instagram}
            twitter={twitter}
            youtube={youtube}
            facebook={facebook}
            discord={discord}
          />
        )}
      </div>

      {(open === 'follower-list' || open === 'following-list') && (
        <ArtistInfoCardFollows
          onClose={handleClose}
          open={open}
          userId={userId}
        />
      )}
    </div>
  );
}

export default ArtistInfoCardInfoWrapper;
