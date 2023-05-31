import {
  NavOption,
  VaultFilter,
  VaultExposureSortFilter,
  VaultNftsSortFilter,
  PeriodFilter,
} from "@/types/common";
import { ChartValue } from "@/types/vault";

export const NAV_OPTIONS: NavOption[] = [
  {
    href: "/",
    name: "Vaults",
    maxWidth: "1536px",
    breakpoint: "sm",
    bigFooter: true,
  },
  { href: "/portfolio", name: "Portfolio", breakpoint: "md" },
];

export const VAULT_FILTERS = [
  VaultFilter.All,
  VaultFilter.Public,
  VaultFilter.VIP,
];

export const MARKETPLACE_FILTERS = [
  "Arcade",
  "Bend",
  "Drops",
  "NFTfi",
  "ParaSpace",
  "X2Y2",
];

export const COLLECTION_FILTERS = [
  "BAYC",
  "MAYC",
  "Crypto Punks",
  "CloneX",
  "Azuki",
  "Otherdeeds",
  "Meebits",
  "Doodles",
  "Squiggles",
  "Sandbox Land",
  "Pudgy Penguins",
  "Cool Cats",
  "BEANZ",
  "World Of Women",
  "rektguy",
  "mfers",
  "Renga",
  "VeeFriends",
  "Valhalla",
  "DigiDaigaku",
  "Checks",
  "FLUF",
  "Milady",
  "KILLABEARS",
];

export const VAULT_EXPOSURE_SORT_FILTERS = [
  VaultExposureSortFilter.ApyHighToLow,
  VaultExposureSortFilter.ApyLowToHigh,
  VaultExposureSortFilter.PositionHighToLow,
  VaultExposureSortFilter.PositionLowToHigh,
  VaultExposureSortFilter.TvlHighToLow,
  VaultExposureSortFilter.TvlLowToHigh,
];

export const VAULT_NFTS_SORT_FILTERS = [
  VaultNftsSortFilter.ValueHighToLow,
  VaultNftsSortFilter.ValueLowToHigh,
  VaultNftsSortFilter.ApyHighToLow,
  VaultNftsSortFilter.ApyLowToHigh,
];

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1740,
};

export const ExampleTotalTvl: Record<PeriodFilter, ChartValue[]> = {
  [PeriodFilter.Day]: [
    {
      x: "2023-5-30 00:00:00",
      y: 10,
    },
    {
      x: "2023-5-30 04:00:00",
      y: 50,
    },
    {
      x: "2023-5-30 08:00:00",
      y: 20,
    },
    {
      x: "2023-5-30 12:00:00",
      y: 50,
    },
    {
      x: "2023-5-30 16:00:00",
      y: 20,
    },
    {
      x: "2023-5-30 20:00:00",
      y: 30,
    },
    {
      x: "2023-5-31 00:00:00",
      y: 45,
    },
  ],
  [PeriodFilter.Week]: [
    {
      x: "2023-5-24",
      y: 6,
    },
    {
      x: "2023-5-25",
      y: 30,
    },
    {
      x: "2023-5-26",
      y: 10,
    },
    {
      x: "2023-5-27",
      y: 50,
    },
    {
      x: "2023-5-28",
      y: 20,
    },
    {
      x: "2023-5-29",
      y: 50,
    },
    {
      x: "2023-5-30",
      y: 20,
    },
  ],
  [PeriodFilter.Month]: [
    {
      x: "2023-5-6",
      y: 20,
    },
    {
      x: "2023-5-10",
      y: 50,
    },
    {
      x: "2023-5-14",
      y: 15,
    },
    {
      x: "2023-5-18",
      y: 40,
    },
    {
      x: "2023-5-22",
      y: 20,
    },
    {
      x: "2023-5-26",
      y: 25,
    },
    {
      x: "2023-5-30",
      y: 15,
    },
  ],
  [PeriodFilter.Year]: [
    {
      x: "2022-11-30",
      y: 15,
    },
    {
      x: "2022-12-30",
      y: 45,
    },
    {
      x: "2023-1-30",
      y: 40,
    },
    {
      x: "2023-2-30",
      y: 15,
    },
    {
      x: "2023-3-30",
      y: 60,
    },
    {
      x: "2023-4-30",
      y: 50,
    },
    {
      x: "2023-5-30",
      y: 20,
    },
  ],
  [PeriodFilter.All]: [
    {
      x: "2020-5-30",
      y: 15,
    },
    {
      x: "2020-11-30",
      y: 42,
    },
    {
      x: "2021-5-30",
      y: 17,
    },
    {
      x: "2021-11-30",
      y: 22,
    },
    {
      x: "2022-5-30",
      y: 20,
    },
    {
      x: "2022-11-30",
      y: 50,
    },
    {
      x: "2023-5-30",
      y: 20,
    },
  ],
};

export const ExampleShare: Record<PeriodFilter, ChartValue[]> = {
  [PeriodFilter.Day]: [
    {
      x: "2023-5-30 01:00:00",
      y: 1000,
    },
    {
      x: "2023-5-30 04:00:00",
      y: 5000,
    },
    {
      x: "2023-5-30 07:00:00",
      y: 2000,
    },
    {
      x: "2023-5-30 10:00:00",
      y: 5000,
    },
    {
      x: "2023-5-30 13:00:00",
      y: 2000,
    },
    {
      x: "2023-5-30 16:00:00",
      y: 3000,
    },
    {
      x: "2023-5-30 19:00:00",
      y: 4500,
    },
  ],
  [PeriodFilter.Week]: [
    {
      x: "2023-5-24",
      y: 600,
    },
    {
      x: "2023-5-25",
      y: 3000,
    },
    {
      x: "2023-5-26",
      y: 1000,
    },
    {
      x: "2023-5-27",
      y: 5000,
    },
    {
      x: "2023-5-28",
      y: 2000,
    },
    {
      x: "2023-5-29",
      y: 5000,
    },
    {
      x: "2023-5-30",
      y: 2000,
    },
  ],
  [PeriodFilter.Month]: [
    {
      x: "2023-5-6",
      y: 2000,
    },
    {
      x: "2023-5-10",
      y: 5000,
    },
    {
      x: "2023-5-14",
      y: 1500,
    },
    {
      x: "2023-5-18",
      y: 4000,
    },
    {
      x: "2023-5-22",
      y: 2000,
    },
    {
      x: "2023-5-26",
      y: 2500,
    },
    {
      x: "2023-5-30",
      y: 1500,
    },
  ],
  [PeriodFilter.Year]: [
    {
      x: "2022-11-30",
      y: 1500,
    },
    {
      x: "2022-12-30",
      y: 4500,
    },
    {
      x: "2023-1-30",
      y: 4000,
    },
    {
      x: "2023-2-30",
      y: 1500,
    },
    {
      x: "2023-3-30",
      y: 6000,
    },
    {
      x: "2023-4-30",
      y: 5000,
    },
    {
      x: "2023-5-30",
      y: 2000,
    },
  ],
  [PeriodFilter.All]: [
    {
      x: "2020-5-30",
      y: 1500,
    },
    {
      x: "2020-11-30",
      y: 4200,
    },
    {
      x: "2021-5-30",
      y: 1700,
    },
    {
      x: "2021-11-30",
      y: 2200,
    },
    {
      x: "2022-5-30",
      y: 2000,
    },
    {
      x: "2022-11-30",
      y: 5000,
    },
    {
      x: "2023-5-30",
      y: 2000,
    },
  ],
};
