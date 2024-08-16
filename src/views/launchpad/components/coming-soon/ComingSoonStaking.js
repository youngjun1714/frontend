import dynamic from 'next/dynamic';
import moment from 'moment';
import styles from './ComingSoon.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCheckConnected from '@/hooks/useCheckConnected';
import VotingBoard from '../voting-board';

const Timer = dynamic(() => import('@/components/ui/Timer/BigTimer'), {
  ssr: false,
});

const ComingSoonStaking = ({
  nextStartTimeAt,
  launchpadPartnerInfos,
  onRefetchLiveRoundInfo,
}) => {
  const router = useRouter();
  const handleCheckConnected = useCheckConnected();

  const handleGoToMy = () => {
    handleCheckConnected(() => {
      router.push('/launchpad?tab=myLaunchpad');
    });
  };

  return (
    <div className={styles.comingSoon}>
      <div className={styles.title}>We are preparing for the next round.</div>
      <div className={styles.stakingDesc}>
        Please wait for the next round.
        <br />
        If <b>you haven’t unstaked</b> your $ADF from previous rounds,
      </div>
      <button className={styles.goBtn} onClick={handleGoToMy}>
        Go to My Launchpad Page
      </button>

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
            src={'/assets/images/launchpad/next-round.svg'}
            width={1028}
            height={559}
            alt={'vote'}
          />
        </div>
      )}
    </div>
  );
};

export default ComingSoonStaking;
