import { TxStatus } from "@/types/common";
import { Slider } from "../common";
import LeverageSVG from "@/assets/icons/leverage.svg";

export enum LeverageTab {
  LeverUp = "Lever Up",
  Increase = "Increase",
  Decrease = "Decrease",
  Refinance = "Refinance",
}

type Props = {
  tab: LeverageTab;
  leverage: number;
  targetLeverage: string;
  txStatus: TxStatus;
  txHash?: string;
  setLeverage: (leverage: number) => void;
  setTargetLeverage: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const leverages = [0, 30, 60, 90, 120, 150];
const decreaseLeverage = [150, 120, 90, 60, 30, 0];

export default function LeverageInput({
  tab,
  leverage,
  targetLeverage,
  txHash,
  txStatus,
  setLeverage,
  setTargetLeverage,
  onFocus,
  onBlur,
}: Props) {
  const processing = () => txStatus === TxStatus.Pending;

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

  return (
    <div className="flex flex-col px-2 pb-3 flex-1">
      <div className="flex flex-1 items-center justify-center">
        {tab === LeverageTab.Refinance ? (
          <div className="flex flex-col items-center text-gray-200 border-1 border-gray-200 rounded w-full max-w-[324px] py-5 px-8">
            <span className="text-2xl">5.09%</span>
            <span className="text-xs">New Borrow APR</span>
          </div>
        ) : (
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
                <span>
                  Max{" "}
                  {tab === LeverageTab.Increase || tab === LeverageTab.Decrease
                    ? tab
                    : "Leverage"}
                  :
                </span>
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
        )}
      </div>
      <div className="flex justify-between text-gray-200 text-xs">
        <span className={`${txHash ? "opacity-100" : "opacity-0"}`}>
          Tx Hash:{" "}
          {txHash && (
            <a
              className="underline"
              href="https://etherscan.io"
              target="__blank"
            >
              {txHash}
            </a>
          )}
        </span>
        {(tab === LeverageTab.Increase || tab === LeverageTab.LeverUp) && (
          <span>Leverage Vault Liquid Balance: Ξ300</span>
        )}
      </div>
    </div>
  );
}
