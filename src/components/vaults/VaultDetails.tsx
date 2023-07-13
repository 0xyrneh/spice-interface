import { useEffect, useState } from "react";
import { useWindowSize } from "@react-hook/window-size/throttled";

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
import { useUI } from "@/hooks";
import VaultDesc from "./VaultDesc";
import { MIN_SCREEN_HEIGHT } from "@/config/constants";

type Props = {
  vault: VaultInfo;
};

export default function VaultDetails({ vault }: Props) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedBoxId, setExpandedBoxId] = useState<number>(-1); // -1: none, 1: left center section, 2: left bottom section
  const [isCardPopup, setIsCardPopup] = useState<boolean>(false); // flag to track one box is pop up
  const [pointValue, setPointValue] = useState(2);

  const { showDepositModal } = useUI();
  const [_, height] = useWindowSize({ fps: 60 });

  useEffect(() => {
    if (vault.isBlur || vault.receiptToken === ReceiptToken.NFT) {
      if (height <= MIN_SCREEN_HEIGHT) {
        if (expandedBoxId === -1) {
          if (vault.isBlur) {
            setExpandedBoxId(2);
          }
          if (vault.receiptToken === ReceiptToken.NFT) {
            setExpandedBoxId(1);
          }
        }
      } else {
        if (expandedBoxId !== -1) {
          setExpandedBoxId(-1);
        }
      }
    }
  }, [height]);

  const onChangeActiveSectionId = (value: number) => {
    if (vault.isBlur || vault.receiptToken === ReceiptToken.NFT) {
      if (value === expandedBoxId) return;
      if (height > MIN_SCREEN_HEIGHT) return;

      setExpandedBoxId(value);
    }
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

  const getTotalEarnings = () => {
    const totalShares = vault.totalShares || 0;
    const aprHistories = getAprHistories();
    if (aprHistories.length === 0) return 0;
    return (
      totalShares *
      (aprHistories[aprHistories.length - 1].assetPerShare -
        aprHistories[0].assetPerShare)
    );
  };

  const blurEstApy = () => {
    if (!vault || !vault.isBlur) return 0;
    // return vault.apy || 0;
    return (
      (((vault.apy || 0) - (vault.apr || 0)) / 100 / 2) * pointValue * 100 +
      (vault.apr || 0)
    );
  };

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
        {/* vault description module */}
        <div className="relative">
          <VaultDesc
            vault={vault}
            showFullDesc={false}
            expanded={showFullDescription}
            onShowFullDesc={() => setShowFullDescription(true)}
          />
          {showFullDescription && (
            <VaultDesc
              vault={vault}
              showFullDesc
              expanded
              onHideFullDesc={() => setShowFullDescription(false)}
            />
          )}
        </div>
        {/* chart graph */}
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
              value={`Ξ${getTotalEarnings().toFixed(2)}`}
            />
            <Stats
              title="Estimated APY"
              value={`${(vault?.isBlur
                ? blurEstApy()
                : vault?.estimatedApy || 0
              ).toFixed(2)}%`}
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

        {/* prologue nft section */}
        {!vault.isBlur && vault.receiptToken === ReceiptToken.NFT && (
          <PrologueNfts
            vault={vault}
            walletConnectRequired={false}
            className={`${
              expandedBoxId === 2
                ? `h-[58px] overflow-hidden gap-4.5 ${
                    isCardPopup ? "flex-1" : ""
                  }`
                : "flex-1 h-[30%] gap-3"
            }`}
            headerClassName={expandedBoxId === 2 ? "cursor-pointer" : ""}
            onActive={() => onChangeActiveSectionId(1)}
            onCardPopup={(value) => setIsCardPopup(value)}
          />
        )}

        {/* blur leaderboard section */}
        {vault.isBlur ? (
          <div
            className="flex flex-col h-full gap-5 overflow-hidden"
            style={{ margin: -5, padding: 5 }}
          >
            <BlurLeaderboard
              vault={vault}
              showIcon
              onlyPts
              className={`justify-between  
              ${
                expandedBoxId === 2
                  ? `h-[58px] overflow-hidden gap-4.5 
                  ${isCardPopup ? "flex-1" : ""}`
                  : "flex-1 gap-3"
              } 
              ${height > MIN_SCREEN_HEIGHT ? "max-h-[200px]" : ""}`}
              headerClassName={expandedBoxId === 2 ? "cursor-pointer" : ""}
              onActive={() => onChangeActiveSectionId(1)}
              onCardPopup={(value) => setIsCardPopup(value)}
            />
            <BlurLeaderboard
              vault={vault}
              showIcon
              nonExpandedClassName={expandedBoxId === 2 ? "flex-1" : ""}
              showAccumulated
              onDeposit={() => {
                showDepositModal({ vault: vault });
              }}
              className={`${
                expandedBoxId === 1
                  ? `h-[100px] overflow-hidden gap-3 ${
                      isCardPopup ? "flex-1" : ""
                    }`
                  : "flex-1 gap-3"
              }`}
              headerClassName={`${
                expandedBoxId === 1 ? "cursor-pointer" : ""
              } h-[18px]`}
              onActive={() => onChangeActiveSectionId(2)}
              onCardPopup={(value) => setIsCardPopup(value)}
            />
          </div>
        ) : (
          <LoanBreakdown
            vault={vault}
            walletConnectRequired={false}
            className={`${
              expandedBoxId === 1
                ? `h-[58px] overflow-hidden gap-4.5 ${
                    isCardPopup ? "flex-1" : ""
                  }`
                : "flex-1 h-[34%] gap-3"
            }`}
            headerClassName={expandedBoxId === 1 ? "cursor-pointer" : ""}
            isBreakdown
            onActive={() => onChangeActiveSectionId(2)}
            onCardPopup={(value) => setIsCardPopup(value)}
          />
        )}
      </div>

      <DetailChart vault={vault} setPointValue={setPointValue} />
    </div>
  );
}
