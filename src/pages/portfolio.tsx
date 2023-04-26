import { useState } from "react";
import Image from "next/image";
import vaults from "@/constants/vaults";
import { NotSupported } from "@/components";
import { Card, Dropdown } from "@/components/common";
import { PieChart, PositionChart } from "@/components/portfolio";
import prologueNfts from "@/constants/prologueNfts";
import marketplaceExposure from "@/constants/marketplaceExposure";
import collectionExposure from "@/constants/collectionExposure";
import {
  PeriodFilter,
  VaultExposureSortFilter,
  VaultNftsSortFilter,
} from "@/types/common";
import PositionSVG from "@/assets/icons/position.svg";
import CopySVG from "@/assets/icons/copy.svg";
import ExposureSVG from "@/assets/icons/exposure.svg";
import KeySVG from "@/assets/icons/key.svg";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import SearchSVG from "@/assets/icons/search.svg";
import { shortAddress } from "@/utils";
import {
  VAULT_EXPOSURE_SORT_FILTERS,
  VAULT_NFTS_SORT_FILTERS,
} from "@/constants";

export default function Portfolio() {
  const address = "0x8snD12tFeAcc7s23ase5339D8snD12tFeAcc7s9D";
  const [selectedPeriod, setPeriod] = useState(PeriodFilter.Week);

  const [vaultExposureSortFilter, setVaultExposureSortFilter] = useState(
    VaultExposureSortFilter.ApyHighToLow
  );
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );

  return (
    <div className="hidden sm:flex tracking-wide w-full h-min-[982px] mt-[84px] px-8 pb-5 gap-5">
      <div className="flex flex-col w-2/5 gap-5">
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
        <div className="flex flex-col gap-5 flex-1 max-h-[calc(max(982px,100vh)-264px)] h-[calc(max(982px,100vh)-264px)]">
          <Card className="gap-3 h-[calc(50%-10px)]">
            <div className="flex items-center gap-2.5">
              <ExposureSVG />
              <h2 className="font-bold text-white font-sm">VAULT EXPOSURE</h2>
            </div>
            <div className="flex items-center justify-between gap-5">
              <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
                <SearchSVG />
                <input
                  className="flex-1 font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
                  placeholder="Search your Vaults"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  // onFocus={handleFocus}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="hidden xl:flex flex-1 justify-end text-gray-200 font-medium text-xs">
                <Dropdown
                  className="w-[170px]"
                  dropdownClassName="bg-gray-700 bg-opacity-95"
                  title={vaultExposureSortFilter}
                  values={[vaultExposureSortFilter]}
                  items={VAULT_EXPOSURE_SORT_FILTERS.filter(
                    (item) => item !== vaultExposureSortFilter
                  )}
                  onChange={(item) =>
                    setVaultExposureSortFilter(item as VaultExposureSortFilter)
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <table className="text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
                <thead>
                  <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200">
                    <th className="text-left pl-1 lg:w-[35%] h-10">Vault</th>
                    <th className="h-10 hidden lg:table-cell">Position</th>
                    <th className="h-10 lg:hidden">Pos.</th>
                    <th className="h-10 hidden xl:table-cell">TVL</th>
                    <th className="h-10">APY</th>
                    <th className="h-10 hidden xl:table-cell">Receipt</th>
                    <th className="h-10 pr-1">Deposit</th>
                  </tr>
                </thead>
                <tbody className="block max-h-[calc((max(982px,100vh)-294px)/2-160px)] overflow-y-hidden hover:overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                  {vaults.map((vault, index) => (
                    <tr
                      key={`vault-${index}`}
                      className="vault-row table table-fixed w-full text-right cursor-pointer"
                    >
                      <td className="text-left lg:w-[35%] h-10">
                        <div className="flex items-center gap-2 pl-1">
                          <Image
                            src={vault.icon}
                            width={16}
                            height={16}
                            alt=""
                          />
                          {vault.name}
                        </div>
                      </td>
                      <td className="h-10">Ξ2</td>
                      <td className="h-10 hidden xl:table-cell">
                        Ξ{vault.tvl}
                      </td>
                      <td className="h-10">{vault.apy}%</td>
                      <td className="h-10 hidden xl:table-cell">
                        {vault.receiptToken}
                      </td>
                      <td className="h-10 pr-1">
                        <button className="border-1 border-orange-900 rounded p-1 bg-orange-900 bg-opacity-10 shadow-orange-900">
                          <span className="text-xs text-orange-900">
                            DEPOSIT
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="gap-5 h-[calc(50%-10px)]">
            <div className="flex items-center gap-2.5">
              <KeySVG />
              <h2 className="font-bold text-white font-sm">VAULT NFTS</h2>
            </div>
            <div className="flex items-center justify-between gap-5">
              <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
                <SearchSVG />
                <input
                  className="flex-1 font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
                  placeholder="Search your NFTs"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  // onFocus={handleFocus}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="hidden xl:flex flex-1 justify-end text-gray-200 font-medium text-xs">
                <Dropdown
                  className="w-[170px]"
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
              <span className="font-medium text-white text-xs">
                Prologue NFT
              </span>
              <div className="flex flex-wrap gap-y-3 gap-x-[1%] overflow-y-auto custom-scroll">
                {prologueNfts.map((nft, idx) => (
                  <div
                    key={`prologue-nft-${idx}`}
                    className={`rounded flex flex-col text-orange-200 text-shadow-orange-200 font-bold w-[calc(98%/3)] lg:w-[calc(97%/4)] xl:w-[calc(96%/5)] 3xl:w-[calc(95%/6)] border-1 ${
                      nft.featured ? "border-orange-200" : "border-transparent"
                    }`}
                  >
                    <div
                      className="flex flex-col w-full bg-cover aspect-square relative justify-center"
                      style={{
                        backgroundImage: `url(${nft.icon})`,
                      }}
                    >
                      {nft.featured && (
                        <Image
                          className="absolute top-0"
                          src="/assets/icons/circle-dot.svg"
                          width={15}
                          height={15}
                          alt=""
                        />
                      )}
                      {nft.featured && (
                        <span className="text-center font-bold text-xs md:text-sm xl:text-base">
                          [LEVERED]
                          <br />
                          Net APY: {nft.apy}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between h-6 bg-gray-700 text-xs p-2">
                      <span>#{nft.rank}</span>
                      <span>Ξ{nft.tvl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-5 max-h-[calc(max(982px,100vh)-164px)] h-[calc(max(982px,100vh)-164px)]">
        <Card className="gap-3 flex-1">
          <div className="flex items-center gap-2.5">
            <PositionSVG />
            <h2 className="font-bold text-white font-sm">
              TOTAL SPICE POSITION
            </h2>
          </div>
          <div className="flex items-end justify-between text-gray-200 pl-11 pr-12">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Your Spice TVL</span>
              <span className="font-bold text-xl text-orange-200">Ξ30.00</span>
            </div>
            <div className="flex items-center text-xs gap-1 xl:gap-4 flex-col xl:flex-row">
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
          <div className="flex flex-1 flex-col-reverse lg:flex-row">
            <div className="flex-1 relative w-[50vw]">
              <PositionChart />
            </div>
            <div className="flex lg:flex-col gap-5.5 justify-center">
              {[
                PeriodFilter.Day,
                PeriodFilter.Week,
                PeriodFilter.Month,
                PeriodFilter.Year,
                PeriodFilter.All,
              ].map((period) => (
                <button
                  key={period}
                  className={`border-1 px-2.5 rounded text-xs bg-opacity-10 ${
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
        <div className="flex gap-5">
          <Card className="flex-1 gap-3">
            <div className="flex items-center gap-2.5">
              <MarketExposureSVG />
              <h2 className="font-bold text-white font-sm">
                MARKETPLACE EXPOSURE
              </h2>
            </div>
            <div className="flex gap-2.5">
              <table className="flex-1 text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
                <thead>
                  <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200">
                    <th className="text-left pl-1 h-10 w-[80%]">Marketplace</th>
                    <th className="h-10 pr-1">%</th>
                  </tr>
                </thead>
                <tbody className="block max-h-[240px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                  {marketplaceExposure.map((exposure, index) => (
                    <tr
                      key={`vault-${index}`}
                      className="vault-row table table-fixed w-full text-right"
                    >
                      <td className="text-left h-10 w-[80%]">
                        <div className="flex items-center gap-2 pl-1">
                          <div
                            className="rounded w-3 h-3"
                            style={{
                              backgroundColor: exposure.color,
                            }}
                          />
                          <span>{exposure.name}</span>
                        </div>
                      </td>
                      <td className="h-10  pr-1">{exposure.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="hidden xl:flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
                <PieChart
                  data={marketplaceExposure.map((item) => ({
                    name: item.name,
                    value: item.percent,
                    color: item.color,
                  }))}
                />
              </div>
            </div>
          </Card>
          <Card className="flex-1 gap-3">
            <div className="flex items-center gap-2.5">
              <UserSVG />
              <h2 className="font-bold text-white font-sm">
                COLLECTION EXPOSURE
              </h2>
            </div>
            <div className="flex gap-2.5">
              <table className="flex-1 text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
                <thead>
                  <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200">
                    <th className="text-left pl-1 h-10 w-[80%]">Collection</th>
                    <th className="h-10 pr-1">%</th>
                  </tr>
                </thead>
                <tbody className="block max-h-[240px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                  {collectionExposure.map((exposure, index) => (
                    <tr
                      key={`vault-${index}`}
                      className="vault-row table table-fixed w-full text-right"
                    >
                      <td className="text-left h-10 w-[80%]">
                        <div className="flex items-center gap-2 pl-1">
                          <div
                            className="rounded w-3 h-3"
                            style={{
                              backgroundColor: exposure.color,
                            }}
                          />
                          {exposure.name}
                        </div>
                      </td>
                      <td className="h-10 pr-1">{exposure.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="hidden xl:flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
                <PieChart
                  data={collectionExposure.map((item) => ({
                    name: item.name,
                    value: item.percent,
                    color: item.color,
                  }))}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <NotSupported />
    </div>
  );
}
