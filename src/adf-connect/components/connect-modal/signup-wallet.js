import { useState } from 'react';
import axios from '@/adf-connect/utils/axios';
import Button from '@/adf-connect/components/ui/button/button';
import useOpen from '@/hooks/useOpen';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import TermsBox from '@/adf-connect/components/ui/terms-box/terms-box';
import tokenStore from '@/adf-connect/utils/token-store';
import dynamic from 'next/dynamic';

const ConfirmModal = dynamic(() =>
  import('@/adf-connect/components/ui/confirm-modal/confirm-modal')
);

const WalletSignup = (props) => {
  const { onOpen } = props;

  const {
    account,
    openModalPage,
    logOutAdf,
    tempToken,
    setTempToken,
    audience,
  } = useConnectModalContext();

  const [isConfirmOpen, handleOpenConfirm, handleCloseConfirm] = useOpen();

  const [failMsg, setFailMsg] = useState('');

  const [nickname, setNickname] = useState(null);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);

  const handleChangeNickname = (e) => {
    setNickname(e.target.value);
    setIsNicknameVerified(false);
    setFailMsg('');
  };

  const handleResetNickname = () => {
    setIsNicknameVerified(false);
    setNickname('');
    setFailMsg('');
  };

  const handleVerifyNickname = async () => {
    try {
      const data = {
        nickname,
      };

      const response = await axios.get(`/join/check-nickname`, {
        params: data,
      });
      if (response.data.response.code === 0) {
        setIsNicknameVerified(true);
      } else if (response.data.response.code === -1) {
        setIsNicknameVerified(false);
        setFailMsg('Username already exists.');
      } else {
        setIsNicknameVerified(false);
        setFailMsg(response?.data?.response?.message);
      }
    } catch (error) {
      setIsNicknameVerified(false);
      setFailMsg(error?.response?.data?.response?.message);
    }
  };

  const handleSubmitNickname = async () => {
    try {
      const data = {
        tempToken,
        nickname,
        audience,
      };

      const response = await axios.post(`/join/signup`, data);
      if (response.data.response.code === 0) {
        setTempToken(null);
        tokenStore.set('accessToken', response.data.response.accessToken);
        tokenStore.set('refreshToken', response.data.response.refreshToken);
        handleOpenConfirm();
      } else {
        setFailMsg('Something wrong. Try again');
      }
    } catch (error) {
      console.log(error);
      setFailMsg(error?.response?.data?.response?.message);
    }
  };

  const handleConfirm = () => {
    handleCloseConfirm();
    openModalPage('SIGNIN');
    logOutAdf();
  };

  const nicknameReg = /^[A-Za-z0-9]{3,15}$/g;
  const isNicknamePassReg = nicknameReg.test(nickname);

  const handleInputOnlyAlphabetNumber = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/gi, '');
  };

  return (
    <div className="modal-container">
      <div className="modal-title">
        Create your
        <br />
        Art de Finance account
      </div>

      <div className="signup-form">
        <div className="step-container">
          <div className="step-no">1</div>
          <div className="step-content">
            <div className="step-title">Connected address</div>
            <div className="step-value">{account?.address}</div>
          </div>
        </div>
        <div className="step-container">
          <div className="step-no">2</div>
          <div className="step-content">
            <div className="step-title active-step is-required">
              Verify your username
            </div>
            <div className="input-container">
              <div
                className={
                  nickname && isNicknamePassReg
                    ? 'input-wrapper'
                    : 'input-wrapper error'
                }
              >
                <input
                  value={nickname}
                  onChange={handleChangeNickname}
                  onInput={handleInputOnlyAlphabetNumber}
                />
                {isNicknameVerified ? (
                  <button
                    className="reset-button"
                    onClick={handleResetNickname}
                    aria-label="reset"
                  >
                    <div className="reset-logo" />
                  </button>
                ) : (
                  <></>
                )}
                <Button
                  className="verify-button"
                  onClick={handleVerifyNickname}
                  disabled={
                    isNicknameVerified || !nickname || !isNicknamePassReg
                  }
                >
                  Verify
                </Button>
              </div>
              {isNicknameVerified && nickname && isNicknamePassReg ? (
                <div className="input-available-msg">
                  Your current username {nickname} is available.
                </div>
              ) : (
                <></>
              )}

              {failMsg ? (
                <div className="input-error-msg">{failMsg}</div>
              ) : (
                <></>
              )}

              {isNicknamePassReg ? (
                <></>
              ) : (
                <div className="input-error-msg">
                  Username has to be 3-15 long characters and numbers only.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button
        className="bottom-button"
        onClick={handleSubmitNickname}
        disabled={!isNicknameVerified}
      >
        Create account
      </Button>

      <TermsBox onOpen={onOpen} />
      {isConfirmOpen && (
        <ConfirmModal
          open={isConfirmOpen}
          onConfirm={handleConfirm}
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
    </div>
  );
};

export default WalletSignup;
