import multicall from "@/utils/multicall";
import { getWethAddress } from "@/utils/addressHelpers";
import SpiceFiLendingAbi from "@/config/abi/SpiceFiLending.json";
import WethAbi from "@/config/abi/WETH.json";
import NoteAbi from "@/config/abi/Note.json";
import { getBalanceInEther } from "@/utils/formatBalance";

const LOAN_RATIO_DENOMINATOR = 10000;
const LIQUIDATION_RATIO_DENOMINATOR = 10000;

export const fetchGlobalLendData = async (lendAddr: string) => {
  const [loanRatio, liquidationRatio, lenderNote] = await multicall(
    SpiceFiLendingAbi,
    [
      {
        address: lendAddr,
        name: "loanRatio",
        params: [],
      },
      {
        address: lendAddr,
        name: "liquidationRatio",
        params: [],
      },
      {
        address: lendAddr,
        name: "lenderNote",
        params: [],
      },
    ]
  );

  const [lendWethBalance] = await multicall(WethAbi, [
    {
      address: getWethAddress(),
      name: "balanceOf",
      params: [lendAddr],
    },
  ]);

  return {
    lenderNote: lenderNote[0],
    loanRatio: loanRatio[0].toNumber() / LOAN_RATIO_DENOMINATOR,
    liquidationRatio:
      liquidationRatio[0].toNumber() / LIQUIDATION_RATIO_DENOMINATOR,
    wethBalance: lendWethBalance[0],
  };
};

export const getLoanData = async (lendAddr: string, loanId: number) => {
  const [loanData] = await multicall(SpiceFiLendingAbi, [
    {
      address: lendAddr,
      name: "getLoanData",
      params: [loanId],
    },
  ]);

  const { startedAt, terms } = loanData[0];

  return {
    startedAt: startedAt.toNumber(),
    duration: terms.duration,
    interestRate: terms.interestRate.toNumber() / 10000,
  };
};

export const getLoanDataFromCallData = async (callData: any[]) => {
  const loanData = await multicall(SpiceFiLendingAbi, callData);

  return loanData.map((row: any, index: number) => {
    const { startedAt, interestAccrued, terms } = row[0];

    return {
      startedAt: startedAt.toNumber(),
      duration: terms.duration,
      interestRate: terms.interestRate.toNumber() / 10000,
      amount: getBalanceInEther(terms.loanAmount),
      interestAccrued: getBalanceInEther(interestAccrued),
      repayAmount:
        getBalanceInEther(terms.loanAmount) +
        getBalanceInEther(interestAccrued),
      loanId: callData[index].params[0],
    };
  });
};

export const getLenderByLoanId = async (
  lenderNoteAddr: string,
  loanId: number
) => {
  const [owner] = await multicall(NoteAbi, [
    {
      address: lenderNoteAddr,
      name: "ownerOf",
      params: [loanId],
    },
  ]);

  return owner[0];
};
