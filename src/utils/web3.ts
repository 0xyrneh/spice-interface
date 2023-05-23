import Web3 from "web3";
import { HttpProviderOptions } from "web3-core-helpers";
import { AbiItem } from "web3-utils";
import { ContractOptions } from "web3-eth-contract";

import getRpcUrl from "@/utils/getRpcUrl";
import { SupportedChainId } from "@/config/constants/chains";

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000,
} as HttpProviderOptions);
const web3NoAccount = new Web3(httpProvider);

const activeChainId: SupportedChainId = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || "1"
);
const mainNetChainId: SupportedChainId = SupportedChainId.MAINNET;
const testNetChainId: SupportedChainId = SupportedChainId.GOERLI;

/**
 * Provides a web3 instance using our own private provider httpProver
 */
const getWeb3 = () => {
  const web3 = new Web3(httpProvider);
  return web3;
};
const getContract = (
  abi: any,
  address: string,
  contractOptions?: ContractOptions
) => {
  const web3 = getWeb3();
  return new web3.eth.Contract(
    abi as unknown as AbiItem,
    address,
    contractOptions
  );
};

const getWeb3NoAccount = () => web3NoAccount;

export {
  getWeb3,
  getContract,
  httpProvider,
  getWeb3NoAccount,
  activeChainId,
  mainNetChainId,
  testNetChainId,
};
