import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import Web3 from "web3";

import { ConnectorNames } from "@/types/wallet";
import getNodeUrl from "@/utils/getRpcUrl";
import { spiceTestnetNodes, spiceMainnetNodes } from "./getRpcUrl";
import { activeChainId } from "@/utils/web3";

const rpcUrl = getNodeUrl();

const mainnetParams = {
  chainId: 1,
  chainName: "Ethereum mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: spiceMainnetNodes,
  blockExplorerUrls: ["https://etherscan.io/"],
};

const testnetParams = {
  chainId: 5,
  chainName: "Ethereum Goerli",
  nativeCurrency: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: spiceTestnetNodes,
  blockExplorerUrls: ["https://goerli.etherscan.io/"],
};

const params = activeChainId === 1 ? mainnetParams : testnetParams;

const injected = new InjectedConnector({ supportedChainIds: [1, 5] });

const walletconnect = new WalletConnectConnector({
  rpc: { [activeChainId]: rpcUrl },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const walletlink = new WalletLinkConnector({
  url: params.rpcUrls[0],
  appName: "Spice",
  supportedChainIds: [1, 5],
});

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Coinbase]: walletlink,
};

export const getLibrary = (provider: any): Web3 => provider;
