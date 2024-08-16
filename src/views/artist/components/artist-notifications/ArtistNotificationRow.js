function ArtistNotificationRow({ notification }) {
  const { type, content } = notification;

  /*
  if (type === 'DISABLED') {
    return (
      <article className={styles.row}>
        <div className={styles.rowLeft}>
          <Avatar type="sm" />
          <div className={styles.rowInfo}>
            <h1>
              <span>{dummyData.inspirationTitle}</span> has been disabled for
              violating our teams. You can learn more in the{' '}
              <Link href="/help" target="_blank">
                Help Center
              </Link>
            </h1>
            <h2>{moment().fromNow()}</h2>
          </div>
        </div>
        <div className={styles.rowRight}>
          <Button type="secondary" color="var(--artiside-neutral1)">
            Appeal
          </Button>
        </div>
      </article>
    );
  }

  if (type === 'AGAINST') {
    return (
      <article className={styles.row}>
        <div className={styles.rowLeft}>
          <Avatar type="sm" />
          <div className={styles.rowInfo}>
            <h1>
              <span>Your Post Goes Against Our Community Guidelines.</span>
            </h1>
            <h1 style={{ color: 'var(--artiside-neutral1)', fontWeight: 300 }}>
              We permanently removed your post because it goes against our{' '}
              <Link href="/terms">Community Guidelines</Link> on{' '}
              <span>{dummyData.violation}</span>.
            </h1>
          </div>
        </div>
      </article>
    );
  } */
}

export default ArtistNotificationRow;
