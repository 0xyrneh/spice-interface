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
  value: string;
  txHash?: string;
  setLeverage: (leverage: number) => void;
  setValue: (value: string) => void;
  setTab: (tab: LeverageTab) => void;
};

const leverages = [0, 30, 60, 90, 120, 150];

export default function LeverageInput({
  tab,
  leverage,
  value,
  txHash,
  setLeverage,
  setValue,
  setTab,
}: Props) {
  return (
    <div className="flex flex-col px-2 pt-3 flex-1">
      <div className="pl-[70px] lg:pl-[50%] flex items-center gap-2">
        <Button
          type={tab === LeverageTab.Increase ? "third" : "secondary"}
          className={`h-6 flex-1 flex items-center justify-center !border-0 ${
            tab === LeverageTab.Increase ? "" : "shadow-transparent"
          }`}
          onClick={() => setTab(LeverageTab.Increase)}
        >
          <span className="text-xs">INCREASE</span>
        </Button>
        <Button
          type={tab === LeverageTab.Decrease ? "third" : "secondary"}
          className={`h-6 flex-1 flex items-center justify-center !border-0 ${
            tab === LeverageTab.Decrease ? "" : "shadow-transparent"
          }`}
          onClick={() => setTab(LeverageTab.Decrease)}
        >
          <span className="text-xs">DECREASE</span>
        </Button>
        <Button
          type={tab === LeverageTab.Refinance ? "third" : "secondary"}
          className={`h-6 flex-1 flex items-center justify-center !border-0 ${
            tab === LeverageTab.Refinance ? "" : "shadow-transparent"
          }`}
          onClick={() => setTab(LeverageTab.Refinance)}
        >
          <span className="text-xs">RECREASE</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center border-1 rounded gap-3 px-3 py-2 w-[110px]">
              <LeverageSVG />
              <input
                className="flex-1 w-px hover:placeholder:text-gray-300 placeholder:text-gray-200 text-white"
                placeholder="0.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
              />
            </div>
            <div className="flex flex-col items-end">
              <span>Max Leverage:</span>
              <span>Ξ5.004 / 150% LTV</span>
            </div>
          </div>
          <div className="flex flex-col">
            <Slider
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
                      ? "text-orange-200 text-shadow-orange-900"
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
      <div className="flex items-center justify-between mb-3 mx-1">
        <span
          className={`text-gray-200 text-xs ${
            txHash ? "opacity-100" : "opacity-0"
          }`}
        >
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
        <span className="text-right text-xs text-gray-200">
          Prologue Vault Liquid Balance: Ξ300
        </span>
      </div>
    </div>
  );
}
