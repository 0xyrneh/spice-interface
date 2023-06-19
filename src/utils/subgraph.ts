import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { activeChainId } from "@/utils/web3";

const prologueNftSubgraphApiUrl =
  activeChainId === 1
    ? "https://api.thegraph.com/subgraphs/name/teamspice/spice-vaults"
    : "https://api.thegraph.com/subgraphs/name/teamspice/spice-vaultss";

export const spiceSubgraphClient = new ApolloClient({
  uri: prologueNftSubgraphApiUrl,
  cache: new InMemoryCache(),
});

const spiceUserQuery = `
  query getUsers($userAddr: String!) {
    users(where:{address:$userAddr, id_not:"0x0000000000000000000000000000000000000000"})
      {
        id
        nfts {
          id
          tokenId
          shares
        }
      }
  }
`;

const spiceNftQuery = `
  query getNfts($cnt: Int!) {
    nfts(first:$cnt)
      {
        tokenId
        shares
        owner {
          address
        }
      }
  }
`;

export const getUserSpiceNfts = async (userAddr: string) => {
  try {
    const result = await spiceSubgraphClient.query({
      query: gql(spiceUserQuery),
      variables: {
        userAddr,
      },
      fetchPolicy: "network-only",
    });

    const user = result.data.users[0];
    return user ? user.nfts : [];
  } catch {
    return [];
  }
};

export const getSpiceNfts = async () => {
  try {
    const result = await spiceSubgraphClient.query({
      query: gql(spiceNftQuery),
      variables: { cnt: 1000 },
      fetchPolicy: "network-only",
    });
    const { nfts } = result.data;
    return nfts || [];
  } catch {
    return [];
  }
};
