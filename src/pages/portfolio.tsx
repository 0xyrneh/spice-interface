import { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useWindowSize } from "@react-hook/window-size/throttled";

import {
  LoanAndBidExposure,
  MarketplaceExposure,
  CombineExposure,
  LoanExposure,
  BlurLeaderboard,
} from "@/components/vaults";
import { VaultsTable } from "@/components/portfolio";
import VaultNfts from "@/components/vaults/VaultNfts";
import { useAppSelector } from "@/state/hooks";
import { useUI } from "@/hooks";
import { VaultInfo, ReceiptToken } from "@/types/vault";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { getNftPortfolios, getTokenImageFromReservoir } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { VaultPositionGraph } from "@/components/vaults";
import { PROLOGUE_NFT_ADDRESS, MIN_SCREEN_HEIGHT } from "@/config/constants";
import AccountInfo from "@/components/portfolio/AccountInfo";

export default function Portfolio() {
  const [selectedVaultAddr, setSelectedVaultAddr] = useState<string>();

  const [expandedBoxId, setExpandedBoxId] = useState<number>(-1); // -1: none, 1: left center section, 2: left bottom section
  const [isCardPopup, setIsCardPopup] = useState<boolean>(false); // flag to track one box is pop up
  const [showAccountDetails, setShowAccountDetails] = useState(false); // flag to show tx history

  const { account } = useWeb3React();
  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);
  const { showDepositModal } = useUI();
  const [_, height] = useWindowSize({ fps: 60 });

  const accountImage = () => {
    if (loans.length === 0) {
      return undefined;
    } else {
      return getTokenImageFromReservoir(
        PROLOGUE_NFT_ADDRESS,
        Number(loans[0].tokenId)
      );
    }
  };

  const vaults = vaultsOrigin
    .map((row: VaultInfo) => {
      let userPositionRaw = BigNumber.from(0);
      let userNftPortfolios: any[] = [];
      if (row.fungible) {
        userPositionRaw = row?.userInfo?.depositAmnt || BigNumber.from(0);
      } else {
        const userNfts = row?.userInfo?.nftsRaw || [];
        userNftPortfolios =
          row.address === DEFAULT_AGGREGATOR_VAULT[activeChainId]
            ? getNftPortfolios(loans, userNfts)
            : [];

        userNftPortfolios.map((row1: any) => {
          userPositionRaw = userPositionRaw.add(row1.value);
          return row1;
        });
      }

      return {
        ...row,
        apy: Math.max(row.apy ?? 0, row.historicalApy ?? 0),
        userPositionRaw,
        userPosition: getBalanceInEther(userPositionRaw),
        userNftPortfolios,
      };
    })
    .filter((row1: VaultInfo) => row1.userPosition && row1.userPosition > 0);

  const onSelectVault = (item?: VaultInfo) => {
    if (!item) setSelectedVaultAddr(undefined);
    else setSelectedVaultAddr(item.address);
  };

  const selectedVault = vaults.find(
    (row: VaultInfo) => row.address === selectedVaultAddr
  );

  const getUserTotalPosition = () => {
    let userTotalPosition = 0;
    vaults.map((vault: VaultInfo) => {
      userTotalPosition += vault?.userPosition || 0;
    });
    return userTotalPosition;
  };

  useEffect(() => {
    if (!selectedVault) return;
    if (
      selectedVault.isBlur ||
      selectedVault.receiptToken === ReceiptToken.NFT
    ) {
      if (height <= MIN_SCREEN_HEIGHT) {
        if (expandedBoxId === -1) {
          setExpandedBoxId(2);
        }
      } else {
        if (expandedBoxId !== -1) {
          setExpandedBoxId(-1);
        }
      }
    }
  }, [height, selectedVaultAddr]);

  const onChangeActiveSectionId = (value: number) => {
    if (!selectedVault) return;
    if (
      selectedVault.isBlur ||
      selectedVault.receiptToken === ReceiptToken.NFT
    ) {
      if (value === expandedBoxId) return;
      if (height > MIN_SCREEN_HEIGHT) return;

      setExpandedBoxId(value);
    }
  };

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
        {/* account card */}
        {account && (
          <div className="relative">
            <AccountInfo
              accountImage={accountImage()}
              onShowDetails={() => setShowAccountDetails(true)}
            />
            {showAccountDetails && (
              <AccountInfo
                accountImage={accountImage()}
                showDetails
                onHideDetails={() => setShowAccountDetails(false)}
              />
            )}
          </div>
        )}

        {/* vault list table */}
        <VaultsTable
          vaults={vaults}
          selectedVault={selectedVault}
          onSelectVault={onSelectVault}
          className="max-h-[40%]"
        />

        {/* blur leaderboard section */}
        <div className="h-[44%] overflow-hidden p-1 -m-1 flex-1">
          {selectedVault &&
            (selectedVault.isBlur ? (
              <div className="flex flex-col h-full gap-5">
                <BlurLeaderboard
                  vault={selectedVault}
                  showIcon
                  onlyPts
                  className={`${
                    expandedBoxId === 2
                      ? `h-[58px] overflow-hidden gap-4.5 ${
                          isCardPopup ? "flex-1" : ""
                        }`
                      : "flex-1 gap-3"
                  } justify-between`}
                  headerClassName={expandedBoxId === 2 ? "cursor-pointer" : ""}
                  onActive={() => onChangeActiveSectionId(1)}
                  onCardPopup={(value) => setIsCardPopup(value)}
                />
                <BlurLeaderboard
                  vault={selectedVault}
                  showIcon
                  nonExpandedClassName={expandedBoxId === 2 ? "flex-1" : ""}
                  onDeposit={() => {
                    showDepositModal({ vault: selectedVault });
                  }}
                  className={`${
                    expandedBoxId === 1
                      ? `h-[58px] overflow-hidden gap-4.5 ${
                          isCardPopup ? "flex-1" : ""
                        }`
                      : "flex-1 gap-3"
                  }`}
                  headerClassName={expandedBoxId === 1 ? "cursor-pointer" : ""}
                  onActive={() => onChangeActiveSectionId(2)}
                  onCardPopup={(value) => setIsCardPopup(value)}
                />
              </div>
            ) : selectedVault.receiptToken === ReceiptToken.ERC20 ? (
              <LoanExposure
                vault={selectedVault}
                showIcon
                nonExpandedClassName="h-full"
              />
            ) : (
              <VaultNfts vault={selectedVault} className="h-full" />
            ))}
          {!selectedVault && (
            <VaultNfts vault={selectedVault} className="h-full" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-5 pt-1">
        {/* vault chart graph */}
        <VaultPositionGraph
          vault={selectedVault}
          vaults={vaults}
          totalPosition={getUserTotalPosition()}
        />

        {/* vault details info */}
        <div className="flex gap-5 h-[37%] overflow-hidden p-1 -m-1">
          {selectedVault &&
            (selectedVault.isBlur ? (
              <LoanAndBidExposure
                className="flex-1"
                small
                showIcon
                vault={selectedVault}
              />
            ) : selectedVault.receiptToken === ReceiptToken.NFT ? (
              <LoanExposure
                className="flex-1"
                small
                showIcon
                vault={selectedVault}
              />
            ) : (
              <MarketplaceExposure
                className="flex-1"
                vault={selectedVault}
                vaults={vaults}
              />
            ))}

          {!selectedVault && (
            <MarketplaceExposure
              className="flex-1"
              vault={selectedVault}
              vaults={vaults}
            />
          )}
          {(!selectedVault || !selectedVault.isBlur) && (
            <CombineExposure
              vault={selectedVault}
              vaults={vaults}
              hasToggle={
                selectedVault && selectedVault.receiptToken === ReceiptToken.NFT
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
