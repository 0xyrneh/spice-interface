import { useEffect, useState } from "react";

import { Card, Stats } from "@/components/common";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import TvlSVG from "@/assets/icons/tvl.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import {
  MarketplaceExposure,
  CollectionExposure,
  LoanAndBidExposure,
} from "@/components/vaults";
import { ChartValue, VaultInfo } from "@/types/vault";
import { ExampleShare, ExampleTotalTvl } from "@/constants";
import { BLUR_API_BASE } from "@/config/constants/backend";
import axios from "axios";
import moment from "moment";
import {
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { formatBlurChart } from "@/utils/formatter";

type Props = {
  vault: VaultInfo;
};

export default function DetailChart({ vault }: Props) {
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const [blurChartInfo, setBlurChartInfo] = useState<any>();

  const fetchBlurChart = async () => {
    setIsFetching(true);

    const apiEnv =
      Number(process.env.REACT_APP_CHAIN_ID) === 1 ? "prod" : "goerli";

    try {
      const res = await axios.get(
        `${BLUR_API_BASE}/historical-points?env=${apiEnv}`
      );

      if (res.status === 200) {
        setBlurChartInfo(formatBlurChart(res.data.data.historicalRecords));
      }
    } catch (err) {
      console.log("ranks fetching error");
    }

    setIsFetching(false);
  };

  const getChartData = () => {
    if (showPerformance) {
      if (vault.isBlur) {
        const currentTime = Math.floor(Date.now() / 1000);
        const blurTvlChart: ChartValue[] = blurChartInfo?.tvlChart ?? [];

        if (selectedPeriod === PeriodFilter.Day) {
          return blurTvlChart.filter((item) => {
            return moment(item.x).unix() > currentTime - DAY_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Week) {
          return blurTvlChart.filter((item) => {
            return moment(item.x).unix() > currentTime - WEEK_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Month) {
          return blurTvlChart.filter((item) => {
            return moment(item.x).unix() > currentTime - MONTH_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Year) {
          return blurTvlChart.filter((item) => {
            return moment(item.x).unix() > currentTime - YEAR_IN_SECONDS;
          });
        }
        return blurTvlChart;
      }
      return ExampleShare[selectedPeriod];
    } else {
      if (vault.isBlur) {
        const currentTime = Math.floor(Date.now() / 1000);

        const blurPointsChart: ChartValue[] = blurChartInfo?.pointsChart ?? [];
        if (selectedPeriod === PeriodFilter.Day) {
          return blurPointsChart.filter((item) => {
            return moment(item.x).unix() > currentTime - DAY_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Week) {
          return blurPointsChart.filter((item) => {
            return moment(item.x).unix() > currentTime - WEEK_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Month) {
          return blurPointsChart.filter((item) => {
            return moment(item.x).unix() > currentTime - MONTH_IN_SECONDS;
          });
        } else if (selectedPeriod === PeriodFilter.Year) {
          return blurPointsChart.filter((item) => {
            return moment(item.x).unix() > currentTime - YEAR_IN_SECONDS;
          });
        }
        return blurPointsChart;
      }
      return ExampleTotalTvl[selectedPeriod];
    }
  };

  useEffect(() => {
    if (vault.isBlur) fetchBlurChart();
  }, [vault]);

  return (
    <div className="flex flex-col flex-1 gap-5 pt-1">
      <Card className="gap-3 flex-1 overflow-hidden min-h-[323px] h-[50%]">
        <div className="flex items-center gap-2.5">
          <TvlSVG />
          <h2 className="font-bold text-white font-sm">
            {showPerformance
              ? vault.isBlur
                ? "TOTAL VALUE LOCKED"
                : "ASSETS PER VAULT SHARE"
              : vault.isBlur
              ? "SP-BLUR ACCUMULATED"
              : "TOTAL VALUE LOCKED"}
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
            {!showPerformance && vault.isBlur ? (
              <Stats
                title="SP-BLUR"
                value={(blurChartInfo?.totalSpPoints ?? 0).toFixed(2)}
              />
            ) : (
              <>
                <Stats title="Vault TVL" value="Ξ30.0" />
                <Stats title="Vault APY" value="16.0%" />
              </>
            )}
          </div>
          {vault.isBlur ? (
            <div className="flex items-center tracking-normal text-xs gap-1 xl:gap-4 flex-col xl:flex-row">
              <div className="hidden 2xl:flex items-center gap-1">
                <span>1W Est. Points:</span>
                <span className="text-white">
                  {(blurChartInfo?.weekPoints
                    ? blurChartInfo?.weekPoints.toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>1M Est. Points:</span>
                <span className="text-white">
                  {(blurChartInfo?.weekPoints
                    ? ((blurChartInfo?.weekPoints * 30) / 7).toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>1Y Est. Points:</span>
                <span className="text-white">
                  {(blurChartInfo?.weekPoints
                    ? (blurChartInfo?.weekPoints * 52).toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100%-96px)]">
          <div className="flex-1 relative w-[calc(59vw-100px)] lg:w-[calc(59vw-146px)] max-h-[calc(100%-18px)] lg:max-h-[100%]">
            <LineChart
              data={getChartData()}
              period={selectedPeriod}
              yPrefix={
                showPerformance
                  ? !vault.isBlur
                    ? ""
                    : "Ξ"
                  : vault.isBlur
                  ? ""
                  : "Ξ"
              }
            />
            {showPerformance ? (
              <LineChart
                data={getChartData()}
                period={selectedPeriod}
                yPrefix={vault.isBlur ? "Ξ" : ""}
              />
            ) : (
              <LineChart
                data={getChartData()}
                period={selectedPeriod}
                yPrefix={vault.isBlur ? "" : "Ξ"}
              />
            )}
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
      <div className="flex gap-5 h-[37%]  overflow-hidden p-1 -m-1">
        {vault.isBlur ? (
          <LoanAndBidExposure className="flex-1" small showIcon vault={vault} />
        ) : (
          <>
            <MarketplaceExposure
              className="flex-1"
              vault={vault}
              vaults={[]}
              walletConnectRequired={false}
            />
            <CollectionExposure
              className="flex-1"
              vault={vault}
              vaults={[]}
              walletConnectRequired={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
