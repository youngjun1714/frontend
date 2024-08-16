import styles from './MobileArtworkInteraction.module.scss';

import MobileInteractionSmallIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionSmallIcon';
import MobileInteractionLargeIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionLargeIcon';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import useBookmarkArtwork from '@/hooks/useBookmarkArtwork';
import { customToast } from '@/utils/customToast';
import shareArticle from '@/utils/shareArticle';

const MobileArtworkInteraction = (props) => {
  const { artworkId, likeCount, viewCount, onCommentOpen, isBookmarked } =
    props;

  const [bookmark, { loading: isBookmarkLoading }] =
    useBookmarkArtwork(artworkId);
  const handleBookmark = async () => {
    const { data } = await bookmark();
    const { bookmarkArtwork } = data;
    if (bookmarkArtwork.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  return (
    <article className={styles.container}>
      <div className={styles.left}>
        <div>
          <MobileInteractionSmallIcon shape="clap" />
          <span>{likeCount || 0}</span>
        </div>
        <div>
          <MobileInteractionSmallIcon shape="view" />
          <span>{viewCount || 0}</span>
        </div>
      </div>

      <div className={styles.right}>
        <button onClick={onCommentOpen} aria-label="comment">
          <MobileInteractionLargeIcon shape="comment" />
        </button>
        <AuthRequiredButtonWrapper onClick={handleBookmark}>
          <button aria-label="bookmark">
            <MobileInteractionLargeIcon
              shape="bookmark"
              isBookmarked={isBookmarked}
            />
          </button>
        </AuthRequiredButtonWrapper>
        <button
          onClick={() => {
            try {
              shareArticle(artworkId, 'artwork');
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
    </article>
  );
};

export default MobileArtworkInteraction;
