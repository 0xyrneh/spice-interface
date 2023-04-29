import Image from "next/image";
import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import { useEffect, useState } from "react";
import { MarketplaceFilter, VaultFilter } from "@/types/common";
import { Button, Dropdown, Select } from "@/components/common";
import CircleXSVG from "@/assets/icons/circleX.svg";
import SearchSVG from "@/assets/icons/search.svg";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import CheckedSVG from "@/assets/icons/checked.svg";
import UncheckedSVG from "@/assets/icons/unchecked.svg";
import SortDownSVG from "@/assets/icons/sort-down.svg";
import {
  MARKETPLACE_FILTERS,
  VAULT_FILTERS,
  COLLECTION_FILTERS,
} from "@/constants";

type Props = {
  onClickVault: (vault: Vault, index: number) => void;
};

const VaultList = ({ onClickVault }: Props) => {
  const [vaultFilter, setVaultFilter] = useState(VaultFilter.All);
  const [marketplaceFilters, setMarketplaceFilters] = useState<string[]>([]);
  const [collectionFilters, setCollectionFilters] = useState<string[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>(vaults);
  const [filterOpened, setFilterOpened] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    const _vaults =
      vaultFilter === VaultFilter.All
        ? vaults
        : vaults.filter((vault) => vault.type === vaultFilter);

    setFilteredVaults(_vaults);
  }, [vaultFilter]);

  const toggleMarketplaceFilter = (filter: string) => {
    const idx = marketplaceFilters.findIndex((_item) => _item === filter);
    if (idx === -1) {
      setMarketplaceFilters([...marketplaceFilters, filter]);
    } else {
      const newValues = [...marketplaceFilters];
      newValues.splice(idx, 1);
      setMarketplaceFilters(newValues);
    }
  };

  const toggleCollectionFilter = (filter: string) => {
    const idx = collectionFilters.findIndex((_item) => _item === filter);
    if (idx === -1) {
      setCollectionFilters([...collectionFilters, filter]);
    } else {
      const newValues = [...collectionFilters];
      newValues.splice(idx, 1);
      setCollectionFilters(newValues);
    }
  };

  return (
    <div className="hidden sm:flex flex-col text-white font-medium px-8 pt-[72px] pb-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-orange-200 font-bold text-shadow-orange-900">
          VAULT LIST
        </h1>
        <div className="hidden md:flex gap-6">
          <Select
            className="w-[124px]"
            itemClassName="text-white hover:text-orange-300"
            type="primary"
            title={vaultFilter}
            values={[vaultFilter]}
            items={VAULT_FILTERS.filter((item) => item !== vaultFilter)}
            onChange={(item) => setVaultFilter(item as VaultFilter)}
          />
          <Dropdown
            opened={filterOpened}
            onClose={() => setFilterOpened(false)}
          >
            <div
              className={`flex items-center gap-3 border-1 border-gray-200 h-8 px-3 ${
                filterOpened ? "rounded-t" : "rounded"
              }`}
            >
              <SearchSVG />
              <input
                className="text-xs font-medium bg-transparent outline-0 placeholder:text-gray-200 text-white"
                placeholder="Filter Vaults"
                onFocus={() => setFilterOpened(true)}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            <div className="bg-black border-x-1 border-b-1 border-gray-300 rounded-b px-3 py-[7px] text-xs max-h-[356px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
              {MARKETPLACE_FILTERS.filter((item) =>
                item.toLowerCase().includes(filterQuery.toLowerCase())
              ).map((filter) => (
                <button
                  key={`marketplace-filter-${filter}`}
                  className={`h-8 flex items-center gap-2 hover:text-gray-300 ${
                    marketplaceFilters.includes(filter)
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}
                  onClick={() => toggleMarketplaceFilter(filter)}
                >
                  {marketplaceFilters.includes(filter) ? (
                    <div className="w-min-[16px]">
                      <CheckedSVG className="w-4 h-[17px]" />
                    </div>
                  ) : (
                    <div className="w-min-[16px]">
                      <UncheckedSVG className="w-4 h-[17px]" />
                    </div>
                  )}
                  <MarketExposureSVG />
                  <span>{filter}</span>
                </button>
              ))}
              {COLLECTION_FILTERS.filter((item) =>
                item.toLowerCase().includes(filterQuery.toLowerCase())
              ).map((filter) => (
                <button
                  key={`collection-filter-${filter}`}
                  className={`h-8 flex items-center gap-2 hover:text-gray-300 ${
                    marketplaceFilters.includes(filter)
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}
                  onClick={() => toggleCollectionFilter(filter)}
                >
                  {collectionFilters.includes(filter) ? (
                    <div className="w-min-[16px]">
                      <CheckedSVG className="w-4 h-[17px]" />
                    </div>
                  ) : (
                    <div className="w-min-[16px]">
                      <UncheckedSVG className="w-4 h-[17px]" />
                    </div>
                  )}
                  <UserSVG />
                  <span>{filter}</span>
                </button>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>

      {(marketplaceFilters.length !== 0 || collectionFilters.length !== 0) && (
        <div className="flex gap-4 flex-wrap items-center">
          <span className="text-base font-medium">23 results</span>
          {marketplaceFilters.map((item) => (
            <div
              key={item}
              className="bg-gray-500 rounded h-8 flex items-center text-warm-gray-50 text-xs font-medium px-2 gap-2"
            >
              <MarketExposureSVG className="text-white" />
              {item}
              <button
                onClick={() => {
                  const idx = marketplaceFilters.findIndex(
                    (_item) => _item === item
                  );
                  if (idx !== -1) {
                    const newValues = [...marketplaceFilters];
                    newValues.splice(idx, 1);
                    setMarketplaceFilters(newValues);
                  }
                }}
              >
                <CircleXSVG />
              </button>
            </div>
          ))}
          {collectionFilters.map((item) => (
            <div
              key={item}
              className="bg-gray-450 bg-opacity-90 rounded h-8 flex items-center text-warm-gray-50 text-xs font-medium px-2 gap-2"
            >
              <UserSVG className="text-white" />
              {item}
              <button
                onClick={() => {
                  const idx = collectionFilters.findIndex(
                    (_item) => _item === item
                  );
                  if (idx !== -1) {
                    const newValues = [...collectionFilters];
                    newValues.splice(idx, 1);
                    setCollectionFilters(newValues);
                  }
                }}
              >
                <CircleXSVG />
              </button>
            </div>
          ))}
        </div>
      )}

      <table className="text-white text-xs border-y-1 border-y-gray-200">
        <thead>
          <tr className="table table-fixed w-full text-gray-250 text-right border-b-1 border-b-gray-200">
            <th className="text-left pl-1 lg:w-[35%] h-14">VAULT</th>
            <th className="h-14">
              <div className="flex items-center justify-end text-orange-200">
                APY
                <SortDownSVG />
              </div>
            </th>
            <th className="hidden md:table-cell h-14">1D CHANGE</th>
            <th className="hidden md:table-cell h-14">7D CHANGE</th>
            <th className="h-14">TVL</th>
            <th className="h-14 hidden md:table-cell">CREATOR</th>
            <th className="h-14">RECEIPT</th>
            <th className="h-14 pr-1">DEPOSIT</th>
          </tr>
        </thead>
        <tbody className="block max-h-[728px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
          {filteredVaults.map((vault, index) => (
            <tr
              key={`vault-${index}`}
              onClick={() => onClickVault(vault, index)}
              className="vault-row table table-fixed w-full text-right cursor-pointer"
            >
              <td className="text-left lg:w-[35%] h-14">
                <div className="flex items-center gap-2 pl-1 h-10 rounded-l">
                  <Image src={vault.icon} width={20} height={20} alt="" />
                  <span className="whitespace-nowrap overflow-hidden w-full text-ellipsis">
                    {vault.name}
                  </span>
                </div>
              </td>
              <td className="h-14">
                <div className="h-10 flex items-center justify-end">
                  {vault.apy}%
                </div>
              </td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.oneDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                <div className="h-10 flex items-center justify-end">
                  {vault.oneDayChange >= 0
                    ? "+" + vault.oneDayChange
                    : vault.oneDayChange}
                  %
                </div>
              </td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.sevenDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                <div className="h-10 flex items-center justify-end">
                  {vault.sevenDayChange >= 0
                    ? "+" + vault.sevenDayChange
                    : vault.sevenDayChange}
                  %
                </div>
              </td>
              <td className="h-14">
                <div className="h-10 flex items-center justify-end">
                  Ξ{vault.tvl}
                </div>
              </td>
              <td className="h-14 hidden md:table-cell">
                <div className="h-10 flex items-center justify-end">
                  {vault.creator}
                </div>
              </td>
              <td className="h-14">
                <div className="h-10 flex items-center justify-end">
                  {vault.receiptToken}
                </div>
              </td>
              <td className="h-14">
                <div className="h-10 flex justify-end items-center pr-1 rounded-r">
                  <Button type="primary" className="p-1">
                    <span className="text-xs">DEPOSIT</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultList;
