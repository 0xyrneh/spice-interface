// leverage
export const getLeveredApy = (
  nftValue: number,
  vaultApy: number,
  debtOwed: number,
  borrowApy: number
) => (nftValue * vaultApy - debtOwed * borrowApy) / (nftValue - debtOwed);

export const getNetApy = (
  nftValue: number,
  vaultApy: number,
  debtOwed: number,
  borrowApy: number
) => (nftValue * vaultApy - debtOwed * borrowApy) / (nftValue - debtOwed);

export const calculateBorrowAprOld = (
  ltv: number,
  total: number,
  available: number
) => {
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

export const calculateBorrowAprOld2 = (
  total: number,
  available: number,
  loanDuration?: number
) => {
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

export const calculateBorrowApr = (
  price: number,
  newDebt: number,
  additionalDebt: number,
  maxLtv: number,
  total: number,
  available: number,
  loanDuration?: number
) => {
  // calc utilization
  let utilization =
    total > 0 ? (total - available + additionalDebt) / total : 0;

  if (utilization < 0) utilization = 0;
  if (utilization > 1) utilization = 1;

  let ltv = maxLtv >= 1 ? newDebt / (price + additionalDebt) : newDebt / price;

  let baseApy = 0.045;
  const ltvSlope = 2;
  const ltvKink = 0.6;

  if (ltv < 0) ltv = 0;
  if (ltv > 1) ltv = 1;

  if (ltv > ltvKink) {
    baseApy += (ltv - ltvKink) * ltvSlope;
  }

  const UTIL_SLOPE_1 = 0.07;
  const UTIL_SLOPE_2 = 0.5;
  const UTIL_SLOPE_3 = 6;

  const UTIL_KINK_1 = 0.75;
  const UTIL_KINK_2 = 0.85;

  let apy = baseApy;
  if (utilization <= UTIL_KINK_1) {
    // apy at kink1
    apy += utilization * UTIL_SLOPE_1;
  } else if (utilization <= UTIL_KINK_2) {
    // apy at kink2
    apy +=
      UTIL_KINK_1 * UTIL_SLOPE_1 + (utilization - UTIL_KINK_1) * UTIL_SLOPE_2;
  } else {
    apy +=
      UTIL_KINK_1 * UTIL_SLOPE_1 +
      (UTIL_KINK_2 - UTIL_KINK_1) * UTIL_SLOPE_2 +
      (utilization - UTIL_KINK_2) * UTIL_SLOPE_3;
  }

  const duration = loanDuration ?? 7; // default loan duration is 7 years
  const repayment = newDebt * Math.pow(1 + apy, duration);
  const apr = (repayment - newDebt) / (duration * newDebt);

  // return apr;
  // eslint-disable-next-line no-restricted-properties
  // const borrowApr = (Math.pow(1 + apy, duration) - 1) / duration;
  return Math.floor(apr * 10000) / 10000;
};
