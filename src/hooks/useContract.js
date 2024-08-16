import { createPublicClient, fallback, http, getContract } from 'viem';
import { useWalletClient } from 'wagmi';
import { polygon, polygonAmoy } from 'viem/chains';
import { isMainnet } from '@/utils/contractUtil';

const chain =
  process.env.NEXT_PUBLIC_IS_MAINNET === 'true' ? polygon : polygonAmoy;

export const useSignedContract = (address, abi) => {
  const { data: walletClient } = useWalletClient();

  const contract = getContract({
    address,
    abi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  return contract ? contract : null;
};

const getAlchemyHttp = () => {
  const apiKey =
    process.env.NEXT_PUBLIC_IS_MAINNET === 'true'
      ? process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_MAINNET_KEY
      : process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_AMOY_KEY;

  return http(
    `https://polygon-${
      isMainnet ? 'mainnet' : 'amoy'
    }.g.alchemy.com/v2/${apiKey}`
  );
};

export const publicClient = createPublicClient({
  chain,
  transport: fallback([getAlchemyHttp()]),
});
