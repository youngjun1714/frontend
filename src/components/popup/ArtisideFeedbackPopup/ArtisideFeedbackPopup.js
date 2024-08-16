import { forwardRef, useEffect, useState } from 'react';
import styles from './ArtisideFeedbackPopup.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import { Modal } from '@mui/material';

const ArtisideFeedbackPopup = (props, ref) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('openEventPopup') === 'false') {
      setOpen(false);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('openEventPopup', false);
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <Modal
          open={open}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            zIndex: 1500,
          }}
        >
          <div ref={ref} className={styles.container}>
            <PopupBox
              image={'/assets/images/popup/ArtisideFeedbackProgram.png'}
              alt="Artiside Feedback Popup"
              link="https://docs.google.com/forms/d/1_x3_-3TYBCX7bbEJtYBRygkHjP9wiFi_sWYcglRZ4jQ/viewform?edit_requested=true"
              onClose={handleClose}
            />
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

const PopupBox = (props) => {
  const { image, alt, link, onClose } = props;
  return (
    <div className={styles.box}>
      <div className={styles.imageWrapper}>
        <Link href={link} target="_blank">
          <Image src={image} alt={alt} fill />
        </Link>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
export default forwardRef(ArtisideFeedbackPopup);
