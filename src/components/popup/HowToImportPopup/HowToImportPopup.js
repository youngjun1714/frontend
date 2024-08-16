import { useState, forwardRef } from 'react';
import styles from '../GuidePopup.module.scss';

import { Modal } from '@mui/material';

import PopupBox from '@/components/ui/Popup/PopupBox/PopupBox';

const HowToImportPopup = (props, ref) => {
  const { open, onClose, isHide, setIsHide, openCreate, sessionStorageItem } =
    props;

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
              video="/assets/images/popup/HowToImport1.gif"
              title="Artwork is both the beginning and the end that connects collectors."
              contents="Consistently upload your artworks \n on ADF PARTNERS and kindly write descriptions \n about your works."
              nextVideo="/assets/images/popup/HowToImport2.gif"
              nextTitle="Interact with fans and respond to their interest."
              nextContents="Artiside's ultimate vision is to transition \n from appreciation to collecting, \n and from collecting to fandom"
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

export default forwardRef(HowToImportPopup);
