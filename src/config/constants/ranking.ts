export interface RankInfo {
  rank: number;
  address: string;
  amount: number;
  tokenId: number;
  tokenImg: string;
}

export const sortOptions = [
  { label: 'Amount high to low', value: 'amount-desc' },
  { label: 'Amount low to high', value: 'amount-asc' },
];
