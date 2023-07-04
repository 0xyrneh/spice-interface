const userTxHistoryQuery = `
  query getUserTxHistories($userAddress: String!) {
    userTxHistories(
      first:$cnt
      where: {
        user: $userAddress
      }
      orderBy: timestamp
      orderDirection: asc
    )
      {
        type
        txHash
        user {
          address
        }
        vault {
          address
        }
        timestamp
        amount
      }
  }
`;

export { userTxHistoryQuery };
