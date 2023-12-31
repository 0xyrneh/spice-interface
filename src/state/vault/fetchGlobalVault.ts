import { BigNumber } from "ethers";
import axios from "axios";

import { VAULT_API, BLUR_API_BASE } from "@/config/constants/backend";
import {
  DEFAULT_AGGREGATOR_VAULT,
  DEFAULT_BLUR_VAULT,
  VAULT_BLACKLISTED,
} from "@/config/constants/vault";
import multicall from "@/utils/multicall";
import { getBalanceInEther } from "@/utils/formatBalance";
import { VaultInfo, ReceiptToken } from "@/types/vault";
import VaultAbi from "@/config/abi/SpiceFiVault.json";
import SpiceFiNFT4626Abi from "@/config/abi/SpiceFiNFT4626.json";
import WethAbi from "@/config/abi/WETH.json";
import Blur4626Abi from "@/config/abi/Blur4626.json";
import { getWethAddress } from "@/utils/addressHelpers";
import { activeChainId } from "@/utils/web3";
import {
  getVaultBackgroundImage,
  getVaultLogo,
  getVaultReadableName,
  getVaultDisplayName,
} from "@/utils/vault";
import { VaultFilter } from "@/types/common";
import {
  VAULT_DESCRIPTIONS,
  VAULT_REQUIREMENTS,
  VAULT_RISK,
} from "@/constants/vaults";
import { formatBlurChart } from "@/utils/formatter";
import { fetchETHPrice } from "@/state/oracle/fetchPrice";
import {
  calculateBlurVaultHistApy,
  calculateBlurVaultEstApy,
} from "@/utils/apy";

const apiEnv = activeChainId === 1 ? "prod" : "goerli";

const getVaultHistoricalApy = (vaultInfo: VaultInfo) => {
  const aprField = "actual_returns";
  return vaultInfo?.okrs ? vaultInfo?.okrs[aprField] : 0;
};

const getVaultEstimatedApy = (vaultInfo: VaultInfo) => {
  const aprField = "expected_return";
  return 100 * (vaultInfo?.okrs ? vaultInfo?.okrs[aprField] : 0);
};

// fetch onchain/offchain data of active vaults
export const fetchActiveVaults = async (vaults: any[]) => {
  let vaultsWithDetails = (
    await Promise.all(
      vaults.map((row: VaultInfo) =>
        axios.get(`${VAULT_API}/${row.address}?env=${apiEnv}`)
      )
    )
  )
    .filter((row: any) => row.status === 200)
    .map((row: any) => row.data.data);

  vaultsWithDetails = vaults.map((row: any, i: number) => ({
    ...row,
    ...vaultsWithDetails[i],
    startTime: row.start_time,
  }));

  try {
    const onChainInfo = await Promise.all(
      vaultsWithDetails.map((row: VaultInfo) => {
        const callData = row?.fungible
          ? [
              {
                address: row.address,
                name: "totalAssets",
                params: [],
              },
              {
                address: row.address,
                name: "totalSupply",
                params: [],
              },
            ]
          : [
              {
                address: row.address,
                name: "totalShares",
                params: [],
              },
              {
                address: row.address,
                name: "totalAssets",
                params: [],
              },
              {
                address: row.address,
                name: "totalSupply",
                params: [],
              },
              {
                address: row.address,
                name: "maxSupply",
                params: [],
              },
            ];
        return multicall(
          row?.fungible ? VaultAbi : SpiceFiNFT4626Abi,
          callData
        );
      })
    );

    const vaultWethInfo = await Promise.all(
      vaultsWithDetails.map((row: VaultInfo) => {
        const callData = [
          {
            address: getWethAddress(),
            name: "balanceOf",
            params: [row.address],
          },
        ];
        return multicall(WethAbi, callData);
      })
    );

    const vaultsWithTvl = vaultsWithDetails.map((row: VaultInfo, i: number) => {
      if (row.type === "aggregator") {
        return {
          ...row,
          totalShares: row?.fungible
            ? getBalanceInEther(onChainInfo[i][1][0])
            : getBalanceInEther(onChainInfo[i][0][0]),
          tvl: row?.fungible
            ? getBalanceInEther(onChainInfo[i][0][0])
            : getBalanceInEther(onChainInfo[i][1][0]),
          wethBalance: vaultWethInfo[i][0][0],
          totalSupply: row?.fungible
            ? getBalanceInEther(onChainInfo[i][1][0])
            : onChainInfo[i][2][0].toNumber(),
          maxSupply: row?.fungible ? 0 : onChainInfo[i][3][0].toNumber(),
          apr: 100 * (row?.okrs?.expected_return || 0),
          apy: 100 * (row?.okrs?.expected_return || 0),
          historicalApy: getVaultHistoricalApy(row),
          estimatedApy: getVaultEstimatedApy(row),
          name: getVaultDisplayName(row?.name),
          logo: getVaultLogo(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          backgroundImage: getVaultBackgroundImage(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          receiptToken: row.fungible ? ReceiptToken.ERC20 : ReceiptToken.NFT,
          userInfo: {
            allowance: BigNumber.from(0),
            tokenBalance: BigNumber.from(0),
            nfts: [],
            amount: BigNumber.from(0),
          },
          category: row.fungible ? VaultFilter.Public : VaultFilter.VIP,
          isBlur: false,
        };
      }
      return {
        ...row,
        tvl: getBalanceInEther(onChainInfo[i][0][0]),
        wethBalance: vaultWethInfo[i][0][0],
        totalSupply: 0,
        apr: 100 * (row?.okrs?.expected_return || 0),
        apy: 100 * (row?.okrs?.expected_return || 0),
        historicalApy: getVaultHistoricalApy(row),
        estimatedApy: getVaultEstimatedApy(row),
        name: getVaultDisplayName(row?.name),
        logo: getVaultLogo(row?.fungible, row?.type, row?.deprecated, row.name),
        backgroundImage: getVaultBackgroundImage(
          row?.fungible,
          row?.type,
          row?.deprecated,
          row.name
        ),
        receiptToken: row.fungible ? ReceiptToken.ERC20 : ReceiptToken.NFT,
        userInfo: {
          allowance: BigNumber.from(0),
          tokenBalance: BigNumber.from(0),
          nfts: [],
          amount: BigNumber.from(0),
        },
        category: VaultFilter.Public,
        isBlur: false,
      };
    });

    const defaultVault =
      vaultsWithTvl.find(
        (row: VaultInfo) =>
          DEFAULT_AGGREGATOR_VAULT[activeChainId].toLowerCase() ===
          row.address.toLowerCase()
      ) || vaultsWithTvl[0];

    return { default: defaultVault, all: vaultsWithTvl };
  } catch (err) {
    console.log("err", err);
    return { default: {}, all: [] };
  }
};

// fetch onchain data of leverage vaults
export const fetchLeverageVaults = async (vaults: any[]) => {
  try {
    const onChainInfo = await Promise.all(
      vaults.map((vault: any) => {
        const callData = [
          {
            address: getWethAddress(),
            name: "balanceOf",
            params: [vault.address],
          },
          {
            address: vault.address,
            name: "totalAssets",
            params: [],
          },
        ];

        return multicall(VaultAbi, callData);
      })
    );

    const data = vaults.map((row: any, i: number) => ({
      ...row,
      wethBalance: onChainInfo[i][0][0],
      totalAssets: onChainInfo[i][1][0],
      category: VaultFilter.Public,
      isBlur: false,
    }));

    return data;
  } catch (err) {
    console.log("err", err);
    return [];
  }
};

// fetch active blur vaults
export const fetchBlurVaults = async (vaults: any[]) => {
  let vaultsWithDetails = (
    await Promise.all(
      vaults.map((row: VaultInfo) =>
        axios.get(`${VAULT_API}/${row.address}?env=${apiEnv}`)
      )
    )
  )
    .filter((row: any) => row.status === 200)
    .map((row: any) => row.data.data);

  vaultsWithDetails = vaults.map((row: any, i: number) => ({
    ...row,
    ...vaultsWithDetails[i],
    startTime: row.start_time,
  }));

  try {
    const onChainInfo = await Promise.all(
      vaultsWithDetails.map((row: VaultInfo) => {
        const callData = [
          {
            address: row.address,
            name: "totalAssets",
            params: [],
          },
          {
            address: row.address,
            name: "totalSupply",
            params: [],
          },
        ];
        return multicall(VaultAbi, callData);
      })
    );

    const vaultWethInfo = await Promise.all(
      vaultsWithDetails.map((row: VaultInfo) => {
        const callData = [
          {
            address: getWethAddress(),
            name: "balanceOf",
            params: [row.address],
          },
        ];
        return multicall(WethAbi, callData);
      })
    );

    const vaultsWithTvl = await Promise.all(
      vaultsWithDetails.map(async (row: VaultInfo, i: number) => {
        const tvl = getBalanceInEther(onChainInfo[i][0][0]);
        const totalShares = getBalanceInEther(onChainInfo[i][1][0]);
        const res = await axios.get(
          `${BLUR_API_BASE}/historical-points?env=${apiEnv}`
        );

        let blurEstApy = 0;
        let blurHistApy = 0;
        if (res.status === 200) {
          const historicalPoints = formatBlurChart(
            res.data.data.historicalRecords
          );
          const ethPrice = await fetchETHPrice();
          blurEstApy = calculateBlurVaultEstApy({
            originEstApy: row?.okrs?.expected_return || 0,
            pointValue: 2,
            totalPoints: historicalPoints?.totalSpPoints ?? 0,
            ethPrice,
            totalAssets: tvl,
            dayPoints: (historicalPoints?.weekPoints || 0) / 7,
          });
          blurHistApy = calculateBlurVaultHistApy({
            pointValue: 2,
            totalPoints: historicalPoints?.totalSpPoints ?? 0,
            ethPrice,
            totalAssets: tvl,
            totalShares,
          });
        }

        return {
          ...row,
          tvl,
          totalShares,
          wethBalance: vaultWethInfo[i][0][0],
          totalSupply: 0,
          apr: 100 * (row?.okrs?.expected_return || 0),
          // apy: 100 * (row?.okrs?.expected_return || 0),
          apy: blurEstApy,
          historicalApy: blurHistApy,
          name: getVaultDisplayName(row?.name),
          logo: getVaultLogo(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          backgroundImage: getVaultBackgroundImage(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          receiptToken: ReceiptToken.ERC20,
          userInfo: {
            allowance: BigNumber.from(0),
            tokenBalance: BigNumber.from(0),
            nfts: [],
            amount: BigNumber.from(0),
          },
          category: VaultFilter.Public,
          isBlur: true,
        };
      })
    );

    return vaultsWithTvl;
  } catch (err) {
    console.log("err", err);
    return [];
  }
};

// fetch global initial data of vaults
export const fetchGlobalInitialData = async () => {
  const res = await axios.get(`${VAULT_API}?env=${apiEnv}`);
  if (res.status === 200) {
    const vaults = res.data.data.filter(
      (row: VaultInfo) =>
        !VAULT_BLACKLISTED[activeChainId].includes(row.address)
    );

    const activeVaults = vaults.filter(
      (row: VaultInfo) =>
        row.depositable && (row.type === "aggregator" || row.type === "bidder")
    );
    const leverageVaults = vaults.filter((row: VaultInfo) => row.leverage);

    // blur vault
    const blurVaultAddr = DEFAULT_BLUR_VAULT[activeChainId];
    const blurVaults = vaults.filter(
      (row: VaultInfo) => row.depositable && row.address === blurVaultAddr
    );

    return {
      vaults: [...activeVaults, ...blurVaults].map((row) => {
        const readablename =
          row?.readable ||
          getVaultReadableName(row?.fungible, row?.type, row.name);
        const vaultDetail = {
          ...row,
          name: getVaultDisplayName(row?.name),
          readable: getVaultReadableName(row?.fungible, row?.type, row.name),
          logo: getVaultLogo(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          backgroundImage: getVaultBackgroundImage(
            row?.fungible,
            row?.type,
            row?.deprecated,
            row.name
          ),
          receiptToken: row.fungible ? ReceiptToken.ERC20 : ReceiptToken.NFT,
          userInfo: {
            allowance: BigNumber.from(0),
            tokenBalance: BigNumber.from(0),
            nfts: [],
            amount: BigNumber.from(0),
          },
          category: row.fungible ? VaultFilter.Public : VaultFilter.VIP,
          isBlur: false,
        };

        if (readablename) {
          let prefix = readablename.split(" ")[0];

          if (row.deprecated) {
            prefix = prefix + "-Deprecated";
          }

          return {
            ...vaultDetail,
            description: VAULT_DESCRIPTIONS[prefix],
            requirement: VAULT_REQUIREMENTS[prefix],
            risk: VAULT_RISK[prefix],
          };
        }
        return vaultDetail;
      }),
      defaultVault:
        activeVaults.find(
          (row: VaultInfo) =>
            DEFAULT_AGGREGATOR_VAULT[activeChainId].toLowerCase() ===
            row.address.toLowerCase()
        ) || activeVaults[0],
      leverageVaults: leverageVaults,
      blurVaults: blurVaults,
    };
  }
  return {
    vaults: [],
    defaultVault: {},
    leverageVaults: [],
    blurVaults: [],
  };
};

// fetch global data of vaults
export const fetchGlobalData = async () => {
  const res = await axios.get(`${VAULT_API}?env=${apiEnv}`);
  if (res.status === 200) {
    const vaults = res.data.data.filter(
      (row: VaultInfo) =>
        !VAULT_BLACKLISTED[activeChainId].includes(row.address)
    );
    const activeVaults = vaults.filter(
      (row: VaultInfo) =>
        row.depositable && (row.type === "aggregator" || row.type === "bidder")
    );
    const leverageVaults = vaults.filter((row: VaultInfo) => row.leverage);

    // blur vault
    const blurVaultAddr = DEFAULT_BLUR_VAULT[activeChainId];
    const blurVaults = vaults.filter(
      (row: VaultInfo) => row.depositable && row.address === blurVaultAddr
    );

    const [activeVaultsData, leverageVaultsData, blurVaultsData] =
      await Promise.all([
        fetchActiveVaults(activeVaults),
        fetchLeverageVaults(leverageVaults),
        fetchBlurVaults(blurVaults),
      ]);

    return {
      vaults: [...activeVaultsData.all, ...blurVaultsData].map((vault) => {
        if (vault.readable) {
          let prefix = vault.readable.split(" ")[0];

          if (vault.deprecated) {
            prefix = prefix + "-Deprecated";
          }

          return {
            ...vault,
            description: VAULT_DESCRIPTIONS[prefix],
            requirement: VAULT_REQUIREMENTS[prefix],
            risk: VAULT_RISK[prefix],
          };
        }
        return vault;
      }),
      defaultVault: activeVaultsData.default,
      leverageVaults: leverageVaultsData,
      blurVaults: blurVaultsData,
    };
  }
  return {
    vaults: [],
    defaultVault: {},
    leverageVaults: [],
    blurVaults: [],
  };
};

// get vault withdrawable amount
export const getVaultWithdrawable = async (
  vault: VaultInfo,
  shares: BigNumber
) => {
  const [maxWithdrawable] = await multicall(
    vault?.fungible ? VaultAbi : SpiceFiNFT4626Abi,
    [
      {
        address: vault.address,
        name: "previewRedeem",
        params: [shares],
      },
    ]
  );

  return maxWithdrawable[0];
};

// get prologue vault withdrawable
export const getPrologueVaultWithdrawable = async ({
  callData,
  tokenIds,
}: {
  callData: any;
  tokenIds: any;
}) => {
  const data = await multicall(SpiceFiNFT4626Abi, callData);

  return data.map((row: any, index: number) => {
    return {
      redeemAmount: getBalanceInEther(row[0]),
      tokenId: tokenIds[index],
    };
  });
};

// get vault share by nftId
export const getVaultNftShare = async (vault: VaultInfo, nftId: number) => {
  const [tokenShare] = await multicall(SpiceFiNFT4626Abi, [
    {
      address: vault.address,
      name: "tokenShares",
      params: [nftId],
    },
  ]);

  return tokenShare[0];
};

// get underlying vaults of aggregator vault
export const getUnderlyingVaults = async (vault: VaultInfo) => {
  if (vault.type !== "aggregator") return [];

  try {
    // fetch VAULT_ROLE byte data
    const [vaultRole] = await multicall(SpiceFiNFT4626Abi, [
      {
        address: vault.address,
        name: "VAULT_ROLE",
        params: [],
      },
    ]);

    // fetch vault role member count
    const [vaultRoleMemberCnt] = await multicall(SpiceFiNFT4626Abi, [
      {
        address: vault.address,
        name: "getRoleMemberCount",
        params: [vaultRole[0]],
      },
    ]);

    // get a list of underlying vaults
    let callData: any[] = [];
    for (let index = 0; index < vaultRoleMemberCnt[0].toNumber(); index += 1) {
      callData = [
        ...callData,
        {
          address: vault.address,
          name: "getRoleMember",
          params: [vaultRole[0], index],
        },
      ];
    }

    let vaults = await multicall(SpiceFiNFT4626Abi, callData);
    vaults = vaults.map((row: any) => row[0]);

    // get off chain data of vaults
    const offChainVaults = (
      await Promise.all(
        vaults.map((row: VaultInfo) =>
          axios.get(`${VAULT_API}/${row}?env=${apiEnv}`)
        )
      )
    )
      .filter((row: any) => row.status === 200)
      .map((row: any) => row.data.data);

    return offChainVaults || [];
  } catch (err) {
    console.log("Underlying vault:", err);
    return [];
  }
};

export const getVaultWETHInfo = async (vault: VaultInfo) => {
  try {
    // fetch weth balance
    const [wethBalance] = await multicall(WethAbi, [
      {
        address: getWethAddress(),
        name: "balanceOf",
        params: [vault.address],
      },
    ]);

    // fetch weth value
    const [wethValue] = await multicall(SpiceFiNFT4626Abi, [
      {
        address: vault.address,
        name: "totalAssets",
        params: [],
      },
    ]);

    return {
      ...vault,
      wethBalance: wethBalance[0],
      wethValue: wethValue[0],
    };
  } catch (err) {
    console.log("Vault WETH:", err);
    return vault;
  }
};

// get vault liquid weth balance
export const getVaultLiquidWeth = async (vault: VaultInfo) => {
  if (!vault?.address) return BigNumber.from(0);

  let liquidWeth = vault?.wethBalance || BigNumber.from(0);
  if (vault?.isBlur) {
    const [bidder] = await multicall(Blur4626Abi, [
      {
        address: vault.address,
        name: "bidder",
        params: [],
      },
    ]);
    const [wethBalance] = await multicall(WethAbi, [
      {
        address: getWethAddress(),
        name: "balanceOf",
        params: [bidder[0]],
      },
    ]);
    return wethBalance[0];
  }

  try {
    const underlyingVaults: any[] = await getUnderlyingVaults(vault);
    const underlyingVaultsWithWethInfo = await Promise.all(
      underlyingVaults.map((row: any) => getVaultWETHInfo(row))
    );
    underlyingVaultsWithWethInfo.map((row: any) => {
      if (row.type === "wrapper") {
        liquidWeth = liquidWeth.add(row.wethValue);
      }
      if (row.type === "bidder") {
        liquidWeth = liquidWeth.add(row.wethBalance);
      }
      return row;
    });
  } catch (err) {
    console.log("liquid weth:", err);
  }
  return liquidWeth;
};
