import styles from './RequestRewardBanner.module.scss';
import dynamic from 'next/dynamic';

import Close from '@/components/ui/Icons/Close';
import ExclamaFillWhite from '@/components/ui/Icons/ExclamaFillWhite';
import { Tooltip } from '@mui/material';
import QuestionCircle from '@/components/ui/Icons/QuestionCircle';

const Timer = dynamic(() => import('@/components/ui/Timer/SeedingTimer'), {
  ssr: false,
});

const RequestRewardBanner = ({
  requestPeriod,
  onOpenRequestRewardModal,
  onSetOpenBanner,
}) => (
  <div className={styles.requestRewardBannerContainer}>
    <div className={styles.requestRewardBanner}>
      <button
        aria-label="close button"
        className={styles.closeButton}
        onClick={() => {
          onSetOpenBanner(false);
        }}
      >
        <Close />
      </button>
      <ExclamaFillWhite />
      <div>
        Request your reward from the previous episode. You won’t be able to
        request it later.{' '}
        <b>
          The remaining time:{' '}
          <Timer expiryTimestamp={requestPeriod} onHandleExpired={() => {}} />
        </b>
      </div>
      <Tooltip
        arrow
        title={
          <div className={styles.tooltip}>
            Unrequested rewards within the designated period will go to the
            Community Pool.
          </div>
        }
        style={{ marginLeft: '-8px', marginTop: '3px' }}
      >
        <span>
          <QuestionCircle color="var(--artiside-neutral1)" />
        </span>
      </Tooltip>
      <button
        className={styles.requestButton}
        onClick={onOpenRequestRewardModal}
      >
        Request Now
      </button>
    </div>
  </div>
);

export default RequestRewardBanner;
