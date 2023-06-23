const userVaultShareQuery = `
  query getUserPositions($userAddress: String!, $vaultAddress: String!) {
    userVaultHourPositions(
      first:$cnt
      where: {
        user: $userAddress
        vault: $vaultAddress
      }
      orderBy: date
      orderDirection: asc
    )
      {
        date
        share
      }
  }
`;

const vaultPositionQuery = `
  query getVaultPositions($cnt: Int!, $vaultAddress: String!) {
    vaultHourPositions(
      first:$cnt
      where: {
        vault: $vaultAddress
      }
      orderBy: date
      orderDirection: asc
    )
      {
        date
        position
      }
  }
`;

const userSpicePositionQuery = `
  query getUserSpicePositions($userAddress: String!) {
    userSpiceHourPositions(
      first:$cnt
      where: {
        address: $userAddress
      }
      orderBy: date
      orderDirection: asc
    )
      {
        date
        position
      }
  }
`;

export { userVaultShareQuery, vaultPositionQuery, userSpicePositionQuery };
