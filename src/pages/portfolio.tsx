import { useState } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { shortAddress } from "@/utils";
import { Card, CopyClipboard } from "@/components/common";
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
import { VaultInfo, ReceiptToken } from "@/types/vault";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { getNftPortfolios, getTokenImageFromReservoir } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { VaultPositionGraph } from "@/components/vaults";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants";

export default function Portfolio() {
  const [selectedVaultAddr, setSelectedVaultAddr] = useState<string>();
  const { account } = useWeb3React();
  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);

  const accountImage = () => {
    if (loans.length === 0) {
      return "/assets/images/vaultIcon.svg";
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
        userPositionRaw,
        userPosition: getBalanceInEther(userPositionRaw),
        userNftPortfolios,

        // TODO: remove later
        // isBlur: true,
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

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
        {/* account card */}
        {account && (
          <Card className="py-3 !flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-5 flex-1">
              <Image
                className="border-1 border-gray-200 rounded-full"
                src={accountImage()}
                width={40}
                height={40}
                alt=""
              />
              <span className="hidden 3xl:flex font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
                {shortAddress(account, 18, -16)}
              </span>
              <span className="hidden lg:flex 3xl:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
                {shortAddress(account, 10, -10)}
              </span>
              <span className="lg:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
                {shortAddress(account, 10, account.length)}
              </span>
            </div>
            <CopyClipboard
              text={account}
              className="min-w-[24px] min-w-[24px]"
            />
          </Card>
        )}

        {/* vault list table */}
        <VaultsTable
          vaults={vaults}
          selectedVault={selectedVault}
          onSelectVault={onSelectVault}
        />

        <div className="h-[44%] overflow-y-hidden p-1 -m-1">
          {selectedVault &&
            (selectedVault.isBlur ? (
              <div className="flex flex-col h-full gap-5">
                <BlurLeaderboard vault={selectedVault} showIcon onlyPts />
                <BlurLeaderboard
                  vault={selectedVault}
                  showIcon
                  nonExpandedClassName="flex-1"
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
              <MarketplaceExposure className="flex-1" vault={selectedVault} />
            ))}

          {!selectedVault && (
            <MarketplaceExposure className="flex-1" vault={selectedVault} />
          )}
          {(!selectedVault || !selectedVault.isBlur) && (
            <CombineExposure
              vault={selectedVault}
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
