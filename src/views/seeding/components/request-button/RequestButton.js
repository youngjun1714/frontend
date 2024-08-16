import Data from '@/components/ui/Icons/Data';
import styles from './RequestButton.module.scss';
import Requested from '@/components/ui/Icons/Requested';
import Unrequested from '@/components/ui/Icons/Unrequested';
import moment from 'moment';

const RequestButton = ({
  rewardRequestType,
  requestPeriod,
  onRequest,
  isLiveEpisode,
  isPolling,
  isSelected,
  isLastEpisode,
}) => {
  switch (rewardRequestType) {
    case 'NONE':
      return !isLiveEpisode &&
        moment().isBefore(requestPeriod) &&
        isLastEpisode ? (
        <div className={styles.disabled}>Processing</div>
      ) : !isLiveEpisode && moment().isBefore(requestPeriod) ? (
        <button
          className={styles.requestButton}
          onClick={onRequest}
          disabled={isPolling && isSelected}
        >
          <Data
            color={
              isPolling && isSelected
                ? 'var(--artiside-neutral3)'
                : 'var(--artiside-neutral7)'
            }
          />
          Request
        </button>
      ) : null;

    case 'REQUESTED':
      return (
        <div className={styles.disabled}>
          <Requested />
          Requested
        </div>
      );

    case 'UNREQUESTED':
      return (
        <div className={styles.disabled}>
          <Unrequested />
          Unrequested
        </div>
      );

    case 'NO_SEED':
      return <div className={styles.disabled}>No Seed</div>;

    default:
      return;
  }
};

export default RequestButton;
