import { useState } from "react";
import { Card, Stats } from "@/components/common";
import { PositionChart, PerformanceChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import TvlSVG from "@/assets/icons/tvl.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import Exposure from "./Exposure";

export default function DetailChart() {
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);
  const [showPerformance, setShowPerformance] = useState(false);

  return (
    <div className="flex flex-col flex-1 gap-5 pt-1">
      <Card className="gap-3 flex-1 overflow-hidden min-h-[523px]">
        <div className="flex items-center gap-2.5">
          <TvlSVG />
          <h2 className="font-bold text-white font-sm">
            {showPerformance ? "ASSETS PER VAULT SHARE" : "TOTAL VALUE LOCKED"}
          </h2>
          <button onClick={() => setShowPerformance(!showPerformance)}>
            <SortUpSVG
              className={`text-gray-100 hover:text-white ${
                showPerformance ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <div className="flex items-end justify-between text-gray-200 px-12">
          <div className="flex gap-4 items-center">
            <Stats title="Vault TVL" value="Ξ30.0" />
            <Stats title="Vault APY" value="16.0%" />
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
        <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100%-96px)]">
          <div className="flex-1 relative w-[calc(59vw-100px)] lg:w-[calc(59vw-146px)] max-h-[calc(100%-18px)] lg:max-h-[100%]">
            {showPerformance ? <PerformanceChart /> : <PositionChart />}
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
                    : "text-gray-200 border-gray-200 bg-gray-200"
                }`}
                onClick={() => setPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <div className="flex gap-5 max-h-[363px] overflow-y-hidden p-1 -m-1">
        <Exposure showMarketplace isBreakdown className="flex-1" />
        <Exposure showCollection isBreakdown className="flex-1" />
      </div>
    </div>
  );
}
