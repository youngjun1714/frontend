import styles from './index.module.scss';

const Switch = ({ tab, onChangeTab, disabled }) => (
  <div className={styles.switch}>
    <button
      aria-label="stake button"
      className={tab === 'stake' ? styles.active : ''}
      onClick={() => onChangeTab('stake')}
      disabled={disabled}
    >
      Stake
    </button>
    <button
      aria-label="unstake button"
      className={tab === 'unstake' ? styles.active : ''}
      onClick={() => onChangeTab('unstake')}
      disabled={disabled}
    >
      Unstake
    </button>
    <div
      className={styles.circle}
      style={{
        transform: tab === 'stake' ? 'translateX(-46%)' : 'translateX(46%)',
      }}
    />
  </div>
);

export default Switch;
