import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const AskBindOrCreate = () => {
  const { openModalPage, account } = useConnectModalContext();

  const createAccount = async () => {
    openModalPage(loginMethod === 'wallet' ? 'SIGNUP_WALLET' : 'SIGNUP_SOCIAL');
  };

  const { loginMethod } = account || {};
  return (
    <div className="modal-container">
      <div className="modal-title">
        Do you have
        <br /> an existing account?
      </div>

      {loginMethod === 'wallet' ? (
        <div className="modal-desc">
          You may connect your wallet to an existing account or create a new
          account.
          <br />
          <br />
          Please note, if you create a new account with your wallet,
          <br /> you will no longer be able to bind it to an existing Google
          account.
        </div>
      ) : (
        <div className="modal-desc">
          You may connect your Google account to an existing account with wallet
          or create a new account.
          <br />
          <br />
          Please note, if you create a new account with your Google account, you
          will no longer be able to bind it to an existing account with wallet.
        </div>
      )}

      <Button className="login-button" onClick={createAccount}>
        No, I’d like to create a new account
      </Button>
      <Button
        className="login-button"
        type="secondary"
        onClick={() => openModalPage('BIND_SOCIAL')}
      >
        Yes, I have an existing account
      </Button>
    </div>
  );
};

export default AskBindOrCreate;
