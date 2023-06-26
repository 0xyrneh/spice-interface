import { BigNumber } from "ethers";

import { Button, Card } from "../../common";
import WethSVG from "@/assets/icons/weth.svg";
import EthSVG from "@/assets/icons/eth.svg";
import TriangleSVG from "@/assets/icons/triangle.svg";
import { TxStatus } from "@/types/common";
import { getExpolorerUrl, shortenTxHash } from "@/utils/string";
import { useAppSelector } from "@/state/hooks";
import {
  getVaultLiquidWeth,
  getVaultNftShare,
  getVaultWithdrawable,
} from "@/state/vault/fetchGlobalVault";
import { VaultInfo } from "@/types/vault";
import { useEffect } from "react";

type Props = {
  vault: VaultInfo;
  lend: any;
  selectedNft: any;
  isDeposit: boolean;
  useWeth: boolean;
  value: string;
  txStatus: TxStatus;
  showTooltip?: boolean;
  balance: string;
  usdVal: string;
  vaultBalance: string;
  setMaxWithdrawAmnt: (value: BigNumber) => void;
  setLiquidWeth: (value: BigNumber | undefined) => void;
  setValue: (value: string) => void;
  onMax?: () => void;
  toggleEth: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PositionInput({
  vault,
  lend,
  selectedNft,
  isDeposit,
  useWeth,
  toggleEth,
  value,
  setMaxWithdrawAmnt,
  setLiquidWeth,
  setValue,
  onMax,
  txStatus,
  onFocus,
  onBlur,
  showTooltip,
  balance,
  usdVal,
  vaultBalance,
}: Props) {
  const processing = () => txStatus === TxStatus.Pending;

  const { pendingTxHash, actionError } = useAppSelector((state) => state.modal);

  const isFungible = vault?.fungible;

  const fetchMaxAmount = async () => {
    if (!vault) return;

    if (isFungible) {
      if (vault?.isBlur) {
        setMaxWithdrawAmnt(vault?.userInfo?.depositAmnt);
        return;
      } else {
        const res = await getVaultWithdrawable(
          vault,
          vault?.userInfo?.userMaxRedeemable || BigNumber.from(0)
        );

        setMaxWithdrawAmnt(res);
        return;
      }
    }

    if (selectedNft) {
      if (selectedNft.loan && selectedNft.loan.balance) {
        const share = await getVaultNftShare(vault, selectedNft.tokenId);
        const collateralAmnt = await getVaultWithdrawable(vault, share);

        let lendMaxWithdrawable = collateralAmnt
          .sub(selectedNft.loan.repayAmount)
          .sub(
            BigNumber.from(10000)
              .mul(selectedNft.loan.repayAmount)
              .div(BigNumber.from(10000 * (lend?.loanRatio || 0)))
          );
        lendMaxWithdrawable = BigNumber.from(99)
          .mul(lendMaxWithdrawable)
          .div(BigNumber.from(100));
        setMaxWithdrawAmnt(lendMaxWithdrawable);
      } else {
        const res = await getVaultWithdrawable(
          vault,
          selectedNft?.tokenShare || BigNumber.from(0)
        );
        setMaxWithdrawAmnt(res);
      }
    }
  };

  const getLiquidWeth = async () => {
    setLiquidWeth(undefined);

    if (!vault) return;

    const liquidWethBal = await getVaultLiquidWeth(vault);
    setLiquidWeth(liquidWethBal);
  };

  useEffect(() => {
    fetchMaxAmount();
  }, [vault?.address, lend?.address, selectedNft?.tokenId]);

  useEffect(() => {
    getLiquidWeth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address]);

  return (
    <div className="flex flex-col px-2 pb-3 flex-1">
      <div className="flex flex-1 items-center justify-center">
        <Card
          className="mx-2.5 border-1 border-gray-200 shadow-transparent px-8 py-5 text-gray-200 gap-1 text-xs max-w-[324px] w-full"
          notBlur
        >
          <div className="flex items-center justify-between">
            <input
              className={`text-2xl w-[100px] flex-1 hover:placeholder:text-gray-300 placeholder:text-gray-200 ${
                processing() ? "text-gray-200" : "text-white"
              }`}
              placeholder="0.000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              disabled={processing()}
            />
            <button
              className="flex items-center gap-2 bg-gray-200 bg-opacity-20 h-7 rounded px-3"
              disabled={processing()}
              onClick={toggleEth}
            >
              {useWeth ? <WethSVG /> : <EthSVG />}
              <span
                className={`${
                  processing() ? "text-gray-200" : "text-white"
                } text-base text-left w-[47px]`}
              >
                {useWeth ? "WETH" : "ETH"}
              </span>
              <TriangleSVG
                className={`${useWeth ? "" : "rotate-180"} ${
                  processing() ? "text-gray-200" : "text-white"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">${usdVal}</span>
            <div className="flex items-center gap-2">
              <span className="">Balance: {balance}</span>
              <Button
                className={
                  processing() ? "" : "text-orange-900 text-shadow-orange-900"
                }
                onClick={onMax}
              >
                MAX
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-between text-gray-200 text-xs">
        <span className={`${pendingTxHash ? "opacity-100" : "opacity-0"}`}>
          {` Tx Hash: `}
          {pendingTxHash && (
            <a
              className="underline"
              href={getExpolorerUrl(pendingTxHash)}
              target="__blank"
            >
              {shortenTxHash(pendingTxHash, 8)}
            </a>
          )}
        </span>
        {isDeposit && (
          <>
            {actionError && (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            )}
          </>
        )}
        {!isDeposit && (
          <>
            {actionError ? (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            ) : (
              <span>
                <span>Vault Liquid Balance: Ξ{vaultBalance}</span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
