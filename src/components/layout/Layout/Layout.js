import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { gql, useQuery } from '@apollo/client';

import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import stores from '@/store';
import Footer from '../Footer/Footer';
import TopNav from '../TopNav/TopNav';
import { CustomToastContainer } from '@/utils/customToast';
import SplashScreen from '../SplashScreen/SplashScreen';
import dynamic from 'next/dynamic';

const ConfirmModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/ConfirmModal')
);

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      wallet
      email
      nickname
      profileImgUrl
      coverImgUrl
      hasNotification
      lastReportAt
      isPartner
      partner {
        artistName
      }
    }
  }
`;

const ANONYMOUS_ONLY_PAGE = ['/adf-signup', '/adf-signup/google-callback'];

const Layout = (props) => {
  const {
    common: { meState },
  } = stores;
  const router = useRouter();

  const [isNavHidden, setIsNavHidden] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [me, setMe] = useRecoilState(meState);
  const { client, loading, data, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { getCurrentUser } = data || {};

  const { account, isConnectedWallet, address, logOutAdf } =
    useConnectModalContext();
  const { isLoggedIn } = account;

  useEffect(() => {
    if (isLoggedIn && ANONYMOUS_ONLY_PAGE.includes(router.pathname)) {
      router.replace('/');
    }
  }, [router.pathname, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    logOutAdf();
    setMe(null);
    location.href = '/';
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleResetStore();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) {
      return;
    }
    if (getCurrentUser) {
      setMe({ ...getCurrentUser });
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // when wallet has changed
  useEffect(() => {
    if (
      isLoggedIn &&
      isConnectedWallet &&
      address &&
      me &&
      me.wallet &&
      me.wallet !== address
    ) {
      setIsConfirmOpen(true);
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // when refresh page and wallet has changed
  useEffect(() => {
    if (
      isLoggedIn &&
      isConnectedWallet &&
      address &&
      me &&
      me.wallet &&
      me.wallet !== address
    ) {
      handleLogout();
    }
  }, [me]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResetStore = async () => {
    try {
      const result = await client.resetStore();
    } catch (e) {}
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNavHidden(true);
        } else {
          setIsNavHidden(false);
        }
      },
      { threshold: 0.5 }
    );
    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [observerTarget]);

  // Web, Mobile Common State
  const [path, setPath] = useState(router.pathname);
  const handleChangePath = (path) => {
    setPath(path);
  };

  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const isNeedNavPaths = ['/', '/creation', '/feed', `/artist/[artistId]`];

  return (
    <>
      {props.showSplashScreen && <SplashScreen />}
      <>
        <TopNav
          path={path}
          onChangePath={handleChangePath}
          isOpenCreate={isOpenCreate}
          isNavHidden={isNavHidden}
          isNeedNav={isNeedNavPaths.includes(router.pathname)}
        />
        <div className="app-container">{props.children}</div>
        <Footer />
        <div ref={observerTarget} style={{ width: '100%' }} />
        {mounted && isConfirmOpen && (
          <ConfirmModal
            open={isConfirmOpen}
            onConfirm={handleLogout}
            title="Lost wallet connection"
            msg="You have been signed out because you
      are disconnected from the wallet you signed up with or connected to
      another wallet."
          />
        )}
        <CustomToastContainer
          closeOnClick={true}
          pauseOnFocusLoss={false}
          hideProgressBar={true}
        />
      </>
    </>
  );
};

export default Layout;
