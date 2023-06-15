import moment from "moment-timezone";

import { VAULT_BACKGROUND_IMAGES, VAULT_LOGOS } from "@/config/constants/vault";

const NONFUNGIBLE_AGGREGATOR_VAULT_DESCRIPTION = `Spice’s first vault represents a medium risk strategy that allocates capital to BendDAO, DropsDAO, NFTfi, Arcade, X2Y2, ParaSpace, and MetaStreet. Receipt tokens for deposits into this vault are represented by Prologue NFTs.`;
const FUNGIBLE_AGGREGATOR_VAULT_DESCRIPTION = `Spice’s first public-access aggregator vault represents a medium risk strategy that allocates capital to BendDAO, DropsDAO, NFTfi, Arcade, X2Y2, ParaSpace, and MetaStreet. Receipt tokens for deposits into this vault are represented by ERC-20 tokens.`;
const LEVERAGE_VAULT_DESCRIPTION = `Spice's first public-access vault routes liquidity solely to fund Prologue holder’s leverage requests. This vault lends against Prologue Vault $WETH positions and earns yield based on requested leverage terms and vault utilization rates.`;

// get vault description
export const getVaultDescription = (
  isFungible: boolean,
  type?: string
): string => {
  if (isFungible) {
    if (type === "aggregator") {
      return FUNGIBLE_AGGREGATOR_VAULT_DESCRIPTION;
    }
    return LEVERAGE_VAULT_DESCRIPTION;
  }
  return NONFUNGIBLE_AGGREGATOR_VAULT_DESCRIPTION;
};

// get vault background image
export const getVaultBackgroundImage = (
  isFungible?: boolean,
  type?: string,
  isDeprecated?: boolean,
  name?: string
): string => {
  if (name === "blur") {
    return VAULT_BACKGROUND_IMAGES.blur;
  }
  if (isFungible) {
    if (type === "aggregator") {
      return VAULT_BACKGROUND_IMAGES.flagship;
    }
    if (isDeprecated) return VAULT_BACKGROUND_IMAGES.leverageWithrawOnly;
    return VAULT_BACKGROUND_IMAGES.leverage;
  }
  return VAULT_BACKGROUND_IMAGES.prologue;
};

// get vault logo
export const getVaultLogo = (
  isFungible?: boolean,
  type?: string,
  isDeprecated?: boolean,
  name?: string
): string => {
  if (name === "blur") {
    return VAULT_LOGOS.blur;
  }
  if (isFungible) {
    if (type === "aggregator") {
      return VAULT_LOGOS.flagship;
    }
    return VAULT_LOGOS.leverage;
  }
  return VAULT_LOGOS.prologue;
};

// get vault up time
export const getVaultUpTime = (creationTimeStamp: number): number => {
  if (!creationTimeStamp) return 0;

  if (creationTimeStamp) {
    const timeDiff = moment.duration(
      moment().diff(moment(creationTimeStamp * 1000))
    );
    return Math.floor(timeDiff.asDays());
  }
  return 0;
};
