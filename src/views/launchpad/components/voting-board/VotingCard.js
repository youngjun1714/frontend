import styles from './index.module.scss';
import Link from 'next/link';
import { Stack } from '@mui/material';
import Avatar from '@/components/ui/Avatar/Avatar';
import ArtistVideoWrap from './ArtistVideoWrap';
import CheckSquare from '@/components/ui/Icons/CheckSquare';
import Verified from '@/components/ui/Icons/Verified';

const VotingCard = ({
  artist,
  onSelectArtwork,
  onClickVoteBtn,
  hideVoteBtn,
}) => {
  const { userId, nickname, artistName, profileImgUrl, candidatePartnerInfo } =
    artist || {};

  const { promotionThumbnailUrl, promotionVideoUrl, intro } =
    candidatePartnerInfo || {};

  return (
    <div className={styles.votingCard}>
      <ArtistVideoWrap
        artwork={{
          artworkUrl: promotionVideoUrl,
          mediaType: 'VIDEO',
          thumbnailUrl: promotionThumbnailUrl,
          title: nickname,
        }}
        onSelectArtwork={onSelectArtwork}
      />
      <div className={styles.flexDiv}>
        <Link href={`/artist/${userId}?list=artworks`}>
          <Stack direction="row" alignItems="center">
            <Avatar image={profileImgUrl} username={nickname} type="mdl" />
            <Stack mx="12px">
              <Stack direction="row" alignItems="center">
                <div className={styles.userName}>{nickname}</div>
                <Verified />
              </Stack>
              <div className={styles.artistName}>@{artistName}</div>
            </Stack>
          </Stack>
        </Link>
        {hideVoteBtn ? (
          <></>
        ) : (
          <button className={styles.voteBtn} onClick={onClickVoteBtn}>
            <CheckSquare /> Vote
          </button>
        )}
      </div>
      <div className={styles.shortBio}>
        <b>Short Bio</b>
        <br />
        {intro}
      </div>
    </div>
  );
};

export default VotingCard;
