/* eslint-disable react/prop-types */
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@/adf-connect/components/ui/button/button';
import styles from './confirm-modal.styles';

const ConfirmModal = (props) => {
  const {
    open,
    onCancel,
    cancelButtonContent,
    onConfirm,
    confirmButtonContent,
    title,
    desc,
    subDesc,
    size = '',
  } = props;

  return (
    <Backdrop
      open={open}
      css={styles}
      sx={{
        zIndex: 1650,
      }}
    >
      <div className={`confirm-modal-div ${size}`}>
        {title ? <div className="confirm-modal__title">{title}</div> : <></>}
        {desc ? <div className="confirm-modal__desc">{desc}</div> : <></>}
        {subDesc ? (
          <div className="confirm-modal__sub-desc">{subDesc}</div>
        ) : (
          <></>
        )}
        <div className="confirm-modal__btns">
          {onConfirm && (
            <Button onClick={onConfirm}>{confirmButtonContent}</Button>
          )}
          {onCancel && (
            <Button type="secondary" onClick={onCancel}>
              {cancelButtonContent}
            </Button>
          )}
        </div>
      </div>
    </Backdrop>
  );
};

export default ConfirmModal;
