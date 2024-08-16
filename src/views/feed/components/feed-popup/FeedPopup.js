import React from 'react';
import styles from '@/views/feed/components/feed-popup/FeedPopup.module.scss';

import FeedCreatorWrapper from '@/views/feed/components/feed-creator-wrapper/FeedCreatorWrapper';
import Button from '@/components/ui/Button/Button';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import { Typography } from '@mui/material';

function FeedPopup() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        You may also
        <br /> like these <span>Creators!</span>
      </h1>
      <p>Customize your Feed by following your favorite creators</p>
      <FeedCreatorWrapper>
        <div className={styles.button}>
          <Button className="w-100" type="secondary">
            <Typography
              textColor="var(--typography-black-2)"
              endDecorator={<ArrowIcon />}
            >
              Discover more Artworks!
            </Typography>
          </Button>
        </div>
      </FeedCreatorWrapper>
    </section>
  );
}

export default FeedPopup;
