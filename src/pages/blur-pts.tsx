import { useEffect, useState } from "react";
import { constants, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import axios from "axios";

import GameSVG from "@/assets/icons/game.svg";
import UserSVG from "@/assets/icons/user-small.svg";
import BlurSVG from "@/assets/icons/blur-pts.svg";
import { Button, Card, Stats } from "@/components/common";
import { BLUR_API_BASE } from "@/config/constants/backend";
import { formatBlurChart } from "@/utils/formatter";
import { useAppSelector } from "@/state/hooks";

export default function Portfolio() {
  const [address, setAddress] = useState<string>();
  const [error, setError] = useState<string>();
  const [checkedAddress, setCheckedAddress] = useState<string>();
  const [vaultInfo, setVaultInfo] = useState();
  const [userInfo, setUserInfo] = useState();
  const [vaultChartInfo, setVaultChartInfo] = useState<any>();
  const [userChartInfo, setUserChartInfo] = useState<any>();
  const [historicalData, setHistoricalData] = useState<any>();
  const [earnedPoints, setEarnedPoints] = useState(0);

  const router = useRouter();
  const { vaults } = useAppSelector((state) => state.vault);
  const { account } = useWeb3React();

  const fetchEfficiency = async (addr?: string) => {
    try {
      const res = await axios.get(
        `${BLUR_API_BASE}/efficiency/${addr ?? constants.AddressZero}`
      );

      setCheckedAddress(addr);

      const data = res.data.data;

      setVaultInfo(data[0]);
      setUserInfo(data[1]);
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

  const formatNumber = (val: any, digits = 2) => {
    if (!val) return "00.00";
    return Number(val).toFixed(digits);
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
    if (checkedAddress && vaultInfo) {
      const vaultEfficiency = vaultInfo[2];
      const userEfficiency = userInfo ? userInfo[2] : 0;
      const userTvl = userChartInfo ? userChartInfo.tvl : 0;

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
                HOW GOOD ARE YOU AT FARMING BLUR PTS?
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

          {checkedAddress && (
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
                    userInfo ? userInfo[2] : undefined
                  )} PTS/Ξ`}
                  size="xs"
                  valueSize="base"
                />
                <Stats
                  title="Multiplier"
                  value={`${formatNumber(userInfo ? userInfo[5] : undefined)}x`}
                  size="xs"
                  valueSize="base"
                />
                <Stats
                  title="Points Earned"
                  value={formatNumber(userInfo ? userInfo[7] : undefined)}
                  size="xs"
                  valueSize="base"
                />
                <Stats
                  title="1W Est. Points"
                  value={formatNumber(
                    userChartInfo?.weekPoints
                      ? userChartInfo?.weekPoints
                      : undefined
                  )}
                  size="xs"
                  valueSize="base"
                />
                <Stats
                  title="1M Est. Points"
                  value={formatNumber(
                    userChartInfo?.weekPoints
                      ? (userChartInfo?.weekPoints * 30) / 7
                      : undefined
                  )}
                  size="xs"
                  valueSize="base"
                />
                <Stats
                  title="1Y Est. Points"
                  value={formatNumber(
                    userChartInfo?.weekPoints
                      ? userChartInfo?.weekPoints * 52
                      : undefined
                  )}
                  size="xs"
                  valueSize="base"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col font-medium gap-3">
            <div className="flex items-center gap-3">
              <BlurSVG />
              <span className="text-base text-orange-900 -ml-1">
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
                type={checkedAddress ? "orange" : "white"}
              />
              <Stats
                title="Multiplier"
                value={`${formatNumber(vaultInfo ? vaultInfo[5] : undefined)}x`}
                size="xs"
                valueSize="base"
                type={checkedAddress ? "orange" : "white"}
              />
              <Stats
                title="Points Earned"
                value={formatNumber(vaultInfo ? vaultInfo[7] : undefined)}
                size="xs"
                valueSize="base"
                type={checkedAddress ? "orange" : "white"}
              />
              <Stats
                title="1W Est. Points"
                value={formatNumber(
                  vaultChartInfo?.weekPoints
                    ? vaultChartInfo?.weekPoints
                    : undefined
                )}
                size="xs"
                valueSize="base"
                type={checkedAddress ? "orange" : "white"}
              />
              <Stats
                title="1M Est. Points"
                value={formatNumber(
                  vaultChartInfo?.weekPoints
                    ? (vaultChartInfo?.weekPoints * 30) / 7
                    : undefined
                )}
                size="xs"
                valueSize="base"
                type={checkedAddress ? "orange" : "white"}
              />
              <Stats
                title="1Y Est. Points"
                value={formatNumber(
                  vaultChartInfo?.weekPoints
                    ? vaultChartInfo?.weekPoints * 52
                    : undefined
                )}
                size="xs"
                valueSize="base"
                type={checkedAddress ? "orange" : "white"}
              />
            </div>
          </div>

          {checkedAddress && earnedPoints > 0 && (
            <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
              {"0x" + checkedAddress.slice(2, 8).toUpperCase() + " "}
              would have earned {earnedPoints.toFixed(2)}{" "}
              <span className="font-bold">MORE BLUR POINTS</span> depositing ETH
              into the SP-BLUR Vault than farming themselves. Will you continue
              to fade rational decision making anon?{" "}
              <span
                className="underline cursor-pointer font-bold hover:text-orange-300"
                onClick={goVaultDetails}
              >
                DEPOSIT NOW
              </span>
            </span>
          )}

          {checkedAddress && earnedPoints < 0 && (
            <span className="text-orange-900 text-xs border-1 border-orange-900 rounded text-xs py-2 px-1 text-center tracking-normal">
              {"0x" + checkedAddress.slice(2, 8).toUpperCase() + " "}
              is earning {Math.abs(earnedPoints).toFixed(2)}{" "}
              <span className="font-bold">MORE BLUR POINTS</span> farming
              themselves vs depositing ETH into the SP-BLUR Vault. Do you want
              to continue spending the time farming yourself?{" "}
              <span
                className="underline cursor-pointer font-bold hover:text-orange-300"
                onClick={goVaultDetails}
              >
                DEPOSIT NOW
              </span>
            </span>
          )}
        </Card>
      </div>
    </div>
  );
}
