import { Modal } from '@mui/material';

import styles from './Modal.module.scss';
import Button from '@/components/ui/Button/Button';
import LockClosed from '@/components/ui/Icons/LockClosed';
import RedSlash from '@/components/ui/Icons/RedSlash';
import Close from '@/components/ui/Icons/Close';
import useSeeding from '@/hooks/useSeeding';
import { useMemo, useState } from 'react';
import { customToast } from '@/utils/customToast';
import InfoTypography from '@/components/ui/Typography/InfoTypography';

function RequestRewardWalletModal(props) {
  const { open, onClose, isImmediateClaim, onRefetch, claimAmt } = props;

  const immediateClaimAmt = useMemo(
    () => (claimAmt ? Math.floor((claimAmt / 10) * 1000000) / 1000000 : 0),
    [claimAmt]
  );
  const { claimReward, claimRewardImmediately } = useSeeding();
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleClaimReward = async () => {
    setLoading(true);
    try {
      await claimReward();
      setLoading(false);
      customToast({
        msg: <>Reward Claim has been successfully done</>,
        autoClose: 2000,
      });
      setIsDone(true);
      onRefetch();
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Reward Claim Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleClaimRewardImmediately = async () => {
    setLoading(true);
    try {
      await claimRewardImmediately();
      setLoading(false);
      customToast({
        msg: <>Reward Claim has been successfully done</>,
        autoClose: 2000,
      });
      setIsDone(true);
      onRefetch();
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Reward Claim Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleClose = () => {
    setIsDone(false);
    onClose();
  };

  return (
    open && (
      <Modal
        open={open}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <div className={styles.headerTitle}>{`Reward Claim`}</div>
            <button
              aria-label="close button"
              className={styles.close}
              onClick={handleClose}
            >
              <Close />
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.priceContainer} style={{ marginBottom: 24 }}>
              <div className={styles.label}>
                {isImmediateClaim ? 'Pending Reward' : 'Claimable Reward'}
              </div>
              <div className={styles.priceBox}>
                <div className={styles.immediateLabel}>
                  {isImmediateClaim && <div>Immediate withdrawal amount</div>}
                </div>
                <div>
                  <div style={{ position: 'relative' }}>
                    <InfoTypography
                      content={claimAmt}
                      decimals={5}
                      size="md"
                      endDecorator="ADF"
                    />
                    {isImmediateClaim && (
                      <div className={styles.redSlash}>
                        <RedSlash />
                      </div>
                    )}
                  </div>
                  {isImmediateClaim && (
                    <div style={{ marginTop: 16 }}>
                      <InfoTypography
                        content={immediateClaimAmt}
                        decimals={5}
                        size="md"
                        endDecorator="ADF"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isImmediateClaim && (
              <div className={styles.requestRewardGuide}>
                <div className={styles.lockClosedWrap}>
                  <LockClosed />
                </div>
                <div className={styles.content}>
                  <div>
                    Only 10% of the rewards will be paid if you wish to receive
                    rewards immediately without waiting for the lock-up period.{' '}
                    <br />
                    Only amounts up to 5 decimal places will be indicated.
                  </div>
                </div>
              </div>
            )}
            {isDone ? (
              <Button
                className={
                  isImmediateClaim
                    ? styles.bottomButton
                    : styles.requestRewardButton
                }
                type="primary"
                onClick={handleClose}
              >
                Done
              </Button>
            ) : (
              <Button
                className={
                  isImmediateClaim
                    ? styles.bottomButton
                    : styles.requestRewardButton
                }
                type="primary"
                onClick={
                  isImmediateClaim
                    ? handleClaimRewardImmediately
                    : handleClaimReward
                }
                disabled={loading}
                isLoading={loading}
              >
                Claim
              </Button>
            )}
          </div>
        </div>
      </Modal>
    )
  );
}

export default RequestRewardWalletModal;
