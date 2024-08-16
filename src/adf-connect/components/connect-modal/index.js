import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import VerifyEmail from './verify-email';
import WalletSignup from './signup-wallet';
import Signin from './signin';
import AskBindOrCreate from './ask-bind-or-create';
import SocialSignup from './signup-social';
import BindSocial from './bind-social';
import AskAddWallet from './ask-add-wallet';
import AccountExists from './account-exists';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import BackArrowIcon from '@/adf-connect/assets/icons/back-arrow';
import AddWallet from './add-wallet';
import VerifyExistingEmail from './verify-existing-email';
import TermsService from '@/views/service/TermsService';
import PrivacyPolicy from '@/views/service/PrivacyPolicy';
import PAGE from '@/adf-connect/utils/PAGE.json';
import styles from './index.styles';
import Close from '@/components/ui/Icons/Close';
import TermsDialog from './terms-dialog';

const ConnectModal = () => {
  const { isConnectModalOpen, closeConnectModal, modalPage, goBackModalPage } =
    useConnectModalContext();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const onReset = () => {
    setEmail('');
    setCode('');
    setIsEmailVerified(false);
  };

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('terms');

  const handleOpen = (modalType) => {
    setOpen(true);
    setModalType(modalType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    !isConnectModalOpen && onReset();
  }, [isConnectModalOpen]);

  const getComponent = () => {
    switch (modalPage) {
      case PAGE.SIGNIN:
        return <Signin onOpen={handleOpen} />;

      case PAGE.SIGNUP_WALLET:
        return (
          <WalletSignup
            isEmailVerified={isEmailVerified}
            email={email}
            onChangeEmail={setEmail}
            onReset={onReset}
            onOpen={handleOpen}
          />
        );

      case PAGE.SIGNUP_SOCIAL:
        return <SocialSignup onOpen={handleOpen} />;

      case PAGE.VERIFY_EMAIL:
        return (
          <VerifyEmail
            email={email}
            code={code}
            onChangeCode={setCode}
            setIsEmailVerified={setIsEmailVerified}
          />
        );

      case PAGE.ASK_BIND_OR_CREATE:
        return <AskBindOrCreate />;

      case PAGE.BIND_SOCIAL:
        return (
          <BindSocial
            isEmailVerified={isEmailVerified}
            email={email}
            onChangeEmail={setEmail}
            onOpen={handleOpen}
          />
        );

      case PAGE.ASK_ADD_WALLET:
        return <AskAddWallet />;

      case PAGE.ACCOUNT_EXISTS:
        return <AccountExists />;

      case PAGE.ADD_WALLET:
        return <AddWallet onOpen={handleOpen} />;

      case PAGE.VERIFY_EXISTING_EMAIL:
        return (
          <VerifyExistingEmail
            email={email}
            code={code}
            onChangeCode={setCode}
            setIsEmailVerified={setIsEmailVerified}
          />
        );

      default:
        return <Signin />;
    }
  };

  return (
    <Dialog
      open={isConnectModalOpen}
      onClose={modalPage === PAGE.SIGNIN ? closeConnectModal : () => {}}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(6px)',
          },
        },
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1550,
        width: '100%',
        '& .MuiDialog-container': {
          width: '100%',
          '@media (max-width: 480px)': {
            alignItems: 'flex-end',
          },
        },
      }}
      PaperProps={{
        sx: {
          margin: 0,
          boxShadow: 'none',
          background: 'none',
          borderRadius: '10px',

          width: 'fit-content',
          '@media (max-width: 480px)': {
            width: '100%',
            borderRadius: '20px 20px 0 0',
          },
        },
      }}
      disableEnforceFocus
    >
      <div css={styles}>
        {modalPage &&
        modalPage !== PAGE.SIGNIN &&
        modalPage !== PAGE.ASK_ADD_WALLET &&
        modalPage !== PAGE.ADD_WALLET ? (
          <button
            onClick={goBackModalPage}
            className="go-back-button"
            aria-label="go back"
          >
            <BackArrowIcon />
          </button>
        ) : (
          <></>
        )}
        {getComponent()}
        <TermsDialog open={open} onClose={handleClose}>
          {modalType === 'terms' ? <TermsService /> : <PrivacyPolicy />}
          <button className="terms-close" onClick={handleClose}>
            <Close color="#ffffff" />
          </button>
        </TermsDialog>
      </div>
    </Dialog>
  );
};

export default ConnectModal;
