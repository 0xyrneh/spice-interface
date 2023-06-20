export const VAULT_DESCRIPTIONS: Record<string, string> = {
  Prologue:
    "The Prologue Vault deploys ETH deposits to fund NFT-backed P2P and P2Pool loans, generating yield for depositors. The vault uses advanced options formulas to calculate and bid for optimal loan LTVs and APYs, diversifying its portfolio to safeguard against market volatility and maximizing yield. This is the same lending strategy used in the Flagship Vault. The Prologue Vault extends loans across all whitelisted NFT lending platforms and collections. Unlike other SPICE Vaults, this vault enables leveraging for increased yield. Depositors can withdraw at any time.",
  Flagship:
    "The Flagship Vault deploys ETH deposits to fund NFT-backed P2P and P2Pool loans, generating yield for depositors. The vault uses advanced options formulas to calculate and bid for optimal loan LTVs and APYs, diversifying its portfolio to safeguard against market volatility and maximizing yield. This is the same lending strategy used in the Prologue Vault. The Flagship Vault will fund loans across all whitelisted NFT lending marketplaces and collections. Depositors can withdraw at any time.",
  Leverage:
    "The Leverage Vault uses ETH deposits solely to fund leverage requests made by Prologue NFT holders, generating yield for depositors. This vault lends ETH to Prologue NFT holders against the ETH that they have deposited into the Prologue Vault. This makes the Leverage Vault the safest vault on the SPICE protocol. The SPICE protocol determines the vault’s APY as a function of its utilization rate. Depositors can withdraw at any time.",
  "Leverage-Deprecated":
    "This is a deprecated version of the Leverage Vault. This vault is no longer accepting any new deposits. Depositors seeking to gain exposure to Prologue Leverage yields may deposit into the new Leverage Vault. Previous depositors may withdraw funds only.",
  Blend:
    "The SP-BLUR Vault uses ETH deposits to fund P2P NFT-backed loans on Blend, generating ETH yield and farming Blur Points for depositors. ETH yield is generated continuously while Blur Point rewards are distributed at the end of the Blur Season. This vault runs a lending strategy that seeks to maximize both Blur Point farming efficiency and ETH yield via strategic loan bidding. The SP-BLUR Vault will fund loans across all whitelisted NFT collections on Blend only. Depositors are instantly earning a 1.5X - 2.5X multiplier on Blur points. The distribution of Blur Points earned by SP-BLUR vault depositors at the end of the Blur Season will be determined by time in vault and average size deposited. The longer and larger the deposit, the higher the share of Blur points. Depositors can withdraw at any time.",
};

export const VAULT_REQUIREMENTS: Record<string, string> = {
  Prologue: "Must hold Prologue NFT",
};
