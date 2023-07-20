import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, providers } from 'ethers';
import useAuth from "./useAuth";

export const useEthBalance = () => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const { account } = useWeb3React();
  const { useProvider } = useAuth();
  const provider = useProvider();

  const fetchBalance = useCallback(async () => {
    if (!account || !provider) return;
    const rawBalance = await provider.getBalance(account);
    setBalance(rawBalance);
  }, [account, provider]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance;
};
