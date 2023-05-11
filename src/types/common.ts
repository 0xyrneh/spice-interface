export type NavOption = {
  href: string;
  name: string;
  breakpoint: string;
  maxWidth?: string;
  bigFooter?: boolean;
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

export enum VaultExposureSortFilter {
  ApyHighToLow = "High to low APY",
  ApyLowToHigh = "Low to high APY",
  PositionHighToLow = "High to low Position",
  PositionLowToHigh = "Low to high Position",
  TvlHighToLow = "High to low TVL",
  TvlLowToHigh = "Low to high TVL",
}

export enum VaultNftsSortFilter {
  ValueHighToLow = "High to low Value",
  ValueLowToHigh = "Low to high Value",
  ApyHighToLow = "High to low APY",
  ApyLowToHigh = "Low to high APY",
}
