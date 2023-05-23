import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";

import { LendInfo } from "@/types/lend";
import { getSpiceFiLendingAddresses } from "@/utils/addressHelpers";
import { fetchGlobalLendData } from "./fetchGlobalLend";
import {
  fetchUserLendLoanData,
  fetchUserNftData,
  fetchUserWethData,
} from "./fetchUserLend";

interface LendsState {
  data: LendInfo[];
}

const initialState: LendsState = {
  data: [],
};

export const lendSlice = createSlice({
  name: "lend",
  initialState,
  reducers: {
    reset: (state) => {
      state.data = [];
    },
    resetLendUserData: (state) => {
      state.data = state.data.map((row: LendInfo) => ({
        ...row,
        userInfo: [],
        wethAllowance: BigNumber.from(0),
      }));
    },

    removeLendUserLoanDataById: (state, action) => {
      const { lendAddr } = action.payload;

      state.data = state.data.map((row: LendInfo) => {
        if (row.address === lendAddr) {
          const userInfo = row.userInfo.map((row1: any) => {
            if (
              !row1.loan.loanId ||
              (row1.loan.loanId && row1.loan.loanId !== action.payload.loanId)
            ) {
              return row1;
            }
            return {
              ...row1,
              isApproved: false,
              loan: {},
            };
          });
          return {
            ...row,
            userInfo,
          };
        }
        return row;
      });
    },

    setLendGlobalData: (state, action) => {
      const { data } = action.payload;
      if (state.data.length === 0) {
        // when data was not initialized yet
        state.data = data.map((row: any) => ({
          address: row.lendAddr,
          lenderNote: row.lenderNote,
          loanRatio: row.loanRatio,
          liquidationRatio: row.liquidationRatio,
          wethBalance: row.wethBalance,
          leverageVaultWeth: row.leverageVaultWeth,
          leverageVaultTotal: row.leverageVaultTotal,
          userInfo: [],
          wethAllowance: BigNumber.from(0),
        }));
      } else {
        // when data was already initialized
        state.data = state.data.map((row: LendInfo) => {
          const selectedLendInfo = data.find(
            (row1: any) => row1.lendAddr === row.address
          );
          return {
            ...row,
            lenderNote: row.lenderNote,
            loanRatio: selectedLendInfo.loanRatio,
            liquidationRatio: selectedLendInfo.liquidationRatio,
            wethBalance: selectedLendInfo.wethBalance,
          };
        });
      }
    },

    setLendUserWethData: (state, action) => {
      const { lendAddr } = action.payload;

      state.data = state.data.map((row: LendInfo) => {
        if (row.address === lendAddr) {
          return {
            ...row,
            wethAllowance: action.payload.wethAllowance,
          };
        }
        return row;
      });
    },

    setLendUserData: (state, action) => {
      const { lendAddr, tokenId, isApproved, loan } = action.payload;

      state.data = state.data.map((row: LendInfo) => {
        if (row.address === lendAddr) {
          let userInfo: any[] = [];
          if (!row.userInfo.find((row1: any) => row1.tokenId === tokenId)) {
            userInfo = [
              ...row.userInfo,
              {
                tokenId,
                isApproved: isApproved !== undefined ? isApproved : false,
                loan: loan !== undefined ? loan : {},
                lendAddr,
              },
            ];
          } else {
            userInfo = row.userInfo.map((row1: any) => {
              if (row1.tokenId === action.payload.tokenId) {
                return {
                  ...row1,
                  isApproved:
                    isApproved !== undefined ? isApproved : row1.isApproved,
                  loan: loan !== undefined ? loan : row1.loan,
                  lendAddr,
                };
              }
              return row1;
            });
          }

          return {
            ...row,
            userInfo,
          };
        }
        return row;
      });
    },
  },
});

export const {
  reset,
  resetLendUserData,
  setLendGlobalData,
  setLendUserWethData,
  setLendUserData,
  removeLendUserLoanDataById,
} = lendSlice.actions;

// fetch global lending status
export const fetchLendGlobalDataAsync = () => async (dispatch: any) => {
  const lendAddrs = getSpiceFiLendingAddresses();
  if (!lendAddrs) return;

  const data = await Promise.all(
    lendAddrs.map(async (lendAddr: string) => {
      const { lenderNote, loanRatio, liquidationRatio, wethBalance } =
        await fetchGlobalLendData(lendAddr);

      return {
        lendAddr,
        lenderNote,
        loanRatio,
        liquidationRatio,
        wethBalance,
      };
    })
  );

  dispatch(
    setLendGlobalData({
      data,
    })
  );
};

// fetch user nft approval status
export const fetchLendUserNftApproveDataAsync =
  (lendAddr: string, tokenId: number, account?: string | null | undefined) =>
  async (dispatch: any) => {
    if (!account) {
      return;
    }

    const { isApproved } = await fetchUserNftData(lendAddr, tokenId);

    dispatch(
      setLendUserData({
        lendAddr,
        tokenId,
        isApproved,
      })
    );
  };

// fetch user loan data
export const fetchLendUserLoanDataAsync =
  (lendAddr: string, account?: string | null | undefined, vaultAddr?: string) =>
  async (dispatch: any) => {
    if (!account || !vaultAddr || !lendAddr) {
      return;
    }

    const { activeLoans } = await fetchUserLendLoanData(
      account,
      vaultAddr,
      lendAddr
    );

    activeLoans.map((row: any) => {
      dispatch(
        setLendUserData({
          lendAddr,
          tokenId: row.tokenId,
          loan: row,
        })
      );
      return row;
    });
  };

// fetch user weth allowance data
export const fetchLendUserWethDataAsync =
  (lendAddr: string, account?: string | null | undefined) =>
  async (dispatch: any) => {
    if (!account) {
      return;
    }

    const { allowance } = await fetchUserWethData(account, lendAddr);

    dispatch(
      setLendUserWethData({
        lendAddr,
        wethAllowance: allowance,
      })
    );
  };

// reset user loan data
export const resetLendUserLoanData = () => async (dispatch: any) => {
  dispatch(resetLendUserData());
};

// remove user loan by loanId
export const removeLendUserLoanData =
  (lendAddr: string, loanId: number) => async (dispatch: any) => {
    dispatch(removeLendUserLoanDataById({ lendAddr, loanId }));
  };

export default lendSlice.reducer;
