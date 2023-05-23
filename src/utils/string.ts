import { activeChainId } from "@/utils/web3";

export const formatTo2Digit = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export const getVaultDisplayName = (name: string): string => {
  switch (name) {
    case "spice-nft-vault-goerli":
      return "Prologue Test Vault";
    case "spice-vault-3":
      return "Prologue Vault";

    default:
      return "Spice Vault";
  }
};

export const shortenTxHash = (txHash: string, chars = 16): string => {
  if (!txHash) return "";

  return `${txHash.substring(0, chars)}•••${txHash.slice(-chars)}`;
};

export const getExpolorerUrl = (txHash: string): string => {
  if (!txHash) return "";

  const baseExplorerUrl =
    activeChainId === 1
      ? "https://etherscan.io/"
      : "https://goerli.etherscan.io";

  return `${baseExplorerUrl}/tx/${txHash}`;
};
