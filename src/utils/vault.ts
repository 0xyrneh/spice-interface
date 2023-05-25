import { VAULT_BACKGROUND_IMAGES } from "@/config/constants/vault";

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
  isDeprecated?: boolean
): string => {
  if (isFungible) {
    if (type === "aggregator") {
      return VAULT_BACKGROUND_IMAGES.flagship;
    }
    if (isDeprecated) return VAULT_BACKGROUND_IMAGES.leverageWithrawOnly;
    return VAULT_BACKGROUND_IMAGES.leverage;
  }
  return VAULT_BACKGROUND_IMAGES.prologue;
};
