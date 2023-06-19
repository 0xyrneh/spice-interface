const userVaultPositionQuery = `
  query getUserPositions($userAddress: String!, $vaultAddress: String!) {
    userHourPositions(
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
        position
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

export { userVaultPositionQuery, vaultPositionQuery, userSpicePositionQuery };
