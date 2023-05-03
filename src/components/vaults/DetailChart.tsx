import { useState } from "react";
import { Card, Stats } from "@/components/common";
import {
  PieChart,
  PositionChart,
  PerformanceChart,
} from "@/components/portfolio";
import marketplaceExposure from "@/constants/marketplaceExposure";
import collectionExposure from "@/constants/collectionExposure";
import { PeriodFilter } from "@/types/common";
import TvlSVG from "@/assets/icons/tvl.svg";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";

export default function DetailChart() {
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);
  const [showPerformance, setShowPerformance] = useState(false);

  return (
    <div className="flex flex-col flex-1 gap-5">
      <Card className="gap-3 flex-1 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <TvlSVG />
          <h2 className="font-bold text-white font-sm">TOTAL VALUE LOCKED</h2>
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
      <div className="flex gap-5">
        <Card className="flex-1 gap-3">
          <div className="flex items-center gap-2.5 tracking-normal font-bold text-white font-sm">
            <MarketExposureSVG className="text-white" />
            <h2 className="block lg:hidden whitespace-nowrap">MRKTPLACE B/D</h2>
            <h2 className="hidden lg:block xl:hidden whitespace-nowrap">
              MRKTPLACE BREAKDOWN
            </h2>
            <h2 className="hidden xl:block whitespace-nowrap">
              MARKETPLACE BREAKDOWN
            </h2>
          </div>
          <div className="flex gap-2.5">
            <table className="flex-1 text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
              <thead>
                <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200 text-gray-100">
                  <th className="text-left pl-1 h-10 w-[80%]">MARKETPLACE</th>
                  <th className="h-10 pr-1">%</th>
                </tr>
              </thead>
              <tbody className="block max-h-[240px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                {marketplaceExposure.map((exposure, index) => (
                  <tr
                    key={`vault-${index}`}
                    className="table table-fixed w-full text-right"
                  >
                    <td className="text-left h-10 w-[80%]">
                      <div className="flex items-center gap-2 pl-1">
                        <div
                          className="rounded w-3 h-3"
                          style={{
                            backgroundColor: exposure.color,
                          }}
                        />
                        <span>{exposure.name}</span>
                      </div>
                    </td>
                    <td className="h-10  pr-1">{exposure.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="hidden xl:flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
              <PieChart
                data={marketplaceExposure.map((item) => ({
                  name: item.name,
                  value: item.percent,
                  color: item.color,
                }))}
              />
            </div>
          </div>
        </Card>
        <Card className="flex-1 gap-3">
          <div className="flex items-center gap-2.5 tracking-normal font-bold text-white font-sm">
            <UserSVG className="text-white" />
            <h2 className="block lg:hidden whitespace-nowrap">
              COLLECTION B/D
            </h2>
            <h2 className="hidden lg:block whitespace-nowrap">
              COLLECTION BREAKDOWN
            </h2>
          </div>
          <div className="flex gap-2.5">
            <table className="flex-1 text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
              <thead>
                <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200 text-gray-100">
                  <th className="text-left pl-1 h-10 w-[80%]">COLLECTION</th>
                  <th className="h-10 pr-1">%</th>
                </tr>
              </thead>
              <tbody className="block max-h-[240px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                {collectionExposure.map((exposure, index) => (
                  <tr
                    key={`vault-${index}`}
                    className="table table-fixed w-full text-right"
                  >
                    <td className="text-left h-10 w-[80%]">
                      <div className="flex items-center gap-2 pl-1">
                        <div
                          className="rounded w-3 h-3"
                          style={{
                            backgroundColor: exposure.color,
                          }}
                        />
                        {exposure.name}
                      </div>
                    </td>
                    <td className="h-10 pr-1">{exposure.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="hidden xl:flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
              <PieChart
                data={collectionExposure.map((item) => ({
                  name: item.name,
                  value: item.percent,
                  color: item.color,
                }))}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
