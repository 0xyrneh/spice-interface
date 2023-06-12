/* eslint-disable no-console */
import { useEffect, useMemo, useState } from "react";
import { AbiItem } from "web3-utils";
import { ContractOptions } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import { providers } from "ethers";

import useWeb3 from "@/hooks/useWeb3";
import erc20Abi from "@/config/abi/Erc20.json";
import WethAbi from "@/config/abi/WETH.json";
import VaultAbi from "@/config/abi/SpiceFiVault.json";
import FtVaultAbi from "@/config/abi/SpiceFi4626.json";
import NftVaultAbi from "@/config/abi/SpiceFiNFT4626.json";
import Erc721Abi from "@/config/abi/Erc721.json";
import SpiceLendingAbi from "@/config/abi/SpiceFiLending.json";
import { getWethAddress } from "@/utils/addressHelpers";
import { getContract } from "@/utils/address";

export const useContractWeb3 = (
  abi: AbiItem,
  address: string,
  contractOptions?: ContractOptions
) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(
    new web3.eth.Contract(abi, address, contractOptions)
  );

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions));
  }, [abi, address, contractOptions, web3]);

  return contract;
};

export const useContract = (
  abi: AbiItem,
  address: string,
  withSignerIfPossible = true
) => {
  const { account, library } = useWeb3React();

  return useMemo(() => {
    if (!address || !abi || !library) return null;

    const provider = new providers.Web3Provider(library);

    try {
      return getContract(
        address,
        abi,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, abi, library, withSignerIfPossible, account]);
};

// erc20 token contract
export const useErc20Contract = (address: string) =>
  useContract(erc20Abi as unknown as AbiItem, address);

// weth token contract
export const useWethContract = () =>
  useContract(WethAbi as unknown as AbiItem, getWethAddress());

// vault contract
export const useVaultContract = (address: string) =>
  useContract(VaultAbi as unknown as AbiItem, address);

// ft vault contract
export const useFtVaultContract = (address: string) =>
  useContract(FtVaultAbi as unknown as AbiItem, address);

// nft vault contract
export const useNftVaultContract = (address: string) =>
  useContract(NftVaultAbi as unknown as AbiItem, address);

// spice lending contract
export const useSpiceLendingContract = (address: string) =>
  useContract(SpiceLendingAbi as unknown as AbiItem, address);

// nft contract
export const useNftContract = (address: string) =>
  useContract(Erc721Abi as unknown as AbiItem, address);

export default useContract;
