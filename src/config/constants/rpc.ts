import { SupportedChainId } from "./chains";

export const ANKR_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: "https://rpc.ankr.com/eth",
  [SupportedChainId.GOERLI]: "https://rpc.ankr.com/eth_goerli",
};

export const SPICE_RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: "https://b3ec853c.spicefi.xyz/eth/mainnet",
  // [SupportedChainId.GOERLI]: 'https://b3ec853c.spicefi.xyz/eth/goerli',
  [SupportedChainId.GOERLI]: "https://rpc.ankr.com/eth_goerli",
};
