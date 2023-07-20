import { ConnectorNames } from "@/types/wallet";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { spiceTestnetNodes, spiceMainnetNodes } from "./getRpcUrl";
import { activeChainId } from "@/utils/web3";

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

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

const [walletConnectV2, walletConnectV2Hooks] =
  initializeConnector<WalletConnectV2>(
    (actions) =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: process.env.walletConnectProjectId || "",
          chains: [activeChainId],
          showQrModal: true,
        },
      })
  );

const [coinbaseWallet, coinbaseWalletHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: params.rpcUrls[0],
          appName: "Spice",
        },
      })
  );

export const connectors: [
  MetaMask | WalletConnectV2 | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

export const connectorsByName = {
  [ConnectorNames.Injected]: { connector: metaMask, hooks: metaMaskHooks },
  [ConnectorNames.WalletConnect]: {
    connector: walletConnectV2,
    hooks: walletConnectV2Hooks,
  },
  [ConnectorNames.Coinbase]: {
    connector: coinbaseWallet,
    hooks: coinbaseWalletHooks,
  },
};
