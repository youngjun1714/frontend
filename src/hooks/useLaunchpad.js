import { parseUnits, formatUnits, erc20Abi } from 'viem';
import { gql, useMutation } from '@apollo/client';

import Staking from '@/abi/Staking.json';
import Voting from '@/abi/Voting.json';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';
import { useSignedContract, publicClient } from '@/hooks/useContract';
import {
  getStakingContractAddress,
  getVotingContractAddress,
  getTokenContractAddress,
} from '@/utils/contractUtil';

const SUBMIT_LAUNCHPAD_HASH = gql`
  mutation setLaunchpadEventHash(
    $event: String!
    $txHash: String!
    $success: Boolean!
  ) {
    setLaunchpadEventHash(event: $event, txHash: $txHash, success: $success)
  }
`;

const ADF_UNIT = 18;

const useLaunchpad = () => {
  const stakingContractAddress = getStakingContractAddress();
  const stakingAbi = Staking.abi;
  const stakingContract = useSignedContract(stakingContractAddress, stakingAbi);

  const votingContractAddress = getVotingContractAddress();
  const votingAbi = Voting.abi;
  const votingContract = useSignedContract(votingContractAddress, votingAbi);

  const ADF_ADDRESS = getTokenContractAddress();
  const adfContract = useSignedContract(ADF_ADDRESS, erc20Abi);

  const { address } = useConnectModalContext();

  const [submitHash] = useMutation(SUBMIT_LAUNCHPAD_HASH, {
    context: { clientName: 'launchpad' },
  });

  /**
   *
   * @param {string} event : STAKING | UNSTAKING | PREV_UNSTAKING | REWARD_REQUEST | REWARD_CLAIM | VOTING
   * @param {string} txHash
   * @param {boolean} success
   */
  const handleSetLaunchpadHash = (event, txHash, success) => {
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

  const handleStaking = async ({ amount, artistWallet }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await stakingContract.write.staking([
          parseUnits(amount.toString(), ADF_UNIT),
          artistWallet,
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('STAKING', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('STAKING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleUnstaking = async ({ amount }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await stakingContract.write.unStaking([
          parseUnits(amount.toString(), ADF_UNIT),
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('UNSTAKING', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('UNSTAKING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handlePrevUnstaking = async ({ launchPadId }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await stakingContract.write.preLaunchPadUnStaking([
          launchPadId,
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('PREV_UNSTAKING', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('PREV_UNSTAKING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleRequestReward = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await stakingContract.write.rewardRequest([]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('REWARD_REQUEST', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('REWARD_REQUEST', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleClaimStakingReward = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await stakingContract.write.rewardClaim([]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('STAKING_CLAIMED', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('STAKING_CLAIMED', hash, false);
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
          stakingContractAddress,
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
            stakingContractAddress,
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

  const handleVoting = async ({ artistWallet, amount }) =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await votingContract.write.voting([
          artistWallet,
          parseUnits(amount.toString(), ADF_UNIT),
        ]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('VOTING', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('VOTING', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  const handleClaimVotingReward = async () =>
    new Promise(async (resolve, reject) => {
      try {
        const hash = await votingContract.write.votingRewardClaim([]);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash,
        });
        // console.log(transaction);
        if (transaction.status === 'success') {
          handleSetLaunchpadHash('VOTING_CLAIMED', hash, true);
          resolve();
        } else {
          handleSetLaunchpadHash('VOTING_CLAIMED', hash, false);
          throw new Error(transaction);
        }
      } catch (error) {
        console.log(error);
        // logSentryError(error);
        reject(error);
      }
    });

  return {
    staking: handleStaking,
    unstaking: handleUnstaking,
    prevUnstaking: handlePrevUnstaking,
    requestReward: handleRequestReward,
    claimStakingReward: handleClaimStakingReward,
    approve: handleApprove,
    getAllowance,
    voting: handleVoting,
    claimVotingReward: handleClaimVotingReward,
  };
};

export default useLaunchpad;
