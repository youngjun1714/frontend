import numberFormat from '@/utils/numberFormat';
import styles from './index.module.scss';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import { NumericFormat } from 'react-number-format';
import useOpen from '@/hooks/useOpen';
import dynamic from 'next/dynamic';
import useLaunchpad from '@/hooks/useLaunchpad';
import { customToast } from '@/utils/customToast';
import { CircularProgress } from '@mui/material';

const UnstakeConfirmModal = dynamic(() =>
  import('../modals/UnstakeConfirmModal')
);

const UnstakeForm = ({
  stakedAmount,
  adfToUsd,
  amount,
  onChangeAmount,
  onCheckConnected,
  onRefetch,
  stakingStatus,
  loading,
  setLoading,
}) => {
  const handleSetAmountByPercent = (percent) => {
    onChangeAmount(Math.floor(stakedAmount * percent));
  };
  const [confirmModalOpen, handleOpenConfirmModal, handleCloseConfirmModal] =
    useOpen();

  const { unstaking } = useLaunchpad();

  const handleUnstake = async () => {
    handleCloseConfirmModal();
    setLoading(true);
    try {
      await unstaking({
        amount,
      });
      setLoading(false);
      onChangeAmount(0);
      customToast({
        msg: <>Unstaking has been successfully activated</>,
        autoClose: 2000,
      });
      onRefetch && onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
      customToast({
        msg: <>Unstaking Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleCheckAndUnstake = () => {
    onCheckConnected(handleUnstake);
  };

  return (
    <div className={styles.stakeForm}>
      <div className={styles.title}>Staked Amount</div>
      <div className={styles.flexDiv}>
        <InfoTypography
          content={stakedAmount}
          endDecorator="ADF"
          size="md"
          decimals={0}
        />
        <div className={styles.usd}>
          ${numberFormat(stakedAmount * adfToUsd, 2)}
        </div>
      </div>
      <div className={styles.percentBtnWrap}>
        <button
          onClick={() => handleSetAmountByPercent(0.3)}
          disabled={loading}
        >
          30%
        </button>
        <button
          onClick={() => handleSetAmountByPercent(0.5)}
          disabled={loading}
        >
          50%
        </button>
        <button
          onClick={() => handleSetAmountByPercent(0.7)}
          disabled={loading}
        >
          70%
        </button>
        <button onClick={() => handleSetAmountByPercent(1)} disabled={loading}>
          100%
        </button>
      </div>
      <div className={styles.input}>
        <NumericFormat
          decimalScale={1}
          onValueChange={(values) => {
            onChangeAmount(values.floatValue);
          }}
          allowNegative={false}
          placeholder="0"
          thousandSeparator=","
          value={amount}
          disabled={loading}
          maxLength={12}
        />
        <span>ADF</span>
        {stakedAmount < amount && (
          <div className={styles.error}>*Not enough ADFs</div>
        )}
      </div>
      <button
        className={styles.submitBtn}
        disabled={stakedAmount < amount || !amount || loading}
        onClick={handleOpenConfirmModal}
      >
        {loading && (
          <CircularProgress
            thickness={5}
            sx={{
              width: '24px !important',
              height: '24px !important',
              color: 'var(--artiside-neutral2) !important',
              marginRight: 2,
            }}
          />
        )}
        Unstake
      </button>
      {confirmModalOpen && (
        <UnstakeConfirmModal
          open={confirmModalOpen}
          onClose={handleCloseConfirmModal}
          onSubmit={handleCheckAndUnstake}
          stakingStatus={stakingStatus}
          adfToUsd={adfToUsd}
        />
      )}
    </div>
  );
};

export default UnstakeForm;
