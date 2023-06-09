import { BigNumber, ethers } from "ethers";

import {
  RESERVOIR_API_COLLECTIONS_BASE,
  RESERVOIR_API_TOKENS_BASE,
} from "@/config/constants/backend";

export const getMarketplaceDisplayName = (name: string): string => {
  switch (name) {
    case "bend":
      return "BendDAO";
    case "drops":
      return "DropsDAO";
    case "para":
      return "ParaSpace";
    case "meta":
      return "MetaStreet";
    default:
      return "P2P Marketplace";
  }
};

export const getNFTCollectionDisplayName = (slug: string): string => {
  switch (slug) {
    case "bakc":
      return "Bored Ape Kennel Club";
    case "nouns":
      return "NounsDAO";
    case "sandland":
      return "Sandbox LAND";
    case "squiggles":
      return "Art Blocks - Squiggles";
    case "meebits":
      return "Meebits";
    case "pudgy":
      return "Pudgy Penguins";
    case "bayc":
      return "Bored Ape Yacht Club";
    case "mayc":
      return "Mutant Ape Yacht Club";
    case "doodles":
      return "Doodles";
    case "punks":
      return "CryptoPunks";
    case "azuki":
      return "Azuki";
    case "otherdeed":
      return "Otherdeed for Otherside";
    case "clonex":
      return "CloneX";
    case "moonbirds":
      return "Moonbirds";
    case "space-doodles":
      return "Space Doodles";
    default:
      return slug;
  }
};

export const getNFTMarketplaceDisplayName = (slug: string): string => {
  if (slug.includes("bend")) return "BendDAO";
  if (slug.includes("drops")) return "DropsDAO";
  if (slug.includes("x2y2")) return "X2Y2";
  if (slug.includes("nftfi")) return "NFTfi";
  if (slug.includes("arcade")) return "Arcade";
  if (slug.includes("para")) return "ParaSpace";
  if (slug.includes("meta")) return "MetaStreet";
  if (slug.includes("spice")) return "SpiceDAO";

  return slug;
};

export const getNFTCollectionAddressFromSlug = (slug: string): string => {
  switch (slug) {
    case "bakc":
      return "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623";
    case "bayc":
      return "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
    case "nouns":
      return "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03";
    case "sandland":
      return "0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38";
    case "squiggles":
      return "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a";
    case "meebits":
      return "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7";
    case "pudgy":
      return "0xbd3531da5cf5857e7cfaa92426877b022e612cf8";
    case "mayc":
      return "0x60e4d786628fea6478f785a6d7e704777c86a7c6";
    case "doodles":
      return "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
    case "punks":
      return "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";
    case "azuki":
      return "0xed5af388653567af2f388e6224dc7c4b3241c544";
    case "otherdeed":
      return "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258";
    case "clonex":
      return "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b";
    case "moonbirds":
      return "0x23581767a106ae21c074b2276d25e5c3e136a68b";
    case "space-doodles":
      return "0x620b70123fb810f6c653da7644b5dd0b6312e4d8";
    case "prologue":
      return "0x6110d61dd1133b0f845f1025d6678cd22a11a2fe";
    case "prologue-goerli":
      return "0x6110d61dd1133b0f845f1025d6678cd22a11a2fe";
    case "beanz":
      return "0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949";
    case "wow":
      return "0xe785e82358879f061bc3dcac6f0444462d4b5330";
    case "rektguy":
      return "0xb852c6b5892256c264cc2c888ea462189154d8d7";
    case "renga":
      return "0x394e3d3044fc89fcdd966d3cb35ac0b32b0cda91";
    case "checks":
      return "0x34eebee6942d8def3c125458d1a86e0a897fd6f9";
    default:
      return ethers.constants.AddressZero;
  }
};

export const getNFTCollectionAddressConvert = (address: string): string => {
  if (address === "0xc118f4bF7f156F3B2027394f2129f32C03FbB1D4")
    return "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe";
  return address;
};

export const formatTokenURI = (tokenUri: string): string => {
  if (tokenUri.includes("ipfs://")) {
    return tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return tokenUri;
};

export const getNftPortfolios = (loans: any[], nfts: any[]) =>
  loans
    .map((row: any) => {
      const userNft = nfts.find((row1: any) => row1.tokenId === row.tokenId);
      const value =
        userNft?.depositAmnt || row.loan?.tokenAmntInVault || BigNumber.from(0);

      return {
        ...row,
        value,
        tokenShare: userNft?.tokenShare || BigNumber.from(0),
      };
    })
    .sort((a: any, b: any) => (a.value.gte(b.value) ? -1 : 1));

export const getTokenImageFromReservoir = (
  collectionAddr: string,
  tokenId?: number
): string =>
  tokenId === undefined
    ? `${RESERVOIR_API_COLLECTIONS_BASE}/${collectionAddr}/image/v1`
    : `${RESERVOIR_API_TOKENS_BASE}/${collectionAddr}:${tokenId}/image/v1`;
