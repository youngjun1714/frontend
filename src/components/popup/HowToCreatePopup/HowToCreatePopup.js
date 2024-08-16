import { useState, forwardRef } from 'react';
import styles from '../GuidePopup.module.scss';

import { Modal } from '@mui/material';

import PopupBox from '@/components/ui/Popup/PopupBox/PopupBox';

const HowToCreatePopup = (props, ref) => {
  const { open, onClose, setIsHide, openCreate, sessionStorageItem } = props;

  const [isHideCheck, setIsHideCheck] = useState(false);

  return (
    <>
      {open ? (
        <Modal
          open={open}
          onClose={onClose}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(6px)',
            padding: '0 10px',
            '@media (max-width: 1024px)': {
              display: 'none',
            },
          }}
        >
          <div ref={ref} className={styles.container}>
            <PopupBox
              video="/assets/images/popup/HowToCreate1.png"
              title="Don't keep the aesthetic of \n daily life just to yourself. Share it."
              contents="Share the best moments from your perspective with the artists on Artiside and provide inspiration."
              nextVideo="/assets/images/popup/HowToCreate2.gif"
              nextTitle="Meet various artists and artworks \n that will make your heart flutter."
              nextContents="You can meet global artists from around the \n world on Artiside."
              checked={isHideCheck}
              onCreate={openCreate}
              onChange={() => {
                setIsHideCheck(!isHideCheck);
              }}
              onClose={() => {
                setIsHide(true);
                onClose();
              }}
              sessionStorageItem={sessionStorageItem}
            />
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default forwardRef(HowToCreatePopup);
