import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const SocialSignup = () => {
  const { openModalPage } = useConnectModalContext();

  return (
    <div className="modal-container">
      <div className="modal-title">Please sign up with your wallet.</div>
      <div className="modal-desc">
        Your Google account are not registered.
        <br />
        Please sign up with your wallet.
      </div>

      <Button className="bottom-button" onClick={() => openModalPage('SIGNIN')}>
        Connect wallet
      </Button>
    </div>
  );
};

export default SocialSignup;
