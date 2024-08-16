import dynamic from 'next/dynamic';
import moment from 'moment';
import styles from './ComingSoon.module.scss';
import Image from 'next/image';
import VotingBoard from '../voting-board';

const Timer = dynamic(() => import('@/components/ui/Timer/BigTimer'), {
  ssr: false,
});

const ComingSoonVoting = ({
  nextStartTimeAt,
  launchpadPartnerInfos,
  onRefetchLiveRoundInfo,
}) => (
  <div className={styles.comingSoon}>
    <div className={styles.title}>Coming soon!</div>

    <div className={styles.desc}>
      {nextStartTimeAt ? '' : 'Please wait for the next round'}
    </div>
    {nextStartTimeAt && moment().isBefore(nextStartTimeAt) && (
      <div className={styles.timer}>
        <Timer
          expiryTimestamp={nextStartTimeAt}
          onHandleExpired={onRefetchLiveRoundInfo}
        />
      </div>
    )}
    {nextStartTimeAt && launchpadPartnerInfos?.length ? (
      <VotingBoard
        launchpadPartnerInfos={launchpadPartnerInfos}
        hideVoteBtn={true}
      />
    ) : (
      <div className={styles.artwork}>
        <Image
          src={'/assets/images/launchpad/vote.svg'}
          width={693}
          height={571}
          alt={'vote'}
        />
        <div>ARTIST VOTING</div>
      </div>
    )}
  </div>
);

export default ComingSoonVoting;
