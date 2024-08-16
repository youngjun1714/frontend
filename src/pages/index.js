import React from 'react';
import Head from 'next/head';
import Creation from '@/pages/creation';

const pageIndex = () => (
  <>
    <Head>
      <link
        rel="canonical"
        href={`https://${process.env.NEXT_PUBLIC_AUTH_AUDIENCE}`}
      />
    </Head>
    <Creation />
  </>
);

export default pageIndex;
