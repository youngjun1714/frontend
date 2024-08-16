import React from 'react';
import Button from '@/adf-connect/components/ui/button/button';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import TermsBox from '@/adf-connect/components/ui/terms-box/terms-box';
import { useRouter } from 'next/router';

const Signin = ({ onOpen }) => {
  const { openWalletConnect } = useConnectModalContext();
  const router = useRouter();

  const handleGoogle = () => {
    router.push('/api/google-auth');
  };

  return (
    <div className="modal-container center-container ">
      <div className="adf-logo" />

      <div className="login-button-container">
        <Button className="login-button" onClick={openWalletConnect}>
          Sign in with Wallet Connect
        </Button>
        <div className="dividing-text">or</div>
        <Button
          className="login-button"
          type="secondary"
          onClick={handleGoogle}
        >
          <div className="google-logo" />
          Sign in with Google
        </Button>
        {/* <Button
          className="login-button"
          type="secondary"
          onClick={() => signIn("apple")}
        >
          <div className="apple-logo" />
          Sign in with Apple
        </Button> */}
      </div>

      <TermsBox onOpen={onOpen} />
    </div>
  );
};

export default Signin;
