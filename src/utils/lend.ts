import axios from "axios";

import { LEVERAGE_API_TERMS } from "@/config/constants/backend";
import { LendInfo } from "@/types/lend";
import { spiceLendingAddrs } from "@/config/constants/contract";
import { activeChainId } from "@/utils/web3";

export const getLendStatus = (lendAddr: string) => {
  const selectedLend = spiceLendingAddrs[activeChainId].find(
    (row: any) => row.address === lendAddr
  );
  if (selectedLend) return selectedLend.isActive;
  return false;
};

export const getLoanTerms = async (
  terms: any,
  signature: any,
  requestType: any,
  chainId: number,
  loanId?: number
) => {
  const requestBody: any = {
    signature,
    loanterms: terms,
    requestType,
    chainId,
  };
  if (loanId !== undefined) {
    requestBody.loanId = loanId;
  }
  return axios.post(`${LEVERAGE_API_TERMS}`, requestBody);
};

export const accLoans = (data: LendInfo[]) => {
  let loans: any[] = [];
  data.map((row: any) => {
    if (row.userInfo) {
      row.userInfo.map((row1: any) => {
        const lendStatus = getLendStatus(row1.lendAddr);
        if (lendStatus) {
          loans = [...loans, row1];
        } else if (row1.loan && row1.loan.loanId > 0) {
          loans = [...loans, row1];
        }
        return row1;
      });
    }
    return row;
  });

  return loans;
};
