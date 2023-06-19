import { gql } from "@apollo/client";

import { prologueNftSubgraphClient, vaultSubgraphClient } from "./config";
import {
  userPrologueNftQuery,
  prologueNftQuery,
  userVaultPositionQuery,
  vaultPositionQuery,
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

// vault position
export const getVaultPositions = async (vaultAddress: string) => {
  if (!vaultAddress) return [];
  try {
    const result = await vaultSubgraphClient.query({
      query: gql(vaultPositionQuery),
      variables: { cnt: 1000, vaultAddress: vaultAddress.toLowerCase() },
      fetchPolicy: "network-only",
    });
    const { vaultHourPositions } = result.data;
    return vaultHourPositions || [];
  } catch {
    return [];
  }
};

// user position
export const getUserVaultPositions = async (
  userAddress: string,
  vaultAddress: string
) => {
  if (!userAddress) return [];
  if (!vaultAddress) return [];
  try {
    const result = await vaultSubgraphClient.query({
      query: gql(userVaultPositionQuery),
      variables: {
        cnt: 1000,
        userAddress: userAddress.toLowerCase(),
        vaultAddress: vaultAddress.toLowerCase(),
      },
      fetchPolicy: "network-only",
    });

    const { userHourPositions } = result.data;
    return userHourPositions || [];
  } catch (err) {
    return [];
  }
};
