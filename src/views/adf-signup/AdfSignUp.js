import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@/adf-connect/components/ui/button/button';
import styles from './AdfSignUp.module.scss';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const SignUp = ({ provider }) => {
  const { openModalPage, openWalletConnect } = useConnectModalContext();
  const router = useRouter();

  useEffect(() => {
    if (provider === 'google') {
      openModalPage('SIGNUP_SOCIAL');
      router.push('/adf-signup');
    }
  }, [provider]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoogle = () => {
    router.push('/api/google-auth');
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.title}>
        Welcome to <br className={styles.onlyMobile} />
        Art de Finance!
      </div>
      <div className={styles.desc}>
        We hope that your Art activities are sustainable.
        <br />
        We are looking for artists and DAOs to onboard with us in our journey.
        <br />
        Not only will the Artiside platfom be available, but ADF will also offer
        various Web 3.0 services such as &quot;THE FLUX&quot;,
        &quot;Liview&quot;, and &quot;NFT-Fi&quot;.
        <br />
        We extend a warm welcome to all creators who are shaping their own
        artistic worlds across various genres.
      </div>
      <div className={styles.signupButtonContainer}>
        <Button className={styles.walletButton} onClick={openWalletConnect}>
          Sign up with <br className={styles.onlyMobile} />
          Wallet Connect
        </Button>
      </div>
      <div className={styles.serviceContainer}>
        <div className={styles.serviceBox}>
          <div className={styles.artisideLogo} />
          <div>
            <div className={styles.serviceName}>
              Social Art Platform Service
            </div>
            <div className={styles.serviceDesc}>
              Support artists in a WEB 3.0 from Encourage artists to produce
              quality work with the community’s support.
            </div>
          </div>
        </div>
        <div className={styles.serviceBox}>
          <div className={styles.liviewLogo} />
          <div>
            <div className={styles.serviceName}>Live Stream Service</div>
            <div className={styles.serviceDesc}>
              Collaborate with galleries to produce live-streaming contents.
            </div>
          </div>
        </div>
        <div className={styles.serviceBox}>
          <div className={styles.fluxLogo} />
          <div>
            <div className={styles.serviceName}>
              Make NFT trading easy and comfortable
            </div>
            <div className={styles.serviceDesc}>
              Provides the safest trading experience by issuing NFTs to
              authenticate works and provide a repository service
            </div>
          </div>
        </div>
        <div className={styles.serviceBox}>
          <div className={styles.defiLogo} />
          <div>
            <div className={styles.serviceName}>
              Financial service with
              <br className={styles.exceptMobile} />
              NFT Assets
            </div>
            <div className={styles.serviceDesc}>
              Provides simple, safe, and transparent ‘NFT Loan’ service for
              capital efficiency in the art NFT market
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
