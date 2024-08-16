import ConfirmModal from '@/adf-connect/components/ui/confirm-modal/confirm-modal';
import ExclamationIcon from '@/adf-connect/assets/icons/exclamation';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const AccountExists = () => {
  const { closeConnectModal } = useConnectModalContext();

  return (
    <ConfirmModal
      open={true}
      onConfirm={closeConnectModal}
      confirmButtonContent="Log in"
      size="sm"
      desc={
        <>
          <ExclamationIcon />
          <div>You have an existing account.</div>
        </>
      }
      subDesc={
        <>
          If you create a new account with your wallet,
          <br />
          connect to new wallet address.
        </>
      }
    />
  );
};

export default AccountExists;
