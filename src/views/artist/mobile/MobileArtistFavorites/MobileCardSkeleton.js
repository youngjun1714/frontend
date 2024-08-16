import styles from './MobileCardSkeleton.module.scss';

const MobileCardSkeleton = ({ type }) => {
  const iter = [1, 2, 3, 4, 5, 6, 7, 8];
  if (type === 'artworks') {
    return (
      <section className={styles.section}>
        {iter.map((item, i) => (
          <Card key={i} />
        ))}
      </section>
    );
  }

  if (type === 'inspiration') {
    return (
      <section className={styles.grid}>
        {iter.map((item, i) => (
          <Card key={i} />
        ))}
      </section>
    );
  }
};

const Card = () => (
  <div className={styles.card}>
    <div className={styles.top} />
    <div className={styles.bottom}>
      <div className={styles.title} />
      <div className={styles.contentWrapper}>
        <div className={styles.content} />
        <div className={styles.content} />
      </div>
    </div>
  </div>
);

export default MobileCardSkeleton;
