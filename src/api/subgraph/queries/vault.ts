const userVaultPositionQuery = `
  query getUserPositions($userAddress: String!, $vaultAddress: String!) {
    userHourPositions(
      first:$cnt
      where: {
        user: $userAddress
        vault: $vaultAddress
      }
      orderBy: date
      orderDirectioni: asc
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
      orderDirectioni: asc
    )
      {
        date
        position
      }
  }
`;

export { userVaultPositionQuery, vaultPositionQuery };
