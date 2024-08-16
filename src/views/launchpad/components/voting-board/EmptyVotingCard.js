import styles from './index.module.scss';
import ArtistVideoWrap from './ArtistVideoWrap';
import CheckSquare from '@/components/ui/Icons/CheckSquare';
import Image from 'next/image';

const EmptyVotingCard = () => (
  <div className={styles.votingCard}>
    <ArtistVideoWrap
      artwork={{
        thumbnailUrl: '/assets/images/launchpad/empty-voting-card.svg',
        title: 'empty',
      }}
    />
    <div className={styles.flexDiv}>
      <Image
        width={197}
        height={55}
        src={'/assets/images/launchpad/empty-avatar.svg'}
        alt={'empty avatar'}
      />
      <button className={styles.voteBtn} disabled>
        <CheckSquare /> Vote
      </button>
    </div>
    <Image
      width={400}
      height={76}
      src={'/assets/images/launchpad/empty-intro.svg'}
      alt={'empty intro'}
    />
  </div>
);

export default EmptyVotingCard;
