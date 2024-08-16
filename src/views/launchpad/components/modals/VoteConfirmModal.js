import { Modal } from '@mui/material';

import styles from './Modal.module.scss';
import ExclamaCircle from '@/components/ui/Icons/ExclamaCircle';

const VoteConfirmModal = ({ open, onClose, onVote }) => (
  <Modal open={open} onClose={onClose} className={styles.modal}>
    <div className={styles.modalContainer}>
      <div className={styles.voteConfirm}>
        <ExclamaCircle />
        <div className={styles.title}>Please note</div>
        <div className={styles.desc}>
          Once you vote for an artist, your decision cannot be changed.
          <br />
          Please vote carefully.
        </div>

        <button className={styles.primaryBtn} onClick={onVote}>
          Yes
        </button>
        <button className={styles.secondBtn} onClick={onClose}>
          No
        </button>
      </div>
    </div>
  </Modal>
);
export default VoteConfirmModal;
