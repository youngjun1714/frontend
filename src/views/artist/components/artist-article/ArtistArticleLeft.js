import React from 'react';

import styles from '@/views/artist/components/artist-article/ArtistArticle.module.scss';

function ArtistArticleLeft(props) {
  const { article, type } = props;

  if (type === 'philosophy') {
    return (
      <>
        <article className={styles.article}>
          <h1 className={styles.question}>
            Please tell us about your values ​​as an artist.
          </h1>
          <p>{article?.values}</p>
        </article>

        <article className={styles.article}>
          <h1 className={styles.question}>
            What message do you want to convey to your audience through your
            artwork?
          </h1>
          <p>{article?.message}</p>
        </article>
      </>
    );
  }

  return (
    <>
      <article className={styles.article}>
        <h1 className={styles.question}>
          Please briefly introduce yourself. (Country of origin, country of
          activity, artist name, affiliated group, etc.)
        </h1>
        <p>{article?.intro}</p>
      </article>

      <article className={styles.article}>
        <h1 className={styles.question}>
          Please explain one of your representative artwork.
        </h1>
        <p>{article?.representativeArtwork}</p>
      </article>

      <article className={styles.article}>
        <h1 className={styles.question}>
          Please introduce an artist who inspires you.
        </h1>
        <p>{article?.recommendArtist}</p>
      </article>
    </>
  );
}

export default ArtistArticleLeft;
