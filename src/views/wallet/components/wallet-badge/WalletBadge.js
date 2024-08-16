import styles from './WalletBadge.module.scss';

const WalletBadge = ({ type = 'black', label }) => (
  <div className={`${styles.badge} ${styles[type]}`}>{label}</div>
);

export default WalletBadge;
