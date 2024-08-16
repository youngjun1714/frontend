import React from 'react';
import styles from './WalletTokenRow.module.scss';

import InfoTypography from '@/components/ui/Typography/InfoTypography';
import DollarTypography from '@/components/ui/Typography/DollarTypography';
import WalletTokenRowIcon from '../wallet-token-row-icon/WalletTokenRowIcon';
import MobileADFSquareLogo from '@/components/mobile-ui/MobileIcons/MobileADFSquareLogo';
import MobilePolygonSquareLogo from '@/components/mobile-ui/MobileIcons/MobilePolygonSquareLogo';
import MobileTetherSquareLogo from '@/components/mobile-ui/MobileIcons/MobileTetherSquareLogo';

function WalletTokenRow(props) {
  const { token, content, toUsd, unit, claimableReward } = props;

  const tokenName = {
    ADF: 'ADF',
    polygon: 'Polygon',
    tether: 'Tether',
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.head}>
          <div className={styles.webIcon}>
            <WalletTokenRowIcon token={token} />
          </div>
          <div className={styles.mobileIcon}>
            {token === 'ADF' && <MobileADFSquareLogo />}
            {token === 'polygon' && <MobilePolygonSquareLogo />}
            {token === 'tether' && <MobileTetherSquareLogo />}
          </div>
          <p>{tokenName[token]}</p>
        </div>
        <div className={styles.body}>
          <InfoTypography content={content} endDecorator={unit} size="sm" />
          <DollarTypography content={Number(content) * toUsd} size="sm" />
        </div>
      </div>
    </div>
  );
}

export default WalletTokenRow;
