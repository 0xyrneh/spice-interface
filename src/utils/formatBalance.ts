import { BigNumber, ethers } from "ethers";

export const getBalanceInEther = (balance: BigNumber): number => {
  const displayBalance = ethers.utils.formatEther(balance.toString());
  return Number(displayBalance);
};

export const getBalanceInWei = (balance: string, decimals = 18): BigNumber =>
  ethers.utils.parseUnits(balance, decimals || 18);
