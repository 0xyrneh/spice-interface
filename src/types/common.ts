export type NavOption = {
  href: string;
  name: string;
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
