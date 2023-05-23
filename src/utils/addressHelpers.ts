import {
  multicallAddr,
  spiceFiFactoryAddr,
  spiceFiNFTFactoryAddr,
  spiceLendingAddr,
  spiceLendingAddrs,
  wethAddr,
} from "@/config/constants/contract";
import { Address } from "@/config/constants/types";
import { activeChainId, mainNetChainId } from "@/utils/web3";

export const getAddress = (address: Address): string =>
  address[activeChainId] ? address[activeChainId] : address[mainNetChainId];

export const getWethAddress = () => getAddress(wethAddr);

export const getMulticallAddress = () => getAddress(multicallAddr);

export const getSpiceFiFactoryAddress = () => getAddress(spiceFiFactoryAddr);

export const getSpiceFiNFTFactoryAddress = () =>
  getAddress(spiceFiNFTFactoryAddr);

export const getSpiceFiLendingAddress = () => getAddress(spiceLendingAddr);

export const getSpiceFiLendingAddresses = () =>
  spiceLendingAddrs[activeChainId].map((row: any) => row.address);
