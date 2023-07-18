import { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";

import { Card, Stats } from "@/components/common";
import PositionSVG from "@/assets/icons/position.svg";
import { VaultInfo, ReceiptToken, ChartValue } from "@/types/vault";
import { LineChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import { BLUR_API_BASE } from "@/config/constants/backend";
import axios from "axios";
import {
  DAY_IN_SECONDS,
  MIN_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { formatBlurChart } from "@/utils/formatter";
import { activeChainId } from "@/utils/web3";
import { getUserVaultShares } from "@/api/subgraph";
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
  const [step, setStep] = useState(0);
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Year);
  const [blurChartInfo, setBlurChartInfo] = useState<any>();
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const { account } = useWeb3React();
  const [noneBlurVaultShares, setNoneBlurVaultShares] = useState<any>([]);
  const [noneBlurVaultsShares, setNoneBlurVaultsShares] = useState<
    { vault: VaultInfo; sharesRaw: any[] }[]
  >([]);

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
      const sharesRaws = await Promise.all(
        vaults.map((_vault) => getUserVaultShares(account, _vault.address))
      );

      setNoneBlurVaultsShares(
        vaults.map((_vault, idx) => ({
          vault: _vault,
          sharesRaw: sharesRaws[idx].map((row: any) => {
            return {
              time: Number(row.date) * 1000,
              share: getBalanceInEther(row.share),
            };
          }),
        }))
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
    if (!vault) {
      fetchBlurChart();
      fetchNoneBlurVaultUserPosition();
    } else if (vault.isBlur) {
      fetchBlurChart();
    } else {
      fetchNoneBlurVaultUserPosition();
    }
  }, [vault, vaults, account]);

  const getAprHistories = (_vault: VaultInfo) => {
    const historialRecords = _vault.historicalRecords || [];
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

  const getUserVaultTVLData = (
    aprHistories: {
      time: number;
      apr: number;
      assetPerShare: number;
    }[],
    vaultShares: any[]
  ) => {
    const sharePriceChartData = aprHistories.map((row) => {
      return {
        x: row.time,
        y: row.assetPerShare,
      };
    });

    const shareValueChartData = vaultShares.map((row: any) => {
      return {
        x: row.time,
        y: row.share,
      };
    });

    // historical asset per share price
    let historicalAssetPreSharePrices: any = {};
    sampleDataByTimeTicks(sharePriceChartData).map((row, i) => {
      historicalAssetPreSharePrices = {
        ...historicalAssetPreSharePrices,
        [row.x]: row.y,
      };
    });

    return sampleDataByTimeTicks(shareValueChartData).map((row: any) => {
      return {
        x: row.x,
        y: row.y * (historicalAssetPreSharePrices[row.x] || 0),
      };
    });
  };

  const getChartData = () => {
    let chartData: ChartValue[] = [];

    let makeStepLike = false;
    if (vault) {
      if (vault.isBlur) {
        if (step === 0) {
          chartData = blurChartInfo?.tvlChart ?? [];
        } else if (step === 1) {
          chartData = blurChartInfo?.pointsChart ?? [];
        } else {
          const aprHistories = getAprHistories(vault);
          chartData = sampleDataByTimeTicks(
            aprHistories.map((row) => {
              return {
                x: row.time,
                y: row.assetPerShare,
              };
            })
          );
        }
      } else {
        makeStepLike = true;

        // apr histories
        const aprHistories = getAprHistories(vault);

        if (step === 0) {
          chartData = getUserVaultTVLData(aprHistories, noneBlurVaultShares);
        } else {
          chartData = sampleDataByTimeTicks(
            aprHistories.map((row) => {
              return {
                x: row.time,
                y: row.assetPerShare,
              };
            })
          );
        }
      }
    } else {
      if (step === 0) {
        if (!account) {
          chartData = [];
        } else {
          makeStepLike = true;
          chartData = [];
          const data: any = {};
          let userTvls = noneBlurVaultsShares.map(({ vault, sharesRaw }) => {
            const aprHistories = getAprHistories(vault);
            return [
              { x: 0, y: 0 },
              ...getUserVaultTVLData(aprHistories, sharesRaw),
            ];
          });

          const blurTvl = (blurChartInfo?.tvlChart || []).map((row: any) => {
            const x = new Date(row.x).getTime();
            return {
              x,
              y: row.y,
            };
          });
          userTvls.push([{ x: 0, y: 0 }, ...blurTvl]);
          userTvls = userTvls.filter((userTvl) => userTvl.length > 0);
          const times = userTvls
            .map((vaultTvl) => vaultTvl.map((row: any) => row.x))
            .reduce((cur, _times) => {
              _times.map((time) => {
                if (cur.indexOf(time) === -1) cur.push(time);
              });
              return cur;
            }, [])
            .sort((a, b) => a - b);
          const length = userTvls.length;
          const indexes = new Array(length).fill(0);
          times.map((x) => {
            if (x === 0) return;
            let tvl = 0;
            for (let i = 0; i < length; i++) {
              while (
                indexes[i] < userTvls[i].length &&
                userTvls[i][indexes[i]].x <= x
              )
                indexes[i]++;
              tvl += userTvls[i][indexes[i] - 1].y;
            }
            chartData.push({
              x,
              y: tvl,
            });
          });
        }
      } else {
        chartData = [];
      }
    }

    if (makeStepLike) {
      let temp = chartData;
      chartData = [];
      for (let i = 0; i < temp.length; i++) {
        if (i > 0 && temp[i - 1].y !== temp[i].y) {
          chartData.push({
            x: (temp[i].x as number) - 1,
            y: temp[i - 1].y,
          });
        }
        chartData.push(temp[i]);
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
          {step === 0
            ? vault
              ? `YOUR ${(vault?.readable || "").toUpperCase()} ${
                  vault?.deprecated ? "[WITHDRAW ONLY]" : ""
                } POSITION`
              : "TOTAL SPICE POSITION"
            : vault && vault.isBlur
            ? step === 1
              ? "YOUR SP-BLUR POINTS"
              : "ASSETS PER VAULT SHARE"
            : "ASSETS PER VAULT SHARE"}
        </h2>
        {vault && (
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
          {vault && vault.isBlur && step === 1 && (
            <Stats
              title="SP-BLUR"
              value={(blurChartInfo?.totalSpPoints ?? 0).toFixed(2)}
            />
          )}
          {vault && (!vault.isBlur || step === 0) && (
            <Stats
              title="Position"
              value={`Ξ${(vault?.userPosition || 0).toFixed(2)}`}
            />
          )}
          {vault && (!vault.isBlur || step === 0) && (
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
            yPrefix={step === 1 ? "" : "Ξ"}
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
