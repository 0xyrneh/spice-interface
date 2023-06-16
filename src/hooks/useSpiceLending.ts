import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { BigNumber, ethers } from "ethers";

import { useAppSelector } from "@/state/hooks";
import {
  useNftVaultContract,
  useSpiceLendingContract,
  useWethContract,
} from "@/hooks/useContract";
import {
  fetchLendUserLoanDataAsync,
  fetchLendUserNftApproveDataAsync,
  fetchLendUserWethDataAsync,
  fetchVaultUserDepositDataAsync,
  removeLendUserLoanData,
} from "@/state/actions";
import { VaultInfo } from "@/types/vault";
import { DEFAULT_LEND } from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { setPendingTxHash } from "@/state/modal/modalSlice";

export const useSpiceLending = (
  lendAddr: string | undefined,
  vaultAddr: string
) => {
  const currentLendAddr = lendAddr || DEFAULT_LEND[activeChainId];

  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const lendingContract = useSpiceLendingContract(currentLendAddr);
  const newLendingContract = useSpiceLendingContract(
    DEFAULT_LEND[activeChainId]
  );
  const vaultContract = useNftVaultContract(vaultAddr);
  const wethContract = useWethContract();
  const { vaults } = useAppSelector((state) => state.vault);
  const currentVault = vaults.find(
    (row: VaultInfo) => row.address === vaultAddr
  );

  const handleApproveNft = useCallback(
    async (tokenId: number): Promise<string | undefined> => {
      if (!account) return "";
      if (!vaultContract || !newLendingContract) return "";

      const tx = await vaultContract.approve(
        newLendingContract.address,
        tokenId
      );
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserNftApproveDataAsync(
            currentLendAddr,
            tokenId,
            account
          ) as any
        );
      }, 500);

      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultContract, lendingContract]
  );

  const handleApproveWeth = useCallback(async (): Promise<
    string | undefined
  > => {
    if (!account) return "";
    if (!wethContract || !lendingContract) return "";

    const tx = await wethContract.approve(
      lendingContract.address,
      ethers.constants.MaxUint256
    );
    dispatch(setPendingTxHash(tx.hash));

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
      throw new Error();
    }

    setTimeout(() => {
      dispatch(fetchLendUserWethDataAsync(currentLendAddr, account) as any);
    }, 500);

    return tx.hash;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, dispatch, wethContract, lendingContract]);

  const handleInitiate = useCallback(
    async (terms: any, signature: any): Promise<string | undefined> => {
      if (!account) return "";
      if (!newLendingContract) return "";

      const tx = await newLendingContract.initiateLoan(terms, signature);
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);

      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault) as any);
      }, 5000);

      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, newLendingContract]
  );

  const handleIncrease = useCallback(
    async (
      loanId: number,
      terms: any,
      signature: any
    ): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.updateLoan(loanId, terms, signature);
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);

      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  const handlePartialDecrease = useCallback(
    async (
      loanId: number,
      repayAmount: string
    ): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.partialRepay(loanId, repayAmount);
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);

      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  const handleDecrease = useCallback(
    async (loanId: number): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.repay(loanId);
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      dispatch(removeLendUserLoanData(currentLendAddr, loanId) as any);

      setTimeout(() => {
        dispatch(fetchVaultUserDepositDataAsync(account, currentVault) as any);
      }, 5000);

      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, lendingContract]
  );

  const handleDeposit = useCallback(
    async (loaId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.deposit(loaId, amount.toString());
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);
      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  const handleDepositETH = useCallback(
    async (loaId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.depositETH(loaId, { value: amount });
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);
      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  const handleWithdraw = useCallback(
    async (loaId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.withdraw(loaId, amount.toString());
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);
      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  const handleWithdrawETH = useCallback(
    async (loaId: number, amount: BigNumber): Promise<string | undefined> => {
      if (!account) return "";
      if (!lendingContract) return "";

      const tx = await lendingContract.withdrawETH(loaId, amount.toString());
      dispatch(setPendingTxHash(tx.hash));

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error();
      }

      setTimeout(() => {
        dispatch(
          fetchLendUserLoanDataAsync(currentLendAddr, account, vaultAddr) as any
        );
      }, 500);
      return tx.hash;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, dispatch, vaultAddr, lendingContract]
  );

  return {
    onApprovePrologueNft: handleApproveNft,
    onApproveWeth: handleApproveWeth,
    onObtainLeverage: handleInitiate,
    onIncreaseLeverage: handleIncrease,
    onPartialDecreaseLeverage: handlePartialDecrease,
    onDecreaseLeverage: handleDecrease,
    onLendingDeposit: handleDeposit,
    onLendingDepositETH: handleDepositETH,
    onLendingWithdraw: handleWithdraw,
    onLendingWithdrawETH: handleWithdrawETH,
  };
};
