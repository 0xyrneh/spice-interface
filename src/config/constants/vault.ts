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

export const DEFAULT_BLUR_VAULT = {
  [SupportedChainId.MAINNET]: "0xfC287513E2DD58fbf952eB0ED05D511591a6215B",
  [SupportedChainId.GOERLI]: "",
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

export const VAULT_BACKGROUND_IMAGES = {
  flagship: "/assets/images/bg-flagship-vault.webp",
  prologue: "/assets/images/bg-prologue-vault.webp",
  leverage: "/assets/images/bg-leverage-vault.webp",
  leverageWithrawOnly: "/assets/images/bg-leverage-vault-withdraw-only.webp",
  blur: "/assets/images/bg-blur-vault.webp",
};

export const VAULT_LOGOS = {
  flagship: "/assets/icons/flagship-vault-logo.png",
  prologue: "/assets/icons/prologue-vault-logo.png",
  leverage: "/assets/icons/leverage-vault-logo.png",
  blur: "/assets/icons/blur-vault-logo.png",
};

export const VAULT_CREATION_TIMESTAMPS: { [key: string]: number } = {
  // mainnet vaults
  "0xd68871bd7D28572860b2E0Ee5c713b64445104F9": 1679214899,
  "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe": 1674114407,
  "0xAe11ae7CaD244dD1d321Ff2989543bCd8a6Db6DF": 1674042143,
  // goerli vaults
  "0x45A5564d06b6A39143271bcE428a5C8CfA8483a6": 1680019080,
  "0xc118f4bF7f156F3B2027394f2129f32C03FbB1D4": 1674226800,
  "0xee324F2461e5B12fD5dfDBa05380ee1915C855d0": 1674225828,
  "0x8ea77Ad57da49f3392BD7884be7972Eb94217eD6": 1674225756,
};

export const DEFAULT_VAULT_BACKGROUND_IMAGE = VAULT_BACKGROUND_IMAGES.prologue;
