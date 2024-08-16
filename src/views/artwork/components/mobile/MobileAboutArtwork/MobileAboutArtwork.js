import { useMemo } from 'react';
import styles from './MobileAboutArtwork.module.scss';
import moment from 'moment';

import MobileFilledCommentIcon from '@/components/mobile-ui/MobileIcons/MobileFilledCommentIcon';
import MobileSmallChevron from '@/components/mobile-ui/MobileIcons/MobileSmallChevron';

const MobileAboutArtwork = (props) => {
  const { createdAt, text, artworkId, onCommentOpen, commentCount } = props;

  const textArray = useMemo(() => text?.split(/^/gm), [text]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1>About Artworks</h1>
        <h2>{moment(createdAt).fromNowOrNow()}</h2>
      </div>

      <div className={styles.contentWrapper}>
        <p className={styles.content}>{text}</p>
        {(text?.length > 129 || textArray?.length > 3) && (
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

export default MobileAboutArtwork;
