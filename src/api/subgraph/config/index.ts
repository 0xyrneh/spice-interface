import { ApolloClient, InMemoryCache } from "@apollo/client";
import { activeChainId } from "@/utils/web3";

const prologueNftSubgraphApiUrl =
  activeChainId === 1
    ? "https://api.thegraph.com/subgraphs/name/teamspice/spice-vaults"
    : "https://api.thegraph.com/subgraphs/name/teamspice/spice-vaultss";

const vaultSubgraphApiUrl =
  activeChainId === 1
    ? "https://api.thegraph.com/subgraphs/name/daisai3/vault-position-mainnet"
    : "https://api.thegraph.com/subgraphs/name/daisai3/vault-position";

export const prologueNftSubgraphClient = new ApolloClient({
  uri: prologueNftSubgraphApiUrl,
  cache: new InMemoryCache(),
});

export const vaultSubgraphClient = new ApolloClient({
  uri: vaultSubgraphApiUrl,
  cache: new InMemoryCache(),
});
