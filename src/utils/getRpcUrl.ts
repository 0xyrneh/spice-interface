import random from "lodash/random";

import { SPICE_RPC_URLS } from "@/config/constants/rpc";
import { SupportedChainId } from "@/config/constants/chains";
import { activeChainId } from "@/utils/web3";

// ethereum mainnet
export const spiceMainnetNodes = [
  SPICE_RPC_URLS[SupportedChainId.MAINNET],
  SPICE_RPC_URLS[SupportedChainId.MAINNET],
  SPICE_RPC_URLS[SupportedChainId.MAINNET],
];

// ethereum goerli
export const spiceTestnetNodes = [
  SPICE_RPC_URLS[SupportedChainId.GOERLI],
  SPICE_RPC_URLS[SupportedChainId.GOERLI],
  SPICE_RPC_URLS[SupportedChainId.GOERLI],
];

const getNodeUrl = (networkId?: number): string => {
  const chainId = networkId || activeChainId;
  const nodes = chainId === 1 ? spiceMainnetNodes : spiceTestnetNodes;
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;
