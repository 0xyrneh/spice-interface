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
import { calculateBorrowApr, getNetApy } from "@/utils/apy";
import { DAY_IN_SECONDS } from "@/config/constants/time";

export enum LeverageTab {
  LeverUp = "Lever Up",
  Increase = "Increase",
  Decrease = "Decrease",
  Refinance = "Refinance",
  Renew = "Renew",
}

type Props = {
  nft: PrologueNftPortofolioInfo;
  tab: LeverageTab;
  requireApprove?: boolean;
  sliderStep: number;
  targetAmount: string;
  loanLender: string;
  onSetSliderStep: (step: number) => void;
  onSetTargetAmount: (value: string) => void;

  onFocus?: () => void;
  onBlur?: () => void;
  updateLoanLender: (val: string) => void;
  getAmountFromSliderStep: (val: number) => number;
  getSliderStepFromAmount: (val: number) => number;
};

export default function LeverageInput({
  nft,
  tab,
  requireApprove,
  sliderStep,
  targetAmount,
  loanLender,
  onSetSliderStep,
  onSetTargetAmount,
  updateLoanLender,
  onFocus,
  onBlur,
  getAmountFromSliderStep,
  getSliderStepFromAmount,
}: Props) {
  const [leverage, setLeverage] = useState<number>();
  const [increaseLeverageTicks, setIncreaseLeverageTicks] = useState<number[]>(
    []
  );
  const [decreaseLeverageTicks, setDecreaseLeverageTicks] = useState<number[]>(
    []
  );
  const { pendingTxHash, actionStatus, actionError } = useAppSelector(
    (state) => state.modal
  );
  const { leverageVaults } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);

  const loanLenderVault =
    tab === LeverageTab.LeverUp
      ? leverageVaults.find((row: any) => !row.deprecated)
      : leverageVaults.find((row: any) => row.address === loanLender);
  const currentLend = lendData.find(
    (row: any) => row.address === nft?.lendAddr
  );
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [maxIncreaseToShow, setMaxIncreaseToShow] = useState(0);
  const [maxDecreaseToShow, setMaxDecreaseToShow] = useState(0);
  const [maxLtvToShow, setMaxLtvToShow] = useState(0);

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
      updateLoanLender(loanLenderAddr);
    }
  };

  useEffect(() => {
    if (processing) return;
    // increase slider
    if (!maxLeverage) return;

    let increaseTicks: number[] = [];
    for (let index = 0; index <= 5; index++) {
      increaseTicks = [
        ...increaseTicks,
        ((loanValue + (index * (maxLeverage - loanValue)) / 5) / maxLeverage) *
          maxLtv,
      ];
    }
    setIncreaseLeverageTicks([...increaseTicks]);
  }, [maxLeverage, loanValue]);

  useEffect(() => {
    if (processing) return;
    // decrease slider
    if (!maxRepayment) return;

    let decreaseTicks: number[] = [];
    for (let index = 0; index <= 5; index++) {
      decreaseTicks = [
        ...decreaseTicks,
        index * (maxRepayment / maxLeverage / 5) * maxLtv,
      ];
    }
    setDecreaseLeverageTicks([...decreaseTicks.reverse()]);
  }, [maxRepayment, processing]);

  useEffect(() => {
    if (loanId > 0) {
      fetchLoanLender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId]);

  useEffect(() => {
    if (
      actionStatus === ActionStatus.Pending ||
      actionStatus === ActionStatus.Success
    ) {
      setProcessing(true);
    } else {
      setProcessing(false);
    }
  }, [actionStatus]);

  useEffect(() => {
    if (processing) {
      setDisabled(true);
    } else if (tab !== LeverageTab.Decrease && loanValue >= maxLeverage) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [processing, tab, loanValue, maxLeverage]);

  useEffect(() => {
    if (processing) return;
    setMaxIncreaseToShow(maxLeverage - loanValue);
  }, [maxLeverage, loanValue, processing]);

  useEffect(() => {
    if (processing) return;
    setMaxDecreaseToShow(maxRepayment);
  }, [maxRepayment, processing]);

  useEffect(() => {
    if (processing) return;
    setMaxLtvToShow(maxLtv);
  }, [maxLtv, processing]);

  const getRefinanceApr = () => {
    if (!loanLenderVault) return 0;

    const additionalDebt =
      tab === LeverageTab.Increase
        ? getAmountFromSliderStep(sliderStep) - loanValue
        : getAmountFromSliderStep(sliderStep);
    const total = getBalanceInEther(
      loanLenderVault?.totalAssets || BigNumber.from(0)
    );
    const available = getBalanceInEther(
      loanLenderVault?.wethBalance || BigNumber.from(0)
    );
    const duration = (nft?.loan?.terms.duration || 0) / DAY_IN_SECONDS;
    const ltv =
      originMaxLtv > 1
        ? getAmountFromSliderStep(sliderStep) /
          (collateralValue + additionalDebt)
        : getAmountFromSliderStep(sliderStep) / collateralValue;

    return (
      100 * calculateBorrowApr(ltv, additionalDebt, total, available, duration)
    );
  };

  // change slider input
  const onChangeTerms = (step: number) => {
    if (tab === LeverageTab.Increase && maxLeverage === 0) return;
    if (tab === LeverageTab.Decrease && maxRepayment === 0) return;

    setLeverage(undefined);

    if (tab === LeverageTab.Increase || tab === LeverageTab.LeverUp) {
      onSetSliderStep(step);
      onSetTargetAmount(getAmountFromSliderStep(step).toFixed(4));
      return;
    }

    if (tab === LeverageTab.Decrease) {
      onSetSliderStep(step);
      onSetTargetAmount(getAmountFromSliderStep(step).toFixed(4));
    }
  };

  // change input
  const onChangeTargetAmount = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue >= 0) {
      const targetMax = getAmountFromSliderStep(100);

      if (newValue > targetMax) {
        onSetTargetAmount(targetMax.toFixed(4));
        onSetSliderStep(100);
      } else {
        onSetTargetAmount(e.target.value);
        onSetSliderStep(getSliderStepFromAmount(newValue));
      }
    }
  };

  const onChangeLeverageTick = (val: number) => {
    setLeverage(val);

    if (tab === LeverageTab.LeverUp) {
      const step =
        ((val - increaseLeverageTicks[0]) /
          (increaseLeverageTicks[5] - increaseLeverageTicks[0])) *
        100;
      onSetSliderStep(step);
      onSetTargetAmount(getAmountFromSliderStep(step).toFixed(4));
    }
    if (tab === LeverageTab.Increase) {
      const step =
        ((val - increaseLeverageTicks[0]) /
          (increaseLeverageTicks[5] - increaseLeverageTicks[0])) *
        100;
      onSetSliderStep(step);
      onSetTargetAmount(getAmountFromSliderStep(step).toFixed(4));
    }
    if (tab === LeverageTab.Decrease) {
      const step =
        ((decreaseLeverageTicks[0] - val) /
          (decreaseLeverageTicks[0] - decreaseLeverageTicks[5])) *
        100;
      onSetSliderStep(step);
      onSetTargetAmount(getAmountFromSliderStep(step).toFixed(4));
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
            <span className="text-2xl">
              {`${getRefinanceApr().toFixed(2)}%`}
            </span>
            <span className="text-xs">New Borrow APR</span>
          </div>
        </div>
      );
    }

    if (tab === LeverageTab.Renew) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-gray-200 border-1 border-gray-200 rounded w-full max-w-[324px] py-5 px-8">
            <span className="text-2xl">
              {`${getRefinanceApr().toFixed(2)}%`}
            </span>
            <span className="text-xs">New Borrow APR</span>
          </div>
        </div>
      );
    }

    if (tab === LeverageTab.Increase || tab === LeverageTab.LeverUp) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center border-1 border-gray-200 hover:border-gray-300 text-gray-200 hover:text-gray-300 rounded gap-3 px-3 py-2 w-[110px]">
                <LeverageSVG />
                <input
                  className={`flex-1 w-px hover:placeholder:text-gray-300 placeholder:text-gray-200 ${
                    disabled ? "text-gray-200" : "text-white"
                  }`}
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={onChangeTargetAmount}
                  type="number"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  disabled={disabled}
                />
              </div>
              <div className="flex flex-col items-end">
                <span>{`Max Increase: `}</span>
                <span>
                  {`Ξ${maxIncreaseToShow.toFixed(4)} to ${(
                    100 * maxLtvToShow
                  ).toFixed(2)}% LTV`}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <Slider
                disabled={disabled}
                max={100}
                min={loanValue >= maxLeverage ? 100 : 0}
                step={10}
                value={sliderStep}
                onChange={onChangeTerms}
              />
              <div className="relative flex justify-between mt-1.5 mx-5">
                {increaseLeverageTicks.map((item, idx) => (
                  <button
                    key={`leverage-${item}`}
                    className={`absolute ${
                      idx > 0 && idx < increaseLeverageTicks.length - 1
                        ? "-translate-x-2/4"
                        : ""
                    } ${
                      item === leverage
                        ? disabled
                          ? "text-shadow-white"
                          : "text-orange-200 text-shadow-orange-900"
                        : ""
                    }`}
                    style={{
                      left:
                        idx === 0
                          ? "-20px"
                          : idx === increaseLeverageTicks.length - 1
                          ? undefined
                          : (100 * idx) / (increaseLeverageTicks.length - 1) +
                            "%",
                      right:
                        idx === increaseLeverageTicks.length - 1
                          ? "-20px"
                          : undefined,
                    }}
                    onClick={() => onChangeLeverageTick(item)}
                  >
                    {`${(100 * item).toFixed(0)}%`}
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
                className={`flex-1 w-px hover:placeholder:text-gray-300 placeholder:text-gray-200 ${
                  disabled ? "text-gray-200" : "text-white"
                }`}
                placeholder="0.00"
                value={targetAmount}
                onChange={onChangeTargetAmount}
                type="number"
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col items-end">
              <span>{`Max Decrease: `}</span>
              <span>{`Ξ${maxDecreaseToShow.toFixed(4)} to 0% LTV`}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Slider
              disabled={disabled}
              max={100}
              min={0}
              step={10}
              value={sliderStep}
              onChange={onChangeTerms}
            />
            <div className="relative flex justify-between mt-1.5 mx-5">
              {(tab === LeverageTab.Decrease
                ? decreaseLeverageTicks
                : increaseLeverageTicks
              ).map((item, idx) => (
                <button
                  key={`leverage-${item}`}
                  className={`absolute ${
                    idx > 0 && idx < increaseLeverageTicks.length - 1
                      ? "-translate-x-2/4"
                      : ""
                  } ${
                    item === leverage
                      ? disabled
                        ? "text-shadow-white"
                        : "text-orange-200 text-shadow-orange-900"
                      : ""
                  }`}
                  style={{
                    left:
                      idx === 0
                        ? "-20px"
                        : idx === increaseLeverageTicks.length - 1
                        ? undefined
                        : (100 * idx) / (increaseLeverageTicks.length - 1) +
                          "%",
                    right:
                      idx === increaseLeverageTicks.length - 1
                        ? "-20px"
                        : undefined,
                  }}
                  onClick={() => onChangeLeverageTick(item)}
                >
                  {`${(100 * item).toFixed(0)}%`}
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
        {requireApprove ? renderApproveRequireContent() : renderInputContent()}
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

        {tab === LeverageTab.Refinance && (
          <>
            {actionError && (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
