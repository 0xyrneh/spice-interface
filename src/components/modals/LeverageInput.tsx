import { TxStatus } from "@/types/common";
import { Button, Slider } from "../common";
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
  setTab: (tab: LeverageTab) => void;
  onFocus: () => void;
  onBlur: () => void;
};

const leverages = [0, 30, 60, 90, 120, 150];

export default function LeverageInput({
  tab,
  leverage,
  targetLeverage,
  txHash,
  txStatus,
  setLeverage,
  setTargetLeverage,
  setTab,
  onFocus,
  onBlur,
}: Props) {
  const processing = () => txStatus === TxStatus.Pending;

  return (
    <div className="flex flex-col px-2 py-3 flex-1">
      <div className="flex flex-row-reverse">
        <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
          <Button
            type={tab === LeverageTab.Increase ? "third" : "secondary"}
            className={`h-6 flex-1 flex items-center justify-center !border-0 ${
              tab === LeverageTab.Increase ? "" : "shadow-transparent"
            }`}
            disabled={tab === LeverageTab.Increase}
            onClick={() => setTab(LeverageTab.Increase)}
          >
            <span className="text-xs">INCREASE</span>
          </Button>
          <Button
            type={tab === LeverageTab.Decrease ? "third" : "secondary"}
            className={`h-6 flex-1 flex items-center justify-center !border-0 ${
              tab === LeverageTab.Decrease ? "" : "shadow-transparent"
            }`}
            disabled={tab === LeverageTab.Decrease}
            onClick={() => setTab(LeverageTab.Decrease)}
          >
            <span className="text-xs">DECREASE</span>
          </Button>
          <Button
            type={tab === LeverageTab.Refinance ? "third" : "secondary"}
            className={`h-6 flex-1 flex items-center justify-center !border-0 ${
              tab === LeverageTab.Refinance ? "" : "shadow-transparent"
            }`}
            disabled={tab === LeverageTab.Refinance}
            onClick={() => setTab(LeverageTab.Refinance)}
          >
            <span className="text-xs">REFINANCE</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        {tab === LeverageTab.Refinance ? (
          <div className="flex flex-col items-center text-gray-200 border-1 border-gray-200 rounded w-full max-w-[324px] py-5 px-8">
            <span className="text-2xl">5.09%</span>
            <span className="text-xs">New Borrow APR</span>
          </div>
        ) : (
          <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center border-1 border-gray-200 hover:border-gray-300 rounded gap-3 px-3 py-2 w-[110px]">
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
                <span>Ξ5.004 / 150% LTV</span>
              </div>
            </div>
            <div className="flex flex-col">
              <Slider
                disabled={processing()}
                value={leverage}
                min={0}
                max={150}
                step={30}
                onChange={setLeverage}
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
        {(tab === LeverageTab.Increase || tab === LeverageTab.LeverUp) &&
          (txHash || processing()) && (
            <span>Leverage Vault Liquid Balance: Ξ300</span>
          )}
      </div>
    </div>
  );
}
