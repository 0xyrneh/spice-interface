export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  Coinbase = "coinbase",
}

export interface Config {
  title: string;
  icon: string;
  connectorId: ConnectorNames;
}

export type Connector = {
  name: string;
  icon: string;
  connector: ConnectorNames;
};
