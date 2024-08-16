import { useMemo } from 'react';
import styles from './MobileAboutInspiration.module.scss';

import MobileFilledCommentIcon from '@/components/mobile-ui/MobileIcons/MobileFilledCommentIcon';
import MobileSmallChevron from '@/components/mobile-ui/MobileIcons/MobileSmallChevron';

const MobileAboutInspiration = (props) => {
  const {
    createdAt,
    text,
    postId,
    pageInfo,
    title,
    author,
    onCommentOpen,
    commentCount,
  } = props;

  const textArray = useMemo(() => text?.split(/^/gm), [text]);

  return (
    <section className={styles.section}>
      <div className={styles.contentWrapper}>
        <p className={styles.content}>
          <span>{author} </span> {text ? text : title}
        </p>
        {(text?.length > 122 || textArray?.length > 3) && (
          <input type="checkbox" className={styles.moreView} />
        )}
      </div>

      <div className={styles.commentWrapper}>
        <span>
          <MobileFilledCommentIcon />
        </span>
        <div onClick={onCommentOpen}>
          {commentCount?.length === 0
            ? 'Be the first to comment'
            : `${commentCount || 0} comments`}

          <MobileSmallChevron />
        </div>
      </div>
    </section>
  );
};

export default MobileAboutInspiration;
