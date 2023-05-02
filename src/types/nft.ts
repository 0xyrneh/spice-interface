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
  apy: number;
  due: number;
  icon: string;
  loanIcon: string;
};
