import { BigNumber } from "ethers";

export type PrologueNft = {
  featured?: boolean;
  apy: number;
  rank: number;
  tvl: number;
  icon: string;
};

export type Exposure = {
  color: string;
  name: string;
  percent: number;
};

export type Loan = {
  name: string;
  principal: number;
  repay: number;
  ltv: number;
  ltvFloor: number;
  apy: number;
  due: number;
  icon: string;
  market: string;
  // TODO: changed to date
  initiated: string;
};

export interface PrologueNftInfo {
  owner: string;
  amount: BigNumber;
  tokenId: number;
  tokenImg: string;
  isEscrowed?: boolean;
  apy: number;
  name?: string;
}

export interface PrologueNftPortofolioInfo {
  owner: string;
  amount: BigNumber;
  tokenId: number;
  tokenImg: string;
  isEscrowed?: boolean;
  apy: number;
  name?: string;
  isApproved: boolean;
  lendAddr?: string;
  borrowApr?: number;
  borrowApy?: number;
  netApy?: number;
  healthFactor?: number;
  debtOwed?: BigNumber;
  autoRenew?: number;
  loan?: any;
  value: BigNumber;
  loanAmount: BigNumber;
}
