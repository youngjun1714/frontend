import { Modal } from '@mui/material';

import Button from '@/components/ui/Button/Button';
import Close from '@/components/ui/Icons/Close';

import styles from './Modal.module.scss';
import SeedGroup from './asset/SeedGroup';

function SeedGroupModal(props) {
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
        <div className={styles.modalBody} style={{ padding: '0 40px 20px' }}>
          <div className={styles.guideLabel}>Seed Group</div>
          <div className={styles.guideTitle}>What is a Seed Group?</div>
          <div className={styles.guideContent}>
            Artist classification into distinct ranges (Groups), determined by
            sponsored
            <br />
            Seed quantity remains fluid across the season; higher group
            assignments yield greater rewards.
            <br />
            <br />
            <span className={styles.blue}>
              Seeding early can lead to heightened reward ratios, even within
              the range!
            </span>
          </div>
          <div className={styles.guidePic} style={{ padding: '24px 0' }}>
            <SeedGroup />
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

export default SeedGroupModal;
