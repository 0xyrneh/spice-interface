import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Stats } from "@/components/common";
import PositionSVG from "@/assets/icons/position.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { VaultInfo, ReceiptToken, ChartValue } from "@/types/vault";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import { ExampleShare, ExampleTotalTvl } from "@/constants";
import moment from "moment";
import { BLUR_API_BASE } from "@/config/constants/backend";
import axios from "axios";
import {
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { formatBlurChart } from "@/utils/formatter";
import { useWeb3React } from "@web3-react/core";

type Props = {
  vault?: VaultInfo | undefined;
  totalPosition: number;
};
export default function VaultPositionGraph({ vault, totalPosition }: Props) {
  const [showPosition, setShowPosition] = useState(true);
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);
  const [blurChartInfo, setBlurChartInfo] = useState<any>();
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const { account } = useWeb3React();

  const fetchBlurChart = async () => {
    setIsFetching(true);

    const apiEnv =
      Number(process.env.REACT_APP_CHAIN_ID) === 1 ? "prod" : "goerli";

    try {
      const res = await axios.get(
        `${BLUR_API_BASE}/historical-points?env=${apiEnv}`
      );

      if (res.status === 200) {
        setBlurChartInfo(
          formatBlurChart(res.data.data.historicalRecords, account)
        );
      }
    } catch (err) {
      console.log("ranks fetching error");
    }

    setIsFetching(false);
  };

  const getChartData = () => {
    if (vault) {
      if (vault.isBlur) {
        const currentTime = Math.floor(Date.now() / 1000);
        const blurPointsChart: ChartValue[] = showPosition
          ? blurChartInfo?.tvlChart ?? []
          : blurChartInfo?.pointsChart ?? [];

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
      if (showPosition) {
        return ExampleTotalTvl[selectedPeriod];
      } else {
        return ExampleShare[selectedPeriod];
      }
    } else {
      if (showPosition) {
        return ExampleTotalTvl[selectedPeriod];
      } else {
        return ExampleShare[selectedPeriod];
      }
    }
  };

  const calculateYields = () => {
    let annualYield = 0;

    if (vault) {
      const { userPosition, apr } = vault;
      annualYield = ((userPosition || 0) * (apr || 0)) / 100;
    }

    return annualYield;
  };

  const annualEstYield = calculateYields();

  useEffect(() => {
    if (vault && vault.isBlur) fetchBlurChart();
  }, [vault]);

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
        <button onClick={() => setShowPosition(!showPosition)}>
          <SortUpSVG
            className={`text-gray-100 hover:text-white ${
              showPosition ? "rotate-180" : ""
            }`}
          />
        </button>
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
            <Stats
              title="SP-BLUR"
              value={(blurChartInfo?.totalSpPoints ?? 0).toFixed(2)}
            />
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
        {vault && vault.isBlur ? (
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
              <span className="text-white">
                {`Ξ${(annualEstYield / 52).toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>1M Est. Yield:</span>
              <span className="text-white">
                {`Ξ${(annualEstYield / 12).toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>1Y Est. Yield:</span>
              <span className="text-white">
                {`Ξ${annualEstYield.toFixed(2)}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* vault graph */}
      <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100%-96px)]">
        <div className="flex-1 relative w-[calc(59vw-100px)] lg:w-[calc(59vw-146px)]  max-h-[calc(100%-18px)] lg:max-h-[100%]">
          <LineChart
            data={getChartData()}
            period={selectedPeriod}
            yPrefix={vault && !showPosition ? "" : "Ξ"}
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
