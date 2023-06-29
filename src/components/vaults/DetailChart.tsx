import { useEffect, useState } from "react";

import { Card, Stats } from "@/components/common";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import TvlSVG from "@/assets/icons/tvl.svg";
import {
  MarketplaceExposure,
  CollectionExposure,
  LoanAndBidExposure,
} from "@/components/vaults";
import { ChartValue, VaultInfo } from "@/types/vault";
import { BLUR_API_BASE } from "@/config/constants/backend";
import { Slider } from "../common";
import axios from "axios";
import moment from "moment";
import {
  MIN_IN_SECONDS,
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { formatBlurChart } from "@/utils/formatter";
import { activeChainId } from "@/utils/web3";
import { getVaultShares } from "@/api/subgraph";
import { getBalanceInEther } from "@/utils/formatBalance";

type Props = {
  vault: VaultInfo;
};

export default function DetailChart({ vault }: Props) {
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Month);
  const [step, setStep] = useState(0);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const [blurChartInfo, setBlurChartInfo] = useState<any>();
  const [noneBlurVaultShares, setNoneBlurVaultShares] = useState<any>();
  const [sliderValue, setSliderValue] = useState(3);
  const [ptValue, setPtValue] = useState("3.00");

  const sampleDataByTimeTicks = (originData: any[]) => {
    if (originData.length === 0) return [];
    const tick =
      selectedPeriod === PeriodFilter.Day
        ? 24 * 60 * MIN_IN_SECONDS * 1000 // 24 hrs
        : 24 * 60 * MIN_IN_SECONDS * 1000; // 24 hrs

    let startTime = originData[0].x;
    let endTime = moment().unix() * 1000;

    startTime = Math.floor(startTime / tick) * tick;
    endTime = Math.floor(endTime / tick) * tick;

    let origin1: any = {};
    originData.map((row, i) => {
      origin1 = { ...origin1, [Math.floor(row.x / tick) * tick]: row.y };
    });

    let result: any[] = [];
    let prevTick = startTime;
    let nearTick = startTime;

    while (prevTick <= endTime) {
      if (origin1[prevTick]) {
        nearTick = prevTick;
      }
      result = [
        ...result,
        {
          x: prevTick,
          y: origin1[nearTick],
        },
      ];
      prevTick += tick;
    }

    return result;
  };

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

  const getAprHistories = () => {
    const historialRecords = vault?.historicalRecords || [];
    const aprField = activeChainId === 1 ? "actual_returns" : "expected_return";
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

    return aprHistories;
  };

  const getChartData = () => {
    const currentTime = Math.floor(Date.now() / 1000);

    // Blur points
    if (vault.isBlur && step === 0) {
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

    // Blur TVL
    if (vault.isBlur && step === 1) {
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

    // apr histories
    const aprHistories = getAprHistories();

    // Assets per share
    if ((!vault.isBlur && step === 1) || (vault.isBlur && step === 2)) {
      const chartData = aprHistories.map((row) => {
        return {
          x: row.time,
          y: row.assetPerShare,
        };
      });

      if (selectedPeriod === PeriodFilter.All) {
        return chartData;
      } else if (selectedPeriod === PeriodFilter.Year) {
        return chartData.filter((item) => {
          return moment(item.x).unix() > currentTime - YEAR_IN_SECONDS;
        });
      } else if (selectedPeriod === PeriodFilter.Month) {
        return chartData.filter((item) => {
          return moment(item.x).unix() > currentTime - MONTH_IN_SECONDS;
        });
      } else if (selectedPeriod === PeriodFilter.Week) {
        return chartData.filter((item) => {
          return moment(item.x).unix() > currentTime - WEEK_IN_SECONDS;
        });
      } else {
        return chartData.filter((item) => {
          return moment(item.x).unix() > currentTime - DAY_IN_SECONDS;
        });
      }
    }

    // Non blur vault TVL
    const sharePriceChartData = aprHistories.map((row) => {
      return {
        x: row.time,
        y: row.assetPerShare,
      };
    });

    const shareChartData = noneBlurVaultShares
      ? noneBlurVaultShares.map((row: any) => {
          return {
            x: row.time,
            y: row.share,
          };
        })
      : [];

    // historical asset per share price
    let historicalAssetPreSharePrices: any = {};
    sampleDataByTimeTicks(sharePriceChartData).map((row, i) => {
      historicalAssetPreSharePrices = {
        ...historicalAssetPreSharePrices,
        [row.x]: row.y,
      };
    });

    const chartData = sampleDataByTimeTicks(shareChartData).map((row: any) => {
      return {
        x: row.x,
        y: row.y * (historicalAssetPreSharePrices[row.x] || 0),
      };
    });

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

  const getTVL = () => {
    if (vault.isBlur) {
      return blurChartInfo.tvl || 0;
    }

    const aprHistories = getAprHistories();

    const sharePriceChartData = aprHistories.map((row) => {
      return {
        x: row.time,
        y: row.assetPerShare,
      };
    });

    const shareChartData = noneBlurVaultShares
      ? noneBlurVaultShares.map((row: any) => {
          return {
            x: row.time,
            y: row.share,
          };
        })
      : [];

    // historical asset per share price
    let historicalAssetPreSharePrices: any = {};
    sampleDataByTimeTicks(sharePriceChartData).map((row, i) => {
      historicalAssetPreSharePrices = {
        ...historicalAssetPreSharePrices,
        [row.x]: row.y,
      };
    });

    const chartData = sampleDataByTimeTicks(shareChartData).map((row: any) => {
      return {
        x: row.x,
        y: row.y * (historicalAssetPreSharePrices[row.x] || 0),
      };
    });

    return chartData.length === 0
      ? 0
      : (chartData[chartData.length - 1].y as number);
  };

  const getVaultHistoricalApy = () => {
    const aprField = activeChainId === 1 ? "actual_returns" : "expected_return";
    return (
      (activeChainId === 1 ? 1 : 100) *
      (vault?.okrs ? vault?.okrs[aprField] : 0)
    );
  };

  const getVaultEstimatedYield = () => {
    const tvl = getTVL();
    const apy = getVaultHistoricalApy();

    return (tvl * apy) / 100.0;
  };

  const fetchNoneBlurVaultPosition = async () => {
    const sharesRaw = await getVaultShares(vault.address);
    setNoneBlurVaultShares(
      sharesRaw.map((row: any) => {
        return {
          time: Number(row.date) * 1000,
          share: getBalanceInEther(row.share),
        };
      })
    );
  };

  useEffect(() => {
    if (vault.isBlur) {
      fetchBlurChart();
    } else {
      fetchNoneBlurVaultPosition();
    }
  }, [vault]);

  const onPtValueChange = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue >= 0) {
      const targetMax = 25;

      if (newValue > targetMax) {
        setPtValue(targetMax.toFixed(3));
        setSliderValue(targetMax);
      } else {
        setPtValue(e.target.value);
        setSliderValue(newValue);
      }
    }
  };

  const onSliderValueChange = (val: number) => {
    setSliderValue(val);
    setPtValue(val.toString());
  };

  return (
    <div className="flex flex-col flex-1 gap-5 pt-1">
      <Card className="gap-3 flex-1 overflow-hidden min-h-[323px] h-[50%]">
        <div className="flex items-center gap-2.5">
          <TvlSVG />
          <h2 className="font-bold text-white font-sm">
            {vault.isBlur
              ? step === 0
                ? "SP-BLUR ACCUMULATED"
                : step === 1
                ? "TOTAL VALUE LOCKED"
                : "ASSETS PER VAULT SHARE"
              : step === 0
              ? "TOTAL VALUE LOCKED"
              : "ASSETS PER VAULT SHARE"}
          </h2>
          <div className="flex items-center gap-[4px]">
            {(vault.isBlur ? [0, 1, 2] : [0, 1]).map((val) => (
              <div
                className={`w-[24px] h-[8px] rounded-full cursor-pointer ${
                  step === val
                    ? "bg-orange-200 box-shadow-orange-200"
                    : "bg-gray-200"
                }`}
                key={val}
                onClick={() => setStep(val)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-200 px-12 gap-[12px]">
          <div className="flex gap-4 items-center w-full">
            {vault.isBlur && step === 0 ? (
              <Stats
                title="SP-BLUR"
                value={(blurChartInfo?.totalSpPoints ?? 0).toFixed(2)}
              />
            ) : (
              <>
                <Stats title="Vault TVL" value={`Ξ${getTVL().toFixed(2)}`} />
                <Stats
                  title="Vault APY"
                  value={`${getVaultHistoricalApy().toFixed(2)}%`}
                />
              </>
            )}
            {vault.isBlur && step === 1 && (
              <div className="flex flex-row gap-1 w-full">
                <div className="flex flex-col tracking-normal">
                  <span className="text-sm font-medium text-gray-200">
                    Point Value
                  </span>
                  <div className="flex items-center border-1 border-gray-200 hover:border-gray-300 text-gray-200 hover:text-gray-300 rounded gap-[8px] px-[8px] py-[5px] w-[100px]">
                    <span className="text-xs">$/PT</span>
                    <input
                      className="text-xs text-gray-200 w-full"
                      placeholder="0.00"
                      value={ptValue}
                      onChange={onPtValueChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col tracking-normal justify-end w-full max-w-[300px]">
                  <div className="flex flex-row items-center justify-between items-center">
                    {[0, 5, 10, 15, 20, 25].map((val, idx) => (
                      <span
                        className={`text-xs font-medium pointer-cursor ${sliderValue !== val ? "text-gray-200" : "text-orange-200 text-shadow-orange-200"}`}
                        onClick={() => onSliderValueChange(val)}
                        key={idx}
                      >
                        ${val}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <Slider
                      max={25}
                      min={0}
                      step={0.1}
                      value={sliderValue}
                      onChange={onSliderValueChange}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {vault.isBlur && step !== 1 ? (
            <div className="flex items-start tracking-normal text-xs gap-[1px] flex-col">
              <div className="hidden 2xl:flex items-center gap-1">
                <span className="whitespace-nowrap whitespace-nowrap">1W Est. Points:</span>
                <span className="text-white">
                  {(blurChartInfo?.weekPoints
                    ? blurChartInfo?.weekPoints.toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap whitespace-nowrap">1M Est. Points:</span>
                <span className="text-white">
                  {(blurChartInfo?.weekPoints
                    ? ((blurChartInfo?.weekPoints * 30) / 7).toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">1Y Est. Points:</span>
                <span className="text-white whitespace-nowrap">
                  {(blurChartInfo?.weekPoints
                    ? (blurChartInfo?.weekPoints * 52).toFixed(2)
                    : undefined) ?? "-"}{" "}
                  SPB
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start tracking-normal text-xs gap-[1px] flex-col">
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">1W Est. Yield:</span>
                <span className="text-white">
                  Ξ{(getVaultEstimatedYield() / 52).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">1M Est. Yield:</span>
                <span className="text-white">
                  Ξ{(getVaultEstimatedYield() / 12).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="whitespace-nowrap">1Y Est. Yield:</span>
                <span className="text-white">
                  Ξ{getVaultEstimatedYield().toFixed(2)}
                </span>
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
                (vault.isBlur && step === 1) || (!vault.isBlur && step === 0)
                  ? "Ξ"
                  : ""
              }
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
      <div className="flex gap-5 h-[37%]  overflow-hidden p-1 -m-1">
        {vault.isBlur ? (
          <LoanAndBidExposure
            className="flex-1"
            small
            showIcon
            vault={vault}
            isBreakdown
          />
        ) : (
          <>
            <MarketplaceExposure
              className="flex-1"
              vault={vault}
              vaults={[]}
              walletConnectRequired={false}
              isBreakdown
            />
            <CollectionExposure
              className="flex-1"
              vault={vault}
              vaults={[]}
              walletConnectRequired={false}
              isBreakdown
            />
          </>
        )}
      </div>
    </div>
  );
}
