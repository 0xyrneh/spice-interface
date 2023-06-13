import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";

import { LeverageVaultInfo, VaultInfo } from "@/types/vault";
import { fetchGlobalData } from "./fetchGlobalVault";
import { fetchUserTokenData, fetchUserVaultData } from "./fetchUserVault";

interface WalletConnectState {
  defaultVault: VaultInfo | null;
  activeVault: VaultInfo | null;
  leverageVaults: LeverageVaultInfo[];
  blurVaults: VaultInfo[];
  vaults: VaultInfo[];
}

const initialState: WalletConnectState = {
  defaultVault: null,
  activeVault: null,
  leverageVaults: [],
  blurVaults: [],
  vaults: [],
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    reset: (state) => {
      state.leverageVaults = [];
      state.blurVaults = [];
      state.vaults = [];
      state.activeVault = null;
    },
    setVaultGlobalData: (state, action) => {
      state.defaultVault = {
        ...action.payload.defaultVault,
        userInfo: state.defaultVault?.userInfo || {},
      };
      state.leverageVaults = action.payload.leverageVaults;
      state.vaults = action.payload.vaults;
      state.vaults = action.payload.vaults.map((row: VaultInfo, i: number) => ({
        ...row,
        userInfo: state.vaults[i]?.userInfo || {},
      }));
    },
    updateActiveVault: (state, action) => {
      state.activeVault = action.payload;
    },
    setVaultUserTokenData: (state, action) => {
      const { vault } = action.payload;
      // update vaults
      state.vaults = state.vaults.map((row: VaultInfo) => {
        if (row.address === vault.address) {
          const updatedVault = {
            ...row,
            userInfo: {
              ...row.userInfo,
              allowance: action.payload.userTokenAllowance || BigNumber.from(0),
              tokenBalance:
                action.payload.userTokenBalance || BigNumber.from(0),
            },
          };
          if (state.activeVault?.address === vault.address) {
            state.activeVault = updatedVault;
          }
          return updatedVault;
        }
        return row;
      });

      // update default vault
      if (state.defaultVault && state.defaultVault.address === vault.address) {
        state.defaultVault = {
          ...state.defaultVault,
          userInfo: {
            ...state.defaultVault.userInfo,
            allowance: action.payload.userTokenAllowance || BigNumber.from(0),
            tokenBalance: action.payload.userTokenBalance || BigNumber.from(0),
          },
        };
      }

      // update active vault
      if (state.activeVault && state.activeVault.address === vault.address) {
        state.activeVault = {
          ...state.activeVault,
          userInfo: {
            ...state.activeVault.userInfo,
            allowance: action.payload.userTokenAllowance || BigNumber.from(0),
            tokenBalance: action.payload.userTokenBalance || BigNumber.from(0),
          },
        };
      }
    },

    setVaultUserDepositData: (state, action) => {
      const { vault } = action.payload;
      // update vaults
      state.vaults = state.vaults.map((row: VaultInfo) => {
        if (row.address === action.payload.vault.address) {
          const updatedVault = {
            ...row,
            userInfo: {
              ...row.userInfo,
              nfts: action.payload.userNfts || [],
              nftsRaw: action.payload.userNftsRaw || [],
              depositAmnt: action.payload.userDepositAmnt || BigNumber.from(0),
              userMaxRedeemable:
                action.payload.userMaxRedeemable || BigNumber.from(0),
            },
          };
          if (state.activeVault?.address === vault.address) {
            state.activeVault = updatedVault;
          }
          return updatedVault;
        }
        return row;
      });

      // update default vault
      if (state.defaultVault && state.defaultVault.address === vault.address) {
        state.defaultVault = {
          ...state.defaultVault,
          userInfo: {
            ...state.defaultVault.userInfo,
            nfts: action.payload.userNfts || [],
            nftsRaw: action.payload.userNftsRaw || [],
            depositAmnt: action.payload.userDepositAmnt || BigNumber.from(0),
            userMaxRedeemable:
              action.payload.userMaxRedeemable || BigNumber.from(0),
          },
        };
      }

      // update active vault
      if (state.activeVault && state.activeVault.address === vault.address) {
        state.activeVault = {
          ...state.activeVault,
          userInfo: {
            ...state.activeVault.userInfo,
            nfts: action.payload.userNfts || [],
            nftsRaw: action.payload.userNftsRaw || [],
            depositAmnt: action.payload.userDepositAmnt || BigNumber.from(0),
            userMaxRedeemable:
              action.payload.userMaxRedeemable || BigNumber.from(0),
          },
        };
      }
    },
  },
});

export const {
  reset,
  setVaultGlobalData,
  setVaultUserTokenData,
  setVaultUserDepositData,
  updateActiveVault,
} = vaultSlice.actions;

export const fetchVaultGlobalDataAsync = () => async (dispatch: any) => {
  const { defaultVault, leverageVaults, blurVaults, vaults } =
    await fetchGlobalData();

  dispatch(
    setVaultGlobalData({
      defaultVault,
      leverageVaults,
      blurVaults,
      vaults,
    })
  );
};

export const fetchVaultUserTokenDataAsync =
  (account?: string | null | undefined, vault?: VaultInfo | null) =>
  async (dispatch: any) => {
    if (!account) {
      dispatch(
        setVaultUserTokenData({
          vault,
          userTokenAllowance: BigNumber.from(0),
          userTokenBalance: BigNumber.from(0),
        })
      );
      return;
    }

    if (!vault) return;

    const { userTokenAllowance, userTokenBalance } = await fetchUserTokenData(
      account,
      vault
    );

    dispatch(
      setVaultUserTokenData({
        vault,
        userTokenAllowance,
        userTokenBalance,
      })
    );
  };

export const fetchVaultUserDepositDataAsync =
  (account?: string | null | undefined, vault?: VaultInfo | null) =>
  async (dispatch: any) => {
    if (!account) {
      dispatch(
        setVaultUserDepositData({
          vault,
          userNfts: [],
          userNftsRaw: [],
          userDepositAmnt: BigNumber.from(0),
        })
      );
      return;
    }

    if (!vault) return;

    const { userNfts, userNftsRaw, userDepositAmnt, userMaxRedeemable } =
      await fetchUserVaultData(account, vault);

    dispatch(
      setVaultUserDepositData({
        vault,
        userNfts,
        userNftsRaw,
        userDepositAmnt,
        userMaxRedeemable: userMaxRedeemable || BigNumber.from(0),
      })
    );
  };

export const fetchVaultUserDataAsync =
  (account?: string | null | undefined, vault?: VaultInfo | null) =>
  async (dispatch: any) => {
    await dispatch(fetchVaultUserTokenDataAsync(account, vault));
    await dispatch(fetchVaultUserDepositDataAsync(account, vault));
  };

export default vaultSlice.reducer;
