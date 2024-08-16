import { useEffect, useState } from 'react';
import axios from '@/adf-connect/utils/axios';
import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import TermsBox from '@/adf-connect/components/ui/terms-box/terms-box';
import dynamic from 'next/dynamic';
import useOpen from '@/hooks/useOpen';

const ConfirmModal = dynamic(() =>
  import('@/adf-connect/components/ui/confirm-modal/confirm-modal')
);
const ConfirmModalIcon = dynamic(() =>
  import('@/components/ui/ConfirmModal/ConfirmModal')
);

const AddWallet = ({ onOpen }) => {
  const {
    openWalletConnect,
    disconnect,
    closeConnectModal,
    account,
    setAccount,
    signature,
  } = useConnectModalContext();

  const [isConfirmOpen, handleOpenConfirm] = useOpen();
  const [isErrorConfirmOpen, handleOpenErrorConfirm, handleCloseErrorConfirm] =
    useOpen();

  const [failMsg, setFailMsg] = useState('');

  const [isWalletVerified, setIsWalletVerified] = useState(false);

  const handleVerifyAccount = async () => {
    try {
      const data = {
        walletAddress: account?.address,
        signature,
      };

      const response = await axios.post(`/join/connect-wallet`, data);
      if (response.data.response.code === 0) {
        handleOpenConfirm();
      }
    } catch (error) {
      console.log(error);
      setFailMsg(error?.response?.data?.response?.message);

      if (
        error?.response?.data?.response?.message.indexOf('user_wallet_un') !==
        -1
      ) {
        handleOpenErrorConfirm();
      }
    }
  };

  const handleResetWallet = () => {
    setIsWalletVerified(false);
    disconnect();
    setAccount((prev) => ({ ...prev, address: null }));
    handleCloseErrorConfirm();
  };

  const handleConfirm = () => {
    closeConnectModal();
    location.reload();
  };

  useEffect(() => {
    if (account?.address) setIsWalletVerified(true);
  }, [account?.address]);

  return (
    <div className="modal-container">
      <div className="modal-title">Connecting your wallet</div>

      <div className="signup-form">
        <div className="step-container">
          <div className="step-no">1</div>
          {isWalletVerified ? (
            <div className="step-content">
              <div className="step-title">Connected your wallet</div>
              <div className="step-value">{account?.address}</div>
            </div>
          ) : (
            <div className="step-content">
              <div className="step-title">Connect your wallet</div>
              <Button className="bottom-button" onClick={openWalletConnect}>
                Connect to Wallet
              </Button>
            </div>
          )}
        </div>
        <div className="step-container">
          <div className="step-no">2</div>
          <div className="step-content">
            <div className="step-title">Your email address</div>
            <div className="step-value">{account?.email}</div>
          </div>
        </div>

        <div className="step-container">
          <div className="step-no">3</div>
          <div className="step-content">
            <div className="step-title active-step">Your username</div>
            <div className="step-value">{account?.nickname}</div>
          </div>
        </div>
      </div>

      <Button
        className="bottom-button"
        onClick={handleVerifyAccount}
        disabled={!isWalletVerified}
      >
        Verify account
      </Button>
      <Button
        className="bottom-button"
        type="secondary"
        onClick={closeConnectModal}
        style={{ marginTop: 20 }}
      >
        No, I&apos;ll do the wallet connection next time
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
              Your wallet connected
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
        <ConfirmModalIcon
          open={isErrorConfirmOpen}
          onConfirm={handleResetWallet}
          title="Wallet is already used"
          type="warning"
        />
      )}
    </div>
  );
};

export default AddWallet;
