import styles from './PartnerHelper.module.scss';

export default function PartnerHelper() {
  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <h1>Partner Account</h1>
      </div>
      <div className={styles.body}>
        <p>
          <span className={styles.red}>&quot;Partners&quot;</span> is a paid
          membership program
          <br />
          that allows artists to register tradable NFTs.
          <br />
          Through <span className={styles.red}>&quot;Partners&quot;</span>,
          artists can sell their
          <br />
          registered art or even receive patronage
          <br />
          through the{' '}
          <span className={styles.blue}>&quot;ADF Token Seeding&quot;</span>
          program
          <br />
          on Artiside.
        </p>
      </div>
    </div>
  );
}
