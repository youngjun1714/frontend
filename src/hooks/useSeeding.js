import { parseUnits, formatUnits, erc20Abi } from 'viem';
import { gql, useMutation } from '@apollo/client';

import Seeding from '@/abi/Seeding.json';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import { useSignedContract, publicClient } from '@/hooks/useContract';
import {
  getSeedingContractAddress,
  getTokenContractAddress,
} from '@/utils/contractUtil';
// import { logSentryError } from '@/utils/logSentryError';

const SUBMIT_SEEDING_HASH = gql`
  mutation setSeedEventHash(
    $event: String!
    $txHash: String!
    $success: Boolean!
  ) {
    setSeedEventHash(event: $event, txHash: $txHash, success: $success)
  }
`;

const ADF_UNIT = 18;

const useSeeding = () => {
  const seedingContractAddress = getSeedingContractAddress();
  const seedingAbi = Seeding.abi;
  const seedingContract = useSignedContract(seedingContractAddress, seedingAbi);
  const ADF_ADDRESS = getTokenContractAddress();
  const adfContract = useSignedContract(ADF_ADDRESS, erc20Abi);

  const { address } = useConnectModalContext();

  const [submitHash] = useMutation(SUBMIT_SEEDING_HASH, {
    context: { clientName: 'seed' },
  });

  /**
   *
   * @param {string} event : SEEDING | UNSEEDING | REQUEST | CLAIMED | IM_CLAIMED
   * @param {string} txHash
   * @param {boolean} success
   */
  const handleSetSeedingHash = (event, txHash, success) => {
    try {
      submitHash({
        variables: {
          event,
          txHash,
          success,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeed = async ({ amount, artistWallet }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await seedingContract.write.seeding([
          artistWallet,
          parseUnits(amount.toString(), ADF_UNIT),
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetSeedingHash('SEEDING', hash, true);
          resolve();
        } else {
          handleSetSeedingHash('SEEDING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleUnseed = async ({ artistWallet }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await seedingContract.write.unseeding([artistWallet]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetSeedingHash('UNSEEDING', hash, true);
          resolve();
        } else {
          handleSetSeedingHash('UNSEEDING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleRequestReward = async ({ episodeNo, artistWallets }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await seedingContract.write.seederRewardReq([
          episodeNo,
          artistWallets,
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetSeedingHash('REQUEST', hash, true);
          resolve();
        } else {
          handleSetSeedingHash('REQUEST', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleClaimReward = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await seedingContract.write.seederClaim([]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetSeedingHash('CLAIMED', hash, true);
          resolve();
        } else {
          handleSetSeedingHash('CLAIMED', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleClaimRewardImmediately = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await seedingContract.write.seederImClaim([]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetSeedingHash('IM_CLAIMED', hash, true);
          resolve();
        } else {
          handleSetSeedingHash('IM_CLAIMED', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const getAllowance = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const allowance = await adfContract.read.allowance([
          address,
          seedingContractAddress,
        ]);
        resolve(formatUnits(allowance, ADF_UNIT));
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleApprove = async (price) =>
    new Promise(async (resolve, reject) => {
      try {
        const allowance = await getAllowance();

        if (Number(allowance) >= Number(price)) {
          resolve();
        } else {
          const hash = await adfContract.write.approve([
            seedingContractAddress,
            parseUnits(price.toString(), ADF_UNIT),
          ]);
          const transaction = await publicClient.waitForTransactionReceipt({
            hash,
          });
          // console.log(transaction);
          if (transaction.status === 'success') {
            resolve();
          } else {
            throw new Error(transaction);
          }
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  return {
    seed: handleSeed,
    unseed: handleUnseed,
    requestReward: handleRequestReward,
    claimReward: handleClaimReward,
    claimRewardImmediately: handleClaimRewardImmediately,
    approve: handleApprove,
    getAllowance,
  };
};

export default useSeeding;
