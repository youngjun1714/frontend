import styles from './ArtworkCardHoverPanel.module.scss';

import Avatar from '@/components/ui/Avatar/Avatar';
import useLikeArtwork from '@/hooks/useLikeArtwork';
import useLikePost from '@/hooks/useLikePost';
import useBookmarkArtwork from '@/hooks/useBookmarkArtwork';
import useBookmarkPost from '@/hooks/useBookmarkPost';
import shareArticle from '@/utils/shareArticle';
import { customToast } from '@/utils/customToast';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import BookmarkOutline from '../../Icons/BookmarkOutline';
import ClapOutline from '../../Icons/ClapOutline';
import SeedingOutline from '../../Icons/SeedingOutline';
import Share from '../../Icons/Share';
import ClapFilled from '../../Icons/ClapFilled';
import IsArtist from '../../Icons/IsArtist';

function ArtworkCardHoverPanel(props) {
  const { onClick, type, data } = props;

  const [artworkLike, { loading }] = useLikeArtwork(data?.artworkId);
  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    artworkLike();
  };

  const [artworkBookmark, { loading: bookmarkLoading }] = useBookmarkArtwork(
    data?.artworkId
  );
  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = await artworkBookmark();
    const { bookmarkArtwork } = data;
    if (bookmarkArtwork.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  const [postLike, { loading: postLikeLoading }] = useLikePost(data?.id);
  const handlePostLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    postLike(e);
  };

  const [postBookmark, { loading: postBookmarkLoading }] = useBookmarkPost(
    data?.id
  );
  const handlePostBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = await postBookmark();
    const { bookmarkPost } = data;
    if (bookmarkPost.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  if (type === 'inspiration') {
    return (
      <div className={styles.panel}>
        <div className={styles.title}>
          <h1>{data.title}</h1>
        </div>
        <div className={styles.buttons}>
          <button
            aria-label="share button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                shareArticle(data?.id, 'inspiration');
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
          >
            <Share color="var(--artiside-neutral5)" />
          </button>
          <AuthRequiredButtonWrapper onClick={(e) => handlePostBookmark(e)}>
            <button aria-label="bookmark button">
              <BookmarkOutline
                fill={data?.isBookmarked ? 'var(--artiside-neutral5)' : 'none'}
                color="var(--artiside-neutral5)"
              />
            </button>
          </AuthRequiredButtonWrapper>
          <AuthRequiredButtonWrapper onClick={(e) => handlePostLike(e)}>
            <button
              aria-label="like button"
              className={data?.isLiked ? styles.isLiked : ''}
            >
              {data?.isLiked ? (
                <ClapOutline color="var(--primary-color)" />
              ) : (
                <ClapOutline color="var(--artiside-neutral5)" />
              )}
            </button>
          </AuthRequiredButtonWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.owner}>
        <Avatar
          type="sm"
          image={data?.owner?.profileImgUrl}
          username={data?.owner?.nickname}
        />
        <div className={styles.user}>
          <h2>owner</h2>
          <h1>
            <span>{data?.owner?.nickname}</span>{' '}
            {data?.owner?.isPartner && <IsArtist />}
          </h1>
        </div>
        {/* <button>
          <SeedingOutline color="var(--artiside-neutral5)" />
        </button> */}
      </div>
      <div className={styles.buttons}>
        <button
          aria-label="share button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              shareArticle(data?.artworkId, 'artwork');
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
        >
          <Share color="var(--artiside-neutral5)" />
        </button>
        <AuthRequiredButtonWrapper onClick={(e) => handleBookmark(e)}>
          <button aria-label="bookmark button">
            <BookmarkOutline
              fill={data?.isBookmarked ? 'var(--artiside-neutral5)' : 'none'}
              color="var(--artiside-neutral5)"
            />
          </button>
        </AuthRequiredButtonWrapper>
        <AuthRequiredButtonWrapper onClick={(e) => handleLike(e)}>
          <button
            aria-label="like button"
            className={data?.isLiked ? styles.isLiked : ''}
          >
            {data?.isLiked ? (
              <ClapOutline color="var(--primary-color)" />
            ) : (
              <ClapOutline color="var(--artiside-neutral5)" />
            )}
          </button>
        </AuthRequiredButtonWrapper>
      </div>
    </div>
  );
}

export default ArtworkCardHoverPanel;
