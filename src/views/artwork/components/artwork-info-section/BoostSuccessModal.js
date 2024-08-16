import { Dialog } from '@mui/material';
import styles from './BoostSuccessModal.module.scss';
import Power from '@/components/ui/Icons/Power';
import Timer from '@/components/ui/Icons/Timer';

const BoostSuccessModal = (props) => {
  const { artwork, handleClose } = props;
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      }}
      PaperProps={{
        sx: {
          margin: 0,
          padding: 0,
          boxShadow: '0px 10px 20px 0px #BABFC54D',
          borderRadius: '10px',
          width: 'fit-content',
        },
      }}
    >
      <div className={styles.modalBody}>
        <p className={styles.title}>
          <span>{artwork.artworkInfo.title} </span>
          Boosted!
        </p>
        <div className={styles.boostBox}>
          <div>
            <Power color="var(--artiside-neutral1)" />
            <div>
              <p className={styles.subTitle}>
                Number of Boosts <strong>{artwork.boostedCount}</strong>
              </p>
              <p className={styles.description}>
                You have <span>{5 - artwork.boostedCount} more</span> boosts to
                go.
              </p>
            </div>
          </div>
          <div>
            <Timer />
            <div>
              <p className={styles.subTitle}>Next Boosts</p>
              <p className={styles.description}>
                You can use it again in <span>72 hours.</span>
              </p>
            </div>
          </div>
        </div>
        <button className={styles.button} onClick={() => handleClose()}>
          Confirm
        </button>
      </div>
    </Dialog>
  );
};

export default BoostSuccessModal;
