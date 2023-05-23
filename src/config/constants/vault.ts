import { SupportedChainId } from "@/config/constants/chains";

export const VAULT_BLACKLISTED = {
  [SupportedChainId.MAINNET]: [""],
  [SupportedChainId.GOERLI]: [""],
};

export const DEFAULT_AGGREGATOR_VAULT = {
  [SupportedChainId.MAINNET]: "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe",
  [SupportedChainId.GOERLI]: "0xc118f4bF7f156F3B2027394f2129f32C03FbB1D4",
};

export const DEFAULT_LEVERAGE_VAULT = {
  [SupportedChainId.MAINNET]: "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe",
  [SupportedChainId.GOERLI]: "0xc118f4bF7f156F3B2027394f2129f32C03FbB1D4",
};

export const DEFAULT_LEND = {
  [SupportedChainId.MAINNET]: "0x5d28a7AF78635d4f4C0BF5C404241A941A7EbD0A",
  [SupportedChainId.GOERLI]: "0xb0F1Cd55CA8897306aEb53f671dD87125f5dBF0d",
};

export const VAULT_COLLECTION_COLORS = [
  "#EA580C",
  "#F97316",
  "#FB923C",
  "#FDBA74",
  "#CA9970",
];

export const VAULT_BACKGROUND_IMAGES = [
  "/assets/images/bgVaults.png",
  "/assets/images/bgVaults1.png",
  "/assets/images/bgVaults2.png",
  "/assets/images/bgVaults.png",
  "/assets/images/bgVaults1.png",
];