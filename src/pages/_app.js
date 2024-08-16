import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApollo } from '@/library/apollo-client';
import moment from 'moment';
import Script from 'next/script';

import '@/styles/globals.scss';

import * as gtag from '@/library/gtag';
import { useNProgress } from '@/hooks/useNprogress';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { RecoilRoot } from 'recoil';
import Connector from '@/adf-connect/connector';
import Layout from '@/components/layout/Layout/Layout';
import { isMainnet } from '@/utils/contractUtil';

// moment.js Customization
moment.fn.fromNowOrNow = function (date) {
  if (Math.abs(moment().diff(this)) < 60_000) {
    return 'just now';
  }
  return this.fromNow(date);
};

moment.updateLocale('en', {
  relativeTime: {
    m: '1 minute',
    h: '1 hour',
    d: '1 day',
    M: '1 Month',
    y: '1 year',
  },
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useNProgress();
  const [isMobile, setIsMobile] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    if (isMainnet) {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('hashChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        router.events.off('hashChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isMobileOrTablet =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    setIsMobile(isMobileOrTablet);
  }, []);

  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    const splashScreenTimer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 500);
  });

  return (
    <>
      <Head>
        <title>Artiside</title>
        <meta
          name="description"
          content="Let your passion for art guide you."
          key="description"
        />
        <meta property="og:title" content="Artiside" key="og-title" />
        <meta
          property="og:description"
          content="Let your passion for art guide you."
          key="og-description"
        />
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}`}
          key="og-url"
        />
        <meta property="og:image" content="/Artiside.png" key="og-image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtag.GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
      <ApolloProvider client={apolloClient}>
        <Connector>
          <RecoilRoot>
            <Layout isMobile={isMobile} showSplashScreen={showSplashScreen}>
              <Component {...pageProps} isMobile={isMobile} />
            </Layout>
          </RecoilRoot>
        </Connector>
      </ApolloProvider>
    </>
  );
}
