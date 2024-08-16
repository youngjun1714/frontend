import axios from 'axios';
import { useEffect, useState } from 'react';

const usePrice = (symbol) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const getPrice = async () => {
      try {
        const response = await axios.get(
          `https://info${
            process.env.NEXT_PUBLIC_IS_MAINNET === 'true' ? '' : '.testnet'
          }.artdefinance.io/api/price?ids=${symbol}`
        );

        setPrice(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getPrice();
  }, []);

  return price;
};

export default usePrice;
