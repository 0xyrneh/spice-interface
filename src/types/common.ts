export type NavOption = {
  href: string;
  name: string;
  maxWidth?: string;
};

export type PieItem = {
  name: string;
  color: string;
  value: number;
};

export enum PeriodFilter {
  Day = "1D",
  Week = "1W",
  Month = "1M",
  Year = "1Y",
  All = "ALL",
}

export enum VaultFilter {
  All = "All Vaults",
  Public = "Public Vaults",
  VIP = "VIP Vaults",
}

export enum MarketplaceFilter {
  All = "Marketplaces",
  Arcade = "Arcade",
  Bend = "Bend",
  Drops = "Drops",
  NFTfi = "NFTfi",
  ParaSpace = "ParaSpace",
  X2Y2 = "X2Y2",
}
