import Image from "next/image";
import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import { useEffect, useState } from "react";
import { VaultFilter } from "@/types/common";
import { Button, Dropdown, Search, Select, Table } from "@/components/common";
import CircleXSVG from "@/assets/icons/circleX.svg";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import CheckedSVG from "@/assets/icons/checked.svg";
import UncheckedSVG from "@/assets/icons/unchecked.svg";
import {
  MARKETPLACE_FILTERS,
  VAULT_FILTERS,
  COLLECTION_FILTERS,
} from "@/constants";
import { TableRowInfo } from "../common/Table";
import { useUI } from "@/hooks";

type Props = {
  onClickVault: (vault: Vault) => void;
};

const VaultList = ({ onClickVault }: Props) => {
  const { showDepositModal } = useUI();

  const [vaultFilter, setVaultFilter] = useState(VaultFilter.All);
  const [marketplaceFilters, setMarketplaceFilters] = useState<string[]>([]);
  const [collectionFilters, setCollectionFilters] = useState<string[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>(vaults);
  const [filterOpened, setFilterOpened] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `VAULT [${filteredVaults.length}]`,
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
        rowClass: () => "lg:w-[35%]",
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
      },
      {
        title: "1D CHANGE",
        key: "oneDayChange",
        rowClass: () => "hidden md:table-cell",
        itemSuffix: () => "%",
        itemClass: (item) =>
          item.oneDayChange >= 0 ? "text-green" : "text-red",
      },
      {
        title: "7D CHANGE",
        key: "sevenDayChange",
        rowClass: () => "hidden md:table-cell",
        itemSuffix: () => "%",
        itemClass: (item) =>
          item.sevenDayChange >= 0 ? "text-green" : "text-red",
      },
      {
        title: "TVL",
        key: "tvl",
        itemPrefix: () => "Ξ",
      },
      {
        title: "CREATOR",
        key: "creator",
        rowClass: () => "hidden md:table-cell",
      },
      {
        title: "RECEIPT",
        key: "receiptToken",
      },
      {
        title: "DEPOSIT",
        noSort: true,
        component: (item) => (
          <Button
            type="primary"
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              showDepositModal(item);
            }}
          >
            <span className="text-xs font-bold">DEPOSIT</span>
          </Button>
        ),
      },
    ];
  };

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
            <Search
              placeholder="Filter Vaults"
              className={filterOpened ? "rounded-b-none" : ""}
              onFocus={() => setFilterOpened(true)}
              onChange={setFilterQuery}
            />
            <div className="bg-black border-x-1 border-b-1 border-gray-300 rounded-b px-3 py-[7px] text-xs max-h-[356px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
              {MARKETPLACE_FILTERS.filter(
                (item) =>
                  item.toLowerCase().includes(filterQuery.toLowerCase()) &&
                  !marketplaceFilters.includes(item)
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
              {COLLECTION_FILTERS.filter(
                (item) =>
                  item.toLowerCase().includes(filterQuery.toLowerCase()) &&
                  !collectionFilters.includes(item)
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

      <Table
        rowInfos={getRowInfos()}
        items={filteredVaults}
        trStyle="h-14"
        rowStyle="h-10"
        defaultSortKey="apy"
        bodyClass="max-h-[528px]"
        onClickItem={onClickVault}
      />
    </div>
  );
};

export default VaultList;
