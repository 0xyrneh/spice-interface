import { useState } from "react";
import Image from "next/image";
import vaults from "@/constants/vaults";
import {
  Button,
  Card,
  PrologueNftCard,
  Select,
  Stats,
  Table,
} from "@/components/common";
import { PositionChart } from "@/components/portfolio";
import prologueNfts from "@/constants/prologueNfts";
import { PeriodFilter, VaultNftsSortFilter } from "@/types/common";
import PositionSVG from "@/assets/icons/position.svg";
import CopySVG from "@/assets/icons/copy.svg";
import ExposureSVG from "@/assets/icons/exposure.svg";
import KeySVG from "@/assets/icons/key.svg";
import SearchSVG from "@/assets/icons/search.svg";
import { shortAddress } from "@/utils";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { TableRowInfo } from "@/components/common/Table";
import { Vault } from "@/types/vault";
import { Exposure, LoanBreakdown } from "@/components/vaults";

export default function Portfolio() {
  const address = "0x8snD12tFeAcc7s23ase5339D8snD12tFeAcc7s9D";
  const [vault, setVault] = useState<Vault>();
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);

  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `VAULTS [${vaults.length}]`,
        key: "name",
        itemPrefix: (item) => (
          <Image
            className="mr-2"
            src={item.icon}
            width={20}
            height={20}
            alt=""
          />
        ),
        rowClass: () => "lg:w-[35%]",
      },
      {
        title: "POSITION",
        key: "position",
        rowClass: () => "hidden lg:table-cell",
        itemPrefix: () => "Ξ",
      },
      {
        title: "POS.",
        key: "position",
        rowClass: () => "lg:hidden",
        itemPrefix: () => "Ξ",
      },
      {
        title: "TVL",
        key: "tvl",
        rowClass: () => "hidden 2xl:table-cell",
        itemPrefix: () => "Ξ",
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
      },
      {
        title: "RECEIPT",
        key: "receiptToken",
        rowClass: () => "hidden xl:table-cell",
      },
      {
        title: "DETAILS",
        noSort: true,
        component: () => (
          <Button type="secondary" className="p-1">
            <span className="text-xs">DETAILS</span>
          </Button>
        ),
      },
      {
        title: "DEPOSIT",
        noSort: true,
        component: () => (
          <Button type="primary" className="p-1">
            <span className="text-xs">DEPOSIT</span>
          </Button>
        ),
      },
    ];
  };

  return (
    <div className="relative hidden md:flex tracking-wide w-full min-h-[838px] max-h-[calc(max(982px,100vh)-144px)] mt-[84px] px-8 pb-5 gap-5 overflow-y-hidden">
      <div className="flex flex-col min-w-[41%] w-[41%] gap-5">
        <Card className="py-3 !flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-5 flex-1">
            <Image
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
        <Card className="gap-3 overflow-hidden">
          <div className="flex items-center gap-2.5">
            <ExposureSVG />
            <h2 className="font-bold text-white font-sm">VAULT EXPOSURE</h2>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="hidden xl:flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
              <SearchSVG />
              <input
                className="flex-1 text-white font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
                placeholder="Search your Vaults"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
              />
            </div>
            <Button
              type="third"
              className="flex-1 xl:flex-none xl:w-[170px] h-8 text-xs"
              onClick={() => setVault(undefined)}
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
        <Card className="gap-5 overflow-hidden max-h-[370px]">
          <div className="flex items-center gap-2.5">
            {vault && <Image src={vault.icon} width={16} height={16} alt="" />}
            <KeySVG />
            <h2 className="font-bold text-white font-sm">
              {vault ? "YOUR PROLOGUE NFTS" : "VAULT NFTS"}{" "}
            </h2>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
              <SearchSVG />
              <input
                className="flex-1 text-white font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
                placeholder="Search your NFTs"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
              />
            </div>
            <div className="hidden xl:flex flex-1 justify-end text-gray-200 font-medium text-xs">
              <Select
                className="w-[170px]"
                itemClassName="text-gray-200 hover:text-gray-300"
                dropdownClassName="bg-gray-700 bg-opacity-95"
                title={vaultNftsSortFilter}
                values={[vaultNftsSortFilter]}
                items={VAULT_NFTS_SORT_FILTERS.filter(
                  (item) => item !== vaultNftsSortFilter
                )}
                onChange={(item) =>
                  setVaultNftsSortFilter(item as VaultNftsSortFilter)
                }
              />
            </div>
          </div>
          <div className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 overflow-y-hidden">
            <span className="font-medium text-white text-xs">Prologue NFT</span>
            <div className="flex flex-wrap gap-y-3 gap-x-[0.5%] overflow-y-auto custom-scroll">
              {prologueNfts.map((nft, idx) => (
                <PrologueNftCard
                  key={`prologue-nft-${idx}`}
                  nft={nft}
                  className="w-[calc(99%/3)] lg:w-[calc(98.5%/4)] xl:w-[calc(98%/5)] 3xl:w-[calc(97.5%/6)]"
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col flex-1 gap-5">
        <Card className="gap-3 flex-1 overflow-hidden">
          <div className="flex items-center gap-2.5">
            {vault && <Image src={vault.icon} width={16} height={16} alt="" />}
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
              {vault && <Stats title="Net APY" value={`${vault.apy}%`} />}
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
        <div className="flex gap-5 max-h-[319px]">
          {vault ? (
            <LoanBreakdown className="flex-1" showIcon vault={vault} />
          ) : (
            <Exposure className="flex-1" showMarketplace />
          )}
          <Exposure
            className="flex-1"
            showCollection
            showMarketplace={!!vault}
            vault={vault}
          />
        </div>
      </div>
    </div>
  );
}
