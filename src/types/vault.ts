export enum ReceiptToken {
  NFT = "NFT",
  ERC20 = "ERC-20",
}

export type Vault = {
  name: string;
  tvl: number;
  apy: number;
  oneDayChange: number;
  sevenDayChange: number;
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
