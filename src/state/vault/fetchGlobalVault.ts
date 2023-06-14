import { BigNumber } from "ethers";
import axios from "axios";

import { VAULT_API } from "@/config/constants/backend";
import {
  DEFAULT_AGGREGATOR_VAULT,
  DEFAULT_BLUR_VAULT,
  VAULT_BLACKLISTED,
} from "@/config/constants/vault";
import multicall from "@/utils/multicall";
import { getBalanceInEther } from "@/utils/formatBalance";
import { VaultInfo, ReceiptToken } from "@/types/vault";
import { getVaultDisplayName } from "@/utils/string";
import VaultAbi from "@/config/abi/SpiceFiVault.json";
import SpiceFiNFT4626Abi from "@/config/abi/SpiceFiNFT4626.json";
import WethAbi from "@/config/abi/WETH.json";
import { getWethAddress } from "@/utils/addressHelpers";
import { activeChainId } from "@/utils/web3";
import { getVaultBackgroundImage, getVaultLogo } from "@/utils/vault";
import { VaultFilter } from "@/types/common";
import { VAULT_DESCRIPTIONS, VAULT_REQUIREMENTS } from "@/constants/vaults";
import { getNFTMarketplaceDisplayName } from "@/utils/nft";
import { COLLECTION_API_BASE } from "@/config/constants/backend";
import { getNFTCollectionDisplayName } from "@/utils/nft";

const apiEnv = activeChainId === 1 ? "prod" : "goerli";

const getVaultHistoricalApy = (vaultInfo: VaultInfo) => {
  const aprField = activeChainId === 1 ? "actual_returns" : "expected_return";
  return (
    (activeChainId === 1 ? 1 : 100) *
    (vaultInfo?.okrs ? vaultInfo?.okrs[aprField] : 0)
  );
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

    // marketplace exposures
    const vaultMarketplaceExposures = await Promise.all(
      vaultsWithDetails.map(async (vault: VaultInfo) => {
        const protocolAllocationsOrigin =
          vault?.okrs?.protocol_allocations || {};
        const protocolAllocations0 = Object.keys(protocolAllocationsOrigin)
          .map((key) => ({
            name: getNFTMarketplaceDisplayName(key),
            allocation: protocolAllocationsOrigin[key],
          }))
          .sort((a, b) => (a.allocation >= b.allocation ? -1 : 1));

        // fetch bidder vault data
        let protocolAllocations1: any[] = [];
        await Promise.all(
          protocolAllocations0.map(async (row: any) => {
            if (row?.name && row?.name.includes("spice-")) {
              const res = await axios.get(`${VAULT_API}/result/${row.name}`);
              if (res.status === 200) {
                const bidderVaultProtocolAllocations =
                  res.data?.data?.okrs?.protocol_allocations;
                if (Object.keys(bidderVaultProtocolAllocations).length > 0) {
                  Object.keys(bidderVaultProtocolAllocations).map((key) => {
                    protocolAllocations1 = [
                      ...protocolAllocations1,
                      {
                        name: key,
                        allocation:
                          bidderVaultProtocolAllocations[key] * row.allocation,
                      },
                    ];
                    return key;
                  });
                }
              } else {
                protocolAllocations1 = [...protocolAllocations1, row];
              }
              return row;
            }
            protocolAllocations1 = [...protocolAllocations1, row];
            return row;
          })
        );

        if (protocolAllocations1.length === 0) {
          protocolAllocations1 = [
            ...protocolAllocations1,
            { name: "SpiceDAO", allocation: 1 },
          ];
        }

        return protocolAllocations1;
      })
    );

    // collection exposures
    const vaultCollectionExposures = await Promise.all(
      vaultsWithDetails.map(async (vault: VaultInfo) => {
        const collectionAllocationsOrigin =
          vault?.okrs?.collection_allocations || {};
        let collectionAllocations0 = await Promise.all(
          Object.keys(collectionAllocationsOrigin).map(async (key) => {
            try {
              const collectionRes = await axios.get(
                `${COLLECTION_API_BASE}/${key}`
              );

              if (collectionRes.status === 200) {
                return {
                  slug: key,
                  name:
                    collectionRes.data.data.readable ||
                    getNFTCollectionDisplayName(key),
                  allocation: collectionAllocationsOrigin[key],
                };
              }
            } catch (err) {
              console.log("Collection API error:", err);
            }
            return {
              slug: key,
              name: getNFTCollectionDisplayName(key),
              allocation: collectionAllocationsOrigin[key],
            };
          })
        );

        if (collectionAllocations0.length === 0) {
          collectionAllocations0 = [
            ...collectionAllocations0,
            { name: "Prologue", slug: "Prologue", allocation: 1 },
          ];
        }

        return collectionAllocations0;
      })
    );

    const vaultsWithTvl = vaultsWithDetails.map((row: VaultInfo, i: number) => {
      if (row.type === "aggregator") {
        return {
          ...row,
          totalShares: getBalanceInEther(onChainInfo[i][0][0]),
          tvl: getBalanceInEther(onChainInfo[i][1][0]),
          wethBalance: vaultWethInfo[i][0][0],
          totalSupply: row?.fungible ? 0 : onChainInfo[i][2][0].toNumber(),
          maxSupply: row?.fungible ? 0 : onChainInfo[i][3][0].toNumber(),
          apr: 100 * (row?.okrs?.expected_return || 0),
          apy: 100 * (row?.okrs?.expected_return || 0),
          historicalApy: getVaultHistoricalApy(row),
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
          marketplaceExposures: vaultMarketplaceExposures[i],
          collectionExposures: vaultCollectionExposures[i],
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
        marketplaceExposures: vaultMarketplaceExposures[i],
        collectionExposures: vaultCollectionExposures[i],
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

    const vaultsWithTvl = vaultsWithDetails.map((row: VaultInfo, i: number) => {
      return {
        ...row,
        tvl: getBalanceInEther(onChainInfo[i][0][0]),
        wethBalance: vaultWethInfo[i][0][0],
        totalSupply: 0,
        apr: 100 * (row?.okrs?.expected_return || 0),
        apy: 100 * (row?.okrs?.expected_return || 0),
        historicalApy: getVaultHistoricalApy(row),
        name: getVaultDisplayName(row?.name),
        logo: getVaultLogo(row?.fungible, row?.type, row?.deprecated, row.name),
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
    });

    return vaultsWithTvl;
  } catch (err) {
    console.log("err", err);
    return [];
  }
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
