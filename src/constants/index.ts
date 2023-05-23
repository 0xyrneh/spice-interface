import {
  NavOption,
  VaultFilter,
  VaultExposureSortFilter,
  VaultNftsSortFilter,
} from "@/types/common";

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
