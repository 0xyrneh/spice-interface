import { useState } from "react";
import Image from "next/image";
import vaults from "@/constants/vaults";
import { Button, Card, Search, Stats, Table } from "@/components/common";
import { PositionChart } from "@/components/portfolio";
import { PeriodFilter } from "@/types/common";
import PositionSVG from "@/assets/icons/position.svg";
import CopySVG from "@/assets/icons/copy.svg";
import ExposureSVG from "@/assets/icons/exposure.svg";
import { shortAddress } from "@/utils";
import { TableRowInfo } from "@/components/common/Table";
import { ReceiptToken, Vault } from "@/types/vault";
import { Exposure, LoanBreakdown } from "@/components/vaults";
import VaultNfts from "@/components/vaults/VaultNfts";

export default function Portfolio() {
  const address = "0x8snD12tFeAcc7s23ase5339D8snD12tFeAcc7s9D";
  const [vault, setVault] = useState<Vault>();
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `VAULTS [${vaults.length}]`,
        key: "name",
        itemPrefix: (item) => (
          <Image
            className="mr-2 border-1 border-gray-200 rounded-full"
            src={item.icon}
            width={20}
            height={20}
            alt=""
          />
        ),
      },
      {
        title: "POSITION",
        key: "position",
        rowClass: () => "hidden lg:table-cell w-[85px]",
        itemPrefix: () => "Ξ",
      },
      {
        title: "TVL",
        key: "tvl",
        rowClass: () => "hidden 3xl:table-cell  w-[75px]",
        itemPrefix: () => "Ξ",
      },
      {
        title: "APY",
        key: "apy",
        rowClass: () => "hidden xl:table-cell w-[75px]",
        itemSuffix: () => "%",
      },
      {
        title: "RECEIPT",
        key: "receiptToken",
        rowClass: () => "hidden 2xl:table-cell  w-[75px]",
      },
      {
        title: "DETAILS",
        noSort: true,
        rowClass: () => "w-[70px]",
        component: () => (
          <Button type="secondary" className="px-1 h-[22px]">
            <span className="text-xs font-bold">DETAILS</span>
          </Button>
        ),
      },
      {
        title: "DEPOSIT",
        noSort: true,
        rowClass: () => "w-[70px]",
        component: () => (
          <Button type="primary" className="px-1 h-[22px]">
            <span className="text-xs font-bold">DEPOSIT</span>
          </Button>
        ),
      },
    ];
  };

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[41%] w-[41%] gap-5 pt-1">
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
              {shortAddress(address, 18, -16)}
            </span>
            <span className="hidden lg:flex 3xl:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
              {shortAddress(address, 10, -10)}
            </span>
            <span className="lg:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
              {shortAddress(address, 10, address.length)}
            </span>
          </div>
          <button className="min-w-[24px] min-w-[24px]">
            <CopySVG />
          </button>
        </Card>
        <Card className="gap-3 overflow-hidden min-h-[379px] flex-1">
          <div className="flex items-center gap-2.5">
            <ExposureSVG />
            <h2 className="font-bold text-white font-sm">SELECT YOUR VAULT</h2>
          </div>
          <div className="flex items-center justify-between gap-5">
            <Search
              placeholder="Search your Vaults"
              className="hidden xl:flex flex-1 xl:flex-none"
            />
            <Button
              type={!vault ? "third" : "secondary"}
              className="flex-1 xl:flex-none xl:w-[170px] h-8 text-xs font-bold"
              onClick={() => setVault(undefined)}
              disabled={!vault}
            >
              TOTAL SPICE POSITION
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Table
              className="block h-full"
              rowInfos={getRowInfos()}
              items={vaults.map((vault) => ({
                ...vault,
                position: 2,
              }))}
              trStyle="h-10"
              rowStyle="h-8"
              defaultSortKey="apy"
              bodyClass="h-[calc(100%-40px)]"
              onClickItem={(item) => {
                setVault(item);
              }}
              isActive={(item) => {
                return !!vault && item.id === vault.id;
              }}
            />
          </div>
        </Card>
        <div className="max-h-[363px] overflow-y-hidden p-1 -m-1">
          {vault && vault.receiptToken === ReceiptToken.ERC20 ? (
            <LoanBreakdown
              vault={vault}
              showIcon
              nonExpandedClassName="h-full"
            />
          ) : (
            <VaultNfts vault={vault} className="h-full" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-5 pt-1">
        <Card className="gap-3 flex-1 overflow-hidden min-h-[523px]">
          <div className="flex items-center gap-2.5">
            {vault && (
              <Image
                className="border-1 border-gray-200 rounded-full"
                src={vault.icon}
                width={16}
                height={16}
                alt=""
              />
            )}
            <PositionSVG />
            <h2 className="font-bold text-white font-sm">
              {vault
                ? `YOUR ${vault.name.toUpperCase()} POSITION`
                : "TOTAL SPICE POSITION"}
            </h2>
          </div>
          <div className="flex items-end justify-between text-gray-200 px-12">
            <div className="flex gap-4 items-center">
              {!vault && <Stats title="Your Spice TVL" value="Ξ30.00" />}
              {vault && <Stats title="Position" value="Ξ30.00" />}
              {vault && (
                <Stats
                  title={
                    vault.receiptToken === ReceiptToken.NFT ? "Net APY" : "APY"
                  }
                  value={`${vault.apy}%`}
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
        <div className="flex gap-5 max-h-[303px] overflow-hidden p-1 -m-1">
          {vault && vault.receiptToken !== ReceiptToken.ERC20 ? (
            <LoanBreakdown className="flex-1" small showIcon vault={vault} />
          ) : (
            <Exposure className="flex-1" showMarketplace vault={vault} />
          )}
          <Exposure
            className="flex-1"
            showCollection
            showMarketplace={vault && vault.receiptToken !== ReceiptToken.ERC20}
            vault={vault}
          />
        </div>
      </div>
    </div>
  );
}
