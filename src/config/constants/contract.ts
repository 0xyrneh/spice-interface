import { SupportedChainId } from "@/config/constants/chains";
import { Address } from "@/config/constants/types";

export const spiceFiFactoryAddr: Address = {
  [SupportedChainId.MAINNET]: "0xE01bf9e18fa5010d23BbdA25D45aFe3201bd7528",
  [SupportedChainId.GOERLI]: "0xE01bf9e18fa5010d23BbdA25D45aFe3201bd7528",
};

export const spiceFiNFTFactoryAddr: Address = {
  [SupportedChainId.MAINNET]: "0xC7C2003ca16674Be50afee9c0732A18E57fef386",
  [SupportedChainId.GOERLI]: "0xC7C2003ca16674Be50afee9c0732A18E57fef386",
};

export const multicallAddr: Address = {
  [SupportedChainId.MAINNET]: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  [SupportedChainId.GOERLI]: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
};

export const wethAddr: Address = {
  [SupportedChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [SupportedChainId.GOERLI]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
};

export const spiceLendingAddr: Address = {
  [SupportedChainId.MAINNET]: "0x5d28a7AF78635d4f4C0BF5C404241A941A7EbD0A",
  [SupportedChainId.GOERLI]: "0x37f8bBE2A9fc816AF6b6843eA0E2DA86289b81DE",
};

export const spiceLendingAddrs: any = {
  [SupportedChainId.MAINNET]: [
    {
      address: "0x5d28a7AF78635d4f4C0BF5C404241A941A7EbD0A",
      isActive: true,
    },
  ],
  [SupportedChainId.GOERLI]: [
    {
      address: "0x37f8bBE2A9fc816AF6b6843eA0E2DA86289b81DE",
      isActive: false,
    },
    {
      address: "0xb0F1Cd55CA8897306aEb53f671dD87125f5dBF0d",
      isActive: true,
    },
  ],
};
