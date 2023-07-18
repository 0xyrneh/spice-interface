import { gql } from "@apollo/client";

import { prologueNftSubgraphClient, vaultSubgraphClient } from "./config";
import {
  userPrologueNftQuery,
  prologueNftQuery,
  userVaultShareQuery,
  vaultShareQuery,
  // tx history query
  userTxHistoryQuery,
} from "./queries";

export const getUserSpiceNfts = async (userAddr: string) => {
  try {
    const result = await prologueNftSubgraphClient.query({
      query: gql(userPrologueNftQuery),
      variables: {
        userAddr,
      },
      fetchPolicy: "network-only",
    });

    const user = result.data.users[0];
    return user ? user.nfts : [];
  } catch {
    return [];
  }
};

export const getSpiceNfts = async () => {
  try {
    const result = await prologueNftSubgraphClient.query({
      query: gql(prologueNftQuery),
      variables: { cnt: 1000 },
      fetchPolicy: "network-only",
    });
    const { nfts } = result.data;
    return nfts || [];
  } catch {
    return [];
  }
};

// vault shares
export const getVaultShares = async (vaultAddress: string) => {
  if (!vaultAddress) return [];
  try {
    const result = await vaultSubgraphClient.query({
      query: gql(vaultShareQuery),
      variables: { cnt: 1000, vaultAddress: vaultAddress.toLowerCase() },
      fetchPolicy: "network-only",
    });
    const { vaultHourPositions } = result.data;
    return vaultHourPositions || [];
  } catch {
    return [];
  }
};

// user vault shares
export const getUserVaultShares = async (
  userAddress: string,
  vaultAddress: string
) => {
  if (!userAddress) return [];
  if (!vaultAddress) return [];
  try {
    const result = await vaultSubgraphClient.query({
      query: gql(userVaultShareQuery),
      variables: {
        cnt: 1000,
        userAddress: userAddress.toLowerCase(),
        vaultAddress: vaultAddress.toLowerCase(),
      },
      fetchPolicy: "network-only",
    });

    const { userVaultHourPositions } = result.data;
    return userVaultHourPositions || [];
  } catch (err) {
    return [];
  }
};

// user tx history
export const getUserTxHistories = async (userAddress: string) => {
  if (!userAddress) return [];
  try {
    const result = await vaultSubgraphClient.query({
      query: gql(userTxHistoryQuery),
      variables: {
        cnt: 1000,
        userAddress: userAddress.toLowerCase(),
      },
      fetchPolicy: "network-only",
    });

    const { userTxHistories } = result.data;
    return userTxHistories || [];
  } catch (err) {
    return [];
  }
};
