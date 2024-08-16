import { useState, useEffect } from 'react';
import styles from './MobileArtistInfo.module.scss';
import { gql, useQuery } from '@apollo/client';

import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import CopyButton from '@/components/ui/CopyButton/CopyButton';
import MobileIsPartnerBadge from '@/components/mobile-ui/MobileIcons/MobileIsPartnerBadge';
import MobileLinkIcon from '@/components/mobile-ui/MobileIcons/MobileLinkIcon';
import MobileFollowIcon from '@/components/mobile-ui/MobileIcons/MobileFollowIcon';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import dynamic from 'next/dynamic';

const MobileArtistFollow = dynamic(() =>
  import('../MobileArtistFollow/MobileArtistFollow')
);
const MobilePartnersHelper = dynamic(() => import('./MobilePartnersHelper'));
const MobileSnsLinks = dynamic(() =>
  import('../MobileSnsLinks/MobileSnsLinks')
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

const MobileArtistInfo = (props) => {
  const {
    userId,
    isMe,
    nickName,
    artistName,
    wallet,
    follower,
    following,
    isPartner,
    partner,
  } = props;

  const [linkOpen, setLinkOpen] = useState(false);
  const [helperOpen, setHelperOpen] = useState(false);
  const [followOpen, setFollowOpen] = useState('');

  const handleChangeNav = (value) => {
    setFollowOpen(value);
  };

  const { loading, data: followListData } = useQuery(GET_FOLLOWING_STATUS, {
    variables: {
      userIds: [userId],
    },
  });
  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  const [follow, { loading: isFollowLoading }] = useFollowUser(userId);
  const handleFollow = async () => {
    try {
      await follow({ variables: { userId } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Mutation: unfollow
   */
  const [unfollow, { loading: isUnfollowLoading }] = useUnfollowUser(userId);
  const handleUnfollow = async () => {
    try {
      await unfollow({ variables: { userId } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [loading, followInfo]);

  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <div className={styles.nameWrapper}>
          <div className={styles.name}>
            <h1>
              {nickName} {isPartner && <MobileIsPartnerBadge />}
            </h1>
            {isPartner && <h2>@{artistName}</h2>}
          </div>
          {wallet && (
            <div className={styles.walletWrapper}>
              <div className={styles.wallet}>
                <h1>
                  {wallet?.slice(0, 6)}...{wallet?.slice(wallet.length - 6)}
                </h1>
                <CopyButton text={wallet} height="fit-content" />
              </div>
              {isPartner && (
                <button
                  className={styles.link}
                  onClick={() => setLinkOpen(true)}
                  aria-label="open link"
                >
                  <MobileLinkIcon />
                </button>
              )}
              {linkOpen && (
                <MobileSnsLinks
                  open={linkOpen}
                  onClose={() => setLinkOpen(false)}
                  instagram={partner?.instagram}
                  discord={partner?.discord}
                  twitter={partner?.twitter}
                  youtube={partner?.youtube}
                />
              )}
            </div>
          )}
        </div>

        <div className={styles.follow}>
          <div
            className={styles.row}
            onClick={() => setFollowOpen('followers')}
          >
            <h1>Followers</h1>
            <h2>{follower}</h2>
          </div>
          <div className={styles.line} />
          <div
            className={styles.row}
            onClick={() => setFollowOpen('following')}
          >
            <h1>Following</h1>
            <h2>{following}</h2>
          </div>
        </div>
        {followOpen && (
          <MobileArtistFollow
            open={followOpen}
            onChangeNav={handleChangeNav}
            onClose={() => setFollowOpen(false)}
            userId={userId}
            isMe={isMe}
          />
        )}

        {!isMe && (
          <AuthRequiredButtonWrapper
            onClick={(e) => {
              if (!isFollow) {
                handleFollow();
              } else {
                handleUnfollow();
              }
            }}
          >
            <div
              className={
                isFollow ? `${styles.button} ${styles.isFollow}` : styles.button
              }
            >
              {isFollow ? (
                'Following'
              ) : (
                <>
                  <MobileFollowIcon /> Follow
                </>
              )}
            </div>
          </AuthRequiredButtonWrapper>
        )}

        {/* {isMe && (
          <div
            className={`${styles.button} ${styles.partnerButton}`}
            onClick={() => {
              if (!isPartner) {
                setHelperOpen(true);
              } else {
                window.open('https://partners.artdefinance.io');
              }
            }}
          >
            {isPartner ? (
              <>Go to Partner Site</>
            ) : (
              <>
                Upgrade to Partner <MobilePartnerTooltipIcon />
              </>
            )}
          </div>
        )} */}
        {helperOpen && (
          <MobilePartnersHelper
            open={helperOpen}
            onClose={() => setHelperOpen(false)}
          />
        )}
      </div>
    </article>
  );
};

export default MobileArtistInfo;

MobileArtistInfo.defaultProps = {
  follower: 0,
  following: 0,
};
