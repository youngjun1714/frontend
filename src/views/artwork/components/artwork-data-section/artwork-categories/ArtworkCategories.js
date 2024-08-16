import React from 'react';
import styles from './ArtworkCategories.module.scss';
import Badge from '@/components/ui/Badge/Badge';

function ArtworkCategories(props) {
  const { data } = props;
  return (
    <section className={styles.section}>
      <article className={styles.header}>
        <h1>Categories</h1>
        <div className={styles.badgeWrapper}>
          {data?.map((item, i) => (
            <Badge hashtag={true} content={item} key={i} />
          ))}
        </div>
      </article>
    </section>
  );
}

export default ArtworkCategories;
