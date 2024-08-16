import { isMainnet } from '@/utils/contractUtil';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#00a300" />
        <meta name="theme-color" content="#ffffff" />
        {isMainnet ? (
          <meta
            name="keywords"
            content="artiside, Artiside, NFT, art, digital art, nft art, artwork, market, ADF, Art de Finance, 아티사이드"
          />
        ) : (
          <meta name="robots" content="noindex" />
        )}
        <meta
          name="google-site-verification"
          content="_UyY1SI0cTBUIZrqUNyDwDYdRcdvcvTnuhMD4Hm85_o"
        />
        <meta
          name="naver-site-verification"
          content="592988bb38cc1d701fe0e8dc80c69a24748dd075"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
