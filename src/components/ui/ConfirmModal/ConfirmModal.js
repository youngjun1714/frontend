/* eslint-disable react/prop-types */
import React from 'react';
import Image from 'next/image';
import Backdrop from '@mui/material/Backdrop';
import Button from '@/components/ui/Button/Button';
import WarningFill from '../Icons/WarningFill';
import styles from './ConfirmModal.styles';

const ConfirmModal = (props) => {
  const { open, onCancel, onConfirm, title, msg, type = 'info' } = props;

  if (!open) return <></>;
  return (
    <Backdrop
      open={open}
      css={styles}
      sx={{
        padding: '0 20px',
        zIndex: 'var(--confirm-modal-z-index)', // should be lower than the w3m-z-index(89)
      }}
    >
      <div className="confirm-modal-div">
        <div
          className={
            type === 'info'
              ? 'confirm-modal__icon-wrap'
              : 'confirm-modal__icon-wrap bg-red'
          }
        >
          {type === 'info' ? (
            <Image
              src="/assets/images/component/confirm-modal.png"
              alt="confirm-modal"
              width={50}
              height={50}
              sizes="50px"
            />
          ) : (
            <WarningFill />
          )}
        </div>
        {title ? <div className="confirm-modal__title">{title}</div> : <></>}
        {msg ? <div className="confirm-modal__msg">{msg}</div> : <></>}
        <div className="confirm-modal__btns">
          {onCancel ? (
            <Button
              type="secondary"
              color="var(--artiside-neutral1)"
              onClick={onCancel}
            >
              <span>Cancel</span>
            </Button>
          ) : null}
          <Button type="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Backdrop>
  );
};

export default ConfirmModal;
