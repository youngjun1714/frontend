import styles from './index.module.scss';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import TriangleRight from '@/components/ui/Icons/TriangleRight';
import TriangleRightSmall from '@/components/ui/Icons/TriangleRightSmall';

const Reward = ({ expectedReward, currentVP }) => {
  const { rewardAmtPerHour, rewardAmtPerDay, totalVp } = expectedReward || {};

  return (
    <div className={styles.reward}>
      <div className={styles.triangleWrapper}>
        <TriangleRight />
      </div>
      <div className={styles.rewardWrapper}>
        <div className={styles.title}>Expected Reward</div>
        <div className={styles.label}>Reward Amount</div>
        <div className={styles.flexDiv}>
          <InfoTypography
            content={rewardAmtPerHour}
            endDecorator="ADF / Hour"
            size="md"
            decimals={5}
            numberColor="#00B5B0"
          />
          <InfoTypography
            content={rewardAmtPerDay}
            endDecorator="ADF / Day"
            size="md"
            decimals={5}
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.label}>Total VP from Staking</div>
        <div className={styles.flexDiv}>
          <InfoTypography
            content={currentVP}
            endDecorator="VP"
            size="md"
            decimals={0}
            numberColor="#9BA1A8"
          />
          <div className={styles.triangleSmallWrapper}>
            <TriangleRightSmall />
          </div>
          <InfoTypography
            content={totalVp}
            endDecorator="VP"
            size="md"
            decimals={0}
          />
        </div>
        <div className={styles.desc}>
          The numbers above are subject to change based on real-time
          information.
        </div>
      </div>
    </div>
  );
};
export default Reward;
