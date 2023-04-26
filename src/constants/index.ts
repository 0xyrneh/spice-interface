import { NavOption, VaultFilter, MarketplaceFilter } from "@/types/common";

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
  MarketplaceFilter.Arcade,
  MarketplaceFilter.Bend,
  MarketplaceFilter.Drops,
  MarketplaceFilter.NFTfi,
  MarketplaceFilter.ParaSpace,
  MarketplaceFilter.X2Y2,
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
