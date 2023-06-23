import { BigNumber } from "ethers";

import { VaultFilter } from "./common";

export enum ReceiptToken {
  NFT = "NFT",
  ERC20 = "ERC-20",
}

export type Vault = {
  id: number;
  name: string;
  type: VaultFilter.Public | VaultFilter.VIP;
  tvl: number;
  apy: number;
  oneDayChange: number;
  sevenDayChange: number;
  oneDayReturn: number;
  sevenDayReturn: number;
  creator: string;
  receiptToken: ReceiptToken;
  favorite?: boolean;
  icon: string;
  bg?: string;
};

export type Nft = {
  name: string;
  tvl: number;
  icon: string;
};

export interface VaultInfo {
  name: string;
  address: string;
  tvl?: number;
  wethBalance?: BigNumber;
  totalShares?: number;
  apr?: number;
  apy?: number;
  historicalApy?: number;
  totalSupply?: number;
  maxSupply?: number;
  tvlChange?: number;
  aprChange?: number;
  sponsor?: string;
  depositedAmt?: number;
  requirement?: string;
  description?: string;
  risk?: VaultRisk;
  okrs?: any;
  readable?: string;
  userInfo: any;
  historicalRecords?: any[];
  userNftPortfolios?: any[];

  depositable?: boolean;
  leverage?: boolean;
  deprecated?: boolean;
  fungible?: boolean;
  type?: string;

  logo: string;
  bg?: string;
  userPositionRaw?: BigNumber;
  userPosition?: number;
  receiptToken: ReceiptToken;
  id: number;
  backgroundImage?: string;
  category: VaultFilter;
  isBlur?: boolean;
  marketplaceExposures?: any[];
  collectionExposures?: any[];
  startTime: number;
}

export interface LeverageVaultInfo {
  name: string;
  address: string;
  sponsor?: string;
  wethBalance?: BigNumber;
  totalAssets?: BigNumber;
  description?: string;
  readable?: string;

  depositable?: boolean;
  leverage?: boolean;
  deprecated?: boolean;
  fungible?: boolean;
  type?: string;
}

export interface ChartValue {
  x: number | string;
  y: number | string;
}

export enum VaultRisk {
  LOW = "LOW RISK",
  MEDIUM = "MEDIUM RISK"
}
