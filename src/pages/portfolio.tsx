import { useState } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import PositionSVG from "@/assets/icons/position.svg";
import CopySVG from "@/assets/icons/copy.svg";
import { shortAddress } from "@/utils";
import { Card, Stats } from "@/components/common";
import { PositionChart } from "@/components/portfolio";
import {
  MarketplaceExposure,
  CombineExposure,
  LoanExposure,
} from "@/components/vaults";
import { VaultsTable } from "@/components/portfolio";
import VaultNfts from "@/components/vaults/VaultNfts";
import { useAppSelector } from "@/state/hooks";
import { VaultInfo, ReceiptToken, Vault } from "@/types/vault";
import { PeriodFilter } from "@/types/common";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { getNftPortfolios } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";

export default function Portfolio() {
  const [selectedVaultAddr, setSelectedVaultAddr] = useState<string>();
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);

  const { account } = useWeb3React();
  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);

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
      <div className="flex flex-col min-w-[41%] w-[41%] gap-5 pt-1">
        {/* account card */}
        {account && (
          <Card className="py-3 !flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-5 flex-1">
              <Image
                className="border-1 border-gray-200 rounded-full"
                src="/assets/images/vaultIcon.svg"
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
            <button className="min-w-[24px] min-w-[24px]">
              <CopySVG />
            </button>
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
          selectedVault.receiptToken === ReceiptToken.ERC20 ? (
            <LoanExposure
              vault={selectedVault}
              showIcon
              nonExpandedClassName="h-full"
            />
          ) : (
            <VaultNfts vault={selectedVault} className="h-full" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-5 pt-1">
        {/* vault chart graph */}
        <Card className="gap-3 flex-1 overflow-hidden min-h-[323px] h-[50%]">
          <div className="flex items-center gap-2.5">
            {selectedVault && (
              <Image
                className="border-1 border-gray-200 rounded-full"
                src={selectedVault.logo}
                width={16}
                height={16}
                alt=""
              />
            )}
            <PositionSVG />
            <h2 className="font-bold text-white font-sm">
              {selectedVault
                ? `YOUR ${(
                    selectedVault?.readable || ""
                  ).toUpperCase()} POSITION`
                : "TOTAL SPICE POSITION"}
            </h2>
          </div>
          <div className="flex items-end justify-between text-gray-200 px-12">
            <div className="flex gap-4 items-center">
              {!selectedVault && (
                <Stats
                  title="Your Spice TVL"
                  value={`Ξ${getUserTotalPosition().toFixed(2)}`}
                />
              )}
              {selectedVault && (
                <Stats
                  title="Position"
                  value={`Ξ${(selectedVault?.userPosition || 0).toFixed(2)}`}
                />
              )}
              {selectedVault && (
                <Stats
                  title={
                    selectedVault?.receiptToken === ReceiptToken.NFT
                      ? "Net APY"
                      : "APY"
                  }
                  value={`${(selectedVault?.apy || 0).toFixed(2)}%`}
                />
              )}
            </div>
            <div className="flex items-center tracking-normal text-xs gap-1 xl:gap-4 flex-col xl:flex-row">
              <div className="hidden 2xl:flex items-center gap-1">
                <span>1W Est. Yield:</span>
                <span className="text-white">Ξ25.60</span>
              </div>
              <div className="flex items-center gap-1">
                <span>1M Est. Yield:</span>
                <span className="text-white">Ξ25.60</span>
              </div>
              <div className="flex items-center gap-1">
                <span>1Y Est. Yield:</span>
                <span className="text-white">Ξ25.60</span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col-reverse lg:flex-row lg:gap-3 max-h-[calc(100%-96px)]">
            <div className="flex-1 relative w-[calc(59vw-100px)] lg:w-[calc(59vw-146px)]  max-h-[calc(100%-18px)] lg:max-h-[100%]">
              <PositionChart />
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
                      : "text-gray-200 border-gray-200 bg-gray-200"
                  }`}
                  onClick={() => setPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* vault details info */}
        <div className="flex gap-5 h-[37%] overflow-hidden p-1 -m-1">
          {selectedVault && selectedVault.receiptToken === ReceiptToken.NFT ? (
            <LoanExposure
              className="flex-1"
              small
              showIcon
              vault={selectedVault}
            />
          ) : (
            <MarketplaceExposure className="flex-1" vault={selectedVault} />
          )}
          <CombineExposure
            vault={selectedVault}
            hasToggle={
              selectedVault && selectedVault.receiptToken === ReceiptToken.NFT
            }
          />
        </div>
      </div>
    </div>
  );
}
