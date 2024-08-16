import styles from './ArtistInfoCardFollowNodata.module.scss';

export default function ArtistInfoCardFollowNodata({ type }) {
  return (
    <div className={styles.section}>
      <h1>{`No ${type} yet`}</h1>
    </div>
  );
}
