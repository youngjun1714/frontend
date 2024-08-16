import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ToastSuccess from '@/components/ui/Icons/ToastSuccess';
import ToastFailed from '@/components/ui/Icons/ToastFailed';
import ToastAlert from '@/components/ui/Icons/ToastAlert';
import ToastInfo from '@/components/ui/Icons/ToastInfo';

export const customToast = ({
  containerId,
  msg,
  toastType = 'success',
  autoClose = 700,
}) => {
  toast(
    <div className="toastify__custom">
      {toastType === 'success' && <ToastSuccess />}
      {toastType === 'error' && <ToastFailed />}
      {toastType === 'info' && <ToastInfo />}
      {toastType === 'alert' && <ToastAlert />}
      <div className="toastify__custom__msg">{msg}</div>
    </div>,
    {
      position: 'bottom-center',
      className: `toast__custom-primary`,
      containerId,
      autoClose,
    }
  );
};

export const CustomToastContainer = (props) => <ToastContainer {...props} />;
