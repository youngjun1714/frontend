/* eslint-disable react/prop-types */
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@/components/ui/Button/Button';
import MobileConfirmModalIcon from '@/components/mobile-ui/MobileIcons/MobileConfirmModalIcon';
import styles from './ConfirmModal.styles';

const MobileDeleteModal = (props) => {
  const { open, onCancel, onConfirm, title, msg, confirm, cancel } = props;
  return (
    <Backdrop
      open={open}
      css={styles}
      sx={{
        zIndex: 'var(--confirm-modal-z-index)', // should be lower than the w3m-z-index(89)
        padding: '0 20px',
      }}
    >
      <div className="confirm-modal-div">
        <div className="confirm-modal__icon">
          <MobileConfirmModalIcon />
        </div>
        {title ? <div className="confirm-modal__title">{title}</div> : <></>}
        {msg ? <div className="confirm-modal__msg">{msg}</div> : <></>}
        <div
          className="confirm-modal__btns"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {onCancel ? (
            <Button
              type="secondary"
              color="var(--artiside-neutral1)"
              onClick={onCancel}
            >
              <span>{cancel}</span>
            </Button>
          ) : null}
          <Button type="primary" onClick={onConfirm}>
            {confirm}
          </Button>
        </div>
      </div>
    </Backdrop>
  );
};

export default MobileDeleteModal;
