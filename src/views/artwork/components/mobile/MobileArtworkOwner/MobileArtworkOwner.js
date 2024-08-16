import Avatar from '@/components/ui/Avatar/Avatar';
import styles from './MobileArtworkOwner.module.scss';
import MobileIsPartnerBadge from '@/components/mobile-ui/MobileIcons/MobileIsPartnerBadge';

const MobileArtworkOwner = (props) => {
  const { creator, owner } = props;

  return (
    <section className={styles.section}>
      <article>
        <div className={styles.heading}>Created by</div>
        <Row
          id={creator?.id}
          nickname={creator?.nickname}
          profileImgUrl={creator?.profileImgUrl}
          isPartner={creator?.isPartner}
          artistName={creator?.artistName}
        />
      </article>

      <article>
        <div className={styles.heading}>Owned by</div>
        <Row
          id={owner?.id}
          nickname={owner?.nickname}
          profileImgUrl={owner?.profileImgUrl}
          isPartner={owner?.isPartner}
          artistName={owner?.artistName}
        />
      </article>
    </section>
  );
};

const Row = (props) => {
  const { nickname, profileImgUrl, artistName, isPartner, id } = props;

  return (
    <div className={styles.row}>
      <Avatar type="md" username={nickname} image={profileImgUrl} />
      <div className={styles.name}>
        <h1>
          {nickname} {isPartner && <MobileIsPartnerBadge size="sm" />}
        </h1>
        <span>@{artistName}</span>
      </div>
    </div>
  );
};
export default MobileArtworkOwner;
