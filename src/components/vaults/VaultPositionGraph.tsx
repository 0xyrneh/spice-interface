import { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";

import { Card, Stats } from "@/components/common";
import PositionSVG from "@/assets/icons/position.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { VaultInfo, ReceiptToken, ChartValue } from "@/types/vault";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import { BLUR_API_BASE } from "@/config/constants/backend";
import axios from "axios";
import {
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { formatBlurChart } from "@/utils/formatter";
import { activeChainId } from "@/utils/web3";
import { getUserVaultShares, getUserSpicePositions } from "@/api/subgraph";
import { getBalanceInEther } from "@/utils/formatBalance";

type Props = {
  vault?: VaultInfo | undefined;
  vaults: VaultInfo[];
  totalPosition: number;
};
export default function VaultPositionGraph({
  vault,
  vaults,
  totalPosition,
}: Props) {
  const [showPosition, setShowPosition] = useState(true);
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Day);
  const [blurChartInfo, setBlurChartInfo] = useState<any>();
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const { account } = useWeb3React();
  const [noneBlurVaultPositions, setNoneBlurVaultPositions] = useState<any>([]);
  const [noneBlurVaultShares, setNoneBlurVaultShares] = useState<any>([]);
  const [spiceUserPositions, setSpiceUserPositions] = useState<any>([]);

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

  const fetchNoneBlurVaultUserPosition = async () => {
    if (!account) return;
    if (!vault?.address) {
      const positionsRaw = await getUserSpicePositions(account);

      setSpiceUserPositions(
        positionsRaw.map((row: any) => {
          return {
            time: Number(row.date) * 1000,
            position: getBalanceInEther(row.position),
          };
        })
      );
    } else {
      const sharesRaw = await getUserVaultShares(account, vault.address);

      setNoneBlurVaultShares(
        sharesRaw.map((row: any) => {
          return {
            time: Number(row.date) * 1000,
            share: getBalanceInEther(row.share),
          };
        })
      );
    }
  };

  useEffect(() => {
    if (vault && vault.isBlur) {
      fetchBlurChart();
    } else {
      fetchNoneBlurVaultUserPosition();
    }
  }, [vault, account]);

  const getChartData = () => {
    let chartData: ChartValue[] = [];

    if (vault) {
      if (vault.isBlur) {
        chartData = showPosition
          ? blurChartInfo?.tvlChart ?? []
          : blurChartInfo?.pointsChart ?? [];
      } else {
        // asset share logic
        const historialRecords = vault?.historicalRecords || [];
        const aprField =
          activeChainId === 1 ? "actual_returns" : "expected_return";
        const graphField =
          activeChainId === 1 ? "assets_per_share" : "expected_return";

        // apr histories
        const aprHistories = historialRecords
          .map((row) => ({
            time: 1000 * Number(row.time) || 0,
            apr:
              (activeChainId === 1 ? 1 : 100) *
              (row?.okrs && row?.okrs[aprField] ? row?.okrs[aprField] : 0),
            assetPerShare:
              (activeChainId === 1 ? 1 : 100) *
              (row?.okrs && row?.okrs[graphField] ? row?.okrs[graphField] : 0),
          }))
          .reverse()
          .filter((row) => row.assetPerShare);

        if (showPosition) {
          const sharePriceChartData = aprHistories.map((row) => {
            return {
              x: row.time,
              y: row.assetPerShare,
            };
          });
          const shareValueChartData = noneBlurVaultShares.map((row: any) => {
            return {
              x: row.time,
              y: Number(row.share.toFixed(2)),
            };
          });
          chartData = noneBlurVaultShares.map((row: any) => {
            return {
              x: row.time,
              y: Number(row.share.toFixed(2)),
            };
          });
        } else {
          chartData = aprHistories.map((row) => {
            return {
              x: row.time,
              y: row.assetPerShare,
            };
          });
        }
      }
    } else {
      if (showPosition) {
        if (!account) {
          chartData = [];
        } else {
          chartData = spiceUserPositions.map((row: any) => {
            return {
              x: row.time,
              y: row.position,
            };
          });
        }
      } else {
        chartData = [];
      }
    }

    // filter data by show option
    const currentTime = Math.floor(Date.now() / 1000);
    if (selectedPeriod === PeriodFilter.All) {
      return chartData;
    } else if (selectedPeriod === PeriodFilter.Year) {
      return chartData.filter((item: any) => {
        return moment(item.x).unix() > currentTime - YEAR_IN_SECONDS;
      });
    } else if (selectedPeriod === PeriodFilter.Month) {
      return chartData.filter((item: any) => {
        return moment(item.x).unix() > currentTime - MONTH_IN_SECONDS;
      });
    } else if (selectedPeriod === PeriodFilter.Week) {
      return chartData.filter((item: any) => {
        return moment(item.x).unix() > currentTime - WEEK_IN_SECONDS;
      });
    } else {
      return chartData.filter((item: any) => {
        return moment(item.x).unix() > currentTime - DAY_IN_SECONDS;
      });
    }
  };

  const calculateYields = () => {
    let annualYield = 0;

    if (vault) {
      // annual yield of selected vault
      const { userPosition, apr } = vault;
      annualYield = ((userPosition || 0) * (apr || 0)) / 100;
    } else {
      // total annual yield
      vaults.map((row) => {
        const { userPosition, apr } = row;
        annualYield += ((userPosition || 0) * (apr || 0)) / 100;
      });
    }

    return annualYield;
  };

  const annualEstYield = calculateYields();

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
          {!showPosition
            ? "ASSETS PER VAULT SHARE"
            : vault
            ? `YOUR ${(vault?.readable || "").toUpperCase()} ${
                vault?.deprecated ? "[WITHDRAW ONLY]" : ""
              } POSITION`
            : "TOTAL SPICE POSITION"}
        </h2>
        {vault && (
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
            yPrefix={!showPosition ? "" : "Ξ"}
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
