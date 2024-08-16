import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const AskAddWallet = () => {
  const { openModalPage, closeConnectModal } = useConnectModalContext();

  return (
    <div className="modal-container">
      <div className="modal-title">
        You can use it after connecting your wallet.
      </div>

      <div className="modal-desc">
        Explore Art de Finance’s services and
        <br />
        experience the new world of Art.
      </div>

      <Button
        className="bottom-button"
        onClick={() => openModalPage('ADD_WALLET')}
      >
        Yes, I want to try more services
      </Button>
      <Button
        className="bottom-button"
        type="secondary"
        onClick={closeConnectModal}
      >
        No, I&apos;ll do the wallet connection next time
      </Button>
    </div>
  );
};

export default AskAddWallet;
