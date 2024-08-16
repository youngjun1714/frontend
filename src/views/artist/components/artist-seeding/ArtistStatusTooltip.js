import Warning from '@/components/ui/Icons/Warning';
import styles from './ArtistStatusCard.module.scss';

function ArtistStatusTooltip() {
  return (
    <div className={styles.tooltip}>
      <Warning />
      <div>
        <p className={styles.tooltipTitle}>
          This Artist will be deleted from your account.
        </p>
        <p className={styles.tooltipSub}>
          Please unseed any amounts you have seeded.
        </p>
      </div>
    </div>
  );
}

export default ArtistStatusTooltip;
