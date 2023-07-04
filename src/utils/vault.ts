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

// get vault name
export const getVaultNameFromAddress = (address: string): string => {
  const prologueAddress = "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe";
  const flagshipAddress = "0xAe11ae7CaD244dD1d321Ff2989543bCd8a6Db6DF";
  const leverageAddress = "0xd68871bd7D28572860b2E0Ee5c713b64445104F9";
  const blurAddress = "0xfC287513E2DD58fbf952eB0ED05D511591a6215B";

  if (address.toLowerCase() === prologueAddress.toLowerCase())
    return "Prologue";
  if (address.toLowerCase() === flagshipAddress.toLowerCase())
    return "Flagship";
  if (address.toLowerCase() === leverageAddress.toLowerCase())
    return "Leverage";
  if (address.toLowerCase() === blurAddress.toLowerCase()) return "SP-BLUR";

  return "Prologue";
};
