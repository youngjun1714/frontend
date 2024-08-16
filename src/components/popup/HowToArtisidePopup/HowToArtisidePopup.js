import { useState, forwardRef } from 'react';
import styles from '../GuidePopup.module.scss';

import { Modal } from '@mui/material';

import PopupBox from '@/components/ui/Popup/PopupBox/PopupBox';

const HowToArtisidePopup = (props, ref) => {
  const { open, onClose, setIsHide, openCreate, sessionStorageItem } = props;

  const [isHideCheck, setIsHideCheck] = useState(false);

  return (
    <>
      {open ? (
        <Modal
          open={open}
          onClose={onClose}
          sx={{
            width: '100%',
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
              video="/assets/images/popup/HowToArtiside1.gif"
              title="Show your arts, \n Show your daily lives!"
              contents="We welcome those who create \n all kinds of aesthetics."
              nextVideo="/assets/images/popup/HowToArtiside2.gif"
              nextTitle="Please send some compliments \n if you've clapped and even shared \n artworks."
              nextContents="Please express and share both the works of \n artists and your daily lives openly on Artiside."
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

export default forwardRef(HowToArtisidePopup);
