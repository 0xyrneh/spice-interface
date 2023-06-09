import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, providers } from 'ethers';

export const useEthBalance = () => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const { account, library } = useWeb3React();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const provider = new providers.Web3Provider(library);
    const rawBalance = await provider.getBalance(account);
    setBalance(rawBalance);
  }, [account, library]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance;
};
