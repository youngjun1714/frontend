import styles from './ArtistInfoTooltip.module.scss';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import Avatar from '@/components/ui/Avatar/Avatar';
import SeedingButton from '../Button/SeedingButton';

import stores from '@/store';
import formatNumberToShortScale from '@/utils/formatNumberToShortScale';

import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import FollowButton from '@/components/ui/Button/FollowButton';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import IsArtist from '../Icons/IsArtist';
import Media from '../Media/Media';
import Picture from '../Picture/Picture';
import { useRouter } from 'next/router';

const GET_ARTWORKS = gql`
  query getArtworks($userId: ID, $take: Int) {
    getArtworks(userId: $userId, take: $take) {
      pageInfo {
        totalCount
      }
      artworks {
        artworkId
        name
        artworkUrl
        thumbnailUrl
        mediaType
      }
    }
  }
`;

const GET_POSTS = gql`
  query getPosts($userId: ID, $take: Int) {
    getPosts(userId: $userId, take: $take) {
      pageInfo {
        totalCount
      }
      posts {
        id
        title
        mainImage
      }
    }
  }
`;

const TAKE = 4;

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      wallet
      nickname
      profileImgUrl
      coverImgUrl
      followingCount
      followerCount
      artworkCreatedCount
      artworkOwnedCount
      artworkCreatedAndOwnedCount
      postCount
      bookmarkArtworkCount
      bookmarkPostCount
      isPartner
      createdAt
      partner {
        artistName
        birth
        instagram
        facebook
        twitter
        youtube
        discord
        bio {
          intro
          artStyle
          representativeArtwork
          rememberAs
          recommendArtist
          futureActivities
        }
        philosophy {
          values
          consideration
          message
          goodArtwork
        }
      }
    }
  }
`;

function ArtistInfoTooltip(props) {
  const { userId, isPartner } = props;
  const router = useRouter();
  // me
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const { loading, data } = useQuery(GET_USER, {
    variables: {
      userId,
    },
    notifyOnNetworkStatusChange: true,
  });

  const { getUser: user } = data || {};

  // GET_FOLLOWING_STATUS
  const {
    loading: followListLoading,
    data: followListData,
    refetch,
  } = useQuery(GET_FOLLOWING_STATUS, {
    fetchPolicy: 'no-cache',
    variables: {
      userIds: [userId],
    },
  });

  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];
  const { isFollowedByYou: isFollow } = followInfo || {};

  const [follow] = useFollowUser(userId);
  const handleFollow = async () => {
    try {
      await follow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const [unfollow] = useUnfollowUser(userId);
  const handleUnfollow = async () => {
    try {
      await unfollow();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  const { data: artworksData } = useQuery(GET_ARTWORKS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: userId,
      take: TAKE,
    },
  });
  const { getArtworks } = artworksData || {};
  const { artworks } = getArtworks || {};

  const { data: postsData } = useQuery(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: userId,
      take: TAKE,
    },
  });
  const { getPosts } = postsData || {};
  const { posts } = getPosts || {};

  if (isPartner) {
    return (
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Link href={`/artist/${userId}?list=artworks`}>
            {loading && <Skeleton className="avatar" />}
            {!loading && (
              <Avatar
                type="lg"
                border={true}
                username={user.nickname}
                image={user.profileImgUrl}
              />
            )}
          </Link>
          <Link href={`/artist/${userId}?list=artworks`}>
            <div className={styles.name}>
              <h1>
                {loading && <Skeleton />}
                {!loading && user.nickname} <IsArtist />
              </h1>
              <h2>
                {loading && <Skeleton />}
                {!loading && user.artistName}
              </h2>
            </div>
          </Link>
        </div>

        <div className={styles.numbers}>
          <div className={styles.column}>
            <h1>
              {formatNumberToShortScale((user || {}).artworkCreatedCount || 0)}
            </h1>
            <h2>Artworks</h2>
          </div>
          {/* <div className={styles.column}>
            <h1>0</h1>
            <h2>Patrons</h2>
          </div> */}
          <div className={styles.column}>
            <h1>{formatNumberToShortScale((user || {}).postCount || 0)}</h1>
            <h2>Inspiration</h2>
          </div>
          <div className={styles.column}>
            <h1>{formatNumberToShortScale((user || {}).followerCount || 0)}</h1>
            <h2>Followers</h2>
          </div>
        </div>

        <div className={styles.contents}>
          {(artworks || []).length === 0 && <h1>No artworks :)</h1>}
          {(artworks || []).map((item) => (
            <Link
              key={`inspiration-artwork-${item.artworkId}`}
              href={`/artwork/${item?.artworkId}`}
            >
              <div className={styles.picture}>
                <Media
                  url={item.artworkUrl}
                  mediaType={item.mediaType}
                  objectFit="cover"
                  alt={item.name}
                  sizes="(max-width: 768px) 33vw, 10vw"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          {me?.id !== userId && (
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
                style={{ width: '100%', height: 48, fontSize: 16 }}
                svgSize={24}
              />
            </AuthRequiredButtonWrapper>
          )}
          <Link href={`/artist/${userId}?list=artworks`}>
            <SeedingButton />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        {loading && <Skeleton className="avatar" />}
        {!loading && (
          <Link href={`/artist/${userId}?list=inspiration`}>
            <Avatar
              type="lg"
              border={true}
              username={user.nickname}
              image={user.profileImgUrl}
            />
          </Link>
        )}
        <Link href={`/artist/${userId}?list=inspiration`}>
          <div className={styles.name}>
            <h1>
              {loading && <Skeleton />}
              {!loading && user.nickname}
            </h1>
          </div>
        </Link>
      </div>

      <div className={styles.numbers} style={{ justifyContent: 'center' }}>
        <div className={styles.column}>
          <h1>{formatNumberToShortScale((user || {}).postCount || 0)}</h1>
          <h2>Inspiration</h2>
        </div>
        <div className={styles.column}>
          <h1>{formatNumberToShortScale((user || {}).followerCount || 0)}</h1>
          <h2>Followers</h2>
        </div>
      </div>

      <div className={styles.contents}>
        {(posts || []).length === 0 && <h1>No Inspirations :)</h1>}
        {(posts || []).map((post) => (
          <Link key={post.id} href={`/inspiration/${post.id}`}>
            <div className={styles.picture}>
              <Picture
                url={post.mainImage}
                alt={post.title}
                sizes="(max-width: 768px) 33vw, 10vw"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        {me?.id !== userId && (
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
              style={{ width: '100%', height: 48, fontSize: 16 }}
              svgSize={24}
            />
          </AuthRequiredButtonWrapper>
        )}
      </div>
    </div>
  );

  // return (
}

export default ArtistInfoTooltip;
