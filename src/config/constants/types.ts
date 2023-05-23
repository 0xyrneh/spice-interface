import { SupportedChainId } from "@/config/constants/chains";

export interface Address {
  [SupportedChainId.GOERLI]: string;
  [SupportedChainId.MAINNET]: string;
}
