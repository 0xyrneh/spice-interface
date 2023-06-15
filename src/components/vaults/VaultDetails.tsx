import { Card, Stats } from "@/components/common";
import {
  BlurLeaderboard,
  DetailChart,
  LoanBreakdown,
  PrologueNfts,
} from "@/components/vaults";
import ChartSVG from "@/assets/icons/chart.svg";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { activeChainId } from "@/utils/web3";
import { getVaultUpTime } from "@/utils/vault";
import { useState } from "react";
import VaultDesc from "./VaultDesc";

type Props = {
  vault: VaultInfo;
};

export default function VaultDetails({ vault }: Props) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getVaultHistoricalApy = () => {
    const aprField = activeChainId === 1 ? "actual_returns" : "expected_return";
    return (
      (activeChainId === 1 ? 1 : 100) *
      (vault?.okrs ? vault?.okrs[aprField] : 0)
    );
  };

  const getExpectedReturn = () => ((vault?.tvl || 0) * (vault?.apr || 0)) / 100;

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
        <div className="relative">
          <VaultDesc
            vault={vault}
            onShowFullDesc={() => setShowFullDescription(true)}
          />
          {showFullDescription && (
            <VaultDesc
              vault={vault}
              showFullDesc
              onHideFullDesc={() => setShowFullDescription(false)}
            />
          )}
        </div>
        <Card className="gap-3">
          <div className="flex items-center gap-2.5">
            <ChartSVG />
            <h2 className="font-bold text-white font-sm leading-[18px]">
              VAULT STATS
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <Stats
              className="hidden lg:flex"
              title="Total Deposits"
              value={`Ξ${(vault.tvl || 0).toFixed(2)}`}
            />
            <Stats
              title="Total Earnings"
              value={`Ξ${getExpectedReturn().toFixed(2)}`}
            />
            <Stats
              title="Historical APY"
              value={`${getVaultHistoricalApy().toFixed(2)}%`}
            />
            {getVaultUpTime(vault.startTime) > 0 && (
              <Stats
                className="hidden xl:flex"
                title="Up Time"
                value={`${getVaultUpTime(vault.startTime)}d`}
              />
            )}
          </div>
        </Card>
        {!vault.isBlur && vault.receiptToken === ReceiptToken.NFT && (
          <PrologueNfts
            vault={vault}
            walletConnectRequired={false}
            className="h-[30%]"
          />
        )}

        {vault.isBlur ? (
          <div className="flex flex-col h-full gap-5">
            <BlurLeaderboard vault={vault} showIcon onlyPts />
            <BlurLeaderboard
              vault={vault}
              showIcon
              nonExpandedClassName="flex-1"
              showAccumulated
            />
          </div>
        ) : (
          <LoanBreakdown
            vault={vault}
            walletConnectRequired={false}
            className="flex-1 h-[34%]"
          />
        )}
      </div>

      <DetailChart vault={vault} />
    </div>
  );
}
