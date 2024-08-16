import styles from './MobileArtistDetail.module.scss';
import { useRouter } from 'next/router';

import Avatar from '@/components/ui/Avatar/Avatar';
import MobileArtistInfo from '../MobileArtistInfo/MobileArtistInfo';
import MobileArtistNav from '../MobileArtistNav/MobileArtistNav';
import MobileArtistBio from '../MobileArtistBio/MobileArtistBio';
import MobileArtistPhilosophy from '../MobileArtistPhilosophy/MobileArtistPhilosophy';
import MobileArtistArtworks from '../MobileArtistArtworks/MobileArtistArtworks';
import MobileArtistMyArtworks from '../MobileArtistArtworks/MobileArtistMyArtworks';
import MobileArtistInspiration from '../MobileArtistInspiration/MobileArtistInspiration';
import MobileArtistFavorites from '../MobileArtistFavorites/MobileArtistFavorites';

const MobileArtistDetail = (props) => {
  const { isMe, isPartner, data, artistId } = props;
  const router = useRouter();
  const { query } = router;

  const { list = isPartner ? 'artworks' : 'inspiration', tab = 'artworks' } =
    query;

  const { partner } = data || {};
  const { bio, philosophy } = partner || {};

  const handleChangeMenu = (value) => {
    router.push(
      {
        pathname: `/artist/${artistId}`,
        query: { list: value },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  const handleChangeTab = (value) => {
    router.push(
      {
        pathname: `/artist/${artistId}`,
        query: { list, tab: value },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.avatarWrapper}>
        <Avatar
          type="mobile-lg"
          username={data?.nickname}
          image={data?.profileImgUrl}
          isSetting={isMe}
        />
      </div>
      <MobileArtistInfo
        userId={artistId}
        isMe={isMe}
        isPartner={isPartner}
        partner={partner}
        nickName={data?.nickname}
        artistName={partner?.artistName}
        wallet={data?.wallet}
        follower={data?.followerCount}
        following={data?.followingCount}
      />

      <MobileArtistNav
        isMe={isMe}
        isPartner={isPartner}
        menu={list}
        onClick={handleChangeMenu}
      />

      <article className={styles.contents}>
        {list === 'short-bio' && <MobileArtistBio data={bio} />}
        {list === 'philosophy' && <MobileArtistPhilosophy data={philosophy} />}
        {list === 'artworks' ? (
          isMe ? (
            <MobileArtistMyArtworks artistId={data?.id} />
          ) : (
            <MobileArtistArtworks artistId={data?.id} />
          )
        ) : (
          <></>
        )}
        {list === 'inspiration' && (
          <MobileArtistInspiration artistId={data?.id} isMe={isMe} />
        )}
        {list === 'favorites' && (
          <MobileArtistFavorites
            artistId={data?.id}
            tab={tab}
            onClick={handleChangeTab}
          />
        )}
      </article>
    </section>
  );
};

export default MobileArtistDetail;
