import { decodeAbiParameters, parseAbiParameters } from 'viem';

export const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET === 'true';

export const getShortAddress = (address) => {
  if (address && typeof address === 'string') {
    return `${address.substring(0, 6)}…${address.substring(
      address.length - 6
    )}`;
  } else {
    return '';
  }
};

export const getTetherContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_TETHER_POLYGON
    : process.env.NEXT_PUBLIC_TETHER_AMOY;

export const getTokenContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_TOKEN_POLYGON
    : process.env.NEXT_PUBLIC_TOKEN_AMOY;

export const getNftContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_NFT_POLYGON
    : process.env.NEXT_PUBLIC_NFT_AMOY;

export const getSeedingContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_SEEDING_POLYGON
    : process.env.NEXT_PUBLIC_SEEDING_AMOY;

export const getStakingContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_STAKING_POLYGON
    : process.env.NEXT_PUBLIC_STAKING_AMOY;

export const getVotingContractAddress = () =>
  isMainnet
    ? process.env.NEXT_PUBLIC_VOTING_POLYGON
    : process.env.NEXT_PUBLIC_VOTING_AMOY;

export const formatTokenId = (tokenId) => {
  try {
    if (tokenId)
      return decodeAbiParameters(
        parseAbiParameters('uint256'),
        tokenId
      )?.[0]?.toString();
  } catch (e) {
    return '';
  }
  return '';
};

export const getExplorerUrlByHash = (hash, type = 'tx') => {
  const base = isMainnet
    ? 'https://polygonscan.com'
    : 'https://amoy.polygonscan.com';
  return `${base}/${type}/${hash}`;
};
