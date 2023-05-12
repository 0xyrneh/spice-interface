import { Button, Card, Slider } from "../common";
import LeverageSVG from "@/assets/icons/leverage.svg";

type Props = {
  leverage: number;
  setLeverage: (leverage: number) => void;
};

const leverages = [0, 30, 60, 90, 120, 150];
// const leverages = [0, 30, 60, 90, 120, 150];
const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 30,
    label: "30%",
  },
  {
    value: 60,
    label: "60%",
  },
  {
    value: 90,
    label: "90%",
  },
  {
    value: 120,
    label: "120%",
  },
  {
    value: 150,
    label: "150%",
  },
];

export default function LeverageInput({ leverage, setLeverage }: Props) {
  return (
    <div className="flex flex-col px-2 pt-3 flex-1">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="third"
          className={`h-6 w-1/2 flex items-center justify-center border-0`}
        >
          <span className="text-xs">LEVER UP</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col mx-2.5 text-gray-200 gap-1 text-xs max-w-[324px] w-full gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center border-1 rounded gap-3 px-3 py-2">
              <LeverageSVG />
              <span>4.5036</span>
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
      <span className="text-right text-xs text-gray-200 mb-3 mx-1">
        Prologue Vault Liquid Balance: Ξ300
      </span>
    </div>
  );
}
