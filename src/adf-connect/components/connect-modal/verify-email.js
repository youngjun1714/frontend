import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from '@/adf-connect/utils/axios';
import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import moment from 'moment';
import InfoEmailCode from './info-email-code';

const Timer = dynamic(
  () => import('@/adf-connect/components/ui/timer/verify-timer'),
  {
    ssr: false,
  }
);

const VerifyEmail = (props) => {
  const { code, onChangeCode, email, setIsEmailVerified } = props;

  const { openModalPage, tempToken, setTempToken } = useConnectModalContext();

  const [failMsg, setFailMsg] = useState('');
  const [endTime, setEndTime] = useState(moment().add(30, 'minutes'));

  const handleChangeCode = (e) => {
    onChangeCode(e.target.value);
    setFailMsg('');
  };

  const handleSubmitVerifyCode = async () => {
    try {
      const data = {
        tempToken,
        email,
        verificationCode: code,
      };

      const response = await axios.post(`/join/verify-mail`, data);
      setTempToken(response.data.response.tempToken);
      setIsEmailVerified(true);
      openModalPage('SIGNUP_WALLET');
    } catch (error) {
      console.log(error);
      setFailMsg('Please input a valid verification code.');
    }
  };

  const handleVerifyMail = async () => {
    try {
      const data = {
        email,
      };

      await axios.post(`/join/resend-mail`, data);
      setEndTime(moment().add(30, 'minutes'));
    } catch (error) {
      console.log(error);
    }
  };

  const [isInfoMail, setIsInfoMail] = useState(false);

  return isInfoMail ? (
    <InfoEmailCode email={email} onConfirm={() => setIsInfoMail(false)} />
  ) : (
    <div className="modal-container">
      <div className="modal-header">Email verification</div>
      <div className="modal-title" style={{ marginTop: 20 }}>
        Enter 6-digit code
      </div>
      <div className="modal-desc">
        Your code was emailed to{' '}
        <b>{email || 'artdefinance@artdefinance.io'}</b>
        <br />
        The code is valid for 30 minutes.
      </div>
      <div className="input-container">
        <div className="input-label">Email verification code</div>
        <div className={failMsg ? 'input-wrapper error' : 'input-wrapper'}>
          <input
            className="verification-code"
            value={code}
            maxLength={6}
            onChange={handleChangeCode}
          />
          <div className="verify-time">
            <Timer expiryTimestamp={endTime} />
          </div>
          <Button type="underlined" size="sm" onClick={handleVerifyMail}>
            Resend code
          </Button>
        </div>
        {failMsg ? <div className="input-error-msg">{failMsg}</div> : <></>}
      </div>
      <Button
        type="underlined"
        onClick={() => setIsInfoMail(true)}
        className="info-email-button"
      >
        Didn’t get the email?
      </Button>
      <Button
        className="bottom-button"
        onClick={handleSubmitVerifyCode}
        disabled={code.length !== 6 || failMsg}
      >
        Submit
      </Button>
    </div>
  );
};

export default VerifyEmail;
