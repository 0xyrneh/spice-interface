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

const vaultShareQuery = `
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
        share
      }
  }
`;

export { userVaultShareQuery, vaultShareQuery };
