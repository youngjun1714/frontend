import AdfSignUp from '@/views/adf-signup/AdfSignUp';
import oauth2Client from '@/utils/googleOauth2Client';
import axios from 'axios';
import tokenStore from '@/adf-connect/utils/token-store';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import { useEffect, useState } from 'react';

const PageGoogleCallback = (props) => {
  const {
    accessToken,
    refreshToken,
    tempToken,
    email,
    nickname,
    wallet,
    partner_status,
  } = props;

  const { account, setAccount, setTempToken } = useConnectModalContext();

  const [provider, setProvider] = useState('');

  useEffect(() => {
    if (tempToken) {
      // setTempToken(tempToken);
      setProvider('google');
    } else {
      tokenStore.set('accessToken', accessToken);
      tokenStore.set('refreshToken', refreshToken);
    }
  }, [tempToken, accessToken, refreshToken, setTempToken]);

  useEffect(() => {
    setAccount({
      ...account,
      loginMethod: 'social',
      email,
      nickname,
      address: wallet,
      partnerStatus: partner_status,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <AdfSignUp provider={provider} />;
};

export const getServerSideProps = async ({ req, res }) => {
  if (!('google-oauth-code' in req.cookies)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  try {
    const oauthCode = req.cookies['google-oauth-code'];
    res.setHeader(
      'Set-Cookie',
      'google-oauth-code=; Path=/; Max-Age=0; HttpOnly'
    );
    const { tokens } = await oauth2Client.getToken(oauthCode);

    const data = {
      id_token: tokens.id_token,
      audience: process.env.NEXT_PUBLIC_AUTH_AUDIENCE,
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/web/login`,
      data
    );

    return {
      props: { ...response.data.response },
    };
  } catch (e) {
    console.error(e.response.data);
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
};

export default PageGoogleCallback;
