import { useEffect, useState } from "react";
import { BigNumber, constants, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import axios from "axios";

import VaultAbi from "@/config/abi/SpiceFiVault.json";
import GameSVG from "@/assets/icons/game.svg";
import UserSVG from "@/assets/icons/user-small.svg";
import BlurSVG from "@/assets/icons/blur-pts.svg";
import { Button, Card, Stats } from "@/components/common";
import { BLUR_API_BASE } from "@/config/constants/backend";
import { formatBlurChart } from "@/utils/formatter";
import { useAppSelector } from "@/state/hooks";
import { activeChainId, getWeb3 } from "@/utils/web3";
import { getBalanceInEther } from "@/utils/formatBalance";
import moment from "moment";
import { PeriodFilter } from "@/types/common";
import { ChartValue } from "@/types/vault";
import {
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS,
  WEEK_IN_SECONDS,
  YEAR_IN_SECONDS,
} from "@/config/constants/time";
import { LineChart } from "@/components/portfolio";
import { DEFAULT_BLUR_VAULT } from "@/config/constants";
import multicall from "@/utils/multicall";

export default function BlurPointsPage() {
  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const [checkedAddress, setCheckedAddress] = useState<string>();
  const [vaultInfo, setVaultInfo] = useState();
  const [userInfo, setUserInfo] = useState();
  const [vaultChartInfo, setVaultChartInfo] = useState<any>();
  const [userChartInfo, setUserChartInfo] = useState<any>();
  const [historicalData, setHistoricalData] = useState<any>();
  const [efficiencyData, setEfficiencyData] = useState<any>();
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isInblur, setIsInBlur] = useState(false);
  const [blurBalance, setBlurBalance] = useState(0);
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Year);

  const router = useRouter();
  const { vaults } = useAppSelector((state) => state.vault);
  const { account } = useWeb3React();

  const fetchEfficiency = async (addr?: string) => {
    try {
      const res = await axios.get(
        `${BLUR_API_BASE}/efficiency/${addr ?? constants.AddressZero}`
      );

      const data = res.data.data;

      if (data.length === 2) {
        setVaultInfo(data[1]);
        setUserInfo(data[0]);
      } else {
        setVaultInfo(data[0]);
        setUserInfo(undefined);
      }

      if (addr) {
        await Promise.all([fetchBalance(addr), fetchBlurBalance(addr)]);
      }
      setCheckedAddress(addr);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlurChart = async () => {
    try {
      const res = await axios.get(`${BLUR_API_BASE}/historical-points`);

      if (res.status === 200) {
        setHistoricalData(res.data.data.historicalRecords);

        setVaultChartInfo(formatBlurChart(res.data.data.historicalRecords));
      }
    } catch (err) {
      console.error("ranks fetching error");
    }
  };

  const fetchBlurEfficiencyData = async () => {
    try {
      let url = `${BLUR_API_BASE}/historical-efficiency/`;
      if (checkedAddress) url += checkedAddress;
      else url += "0x0";
      const res = await axios.get(url);

      if (res.status === 200) {
        setEfficiencyData(res.data.data);
      }
    } catch (err) {
      console.error("efficiency fetching error");
    }
  };

  const fetchBalance = async (addr: string) => {
    const web3 = getWeb3();
    const res = await web3.eth.getBalance(addr);
    setBalance(getBalanceInEther(BigNumber.from(res)));
  };

  const fetchBlurBalance = async (addr: string) => {
    if (!DEFAULT_BLUR_VAULT[activeChainId]) return;

    const [balance, totalAssets, totalSupply] = await multicall(VaultAbi, [
      {
        address: DEFAULT_BLUR_VAULT[activeChainId],
        name: "balanceOf",
        params: [addr],
      },
      {
        address: DEFAULT_BLUR_VAULT[activeChainId],
        name: "totalAssets",
        params: [],
      },
      {
        address: DEFAULT_BLUR_VAULT[activeChainId],
        name: "totalSupply",
        params: [],
      },
    ]);

    setIsInBlur(!balance[0].eq(0));
    setBlurBalance(
      (getBalanceInEther(balance[0]) * getBalanceInEther(totalAssets[0])) /
        getBalanceInEther(totalSupply[0])
    );
  };

  const formatNumber = (val: any, digits = 2) => {
    if (!val) return "00.00";
    return Number(val).toFixed(digits);
  };

  const getChartData = () => {
    const currentTime = Math.floor(Date.now() / 1000);

    const chartData: ChartValue[][] = [];
    if (efficiencyData) {
      const vaultData: ChartValue[] = [];
      const userData: ChartValue[] = [];
      efficiencyData.times.map((time: string, i: number) => {
        vaultData.push({
          x: parseInt(time) * 1000,
          y: efficiencyData.SPICE[i],
        });
        userData.push({
          x: parseInt(time) * 1000,
          y: efficiencyData.user[i],
        });
      });
      chartData.push(vaultData);
      if (checkedAddress && userData.findIndex((val) => (val.y as number) > 0) > -1) {
        chartData.push(userData);
      }
    } else {
      chartData.push([]);
    }

    if (selectedPeriod === PeriodFilter.Day) {
      return chartData.map((data: ChartValue[]) =>
        data.filter((item) => {
          return moment(item.x).unix() > currentTime - DAY_IN_SECONDS;
        })
      );
    } else if (selectedPeriod === PeriodFilter.Week) {
      return chartData.map((data: ChartValue[]) =>
        data.filter((item) => {
          return moment(item.x).unix() > currentTime - WEEK_IN_SECONDS;
        })
      );
    } else if (selectedPeriod === PeriodFilter.Month) {
      return chartData.map((data: ChartValue[]) =>
        data.filter((item) => {
          return moment(item.x).unix() > currentTime - MONTH_IN_SECONDS;
        })
      );
    } else if (selectedPeriod === PeriodFilter.Year) {
      return chartData.map((data: ChartValue[]) =>
        data.filter((item) => {
          return moment(item.x).unix() > currentTime - YEAR_IN_SECONDS;
        })
      );
    }
    return chartData;
  };

  useEffect(() => {
    if (historicalData) {
      setUserChartInfo(formatBlurChart(historicalData, checkedAddress));
    }
  }, [checkedAddress, historicalData]);

  useEffect(() => {
    fetchBlurChart();
    fetchEfficiency();
  }, []);

  useEffect(() => {
    fetchBlurEfficiencyData();
  }, [vaultInfo, checkedAddress]);

  useEffect(() => {
    if (checkedAddress && vaultInfo) {
      const vaultEfficiency = vaultInfo[2];
      const userEfficiency = userInfo ? userInfo[2] : 0;
      const userTvl = userInfo ? userInfo[4] : 0;

      let points = (vaultEfficiency - userEfficiency) * userTvl;

      if (points <= 0) {
        points = vaultInfo[7] - (userInfo ? userInfo[7] : 0);
      }

      setEarnedPoints(points);
    } else {
      setEarnedPoints(0);
    }
  }, [vaultInfo, userInfo, checkedAddress, userChartInfo]);

  const onCheck = () => {
    if (isValidAddress()) {
      setError(undefined);
      fetchEfficiency(address);
    } else {
      setError("This address is invalid. Please try again.");
    }
  };

  const isValidAddress = () => {
    if (!address) return false;
    return utils.isAddress(address.toLowerCase());
  };

  const goVaultDetails = () => {
    console.log(vaults);
    const blurVault = vaults.find((vault) => vault.isBlur);
    if (blurVault) {
      router.push(`/vault/${blurVault.address}`);
    }
  };

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1">
        <Card className="max-w-[610px] w-[610px] gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <GameSVG />
              <h2 className="font-bold text-white font-sm">
                HOW GOOD ARE YOU AT FARMING BLUR LENDING PTS?
              </h2>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex h-9 gap-3">
              <div className="flex border-1 border-gray-200 rounded flex-1 px-3 text-xs">
                <input
                  className="flex-1 text-white font-medium placeholder:text-gray-200 placeholder:text-opacity-50"
                  placeholder="Enter wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {checkedAddress && (
                  <button
                    className="text-orange-900 text-xs font-medium text-shadow-orange-900-sm underline hover:text-orange-300"
                    onClick={() => {
                      setAddress("");
                      setCheckedAddress(undefined);
                      setUserInfo(undefined);
                    }}
                  >
                    RESET
                  </button>
                )}
                {!checkedAddress && account && (
                  <button
                    className="text-orange-900 text-xs font-medium text-shadow-orange-900-sm underline  hover:text-orange-300"
                    onClick={() => setAddress(account)}
                  >
                    {account.slice(0, 8)}
                  </button>
                )}
              </div>
              <Button
                type="primary"
                className="w-[100px] h-full"
                onClick={onCheck}
              >
                CHECK
              </Button>
            </div>
            {error && <span className="mt-px text-red text-xs">{error}</span>}
          </div>

          {checkedAddress &&
            vaultInfo &&
            (isInblur || (userInfo && userInfo[7] > 0)) && (
              <div className="flex flex-col font-medium gap-3">
                <div className="flex items-center gap-3">
                  <UserSVG />
                  <span className="text-base text-orange-200 -ml-1">
                    {"0x" + checkedAddress.slice(2, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Stats
                    title="Efficiency"
                    value={`${formatNumber(
                      userInfo
                        ? userInfo[2]
                        : isInblur
                        ? vaultInfo[2]
                        : undefined
                    )} PTS/Ξ`}
                    size="xs"
                    valueSize="base"
                  />
                  <Stats
                    title="Avg Multiplier"
                    value={`${formatNumber(
                      userInfo
                        ? userInfo[5]
                        : isInblur
                        ? vaultInfo[5]
                        : undefined
                    )}X`}
                    size="xs"
                    valueSize="base"
                  />
                  <Stats
                    title="Lending Pts Earned"
                    value={`${formatNumber(
                      userInfo
                        ? userInfo[3] * userInfo[5]
                        : isInblur
                        ? blurBalance * vaultInfo[2]
                        : undefined
                    )}/day`}
                    size="xs"
                    valueSize="base"
                  />
                  <Stats
                    title="TVL"
                    value={`Ξ${formatNumber(
                      userInfo
                        ? userInfo[4]
                        : isInblur
                        ? blurBalance
                        : undefined
                    )}`}
                    size="xs"
                    valueSize="base"
                  />
                </div>
              </div>
            )}

          <div className="flex flex-col font-medium gap-3">
            <div className="flex items-center gap-3">
              <BlurSVG
                className={
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "text-orange-900"
                    : "text-white"
                }
              />
              <span
                className={`text-base -ml-1 ${
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "text-orange-900"
                    : "text-white"
                }`}
              >
                SP-BLUR VAULT
              </span>
              <Button
                className="h-5 w-[84px] text-xs"
                type="primary"
                onClick={goVaultDetails}
              >
                SEE VAULT
              </Button>
            </div>
            <div className="flex gap-4">
              <Stats
                title="Efficiency"
                value={`${formatNumber(
                  vaultInfo ? vaultInfo[2] : undefined
                )} PTS/Ξ`}
                size="xs"
                valueSize="base"
                type={
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "orange"
                    : "white"
                }
              />
              <Stats
                title="Avg Multiplier"
                value={`${formatNumber(vaultInfo ? vaultInfo[5] : undefined)}X`}
                size="xs"
                valueSize="base"
                type={
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "orange"
                    : "white"
                }
              />
              <Stats
                title="Lending Pts Earned"
                value={`${formatNumber(
                  vaultInfo ? vaultInfo[7] : undefined
                )}/day`}
                size="xs"
                valueSize="base"
                type={
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "orange"
                    : "white"
                }
              />
              <Stats
                title="TVL"
                value={`Ξ${formatNumber(vaultInfo ? vaultInfo[4] : undefined)}`}
                size="xs"
                valueSize="base"
                type={
                  checkedAddress && (isInblur || (userInfo && userInfo[7] > 0))
                    ? "orange"
                    : "white"
                }
              />
            </div>
          </div>

          {isInblur && checkedAddress && vaultInfo && (
            <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
              You&apos;re already in the SP-BLUR Vault! You could be earning{" "}
              <span className="font-bold">
                {(balance * vaultInfo[2]).toFixed(3)} MORE BLUR LENDING POINTS
                PER DAY
              </span>{" "}
              depositing your current wallet balance. Will you continue to fade
              rational decision making anon?{" "}
              <span
                className="underline cursor-pointer font-bold hover:text-orange-300"
                onClick={goVaultDetails}
              >
                DEPOSIT NOW
              </span>
            </span>
          )}

          {!isInblur &&
            checkedAddress &&
            vaultInfo &&
            (!userInfo || !userInfo[7]) && (
              <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
                You currently have zero Blur Lending Points. You can be earning{" "}
                <span className="font-bold">
                  {(balance * vaultInfo[2]).toFixed(3)} BLUR LENDING POINTS PER
                  DAY
                </span>{" "}
                by depositing the {balance.toFixed(3)} ETH in YOUR wallet into
                the SP-BLUR Vault. Will you continue to fade rational decision
                making anon?{" "}
                <span
                  className="underline cursor-pointer font-bold hover:text-orange-300"
                  onClick={goVaultDetails}
                >
                  DEPOSIT NOW
                </span>
              </span>
            )}

          {!isInblur &&
            checkedAddress &&
            vaultInfo &&
            userInfo &&
            userInfo[7] &&
            earnedPoints > 0 && (
              <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
                You would have earned{" "}
                <span className="font-bold">
                  {earnedPoints.toFixed(2)} MORE BLUR LENDING POINTS PER DAY
                </span>{" "}
                depositing ETH into the SP-BLUR Vault (
                <span className="font-bold">
                  {((100 * vaultInfo[2]) / userInfo[2]).toFixed(0)}% more
                  efficient)
                </span>{" "}
                than farming yourself. Will you continue to fade rational
                decision making anon?{" "}
                <span
                  className="underline cursor-pointer font-bold hover:text-orange-300"
                  onClick={goVaultDetails}
                >
                  DEPOSIT NOW
                </span>
              </span>
            )}

          {!isInblur &&
            checkedAddress &&
            userInfo &&
            userInfo[7] &&
            earnedPoints < 0 && (
              <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
                You are earning{" "}
                <span className="font-bold">
                  {Math.abs(earnedPoints).toFixed(2)} MORE BLUR LENDING POINTS
                  PER DAY
                </span>{" "}
                farming yourself vs depositing ETH into the SP-BLUR Vault. Do
                you want to continue spending the time farming yourself?{" "}
                <span
                  className="underline cursor-pointer font-bold hover:text-orange-300"
                  onClick={goVaultDetails}
                >
                  DEPOSIT NOW
                </span>
              </span>
            )}

          <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100vh-570px)] basis-[350px]">
            <div className="flex-1 relative max-h-[calc(100%-18px)] lg:max-h-[100%]">
              <LineChart
                data={getChartData()}
                colors={["#FDA739", "#FFE3CA"]}
                period={selectedPeriod}
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
      </div>
    </div>
  );
}
