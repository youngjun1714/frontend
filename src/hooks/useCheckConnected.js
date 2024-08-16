import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import stores from '@/store';
import { useRecoilValue } from 'recoil';

const useCheckConnected = () => {
  const {
    common: { meState },
  } = stores;

  const me = useRecoilValue(meState);

  const { isConnectedWallet, openWalletConnect, openModalPage } =
    useConnectModalContext();

  const handleCheckConnected = (func) => {
    if (!isConnectedWallet) {
      if (me) {
        if (me?.wallet) {
          openWalletConnect();
        } else {
          openModalPage('ASK_ADD_WALLET');
        }
      } else {
        openModalPage('SIGNIN');
      }
    } else {
      func();
    }
  };
  return handleCheckConnected;
};

export default useCheckConnected;
