import { useState, useEffect } from 'react';
import { Modal, Stack } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { gql, useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { useRecoilValue } from 'recoil';

import styles from './Modal.module.scss';
import Button from '@/components/ui/Button/Button';
import Close from '@/components/ui/Icons/Close';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import Avatar from '@/components/ui/Avatar/Avatar';
import ToastSuccess from '@/components/ui/Icons/ToastSuccess';
import TimerFill from '@/components/ui/Icons/TimerFill';
import Calendar from '@/components/ui/Icons/Calendar';
import numberFormat from '@/utils/numberFormat';
import useSeeding from '@/hooks/useSeeding';
import { customToast } from '@/utils/customToast';
import stores from '@/store';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import useTokenBalance from '@/hooks/useTokenBalance';

const GET_PARTNER_INFO_BY_SEEDER = gql`
  query getPartnerInfoBySeeder($episodeNo: Long, $partnerId: Long) {
    getPartnerInfoBySeeder(episodeNo: $episodeNo, partnerId: $partnerId) {
      seed
      seederAmt
      UnSeedingValidationDTO {
        latestSeedingAt
        hasPassed4Days
        latestEpisodeNo
        isLatestEpisodeLessThanCurrent
      }
    }
  }
`;

function SeedingModal(props) {
  const {
    onClose,
    open,
    menu = 'seed',
    onSetMenu,
    episodeNo,
    partner,
    onRefetch,
  } = props;

  const { userName, artistName, artistWallet, profileImgUrl, partnerId } =
    partner || {};

  const [seedAmount, setSeedAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  const { seed, unseed, approve, getAllowance } = useSeeding();

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const { balance } = useTokenBalance(me?.wallet, 'adf');

  const [getPartnerInfoBySeederQuery, { data }] = useLazyQuery(
    GET_PARTNER_INFO_BY_SEEDER,
    {
      fetchPolicy: 'cache-and-network',
      context: { clientName: 'seed' },
    }
  );
  const { getPartnerInfoBySeeder } = data || {};

  const {
    seed: seedAmt = 0,
    seederAmt = 0,
    UnSeedingValidationDTO,
  } = getPartnerInfoBySeeder || {};

  const {
    latestSeedingAt,
    hasPassed4Days,
    latestEpisodeNo,
    isLatestEpisodeLessThanCurrent,
  } = UnSeedingValidationDTO || {};

  useEffect(() => {
    if (open) {
      getPartnerInfoBySeederQuery({
        variables: {
          episodeNo,
          partnerId,
        },
      });
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    setIsApproved(false);
    setSeedAmount(0);
    onSetMenu('seed');
  };

  const handleApprove = async () => {
    if (balance < seedAmount)
      return handleOpenErrorWithText('Balance is lower than seed amount');
    setLoading(true);
    try {
      await approve(seedAmount);
      setIsApproved(true);
      setLoading(false);
      customToast({
        msg: <>Approved</>,
      });
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Approve Failed</>,
        toastType: 'error',
      });
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seed({
        amount: seedAmount,
        artistWallet,
      });
      setLoading(false);
      customToast({
        msg: <>Seeding has been successfully activated</>,
        autoClose: 2000,
      });
      handleClose();
      onRefetch && onRefetch();
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Seed Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleUnseed = async () => {
    setLoading(true);
    try {
      await unseed({
        artistWallet,
      });
      setLoading(false);
      customToast({
        msg: <>Unseeding has been successfully done</>,
        autoClose: 2000,
      });
      handleClose();
      onRefetch();
    } catch (error) {
      setLoading(false);
      customToast({
        msg: <>Unseed Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const checkAllowance = async () => {
      const allowance = await getAllowance();
      if (Number(allowance) < Number(seedAmount)) {
        setIsApproved(false);
        customToast({
          msg: <>Please approve more than {numberFormat(seedAmount)} ADF.</>,
          toastType: 'error',
          autoClose: 2000,
        });
      }
    };

    if (isApproved) {
      checkAllowance();
    }
  }, [isApproved]);

  return (
    <>
      <Modal
        open={open}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <div className={styles.headerTitle}>
              <div>Episode {episodeNo}</div>
              <StatusLabel label="LIVE" />
            </div>
            <button
              aria-label="close button"
              className={styles.close}
              onClick={handleClose}
              disabled={loading}
            >
              <Close />
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.seedStat}>
              <div className={styles.statItem}>
                <div className={styles.label}>Seed to</div>
                <div className={styles.value}>
                  <Stack direction="row" gap="8px" alignItems="center">
                    <Avatar
                      image={profileImgUrl}
                      username={userName}
                      type="md"
                    />
                    <div>
                      <div>{userName}</div>
                      <div className={styles.artistName}>@{artistName}</div>
                    </div>
                  </Stack>
                </div>
              </div>
              <div className={styles.verticalLine} />
              <div className={styles.statItem}>
                <div className={styles.label}>Total Seed(ADF)</div>
                <div className={styles.value} style={{ marginBottom: 24 }}>
                  <InfoTypography content={seedAmt} decimals={2} size="xs" />
                </div>
                <div className={styles.label}>My Seed(ADF)</div>
                <div className={styles.value}>
                  <InfoTypography content={seederAmt} decimals={2} size="xs" />
                </div>
              </div>
            </div>
            <div className={styles.thickLine} />
            <div className={styles.toggle}>
              <button
                className={menu === 'seed' ? styles.active : ''}
                onClick={() => onSetMenu('seed')}
                disabled={loading}
              >
                Seed
              </button>
              <button
                className={menu === 'unseed' ? styles.active : ''}
                onClick={() => onSetMenu('unseed')}
                disabled={loading}
              >
                Unseed
              </button>
              <div
                className={styles.circle}
                style={{
                  transform:
                    menu === 'seed' ? 'translateX(-46%)' : 'translateX(46%)',
                }}
              />
            </div>

            {menu === 'seed' && (
              <>
                <div className={styles.input}>
                  <div className={styles.inputLabel}>Enter Amount</div>
                  <div className={styles.panel}>
                    <NumericFormat
                      decimalScale={2}
                      onValueChange={(values) => {
                        setSeedAmount(values.floatValue);
                      }}
                      allowNegative={false}
                      placeholder="0"
                      thousandSeparator=","
                      value={seedAmount}
                      disabled={loading}
                      maxLength={12}
                    />
                    <span>ADF</span>
                  </div>
                </div>
                <div className={styles.thinLine} />
                <div className={styles.available}>
                  <div className={styles.availableLabel}>Available</div>
                  <div className={styles.availableValue}>
                    {numberFormat(balance, 2)}{' '}
                    <span className={styles.adf}>ADF</span>
                  </div>
                </div>
              </>
            )}

            {menu === 'unseed' && (
              <>
                {(!hasPassed4Days || !isLatestEpisodeLessThanCurrent) && (
                  <div className={styles.unseedTitle}>
                    You cannot Unseed at the moment.
                    <br />
                    Please check the Unseed conditions below.
                  </div>
                )}

                <div className={styles.unseedSelect}>
                  <button aria-label="unseed select">
                    <Stack direction="row" alignItems="center" gap="12px">
                      <TimerFill
                        color={
                          hasPassed4Days
                            ? 'var(--primary-color)'
                            : 'var(--artiside-neutral3'
                        }
                      />
                      <div className={styles.selectContent}>
                        4 day (+96 hrs) after the last
                        <br />
                        Seeding date{' '}
                        {latestSeedingAt && (
                          <span
                            style={{
                              color: 'var(--primary-color)',
                              fontWeight: 'bold',
                            }}
                          >
                            {moment(latestSeedingAt)
                              .utc()
                              .format('(UTC) MMM DD')}
                          </span>
                        )}
                      </div>
                    </Stack>
                    <ToastSuccess
                      color={
                        hasPassed4Days
                          ? 'var(--primary-color)'
                          : 'var(--artiside-neutral4'
                      }
                    />
                  </button>
                  <div className={styles.buttonDivider} />
                  <button aria-label="unseed select">
                    <Stack direction="row" alignItems="center" gap="12px">
                      <Calendar
                        color={
                          isLatestEpisodeLessThanCurrent
                            ? 'var(--primary-color)'
                            : 'var(--artiside-neutral3'
                        }
                      />
                      <div className={styles.selectContent}>
                        After the last Seeding Episode{' '}
                        {latestEpisodeNo ? (
                          <span
                            style={{
                              color: 'var(--secondary-color)',
                              fontWeight: 'bold',
                            }}
                          >
                            {latestEpisodeNo}
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Stack>
                    <ToastSuccess
                      color={
                        isLatestEpisodeLessThanCurrent
                          ? 'var(--primary-color)'
                          : 'var(--artiside-neutral4'
                      }
                    />
                  </button>
                </div>
              </>
            )}

            <div className={styles.seedingGuide}>
              Unseed is eligible for 4 days after the last Seeding date + after
              the
              <br />
              last Seeding Episode has ended.
            </div>
            {menu === 'seed' ? (
              isApproved ? (
                <Button
                  type="primary"
                  disabled={!seedAmount || seedAmount > balance || loading}
                  className={styles.seedingButton}
                  onClick={handleSeed}
                  isLoading={loading}
                >
                  Seed
                </Button>
              ) : (
                <Button
                  type="primary"
                  disabled={!seedAmount || seedAmount > balance || loading}
                  className={styles.seedingButton}
                  onClick={handleApprove}
                  isLoading={loading}
                >
                  Approve
                </Button>
              )
            ) : (
              <Button
                type="primary"
                disabled={
                  loading || !hasPassed4Days || !isLatestEpisodeLessThanCurrent
                }
                className={styles.seedingButton}
                onClick={handleUnseed}
                isLoading={loading}
              >
                Unseed
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SeedingModal;
