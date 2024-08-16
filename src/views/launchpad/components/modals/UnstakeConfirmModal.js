import { Modal } from '@mui/material';

import styles from './Modal.module.scss';
import numberFormat from '@/utils/numberFormat';
import InfoTypography from '@/components/ui/Typography/InfoTypography';

const UnstakeConfirmModal = ({
  open,
  onClose,
  onSubmit,
  stakingStatus,
  adfToUsd,
}) => {
  const { curStakingAmt, curVpAmt } = stakingStatus || {};
  if (!open) return <></>;
  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.unstakeConfirm}>
          <div className={styles.title}>Notice</div>
          <div className={styles.desc}>
            You will miss the opportunity to gain more.
            <br />
            <b>Are you sure you want to Unstake?</b>
          </div>

          {/* <div className={styles.rewardBox}>
            <div className={styles.rewardTitle}>Total Reward</div>
            <div className={styles.rewardWrap}>
              <div className={styles.reward}>
                <div className={styles.value}>
                  <InfoTypography
                    content={curStakingAmt}
                    endDecorator="ADF"
                    size="sm"
                    decimals={2}
                  />
                </div>
                <div className={styles.usd}>
                  ${numberFormat(curStakingAmt * adfToUsd, 2)}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.reward}>
                <div className={styles.value}>
                  <InfoTypography
                    content={curVpAmt}
                    endDecorator="VP"
                    size="sm"
                    decimals={0}
                  />
                </div>
              </div>
            </div>
          </div> */}

          <button className={styles.secondBtn} onClick={onSubmit}>
            Yes
          </button>
          <button className={styles.primaryBtn} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default UnstakeConfirmModal;
