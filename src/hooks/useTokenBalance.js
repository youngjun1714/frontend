import { useEffect, useState } from 'react';
import { useSignedContract } from './useContract';
import { erc20Abi, formatUnits } from 'viem';
import {
  getTetherContractAddress,
  getTokenContractAddress,
} from '@/utils/contractUtil';

const TOKENS = {
  tether: {
    address: getTetherContractAddress(),
    decimals: 6,
  },
  adf: {
    address: getTokenContractAddress(),
    decimals: 18,
  },
};

const useTokenBalance = (walletAddress, token) => {
  const [balance, setBalance] = useState('0');

  const { address, decimals } = TOKENS[token] || {};
  const tokenContract = useSignedContract(address, erc20Abi);

  const getBalance = async () => {
    try {
      let token = 0;
      token = await tokenContract.read.balanceOf([walletAddress]);
      token = formatUnits(token, decimals);
      setBalance(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (walletAddress) getBalance();
  }, [walletAddress]);

  return { balance, refetchBalance: getBalance };
};

export default useTokenBalance;
