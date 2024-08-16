import { useState } from 'react';
import axios from '@/adf-connect/utils/axios';
import Button from '@/adf-connect/components/ui/button/button';
import useOpen from '@/hooks/useOpen';
import tokenStore from '@/adf-connect/utils/token-store';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import TermsBox from '@/adf-connect/components/ui/terms-box/terms-box';
import dynamic from 'next/dynamic';

const ConfirmModal = dynamic(() =>
  import('@/adf-connect/components/ui/confirm-modal/confirm-modal')
);

const emailReg = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

const BindSocial = (props) => {
  const RESPONSE_CODE_VERIFY_EMAIL_SUCCESS = 0;
  const RESPONSE_CODE_VERIFY_EMAIL_ALREADY_EXIST_WALLET = -1;
  const RESPONSE_CODE_VERIFY_EMAIL_INVALID_EMAIL = -2;
  const TIME_DELAY_VERIFY_EMAIL_BUTTON_RENEWAL = 3000;

  const { isEmailVerified, email, onChangeEmail, onOpen } = props;

  const {
    address,
    openModalPage,
    closeConnectModal,
    account,
    signature,
    tempToken,
    setTempToken,
    audience,
  } = useConnectModalContext();

  const [isConfirmOpen, handleOpenConfirm] = useOpen();
  const [isErrorConfirmOpen, handleOpenErrorConfirm, handleCloseErrorConfirm] =
    useOpen();

  const { loginMethod } = account || {};

  const handleCreateNewAccount = async () => {
    handleCloseErrorConfirm();
    onChangeEmail('');
    openModalPage(loginMethod === 'wallet' ? 'SIGNUP_WALLET' : 'SIGNUP_SOCIAL');
  };

  const [failMsg, setFailMsg] = useState('');
  const [isEmailDuplicated, setIsEmailDuplicated] = useState(false);

  const handleChangeEmail = (e) => {
    onChangeEmail(e.target.value);
    setIsEmailDuplicated(false);
    setFailMsg('');
  };

  const handleVerifyMail = async () => {
    try {
      const data = {
        email,
      };

      const response = await axios.post(`/join/check-exist-mail`, data);
      if (response.data.response.code === RESPONSE_CODE_VERIFY_EMAIL_SUCCESS) {
        openModalPage('VERIFY_EXISTING_EMAIL');
      } else if (
        response.data.response.code ===
        RESPONSE_CODE_VERIFY_EMAIL_ALREADY_EXIST_WALLET
      ) {
        setFailMsg('Wallet is already exist');
        setTimeout(
          () => setFailMsg(''),
          TIME_DELAY_VERIFY_EMAIL_BUTTON_RENEWAL
        );
      }
    } catch (error) {
      console.log(error);
      if (
        error?.response?.data?.response?.code ===
        RESPONSE_CODE_VERIFY_EMAIL_INVALID_EMAIL
      ) {
        setFailMsg('Please enter a valid email address.');
        handleOpenErrorConfirm();
      }
    }
  };

  const handleVerifyAccount = async () => {
    try {
      const data = {
        tempToken,
        walletAddress: address,
        signature,
        audience,
      };

      const response = await axios.post(`/join/bind-wallet-to-social`, data);
      if (response.data.response.code === 0) {
        setTempToken(null);
        tokenStore.set('accessToken', response.data.response.accessToken);
        tokenStore.set('refreshToken', response.data.response.refreshToken);
        handleOpenConfirm();
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.response?.code === -2) {
        setFailMsg('Please enter a valid email address.');
      }
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-title">Connecting your account</div>

      <div className="signup-form">
        <div className="step-container">
          <div className="step-no">1</div>
          <div className="step-content">
            <div className="step-title">Connected address</div>
            <div className="step-value">{address}</div>
          </div>
        </div>
        <div className="step-container">
          <div className="step-no">2</div>
          {isEmailVerified ? (
            <div className="step-content">
              <div className="step-title">Your email address</div>
              <div className="step-value">{email}</div>
            </div>
          ) : (
            <div className="step-content">
              <div
                className={
                  isEmailVerified
                    ? 'step-title'
                    : 'step-title active-step is-required'
                }
              >
                Verify your email address
              </div>
              <div className="step-desc">
                Please enter the email address you signed up for with your
                Google account.
              </div>
              <div className="input-container">
                <div
                  className={
                    email && emailReg.test(email) && !failMsg
                      ? 'input-wrapper'
                      : 'input-wrapper error'
                  }
                >
                  <input
                    className="error"
                    value={email}
                    onChange={handleChangeEmail}
                  />
                  <Button
                    className="verify-button"
                    onClick={handleVerifyMail}
                    disabled={!email || !emailReg.test(email) || failMsg}
                  >
                    Verify
                  </Button>
                </div>
                {!email || !emailReg.test(email) || failMsg ? (
                  <div className="input-error-msg">
                    {failMsg || 'Please enter a valid email address.'}
                  </div>
                ) : (
                  <></>
                )}
                {isEmailDuplicated && !isEmailVerified ? (
                  <div className="input-error-msg">Email already exists.</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="step-container">
          <div className={isEmailVerified ? 'step-no' : 'step-no disabled'}>
            3
          </div>
          <div className="step-content">
            <div
              className={
                isEmailVerified ? 'step-title active-step' : 'step-title'
              }
            >
              Your username
            </div>
            {isEmailVerified ? (
              <div className="step-value">{account?.nickname}</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <Button
        className="bottom-button"
        onClick={handleVerifyAccount}
        disabled={!isEmailVerified}
      >
        Verify account
      </Button>

      <TermsBox onOpen={onOpen} />
      {isConfirmOpen && (
        <ConfirmModal
          open={isConfirmOpen}
          onConfirm={closeConnectModal}
          confirmButtonContent="Explore"
          title="Account has been created"
          desc={
            <>
              Your account registration
              <br />
              has been successfully completed!
            </>
          }
          subDesc={
            <>
              Explore Art de Finance’s services and
              <br />
              experience the new world of Art.
            </>
          }
        />
      )}
      {isErrorConfirmOpen && (
        <ConfirmModal
          open={isErrorConfirmOpen}
          onConfirm={handleCreateNewAccount}
          onCancel={handleCloseErrorConfirm}
          cancelButtonContent="No"
          confirmButtonContent="Yes, I'd like to create a new account"
          title="You don’t have an existing account."
          desc={
            <>
              Do you want to create a new account with
              <br />
              your connected wallet?
            </>
          }
        />
      )}
    </div>
  );
};

export default BindSocial;
