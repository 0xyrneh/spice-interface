// leverage
export const getLeveredApy = (nftValue: number, vaultApy: number, debtOwed: number, borrowApy: number) =>
  (nftValue * vaultApy - debtOwed * borrowApy) / (nftValue - debtOwed);

export const getNetApy = (nftValue: number, vaultApy: number, debtOwed: number, borrowApy: number) =>
  (nftValue * vaultApy - debtOwed * borrowApy) / (nftValue - debtOwed);

export const calculateBorrowAprOld = (ltv: number, total: number, available: number) => {
  const GROWTH_FACTOR = 0.05;
  const BASE_FACTOR_1 = 50;
  const BASE_FACTOR_2 = 5;
  const BASE_FACTOR_3 = 100;
  const KINK = 0.45;

  // eslint-disable-next-line no-restricted-properties
  const baseApy = GROWTH_FACTOR * Math.pow(BASE_FACTOR_1, ltv);
  const utilization = total > 0 ? (total - available) / total : 0;

  if (utilization > KINK) {
    // eslint-disable-next-line no-restricted-properties
    const interimApy = baseApy * Math.pow(BASE_FACTOR_3, utilization);
    // eslint-disable-next-line no-restricted-properties
    const kinkApyHigh = baseApy * Math.pow(BASE_FACTOR_3, KINK);
    // eslint-disable-next-line no-restricted-properties
    const kinkApyLow = baseApy * Math.pow(BASE_FACTOR_2, KINK);

    return interimApy - kinkApyHigh + kinkApyLow;
  }
  // eslint-disable-next-line no-restricted-properties
  return baseApy * Math.pow(BASE_FACTOR_2, utilization);
};

export const calculateBorrowAprOld2 = (total: number, available: number, loanDuration?: number) => {
  const duration = loanDuration || 28 / 365; // loan duration is 28 days
  const baseApy = 0.045;
  const UTIL_SLOPE_1 = 0.02;
  const UTIL_SLOPE_2 = 0.3;
  const UTIL_SLOPE_3 = 6;
  const UTIL_KINK_1 = 0.75;
  const UTIL_KINK_2 = 0.85;

  const apyKink1 = baseApy + UTIL_KINK_1 * UTIL_SLOPE_1;
  const apyKink2 = apyKink1 + (UTIL_KINK_2 - UTIL_KINK_1) * UTIL_SLOPE_2;

  const utilization = total > 0 ? (total - available) / total : 0;

  let apy = 0;
  if (utilization <= UTIL_KINK_1) {
    apy = baseApy + utilization * UTIL_SLOPE_1;
  } else if (utilization <= UTIL_KINK_2) {
    apy = apyKink1 + (utilization - UTIL_KINK_1) * UTIL_SLOPE_2;
  } else {
    apy = apyKink2 + (utilization - UTIL_KINK_2) * UTIL_SLOPE_3;
  }

  // eslint-disable-next-line no-restricted-properties
  const borrowApr = (Math.pow(1 + apy, duration) - 1) / duration;
  return borrowApr;
};

/*
 * @param "repayValue": repayAmount(loanId)
 * @param "additionalDebt": additional loan amount
 * @pram "total": total supply of loan lender valut
 * @param "available": weth balance of loan lender vault
 * @param "loanDuration": loan duration in days
 */
export const calculateBorrowApr = (
  ltv: number,
  additionalDebt: number,
  total: number,
  available: number,
  loanDuration?: number
) => {
  // calc utilization
  let utilization = total > 0 ? (total - available + additionalDebt) / total : 0;
  if (utilization < 0) utilization = 0;
  if (utilization > 1) utilization = 1;

  const baseApy = 0.045;
  const UTIL_SLOPE_1 = 0.07;
  const UTIL_SLOPE_2 = 0.5;
  const UTIL_SLOPE_3 = 6;

  const UTIL_KINK_1 = 0.75;
  const UTIL_KINK_2 = 0.85;

  // const UTIL_SLOPE_L = 2;
  // const UTIL_KINK_L = 0.6;

  // if (ltv > UTIL_KINK_L) {
  //   baseApy += ltv * UTIL_SLOPE_L - UTIL_KINK_L * UTIL_SLOPE_L;
  // }

  let apy = 0;
  if (utilization <= UTIL_KINK_1) {
    // apy at kink1
    apy = baseApy + utilization * UTIL_SLOPE_1;
  } else if (utilization <= UTIL_KINK_2) {
    // apy at kink2
    apy = baseApy + UTIL_KINK_1 * UTIL_SLOPE_1 + (utilization - UTIL_KINK_1) * UTIL_SLOPE_2;
  } else {
    apy =
      baseApy +
      UTIL_KINK_1 * UTIL_SLOPE_1 +
      (UTIL_KINK_2 - UTIL_KINK_1) * UTIL_SLOPE_2 +
      (utilization - UTIL_KINK_2) * UTIL_SLOPE_3;
  }

  // calculate apr from apy
  const duration = (loanDuration || 28) / 365;
  // eslint-disable-next-line no-restricted-properties
  return (Math.pow(1 + apy, duration) - 1) / duration;
};
