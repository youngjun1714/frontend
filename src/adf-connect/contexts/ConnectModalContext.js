import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
  useAccount,
  useAccountEffect,
  useDisconnect,
  useSignMessage,
} from 'wagmi';
import tokenStore from '@/adf-connect/utils/token-store';
import axios from 'axios';
import axiosInstance from '@/adf-connect/utils/axios';
import PAGE from '@/adf-connect/utils/PAGE.json';
import useOpen from '@/hooks/useOpen';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ConfirmModalIcon = dynamic(() =>
  import('@/components/ui/ConfirmModal/ConfirmModal')
);

/**
 * @typedef TAccount
 * @property {('wallet'|'social'|null)} loginMethod
 * @property {?String} address
 * @property {?String} email
 * @property {?String} nickname
 * @property {Boolean} isLoggedIn
 *
 * @typedef TConnectModalContext
 * @property {boolean} isConnectModalOpen
 * @property {function} closeConnectModal
 * @property {number} modalPage
 * @property {function} openModalPage
 * @property {function} goBackModalPage
 * @property {string} audience
 * @property {TAccount} account
 * @property {string} signature
 * @property {function} setAccount
 * @property {string} tempToken
 * @property {function} setTempToken
 * @property {string} address
 * @property {function} openWalletConnect
 * @property {function} disconnect
 * @property {function} logOutAdt
 * @property {boolean} isConnectedWallet
 * @property {boolean} isLoadedUserInfo
 */

/** @type {import('react').Context<TConnectModalContext>} */
export const ConnectModalContext = createContext();

export const ConnectModalContextProvider = ({ children }) => {
  const [isConnectModalOpen, setOpenModal] = useState(false);
  const [modalPage, setModalPage] = useState(PAGE.SIGNIN);
  const [modalHistory, setModalHistory] = useState([]);
  const [tempToken, setTempToken] = useState(null);
  const [account, setAccount] = useState({
    loginMethod: null,
    address: null,
    email: null,
    nickname: null,
    isLoggedIn: false,
  });
  const { current: audience } = useRef(process.env.NEXT_PUBLIC_AUTH_AUDIENCE);

  const clearAllToken = () => {
    setTempToken(null);
    tokenStore.clear('accessToken');
    tokenStore.clear('refreshToken');
  };

  const closeConnectModal = () => {
    if (
      ![
        PAGE.SIGNIN,
        PAGE.ACCOUNT_EXISTS,
        PAGE.ASK_ADD_WALLET,
        PAGE.ADD_WALLET,
      ].includes(modalPage)
    ) {
      clearAllToken();
      disconnect();
      setAccount({
        loginMethod: null,
        address: null,
        email: null,
        nickname: null,
        isLoggedIn: false,
      });
      setModalPage(PAGE.SIGNIN);
      setModalHistory([PAGE.SIGNIN]);
    }
    setOpenModal(false);
  };

  const openModalPage = (pageName) => {
    setOpenModal(true);
    setModalPage(PAGE[pageName]);
    setModalHistory([modalPage, ...modalHistory]);
  };

  const goBackModalPage = () => {
    if (!modalHistory.length || modalHistory[0] === PAGE.SIGNIN) {
      handleLogOut();
    }
    setModalPage(modalHistory[0]);
    setModalHistory(modalHistory.slice(1));
  };

  const router = useRouter();

  const {
    isConnected: isConnectedWallet,
    address,
    isReconnecting,
    connector,
  } = useAccount();

  useAccountEffect({
    onConnect({ address }) {
      if (
        (isConnectModalOpen &&
          [PAGE.SIGNIN, PAGE.ADD_WALLET].includes(modalPage)) ||
        (!isConnectModalOpen &&
          !account?.isLoggedIn &&
          !isReconnecting &&
          router?.pathname === '/adf-signup')
      )
        handleSign(address);
    },
    onDisconnect() {
      console.debug('Wallet is disconnected');
    },
  });

  const { disconnect } = useDisconnect();

  const { open: openWalletConnect } = useWeb3Modal();

  const [signature, setSignature] = useState(null);

  const [isErrorConfirmOpen, handleOpenErrorConfirm, handleCloseErrorConfirm] =
    useOpen();

  const afterSign = async (signature) => {
    setSignature(signature);
    if (modalPage === PAGE.ADD_WALLET) {
      try {
        const res = await axiosInstance.post(`/join/verify-wallet`, {
          walletAddress: address,
          signature,
        });
        if (res.data.response.code === 0) {
          setAccount({
            ...account,
            address,
          });
        }
      } catch (e) {
        if (
          e?.response?.data?.response?.message ===
          'wallet in use by another account'
        ) {
          handleOpenErrorConfirm();
        }
        disconnect();
        console.error(e);
      }
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`,
          {
            walletAddress: address,
            signature,
            audience,
          }
        );
        const {
          accessToken,
          refreshToken,
          tempToken,
          nickname,
          email,
          partner_status,
        } = res.data.response;
        if (tempToken) {
          setTempToken(tempToken);
        } else {
          tokenStore.set('accessToken', accessToken);
          tokenStore.set('refreshToken', refreshToken);
        }

        setAccount({
          ...account,
          loginMethod: 'wallet',
          email,
          nickname,
          address,
          partnerStatus: partner_status,
        });

        if (tempToken) {
          openModalPage('ASK_BIND_OR_CREATE');
        } else {
          closeConnectModal();
        }
      } catch (e) {
        disconnect();
        console.error(e);
      }
    }
  };

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess(data) {
        console.debug('sign success', JSON.stringify(data));
        afterSign(data);
      },
      onError(err) {
        if (err.toString().includes('User rejected request')) {
          console.debug(
            'Message Sign is rejected by user. Wallet should be disconnected '
          );
          // Disconnect when user try to sign in but user reject signing
          if (modalPage === PAGE.SIGNIN && isConnectModalOpen) {
            disconnect();
          }
        }
      },
    },
  });

  const getSignMessage = async (address) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/generate-message`,
        {
          walletAddress: address,
        }
      );
      return res.data.response.generateMessage;
    } catch (e) {
      disconnect();
      console.error(e);
    }
  };

  const handleSign = async (address) => {
    const message = await getSignMessage(address);
    signMessage({
      message,
    });
  };

  const handleLogOut = () => {
    clearAllToken();
    tokenStore.clearAll();
    disconnect();
    setAccount({
      loginMethod: null,
      address: null,
      email: null,
      nickname: null,
      isLoggedIn: false,
    });
  };

  const [isLoadedUserInfo, setIsLoadedUserInfo] = useState(false);
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/auth/userinfo');
      const { wallet, email, nickname, partner_status } = response?.data || {};
      setAccount({
        ...account,
        address: wallet,
        email,
        nickname,
        isLoggedIn: true,
        partnerStatus: partner_status,
      });
      setIsLoadedUserInfo(true);
    } catch (error) {
      console.log(error);
      setIsLoadedUserInfo(true);
    }
  };

  // when page refresh get userInfo
  useEffect(() => {
    if (!account?.isLoggedIn) {
      getUserInfo();
    }
  }, [account]); // eslint-disable-line react-hooks/exhaustive-deps

  // when page refresh before finishing signup
  useEffect(() => {
    const handleUnload = () => {
      if (
        ![
          PAGE.SIGNIN,
          PAGE.ACCOUNT_EXISTS,
          PAGE.ASK_ADD_WALLET,
          PAGE.ADD_WALLET,
        ].includes(modalPage) &&
        isConnectModalOpen
      ) {
        clearAllToken();
        disconnect();
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [modalPage, isConnectModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Disconnect when user opens connect modal to sign in
  useEffect(() => {
    if (modalPage === PAGE.SIGNIN && isConnectModalOpen) disconnect();
  }, [modalPage, isConnectModalOpen, disconnect]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectModalContext.Provider
      value={{
        isConnectModalOpen,
        closeConnectModal,
        modalPage,
        openModalPage,
        goBackModalPage,
        audience,
        account,
        signature,
        setAccount,
        tempToken,
        setTempToken,
        address,
        openWalletConnect,
        disconnect,
        logOutAdf: handleLogOut,
        isConnectedWallet: !!isConnectedWallet && !!connector,
        isLoadedUserInfo,
      }}
    >
      {children}
      {mounted && isErrorConfirmOpen && (
        <ConfirmModalIcon
          open={isErrorConfirmOpen}
          onConfirm={() => {
            disconnect();
            handleCloseErrorConfirm();
          }}
          title="Wallet is already used"
          type="warning"
        />
      )}
    </ConnectModalContext.Provider>
  );
};

export const useConnectModalContext = () => {
  const context = useContext(ConnectModalContext);
  if (context === undefined) {
    throw new Error(
      'useConnectModalContext must be used within a ConnectModalContextProvider'
    );
  }
  return context;
};
