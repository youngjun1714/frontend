import styles from '@/components/ui/Card/FeedCard/FeedCard.module.scss';
import moment from 'moment';

import Avatar from '@/components/ui/Avatar/Avatar';

import useLikeArtwork from '@/hooks/useLikeArtwork';
import Link from 'next/link';
import useBookmarkArtwork from '@/hooks/useBookmarkArtwork';
import { customToast } from '@/utils/customToast';
import BookmarkOutline from '../../Icons/BookmarkOutline';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import shareArticle from '@/utils/shareArticle';
import MobileVerticalMoreIcon from '@/components/mobile-ui/MobileIcons/MobileVerticalMoreIcon';
import MobileIsPartnerBadge from '@/components/mobile-ui/MobileIcons/MobileIsPartnerBadge';
import MobileArtworkBadge from '@/components/mobile-ui/MobileIcons/MobileArtworkBadge';
import ClapOutline from '../../Icons/ClapOutline';
import Share from '../../Icons/Share';
import CommentFilled from '../../Icons/CommentFilled';
import ViewFilled from '../../Icons/ViewFilled';
import ClapFilled from '../../Icons/ClapFilled';
import Verified from '../../Icons/Verified';
import RedLabelBadge from '../../Icons/RedLabelBadge';
import Boosted from '../../Icons/Boosted';
import MobileClapIcon from '@/components/mobile-ui/MobileIcons/MobileClapIcon';
import MobileInteractionLargeIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionLargeIcon';
import Media from '../../Media/Media';

const ArtworkFeedCard = ({ artwork }) => {
  // artwork Image
  const [likeSubmit, { loading: likeLoading }] = useLikeArtwork(
    artwork.artworkId
  );
  const [bookmarkSubmit, { loading: bookmarkLoading }] = useBookmarkArtwork(
    artwork.artworkId
  );
  const handleLike = () => likeSubmit();
  const handleBookmark = async () => {
    const { data } = await bookmarkSubmit();
    const { bookmarkArtwork } = data;
    if (bookmarkArtwork.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  const { creator } = artwork;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.link}>
          <Link href={`/artist/${creator?.id}`}>
            <Avatar
              type="mobile-md"
              image={creator.profileImgUrl}
              username={creator.nickname}
            />
          </Link>

          <Link href={`/artist/${creator?.id}`}>
            <div className={styles.user}>
              <div className={styles.author}>
                {creator.nickname}&nbsp;
                <Verified /> &nbsp;
                <span>
                  · {moment(artwork.importedAt).fromNowOrNow()}
                  {/* {!!artwork?.lastBoostedAt && (
                  <>, Boosted {moment(artwork?.lastBoostedAt).fromNowOrNow()}</>
                )} */}
                </span>
              </div>
              <div className={styles.nickname}>@{creator.artistName}</div>
            </div>
          </Link>
        </div>
        <div className={styles.artworkBadge}>
          <h1>Artwork</h1>
        </div>
        <div className={styles.mobileArtworkBadge}>
          <MobileArtworkBadge />
        </div>
      </div>

      <div className={styles.cardImage}>
        {/* <div className={styles.badge}>
          <RedLabelBadge />
        </div> */}
        <Link href={`/artwork/${artwork.artworkId}`}>
          <div className={styles.imageWrapper}>
            <Media
              url={artwork.artworkUrl}
              mediaType={artwork.mediaType}
              objectFit="cover"
              alt={artwork.name}
              placeholder="blur"
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              sizes="(max-width: 768px) 80vw, (max-width: 900px) 33vw, 500px"
              className={styles.image}
            />
          </div>
        </Link>
      </div>
      <div className={styles.cardBottom}>
        <div>
          <div className={styles.count}>
            <ClapFilled />
            {artwork.likeCount || 0}
          </div>
          <div className={styles.count}>
            <ViewFilled />
            {artwork.viewCount || 0}
          </div>
          <div className={styles.count}>
            <CommentFilled />
            {artwork.commentCount || 0}
          </div>
          {/* {artwork?.boostedCount > 0 && (
            <div>
              <Boosted />
              {artwork.boostedCount || 0}
            </div>
          )} */}
        </div>
        <div className={styles.interactionButton}>
          <AuthRequiredButtonWrapper
            onClick={() => {
              handleLike();
            }}
          >
            <button
              className={artwork.isLiked ? styles.isLiked : ''}
              aria-label="like"
            >
              <MobileInteractionLargeIcon
                shape="clap"
                isLiked={artwork.isLiked}
              />
            </button>
          </AuthRequiredButtonWrapper>
          <AuthRequiredButtonWrapper onClick={() => handleBookmark()}>
            <button
              className={artwork.isBookmarked ? styles.isBookmarked : ''}
              aria-label="bookmark"
            >
              <MobileInteractionLargeIcon
                shape="bookmark"
                isBookmarked={artwork.isBookmarked}
              />
            </button>
          </AuthRequiredButtonWrapper>
          <button
            onClick={() => {
              try {
                shareArticle(artwork?.artworkId, 'artwork');
                customToast({
                  msg: <>Copied</>,
                });
              } catch (e) {
                console.log(e);
                customToast({
                  toastType: 'error',
                  msg: <>Error</>,
                });
              }
            }}
            aria-label="share"
          >
            <MobileInteractionLargeIcon shape="share" />
          </button>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h1>{artwork.name}</h1>
        <div>
          <p className={styles.about}>{artwork.artworkInfo.about}</p>
          {artwork.artworkInfo.about.length > 192 && (
            <Link href={`/artwork/${artwork.artworkId}`}>
              <button className={styles.moreView} aria-label="more" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArtworkFeedCard;
