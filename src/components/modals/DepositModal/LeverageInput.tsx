import { useState, useEffect } from "react";
import { BigNumber } from "ethers";

import { ActionStatus } from "@/types/common";
import { Slider } from "../../common";
import LeverageSVG from "@/assets/icons/leverage.svg";
import { useAppSelector } from "@/state/hooks";
import { getExpolorerUrl, shortenTxHash } from "@/utils/string";
import { PrologueNftPortofolioInfo } from "@/types/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { getLenderByLoanId } from "@/state/lend/fetchGlobalLend";

export enum LeverageTab {
  LeverUp = "Lever Up",
  Increase = "Increase",
  Decrease = "Decrease",
  Refinance = "Refinance",
}

type Props = {
  nft: PrologueNftPortofolioInfo;
  tab: LeverageTab;

  // old
  leverage: number;
  targetLeverage: string;
  setLeverage: (leverage: number) => void;
  setTargetLeverage: (value: string) => void;

  // new
  sliderStep: number;
  targetAmount: string;
  onSetSliderStep: (leverage: number) => void;
  onSetTargetAmount: (value: string) => void;

  onFocus?: () => void;
  onBlur?: () => void;
};

const leverages = [0, 30, 60, 90, 120, 150];
const decreaseLeverage = [150, 120, 90, 60, 30, 0];

export default function LeverageInput({
  nft,
  tab,
  // old
  leverage,
  targetLeverage,
  setLeverage,
  setTargetLeverage,
  // new
  sliderStep,
  targetAmount,
  onSetSliderStep,
  onSetTargetAmount,

  onFocus,
  onBlur,
}: Props) {
  const [loanLender, setLoanLender] = useState<string>("");
  const { pendingTxHash, actionStatus, actionError } = useAppSelector(
    (state) => state.modal
  );
  const { vaults } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);

  const loanLenderVault = vaults.find((row: any) => row.address === loanLender);
  const currentLend = lendData.find(
    (row: any) => row.address === nft?.lendAddr
  );

  const { loanId, repayAmount, balance } = nft.loan;
  const collateralValue = getBalanceInEther(nft.value);
  const loanValue = getBalanceInEther(balance || BigNumber.from(0));
  const repayValue = getBalanceInEther(repayAmount || BigNumber.from(0));
  const originMaxLtv = currentLend?.loanRatio || 0;
  const maxRepayment = getBalanceInEther(repayAmount || BigNumber.from(0));

  // max leverage calculation to prevent utilization is greater than 1
  const lenderWethAvailable = getBalanceInEther(
    loanLenderVault?.wethBalance || BigNumber.from(0)
  );
  const interesteAccrued = repayValue - loanValue;
  const leverageAvailable = Math.max(
    0,
    originMaxLtv < 0.9
      ? originMaxLtv * (collateralValue - interesteAccrued * 2)
      : originMaxLtv * (collateralValue - loanValue - interesteAccrued * 2)
  );
  const maxLeverage = Math.min(leverageAvailable, lenderWethAvailable);
  const maxLtv =
    lenderWethAvailable > leverageAvailable
      ? originMaxLtv
      : maxLeverage / (collateralValue - loanValue);

  const fetchLoanLender = async () => {
    if (currentLend?.lenderNote) {
      const loanLenderAddr = await getLenderByLoanId(
        currentLend.lenderNote,
        loanId
      );
      setLoanLender(loanLenderAddr);
    }
  };

  useEffect(() => {
    if (loanId > 0) {
      fetchLoanLender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId]);

  const getAmount = (step: number) => {
    if (tab === LeverageTab.Increase) {
      return loanValue + (step / 100) * Math.max(0, maxLeverage - loanValue);
    }
    return (step / 100) * maxRepayment;
  };

  const processing = () => actionStatus === ActionStatus.Pending;

  // change slider input
  const onChangeTerms = (val: any) => {
    // if (status === "Confirming") return;
    if (tab === LeverageTab.Increase && maxLeverage === 0) return;
    if (tab === LeverageTab.Decrease && maxRepayment === 0) return;

    onSetSliderStep(val);
    onSetTargetAmount(getAmount(val).toFixed(4));
  };

  // change input
  const onChangeTargetAmount = (e: any) => {
    if (status === "Confirming") return;

    if (Number(e.target.value) >= 0) {
      const sliderMax =
        tab === LeverageTab.Increase ? maxLeverage : maxRepayment;
      if (sliderMax === 0) return;

      // when the amount is greater than max leverage
      if (e.target.value > sliderMax) {
        onSetTargetAmount(Number(sliderMax).toFixed(4));
        onSetSliderStep(100);
        return;
      }

      if (tab === LeverageTab.Increase) {
        // when the amount is smaller than repay value
        if (Number(e.target.value) < loanValue) {
          onSetTargetAmount(e.target.value);
          onSetSliderStep(0);
          return;
        }
        onSetTargetAmount(e.target.value);
        onSetSliderStep(
          (100 * (Number(e.target.value) - loanValue)) /
            (maxLeverage - loanValue)
        );
      } else {
        onSetTargetAmount(e.target.value);
        onSetSliderStep((100 * Number(e.target.value)) / sliderMax);
      }
    }
  };

  const leverageUpdateText = () => {
    // const _targetLev = targetLeverage === "" ? "0.00" : targetLeverage;
    if (tab === LeverageTab.LeverUp) {
      // return `Ξ${10.00} / ${leverage}% LTV`;
    } else {
      return `Ξ10.0 ${tab.toLowerCase()} to ${
        tab === LeverageTab.Increase
          ? leverages[leverages.length - 1]
          : decreaseLeverage[decreaseLeverage.length - 1]
      }% LTV`;
    }
  };

  const renderApproveRequireContent = () => {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col text-gray-200 border-1 border-gray-200 rounded w-full max-w-[324px] py-3 px-3 mx-auto gap-5">
          <span className="text-xs">
            {`To interact with Prologue Leverage, you must first approve the Spice
            Protocol’s request to escrow your NFT.`}
          </span>
          <span className="text-xs">
            {` Hit “Approve” to begin the
            process.`}
          </span>
        </div>
      </div>
    );
  };

  const renderInputContent = () => {
    if (tab === LeverageTab.Refinance) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-gray-200 border-1 border-gray-200 rounded w-full max-w-[324px] py-5 px-8">
            <span className="text-2xl">5.09%</span>
            <span className="text-xs">New Borrow APR</span>
          </div>
        </div>
      );
    }

    if (tab === LeverageTab.Increase) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center border-1 border-gray-200 hover:border-gray-300 text-gray-200 hover:text-gray-300 rounded gap-3 px-3 py-2 w-[110px]">
                <LeverageSVG />
                <input
                  className="flex-1 w-px hover:placeholder:text-gray-300 placeholder:text-gray-200 text-white"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={onChangeTargetAmount}
                  type="number"
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div className="flex flex-col items-end">
                <span>{`Max Increase: `}</span>
                <span>
                  {`Ξ${maxLeverage.toFixed(4)} to ${(100 * maxLtv).toFixed(
                    2
                  )}% LTV`}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <Slider
                disabled={processing()}
                max={100}
                min={loanValue >= maxLeverage ? 100 : 0}
                step={10}
                value={sliderStep}
                onChange={onChangeTerms}
              />
              <div className="relative flex justify-between mt-1.5 mx-5">
                {leverages.map((item, idx) => (
                  <button
                    key={`leverage-${item}`}
                    className={`absolute ${
                      idx > 0 && idx < leverages.length - 1
                        ? "-translate-x-2/4"
                        : ""
                    } ${
                      item === leverage
                        ? processing()
                          ? "text-shadow-white"
                          : "text-orange-200 text-shadow-orange-900"
                        : ""
                    }`}
                    style={{
                      left:
                        idx === 0
                          ? "-20px"
                          : idx === leverages.length - 1
                          ? undefined
                          : (100 * idx) / (leverages.length - 1) + "%",
                      right: idx === leverages.length - 1 ? "-20px" : undefined,
                    }}
                    onClick={() => setLeverage(item)}
                  >
                    {item}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center border-1 border-gray-200 hover:border-gray-300 text-gray-200 hover:text-gray-300 rounded gap-3 px-3 py-2 w-[110px]">
              <LeverageSVG />
              <input
                className="flex-1 w-px hover:placeholder:text-gray-300 placeholder:text-gray-200 text-white"
                placeholder="0.00"
                value={targetLeverage}
                onChange={(e) => setTargetLeverage(e.target.value)}
                type="number"
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <div className="flex flex-col items-end">
              <span>{`Max Decrease: `}</span>
              <span>{leverageUpdateText()}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Slider
              disabled={processing()}
              value={tab === LeverageTab.Decrease ? leverage * -1 : leverage}
              min={tab === LeverageTab.Decrease ? -150 : 0}
              max={tab === LeverageTab.Decrease ? 0 : 150}
              step={30}
              onChange={(_val) => setLeverage(Math.abs(_val))}
            />
            <div className="relative flex justify-between mt-1.5 mx-5">
              {(tab === LeverageTab.Decrease
                ? decreaseLeverage
                : leverages
              ).map((item, idx) => (
                <button
                  key={`leverage-${item}`}
                  className={`absolute ${
                    idx > 0 && idx < leverages.length - 1
                      ? "-translate-x-2/4"
                      : ""
                  } ${
                    item === leverage
                      ? processing()
                        ? "text-shadow-white"
                        : "text-orange-200 text-shadow-orange-900"
                      : ""
                  }`}
                  style={{
                    left:
                      idx === 0
                        ? "-20px"
                        : idx === leverages.length - 1
                        ? undefined
                        : (100 * idx) / (leverages.length - 1) + "%",
                    right: idx === leverages.length - 1 ? "-20px" : undefined,
                  }}
                  onClick={() => setLeverage(item)}
                >
                  {item}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col px-2 pb-3 flex-1">
      {/* body content */}
      <>
        {!nft.isApproved ? renderApproveRequireContent() : renderInputContent()}
      </>

      {/* footer content */}
      <div className="flex justify-between text-gray-200 text-xs">
        <span className={`${pendingTxHash ? "opacity-100" : "opacity-0"}`}>
          {` Tx Hash: `}
          {pendingTxHash && (
            <a
              className="underline"
              href={getExpolorerUrl(pendingTxHash)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {shortenTxHash(pendingTxHash, 4)}
            </a>
          )}
        </span>
        {(tab === LeverageTab.Increase || tab === LeverageTab.LeverUp) && (
          <>
            {actionError ? (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            ) : (
              <span>
                {`Leverage Vault Liquid Balance: Ξ${lenderWethAvailable.toFixed(
                  2
                )}`}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
