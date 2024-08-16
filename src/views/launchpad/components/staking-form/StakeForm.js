import { gql, useQuery } from '@apollo/client';

import styles from './index.module.scss';
import numberFormat from '@/utils/numberFormat';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import { NumericFormat } from 'react-number-format';
import useLaunchpad from '@/hooks/useLaunchpad';
import { customToast } from '@/utils/customToast';
import { CircularProgress } from '@mui/material';

const GET_PRE_STAKING_INFO = gql`
  query getPreStakingInfo {
    getPreStakingInfo {
      wallet
    }
  }
`;
const StakeForm = ({
  availableAmount,
  adfToUsd,
  amount,
  onChangeAmount,
  onRefetch,
  onCheckConnected,
  loading,
  setLoading,
  disableStaking,
}) => {
  const handleSetAmountByPercent = (percent) => {
    onChangeAmount(Math.floor(availableAmount * percent));
  };

  const { data: preStakingData } = useQuery(GET_PRE_STAKING_INFO, {
    fetchPolicy: 'cache-and-network',
    context: { clientName: 'launchpad' },
  });

  const { getPreStakingInfo } = preStakingData || {};
  const { wallet: artistWallet } = getPreStakingInfo || {};

  const { staking, approve, getAllowance } = useLaunchpad();

  const handleStake = async () => {
    setLoading(true);
    try {
      await staking({
        amount,
        artistWallet,
      });
      setLoading(false);
      onChangeAmount(0);
      customToast({
        msg: <>Staking has been successfully activated</>,
        autoClose: 2000,
      });
      onRefetch && onRefetch();
    } catch (error) {
      console.log(error);
      setLoading(false);
      customToast({
        msg: <>Staking Failed</>,
        toastType: 'error',
        autoClose: 1000,
      });
    }
  };

  const handleApprove = async () => {
    if (availableAmount < amount)
      return handleOpenErrorWithText('Balance is lower than staking amount');

    setLoading(true);

    const allowance = await getAllowance();

    if (Number(allowance) < Number(amount)) {
      try {
        await approve(amount);
        handleStake();
      } catch (error) {
        setLoading(false);
        customToast({
          msg: <>Approve Failed</>,
          toastType: 'error',
        });
      }
    } else {
      handleStake();
    }
  };

  const handleCheckAndApprove = () => {
    onCheckConnected(handleApprove);
  };

  return (
    <div className={styles.stakeForm}>
      <div className={styles.title}>Available Amount</div>
      <div className={styles.flexDiv}>
        <InfoTypography
          content={availableAmount}
          endDecorator="ADF"
          size="md"
          decimals={0}
        />
        <div className={styles.usd}>
          ${numberFormat(availableAmount * adfToUsd, 2)}
        </div>
      </div>
      <div className={styles.percentBtnWrap}>
        <button
          onClick={() => handleSetAmountByPercent(0.3)}
          disabled={loading || disableStaking}
        >
          30%
        </button>
        <button
          onClick={() => handleSetAmountByPercent(0.5)}
          disabled={loading || disableStaking}
        >
          50%
        </button>
        <button
          onClick={() => handleSetAmountByPercent(0.7)}
          disabled={loading || disableStaking}
        >
          70%
        </button>
        <button
          onClick={() => handleSetAmountByPercent(1)}
          disabled={loading || disableStaking}
        >
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
          disabled={loading || disableStaking}
          maxLength={12}
        />
        <span>ADF</span>
        {availableAmount < amount ? (
          <div className={styles.error}>*Not enough ADFs</div>
        ) : !amount ? (
          <div className={styles.error}>
            *The minimum stakable amount is 0.1 ADF.
          </div>
        ) : null}
      </div>
      <button
        className={styles.submitBtn}
        disabled={
          Number(availableAmount) < Number(amount) ||
          !Number(availableAmount) ||
          !Number(amount) ||
          loading ||
          disableStaking
        }
        onClick={handleCheckAndApprove}
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
        Stake
      </button>
    </div>
  );
};

export default StakeForm;
