import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';

import { useNftVaultContract, useWethContract } from '@/hooks/useContract';
import { fetchVaultGlobalDataAsync, fetchVaultUserDepositDataAsync, fetchVaultUserTokenDataAsync } from '@/state/actions';

import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { VaultInfo } from '@/types/vault';
import { setPendingTxHash } from '@/state/modal/modalSlice';

export const useNftVault = (address: string) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const vaultContract = useNftVaultContract(address);
  const wethContract = useWethContract();
  const { vaults } = useAppSelector((state) => state.vault);
  const currentVault = vaults.find((row: VaultInfo) => row.address === address);

  const handleApprove = useCallback(async (): Promise<string | undefined> => {
    if (!account || !currentVault) return '';
    if (!wethContract) return '';
    if (!vaultContract) return '';

    const tx = await wethContract.approve(vaultContract.address, ethers.constants.MaxUint256);
    dispatch(setPendingTxHash(tx.hash));
    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      throw new Error();
    }

    dispatch(fetchVaultUserTokenDataAsync(account, currentVault));

    return tx.txHash;
  }, [account, dispatch, wethContract, currentVault, vaultContract]);

  const handleDeposit = useCallback(
    async (tokenId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract['deposit(uint256,uint256)'](tokenId, amount);
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  const handleDepositETH = useCallback(
    async (tokenId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract.depositETH(tokenId, { value: amount });
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  const handleWithdraw = useCallback(
    async (tokenId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract['withdraw(uint256,uint256,address)'](tokenId, amount, account);
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  const handleWithdrawETH = useCallback(
    async (tokenId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract.withdrawETH(tokenId, amount, account);
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  const handleRedeem = useCallback(
    async (tokenId: number, shares: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract['redeem(uint256,uint256,address)'](tokenId, shares, account);
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  const handleRedeemETH = useCallback(
    async (tokenId: number, shares: BigNumber): Promise<string | undefined> => {
      if (!account || !currentVault) return '';
      if (!vaultContract) return '';

      const tx = await vaultContract.redeemETH(tokenId, shares, account);
      dispatch(setPendingTxHash(tx.hash));
      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(fetchVaultUserTokenDataAsync(account, currentVault));
      dispatch(fetchVaultGlobalDataAsync());
      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault));
      }, 5000);

      return tx.txHash;
    },
    [account, dispatch, currentVault, vaultContract]
  );

  return {
    onApprove: handleApprove,
    onDeposit: handleDeposit,
    onDepositETH: handleDepositETH,
    onWithdraw: handleWithdraw,
    onWithdrawETH: handleWithdrawETH,
    onRedeem: handleRedeem,
    onRedeemETH: handleRedeemETH,
  };
};
