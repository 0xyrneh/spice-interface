import {
  NavOption,
  VaultFilter,
  MarketplaceFilter,
  VaultExposureSortFilter,
  VaultNftsSortFilter,
} from "@/types/common";

export const NAV_OPTIONS: NavOption[] = [
  { href: "/", name: "Vaults", maxWidth: "1536px" },
  { href: "/portfolio", name: "Portfolio" },
  { href: "/prologue-nfts", name: "Prologue NFTs" },
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
