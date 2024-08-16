import { useState, useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import styles from './MobileArtworkTitle.module.scss';
import moment from 'moment';

import { Menu } from '@mui/material';

import Avatar from '@/components/ui/Avatar/Avatar';
import MobileFollowButton from '@/components/mobile-ui/MobileFollowButton/MobileFollowButton';
import MobileMoreButtonIcon from '@/components/mobile-ui/MobileIcons/MobileMoreButtonIcon';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import MobileDropdown from '@/components/mobile-ui/MobileDropdown/MobileDropdown';
import MobileDropdownRow from '@/components/mobile-ui/MobileDropdown/MobileDropdownRow';
import { customToast } from '@/utils/customToast';
import dynamic from 'next/dynamic';

const MobileReport = dynamic(() =>
  import('@/components/mobile-ui/MobileReport/MobileReport')
);

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const SHOW_ARTWORK = gql`
  mutation ShowArtwork($artworkId: ID!) {
    showArtwork(artworkId: $artworkId) {
      artworkId
      isArtisideVisible
      artisideHiddenAt
    }
  }
`;

const HIDE_ARTWORK = gql`
  mutation HideArtwork($artworkId: ID!) {
    hideArtwork(artworkId: $artworkId) {
      artworkId
      isArtisideVisible
      artisideHiddenAt
    }
  }
`;

const MobileArtworkTitle = (props) => {
  const { data, creator, isMe } = props;

  // Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Dropdown menu select
  const [select, setSelect] = useState('');

  // Data Fetching : follow info
  const [
    updateFollowingStatus,
    {
      loading: followListLoading,
      data: followListData,
      refetch: followListRefetch,
    },
  ] = useLazyQuery(GET_FOLLOWING_STATUS);

  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  // isReadyData (FollowStatus)
  useEffect(() => {
    if (creator) {
      updateFollowingStatus({
        variables: {
          userIds: [creator.id],
        },
      });
    }
  }, [creator]);

  // update (FollowState)
  useEffect(() => {
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [followInfo]);

  // for Mutation
  // Follow
  const [follow, { loading: isFollowLoading }] = useFollowUser(creator?.id);
  const handleFollow = async () => {
    try {
      await follow({ variables: { userId: creator?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  // Unfollow
  const [unfollow, { loading: isUnfollowLoading }] = useUnfollowUser(
    creator?.id
  );
  const handleUnfollow = async () => {
    try {
      await unfollow({ variables: { userId: creator?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelect = (menu) => {
    setSelect(menu);
    setAnchorEl('');
  };

  const [showArtwork] = useMutation(SHOW_ARTWORK, {
    variables: {
      artworkId: data?.artworkId,
    },
    refetchQueries: ['getArtworks'],
  });

  const [hideArtwork] = useMutation(HIDE_ARTWORK, {
    variables: {
      artworkId: data?.artworkId,
    },
    refetchQueries: ['getArtworks'],
  });

  const handleShow = () => {
    setAnchorEl(null);
    showArtwork();
  };

  const handleHide = () => {
    setAnchorEl(null);
    hideArtwork();
    customToast({
      msg: <>Hidden</>,
    });
  };

  return (
    <div className={styles.mobileTitle}>
      <h1>{data?.name}</h1>
      <div className={styles.mobileInfoSection}>
        <Link href={`/artist/${creator?.id}?list=artworks`}>
          <div className={styles.left}>
            <Avatar
              type="sm"
              username={creator?.nickname}
              image={creator?.profileImgUrl}
            />
            <h1>
              {creator?.nickname}{' '}
              <span>· {moment(data?.createdAt).fromNowOrNow()}</span>
            </h1>
          </div>
        </Link>

        <div className={styles.right}>
          {!isMe && (
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
              <MobileFollowButton
                isFollow={isFollow}
                width="unset"
                icon={false}
              />
            </AuthRequiredButtonWrapper>
          )}
          {isMe && (
            <button
              className={styles.moreButton}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="more"
            >
              <MobileMoreButtonIcon />
            </button>
          )}

          <Menu
            sx={{
              '&.MuiPopover-root': {
                zIndex: '1600 !important',
                backgroundColor: 'transparent !important',
              },
              '& > .MuiPaper-root': {
                borderRadius: '10px !important',
                backgroundColor: 'transparent !important',
                boxShadow: '0px 10px 60px 0px rgba(59, 59, 59, 0.3)',
                '& > .MuiMenu-list': {
                  paddingTop: '0 !important',
                  paddingBottom: '0 !important',
                },
              },
              '& > .MuiList-root': {
                backgroundColor: 'transparent !important',
                borderRadius: '10px !important',
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MobileDropdown>
              {data?.isArtisideVisible ? (
                <MobileDropdownRow title="hide" onClick={() => handleHide()} />
              ) : (
                <MobileDropdownRow
                  title="show"
                  onClick={() => {
                    handleShow();
                    customToast({
                      msg: <>Shown</>,
                    });
                  }}
                />
              )}
            </MobileDropdown>
          </Menu>
        </div>
        {select === 'report' && (
          <MobileReport
            open={select === 'report'}
            onClose={() => setSelect('')}
          />
        )}
      </div>
    </div>
  );
};

export default MobileArtworkTitle;
