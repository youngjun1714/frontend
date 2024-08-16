import { Modal } from '@mui/material';

import Button from '@/components/ui/Button/Button';
import Close from '@/components/ui/Icons/Close';

import styles from './Modal.module.scss';
import RewardPercent from './asset/RewardPercent';

function RewardPercentModal(props) {
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
        <div className={styles.modalBody}>
          <div className={styles.guideLabel}>Reward Percentage</div>
          <div className={styles.guideTitle}>
            The percentage that the Seeder takes from the
            <br /> seeding reward.
          </div>
          <div className={styles.guideContent}>
            This is the distribution ratio that Seeders receive from the Seeding
            rewards.
            <br />
            It is divided among the Seeders who have seeded the artist,
            <br />
            excluding{' '}
            <span className={styles.blue}>
              the artist&apos;s self-set share ratio (0-5%)
            </span>
            .
          </div>
          <div className={styles.guidePic}>
            <RewardPercent />
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
    </Modal>
  );
}

export default RewardPercentModal;
