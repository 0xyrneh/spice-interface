import { BigNumber } from "ethers";

import WethAbi from "@/config/abi/WETH.json";
import VaultAbi from "@/config/abi/SpiceFiVault.json";
import multicall from "@/utils/multicall";
import { getWethAddress } from "@/utils/addressHelpers";
import { getBalanceInWei } from "@/utils/formatBalance";
import { getUserSpiceNfts } from "@/utils/subgraph";
import { VaultInfo } from "@/types/vault";

export const fetchUserTokenData = async (account: string, vault: VaultInfo) => {
  // get weth allowance, balance
  const [userTokenAllowance, userTokenBalance] = await multicall(WethAbi, [
    {
      address: getWethAddress(),
      name: "allowance",
      params: [account, vault.address],
    },
    {
      address: getWethAddress(),
      name: "balanceOf",
      params: [account],
    },
  ]);

  return {
    userTokenAllowance: userTokenAllowance[0],
    userTokenBalance: userTokenBalance[0],
  };
};

export const fetchUserVaultData = async (account: string, vault: VaultInfo) => {
  const vaultTvl = vault.tvl || 0;
  const vaultTotalShares = vault.totalShares || 0;

  if (vault.fungible) {
    const [userShareBalance, userMaxRedeemable] = await multicall(VaultAbi, [
      {
        address: vault.address,
        name: "balanceOf",
        params: [account],
      },
      {
        address: vault.address,
        name: "maxRedeem",
        params: [account],
      },
    ]);

    const [userTokenBalance] = await multicall(VaultAbi, [
      {
        address: vault.address,
        name: "convertToAssets",
        params: [userShareBalance[0]],
      },
    ]);

    return {
      userNftsRaw: [],
      userNfts: [],
      userDepositAmnt: userTokenBalance[0],
      userMaxRedeemable: userMaxRedeemable[0],
    };
  }

  const nfts = await getUserSpiceNfts(account);
  const userNfts = nfts
    .map((row: any) => ({
      tokenId: Number(row.tokenId),
      tokenShare: BigNumber.from(row.shares),
      depositAmnt:
        vaultTotalShares === 0
          ? BigNumber.from(row.shares)
          : BigNumber.from(row.shares)
              .mul(BigNumber.from(getBalanceInWei(vaultTvl.toString())))
              .div(
                BigNumber.from(getBalanceInWei(vaultTotalShares.toString()))
              ),
    }))
    .sort((a: any, b: any) => (a.tokenId > b.tokenId ? 1 : -1));

  // deposited balance
  let depositAmnt = BigNumber.from(0);
  userNfts.map((row: any) => {
    depositAmnt = depositAmnt.add(row.depositAmnt);
    return row;
  });

  return {
    userNftsRaw: userNfts,
    userNfts: userNfts.map((row: any) => row.tokenId),
    userDepositAmnt: depositAmnt,
  };
};

export const fetchUserData = async (account: string, vault: VaultInfo) => {
  const { userTokenAllowance, userTokenBalance } = await fetchUserTokenData(
    account,
    vault
  );
  const { userNfts, userDepositAmnt } = await fetchUserVaultData(
    account,
    vault
  );

  return {
    userTokenAllowance,
    userTokenBalance,
    userNfts,
    userDepositAmnt,
  };
};
