import React from 'react';
import styles from '@/views/feed/components/feed-top-creator/FeedTopCreator.module.scss';

import FeedCreatorWrapper from '@/views/feed/components/feed-creator-wrapper/FeedCreatorWrapper';

function FeedTopCreator(props) {
  const { data } = props;
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        Top <span>Creators!</span>
      </h1>
      <FeedCreatorWrapper data={data} />
    </section>
  );
}

export default FeedTopCreator;
