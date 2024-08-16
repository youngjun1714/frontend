import { Modal, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

import styles from './Modal.module.scss';
import Button from '@/components/ui/Button/Button';
import LockClosed from '@/components/ui/Icons/LockClosed';
import Close from '@/components/ui/Icons/Close';
import moment from 'moment';
import useSeeding from '@/hooks/useSeeding';
import { customToast } from '@/utils/customToast';

const GET_ARTIST_WALLETS = gql`
  query getPreRequestReward($episodeNo: Long) {
    getPreRequestReward(episodeNo: $episodeNo) {
      artistWallets
    }
  }
`;

function RequestRewardModal(props) {
  const { open, onClose, episodeNo, requestPeriod, onRefetch } = props;

  const [getArtistWallets, { data, loading: isLoadingWallets }] = useLazyQuery(
    GET_ARTIST_WALLETS,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        episodeNo,
      },
      context: { clientName: 'seed' },
    }
  );
  const { getPreRequestReward } = data || {};
  const { artistWallets } = getPreRequestReward || {};

  useEffect(() => {
    if (open) getArtistWallets();
  }, [open]);

  const { requestReward } = useSeeding();

  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleRequestReward = async () => {
    if (!artistWallets || !artistWallets?.length) return;
    setLoading(true);
    try {
      await requestReward({
        episodeNo,
        artistWallets,
      });
      setLoading(false);
      customToast({
        msg: <>Request reward has been successfully done</>,
        autoClose: 2000,
      });
      setIsDone(true);
      onRefetch();
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Request reward Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleClose = () => {
    setIsDone(false);
    onClose();
  };

  return (
    open && (
      <Modal
        open={open}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <div
              className={styles.headerTitle}
            >{`Episode ${episodeNo} Reward`}</div>
            <button
              aria-label="close button"
              className={styles.close}
              onClick={handleClose}
            >
              <Close />
            </button>
          </div>
          <div className={styles.modalBody}>
            {/* <div className={styles.priceContainer}>
            <div className={styles.label}>Reward</div>
            <div className={styles.priceBox}>
              <span>12.34</span>
              <span className={styles.adf}>ADF</span>
            </div>
          </div> */}
            <Stack
              direction="row"
              justifyContent="space-between"
              mt="24px"
              mb="24px"
            >
              <div className={styles.claimDateLabel}>Claim available date</div>
              <div className={styles.claimDate}>
                {moment(requestPeriod).utc().format('(UTC) MMM DD, YYYY')}
              </div>
            </Stack>
            <div className={styles.requestRewardGuide}>
              <div className={styles.lockClosedWrap}>
                <LockClosed />
              </div>
              <div className={styles.content}>
                You can receive the reward in your wallet +12 weeks from the
                date of request.
                <br />
                <div style={{ marginTop: 8 }}>
                  Only 10% of the rewards will be paid if you wish to receive
                  rewards immediately without waiting for the lock-up period.
                </div>
              </div>
            </div>
            {isDone ? (
              <Button
                className={styles.bottomButton}
                type="primary"
                onClick={handleClose}
              >
                Done
              </Button>
            ) : (
              <Button
                className={styles.bottomButton}
                type="primary"
                disabled={loading || isLoadingWallets}
                isLoading={loading || isLoadingWallets}
                onClick={handleRequestReward}
              >
                Request
              </Button>
            )}
          </div>
        </div>
      </Modal>
    )
  );
}

export default RequestRewardModal;
