import { Modal } from '@mui/material';

import Button from '@/components/ui/Button/Button';
import Close from '@/components/ui/Icons/Close';

import styles from './Modal.module.scss';
import RequestPeriod from './asset/RequestPeriod';

function RequestPeriodModal(props) {
  const { onClose, open } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}></div>
          <button
            aria-label="close button"
            className={styles.close}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.modalContainer}>
          <div className={styles.modalBody}>
            <div className={styles.guideLabel}>Request Period</div>
            <div className={styles.guideTitle}>
              You have to request the reward after the
              <br />
              participated Episode!
            </div>
            <div className={styles.guideContent}>
              You can request it{' '}
              <span className={styles.blue}>within 14 days</span> after the
              Episode ends, and if you don&apos;t request it <br />
              during this period, you won&apos;t receive the reward.
            </div>
            <div className={styles.guidePic}>
              <RequestPeriod />
            </div>
            <div className={styles.guideContent} style={{ marginTop: 24 }}>
              The reward will be available for{' '}
              <span className={styles.blue}>
                withdrawal +12 weeks later (The Lock-up Period)
              </span>
              <br />
              from the requested date. You need to claim the reward to your
              wallet in order to utilize it,
              <br />
              even though the requested reward will not expire.
            </div>
            <Button
              type="primary"
              className={styles.bottomButton}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RequestPeriodModal;
