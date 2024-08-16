import styles from './MobileConnectBoxWallet.module.scss';

import ServiceLogo from '@/components/ui/Icons/ServiceLogo';
import TokenLogo from '@/components/ui/Icons/TokenLogo';
import CopyButton from '@/components/ui/CopyButton/CopyButton';

const MobileConnectBoxWallet = (props) => {
  const { wallet, nickname } = props;
  return (
    <div className={styles.wallet}>
      {!wallet ? <ServiceLogo shape="google" /> : <TokenLogo shape="polygon" />}
      <div>
        {!wallet ? (
          <h1>{(nickname || '').substring(0, 12)}</h1>
        ) : (
          <h1>
            {wallet.substring(0, 6)}...
            {wallet.substring(wallet.length - 6)}
          </h1>
        )}
        <CopyButton text={wallet} />
      </div>
    </div>
  );
};

export default MobileConnectBoxWallet;
