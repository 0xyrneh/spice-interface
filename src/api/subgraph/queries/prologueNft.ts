const userPrologueNftQuery = `
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

const prologueNftQuery = `
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

export { userPrologueNftQuery, prologueNftQuery };
