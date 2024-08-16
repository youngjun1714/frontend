import { useState } from 'react';
import styles from './MobileInspirationInteraction.module.scss';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';
import MobileInteractionSmallIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionSmallIcon';
import MobileInteractionLargeIcon from '@/components/mobile-ui/MobileIcons/MobileInteractionLargeIcon';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import useBookmarkPost from '@/hooks/useBookmarkPost';
import { customToast } from '@/utils/customToast';
import shareArticle from '@/utils/shareArticle';
import MobileDrawerList from '@/components/mobile-ui/MobileDrawer/MobileDrawerList';
import MobileCopyIcon from '@/components/mobile-ui/MobileIcons/MobileCopyIcon';
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@mui/material/Drawer'));

const MobileInspirationInteraction = (props) => {
  const {
    postId,
    likeCount,
    viewCount,
    toggleLike,
    onCommentOpen,
    isBookmarked,
    isLiked,
  } = props;

  const [open, setOpen] = useState(false);

  const [bookmark, { loading: isBookmarkLoading }] = useBookmarkPost(postId);
  const handleBookmark = async () => {
    const { data } = await bookmark();
    const { bookmarkPost } = data;
    if (bookmarkPost.isBookmarked) {
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
        <AuthRequiredButtonWrapper onClick={toggleLike}>
          <button className={isLiked ? styles.isLiked : ''} aria-label="like">
            <MobileInteractionLargeIcon shape="clap" isLiked={isLiked} />
          </button>
        </AuthRequiredButtonWrapper>
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
        <button onClick={() => setOpen(true)} aria-label="share">
          <MobileInteractionLargeIcon shape="share" />
        </button>
      </div>

      {open && (
        <Drawer
          sx={{
            backdropFilter: 'blur(6px)',
            '@media (min-width: 481px)': {
              display: 'none',
            },
            '&': {
              zIndex: 1500,
            },
            '& > .MuiPaper-root': {
              backgroundColor: 'transparent',
            },
          }}
          transitionDuration={200}
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
        >
          <MobileDrawerContainer>
            <MobileDrawerList
              title="Copy Link"
              icon={<MobileCopyIcon />}
              onClick={() => {
                try {
                  shareArticle(postId, 'inspiration');
                  customToast({
                    msg: <>Copied</>,
                    autoClose: true,
                  });
                } catch (e) {
                  console.log(e);
                  customToast({
                    toastType: 'error',
                    msg: <>Error</>,
                  });
                }
                setOpen(false);
              }}
              arrow
            />
          </MobileDrawerContainer>
        </Drawer>
      )}
    </article>
  );
};

export default MobileInspirationInteraction;
