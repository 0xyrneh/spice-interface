import { Connector, ConnectorNames } from "@/types/wallet";

const connectors: Connector[] = [
  {
    name: "Metamask",
    icon: "/assets/icons/metamask.svg",
    connector: ConnectorNames.Injected,
  },
  {
    name: "Coinbase Wallet",
    icon: "/assets/icons/coinbase.svg",
    connector: ConnectorNames.Coinbase,
  },
  {
    name: "WalletConnect",
    icon: "/assets/icons/wallet-connect.svg",
    connector: ConnectorNames.WalletConnect,
  },
];

export default connectors;
