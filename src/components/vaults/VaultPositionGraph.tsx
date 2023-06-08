import { useState } from "react";
import Image from "next/image";
import { Card, Stats } from "@/components/common";
import PositionSVG from "@/assets/icons/position.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { VaultInfo, ReceiptToken } from "@/types/vault";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import { ExampleTotalTvl } from "@/constants";

type Props = {
  vault?: VaultInfo | undefined;
  totalPosition: number;
};
export default function VaultPositionGraph({ vault, totalPosition }: Props) {
  const [showPosition, setShowPosition] = useState(true);
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);

  return (
    <Card className="gap-3 flex-1 overflow-hidden min-h-[323px] h-[50%]">
      {/* vault header */}
      <div className="flex items-center gap-2.5">
        {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.logo}
            width={16}
            height={16}
            alt=""
          />
        )}
        <PositionSVG />
        <h2 className="font-bold text-white font-sm">
          {vault
            ? `YOUR ${(vault?.readable || "").toUpperCase()} ${
                vault?.deprecated ? "[WITHDRAW ONLY]" : ""
              } POSITION`
            : "TOTAL SPICE POSITION"}
        </h2>
        {vault && vault.isBlur && (
          <button onClick={() => setShowPosition(!showPosition)}>
            <SortUpSVG
              className={`text-gray-100 hover:text-white ${
                showPosition ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* vault stats */}
      <div className="flex items-end justify-between text-gray-200 px-12">
        <div className="flex gap-4 items-center">
          {!vault && (
            <Stats
              title="Your Spice TVL"
              value={`Ξ${totalPosition.toFixed(2)}`}
            />
          )}
          {vault && vault.isBlur && !showPosition && (
            <Stats title="SP-BLUR" value={"1500"} />
          )}
          {vault && (!vault.isBlur || showPosition) && (
            <Stats
              title="Position"
              value={`Ξ${(vault?.userPosition || 0).toFixed(2)}`}
            />
          )}
          {vault && (!vault.isBlur || showPosition) && (
            <Stats
              title={
                vault?.receiptToken === ReceiptToken.NFT ? "Net APY" : "APY"
              }
              value={`${(vault?.apy || 0).toFixed(2)}%`}
            />
          )}
        </div>
        <div className="flex items-center tracking-normal text-xs gap-1 xl:gap-4 flex-col xl:flex-row">
          <div className="hidden 2xl:flex items-center gap-1">
            <span>1W Est. Yield:</span>
            <span className="text-white">Ξ25.60</span>
          </div>
          <div className="flex items-center gap-1">
            <span>1M Est. Yield:</span>
            <span className="text-white">Ξ25.60</span>
          </div>
          <div className="flex items-center gap-1">
            <span>1Y Est. Yield:</span>
            <span className="text-white">Ξ25.60</span>
          </div>
        </div>
      </div>

      {/* vault graph */}
      <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100%-96px)]">
        <div className="flex-1 relative w-[calc(59vw-100px)] lg:w-[calc(59vw-146px)]  max-h-[calc(100%-18px)] lg:max-h-[100%]">
          <LineChart
            data={ExampleTotalTvl[selectedPeriod]}
            period={selectedPeriod}
            yPrefix="Ξ"
          />
        </div>
        <div className="flex px-12 lg:px-0 lg:w-[34px] lg:flex-col gap-5.5 justify-center justify-between lg:justify-center">
          {[
            PeriodFilter.Day,
            PeriodFilter.Week,
            PeriodFilter.Month,
            PeriodFilter.Year,
            PeriodFilter.All,
          ].map((period) => (
            <button
              key={period}
              className={`w-[34px] lg:w-full border-1 rounded text-xs bg-opacity-10 ${
                period === selectedPeriod
                  ? "text-orange-200 border-orange-200 shadow-orange-200 bg-orange-200"
                  : "text-gray-200 border-gray-200 bg-gray-200 hover:text-gray-300 hover:bg-gray-300 hover:bg-opacity-10 hover:border-gray-300"
              }`}
              disabled={period === selectedPeriod}
              onClick={() => setPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
