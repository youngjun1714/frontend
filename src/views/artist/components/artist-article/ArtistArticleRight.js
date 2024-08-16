import React from 'react';

import styles from '@/views/artist/components/artist-article/ArtistArticle.module.scss';

function ArtistArticleRight(props) {
  const { article, type } = props;

  if (type === 'philosophy') {
    return (
      <>
        <article className={styles.article}>
          <h1 className={styles.question}>
            What is your most important consideration when creating artworks?
          </h1>
          <p>{article?.consideration}</p>
        </article>

        <article className={styles.article}>
          <h1 className={styles.question}>
            What do you consider to be good artwork?
          </h1>
          <p>{article?.goodArtwork}</p>
        </article>
      </>
    );
  }

  return (
    <>
      <article className={styles.article}>
        <h1 className={styles.question}>Please describe your art style.</h1>
        <p>{article?.artStyle}</p>
      </article>

      <article className={styles.article}>
        <h1 className={styles.question}>
          What kind of artist do you want to be remembered as by people?
        </h1>
        <p>{article?.rememberAs}</p>
      </article>

      <article className={styles.article}>
        <h1 className={styles.question}>Describe your future activities.</h1>
        <p>{article?.futureActivities}</p>
      </article>
    </>
  );
}

export default ArtistArticleRight;
