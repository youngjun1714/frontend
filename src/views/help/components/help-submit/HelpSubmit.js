import { Modal } from '@mui/material';

import styles from './HelpSubmit.module.scss';
import Button from '@/components/ui/Button/Button';
import Close from '@/components/ui/Icons/Close';
import ExclamaCircleIcon from '@/components/ui/Icons/ExclamaCircle';

function HelpSubmit(props) {
  const { onClose, open } = props;
  return (
    <Modal
      open={open}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={onClose} aria-label="close">
            <Close color="var(--artiside-neutral4)" />
          </button>
        </div>
        <div className={styles.main}>
          <ExclamaCircleIcon />
          <h1>
            Do you want to proceed
            <br /> this submition?
          </h1>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            onClick={onClose}
            color="var(--artiside-neutral1)"
            size="sm"
            type="secondary"
          >
            cancel
          </Button>
          <Button size="sm" type="primary">
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default HelpSubmit;
