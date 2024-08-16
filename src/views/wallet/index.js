import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { Container } from '@mui/material';
import { useBalance } from 'wagmi';

import styles from './Wallet.module.scss';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';

import MobileHeader from '@/components/mobile-ui/MobileHeader/MobileHeader';
import MobileIsPartnerBadge from '@/components/mobile-ui/MobileIcons/MobileIsPartnerBadge';
import WalletNavMenu from './components/wallet-nav-menu/WalletNavMenu';
import Reward from './Reward';
import usePrice from '@/hooks/usePrice';

import History from './History';
import Balance from './Balance';
import useTokenBalance from '@/hooks/useTokenBalance';
import { formatUnits } from 'viem';

const Wallet = ({ isMobile }) => {
  const router = useRouter();
  const { query } = router;
  const { tab = 'balance' } = query;

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // Balance
  const { balance: adfBalance } = useTokenBalance(me?.wallet, 'adf');
  const { balance: tetherBalance } = useTokenBalance(me?.wallet, 'tether');
  const { data: polygon } = useBalance({
    address: me?.wallet,
  });
  const polygonBalance = useMemo(() => {
    if (polygon) {
      return formatUnits(polygon?.value, polygon?.decimals);
    } else {
      return '0';
    }
  }, [polygon]);

  // Currency
  const currency = {
    matic: usePrice('matic'),
    tether: usePrice('tether'),
    adf: usePrice('adf'),
  };

  useEffect(() => {
    if (me && !me?.wallet) {
      router.back();
    }
  }, [me]); // eslint-disable-line react-hooks/exhaustive-deps

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Wallet | Artiside</title>
      </Head>
      <MobileHeader title="Wallet" onClick={() => router.back()} />
      {mounted && (
        <Container className={styles.walletContainer} sx={{ marginBottom: 10 }}>
          <div className={styles.header}>
            <div className={styles.user}>
              <Avatar
                type="xl"
                username={me?.nickname}
                image={me?.profileImgUrl}
              />
              <div>
                <h1>
                  {me?.nickname}{' '}
                  {me?.isPartner && <MobileIsPartnerBadge size="md" />}
                </h1>
                {me?.isPartner && <p>@{me?.partner?.artistName}</p>}
              </div>
            </div>
          </div>
          {!isMobile && <WalletNavMenu tab={tab} />}
          {tab === 'balance' && (
            <Balance
              currency={currency}
              balances={{
                adf: adfBalance,
                tether: tetherBalance,
                polygon: polygonBalance,
              }}
              isMobile={isMobile}
            />
          )}

          {tab === 'reward' && !isMobile && <Reward />}
          {tab === 'history' && !isMobile && <History />}
        </Container>
      )}
    </>
  );
};

export default Wallet;
