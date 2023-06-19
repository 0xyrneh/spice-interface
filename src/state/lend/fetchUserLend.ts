import { BigNumber } from "ethers";

import NftAbi from "@/config/abi/Erc721.json";
import WethAbi from "@/config/abi/WETH.json";
import SpiceFiLendingAbi from "@/config/abi/SpiceFiLending.json";
import multicall from "@/utils/multicall";
import { getWethAddress } from "@/utils/addressHelpers";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import SpiceFiNFT4626Abi from "@/config/abi/SpiceFiNFT4626.json";
import { activeChainId } from "@/utils/web3";
import { getBalanceInEther } from "@/utils/formatBalance";

const spiceNftAddr = DEFAULT_AGGREGATOR_VAULT[activeChainId];

export const fetchUserNftData = async (lendAddr: string, tokenId: number) => {
  const [approver] = await multicall(NftAbi, [
    {
      address: spiceNftAddr,
      name: "getApproved",
      params: [tokenId],
    },
  ]);

  return {
    isApproved: approver[0].toLowerCase() === lendAddr.toLowerCase(),
  };
};

export const fetchUserWethData = async (account: string, lendAddr: string) => {
  const [wethAllowance] = await multicall(WethAbi, [
    {
      address: getWethAddress(),
      name: "allowance",
      params: [account, lendAddr],
    },
  ]);

  return {
    allowance: wethAllowance[0],
  };
};

export const fetchUserLendLoanData = async (
  account: string,
  vaultAddr: string,
  lendAddr: string
) => {
  const [activeLoanIdsRaw] = await multicall(SpiceFiLendingAbi, [
    {
      address: lendAddr,
      name: "getActiveLoans",
      params: [account],
    },
  ]);

  const activeLoanIds = activeLoanIdsRaw[0].map((row: BigNumber) =>
    row.toNumber()
  );

  try {
    const activeLoansRaw = await Promise.all(
      activeLoanIds.map((activeLoanId: number) => {
        const callData = [
          {
            address: lendAddr,
            name: "getLoanData",
            params: [activeLoanId],
          },
          {
            address: lendAddr,
            name: "repayAmount",
            params: [activeLoanId],
          },
        ];
        return multicall(SpiceFiLendingAbi, callData);
      })
    );

    const activeLoans = await Promise.all(
      activeLoanIds.map(async (loanId: any, id: number) => {
        const { state, terms, startedAt, balance, interestAccrued, updatedAt } =
          activeLoansRaw[id][0][0];
        const tokenId = terms.collateralId.toNumber();

        const [tokenShare] = await multicall(SpiceFiNFT4626Abi, [
          {
            address: vaultAddr,
            name: "tokenShares",
            params: [tokenId],
          },
        ]);

        const [tokenAsset, rawPrice] = await multicall(SpiceFiNFT4626Abi, [
          {
            address: vaultAddr,
            name: "convertToAssets",
            params: [tokenShare[0]],
          },
          {
            address: vaultAddr,
            name: "previewRedeem",
            params: [tokenShare[0]],
          },
        ]);

        return {
          loanId,
          state,
          terms,
          startedAt: startedAt.toNumber(),
          loanAmount: terms.loanAmount,
          repayAmount: activeLoansRaw[id][1][0],
          interestAccrued,
          updatedAt: updatedAt.toNumber(),
          tokenId,
          tokenAmntInVault: tokenAsset[0],
          balance,
          price: getBalanceInEther(rawPrice[0]),
        };
      })
    );

    return {
      activeLoans,
    };
  } catch {
    return {
      activeLoans: [],
    };
  }
};
