import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import moment from "moment";

// import vaults from "@/constants/vaults";
import { VaultInfo } from "@/types/vault";
import { useEffect, useState } from "react";
import { VaultFilter } from "@/types/common";
import { Button, Dropdown, Search, Select, Table } from "@/components/common";
import { useAppSelector } from "@/state/hooks";
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
import { useUI } from "@/hooks";
import { TableRowInfo } from "../common/Table";
import { activeChainId } from "@/utils/web3";

type Props = {
  onClickVault: (vault: VaultInfo) => void;
};

const VaultList = ({ onClickVault }: Props) => {
  const [vaultFilter, setVaultFilter] = useState(VaultFilter.All);
  const [marketplaceFilters, setMarketplaceFilters] = useState<string[]>([]);
  const [collectionFilters, setCollectionFilters] = useState<string[]>([]);
  const [filterOpened, setFilterOpened] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { showDepositModal, showConnectModal } = useUI();
  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);
  const { account } = useWeb3React();

  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false);
    }, 3000);
  }, []);

  const getWeeklyReturn = (historyData: any[]) => {
    if (historyData.length === 0) return { oneDayReturn: 0, sevenDayReturn: 0 };

    const latestRecord = historyData.slice(-1)[0];
    const oneDayBeforeTimestamp = moment(latestRecord.time)
      .subtract(1, "d")
      .valueOf();
    const oneWeekBeforeTimestamp = moment(latestRecord.time)
      .subtract(7, "d")
      .valueOf();

    let oneDayNearHisRecord: any = { time: 0, assetPerShare: 0 };
    let oneWeekNearHisRecord: any = { time: 0, assetPerShare: 0 };
    historyData.map((row: any) => {
      if (
        Math.abs(row.time - oneDayBeforeTimestamp) <
        Math.abs(oneDayNearHisRecord.time - oneDayBeforeTimestamp)
      ) {
        oneDayNearHisRecord = row;
      }
      if (
        Math.abs(row.time - oneWeekBeforeTimestamp) <
        Math.abs(oneWeekNearHisRecord.time - oneWeekBeforeTimestamp)
      ) {
        oneWeekNearHisRecord = row;
      }
      return row;
    });

    let oneDayReturn = 0;
    let sevenDayReturn = 0;

    if (oneDayNearHisRecord.assetPerShare > 0) {
      oneDayReturn =
        latestRecord.assetPerShare / oneDayNearHisRecord.assetPerShare - 1;
    }

    if (oneWeekNearHisRecord.assetPerShare > 0) {
      sevenDayReturn =
        latestRecord.assetPerShare / oneWeekNearHisRecord.assetPerShare - 1;
    }

    return {
      oneDayReturn: 100 * oneDayReturn,
      sevenDayReturn: 100 * sevenDayReturn,
    };

    // TODO: yearly apy: [Deprecated]
    // const timeDiff = moment.duration(moment(latestRecord.time).diff(nearHisRecord.time));
    // const dayDiff = timeDiff.asDays() % 24;

    // if (nearHisRecord.assetPerShare > 0 && dayDiff > 0) {
    //   // eslint-disable-next-line no-restricted-properties
    //   const dailyApy = Math.pow(latestRecord.assetPerShare / nearHisRecord.assetPerShare, 1 / dayDiff) - 1;
    //   // eslint-disable-next-line no-restricted-properties
    //   const yearlyApy = Math.pow(1 + dailyApy, 365) - 1;

    //   return 100 * yearlyApy;
    // }
  };

  const vaults = vaultsOrigin.map((vault) => {
    // day return logic
    const historicalRecords = vault?.historicalRecords || [];
    const graphField =
      activeChainId === 1 ? "assets_per_share" : "expected_return";

    const historyData = historicalRecords
      .map((row) => ({
        time: 1000 * Number(row.time) || 0,
        assetPerShare:
          (activeChainId === 1 ? 1 : 100) *
          (row?.okrs && row?.okrs[graphField] ? row?.okrs[graphField] : 0),
      }))
      .reverse();

    return {
      ...vault,
      apy: Math.max(vault.apy ?? 0, vault.historicalApy ?? 0),
      oneDayReturn: getWeeklyReturn(historyData).oneDayReturn,
      sevenDayReturn: getWeeklyReturn(historyData).sevenDayReturn,
    };
  });

  const getFilteredVaults = () => {
    let filtered = vaults;
    if (vaultFilter !== VaultFilter.All) {
      filtered = vaults.filter((vault) => vault.category === vaultFilter);
    }

    if (marketplaceFilters.length > 0) {
      filtered = filtered.filter(
        (vault) =>
          (vault.marketplaceExposures || []).findIndex(
            (exposure) => marketplaceFilters.indexOf(exposure.name) > -1
          ) > -1
      );
    }

    if (collectionFilters.length > 0) {
      filtered = filtered.filter(
        (vault) =>
          (vault.collectionExposures || []).findIndex(
            (exposure) => collectionFilters.indexOf(exposure.name) > -1
          ) > -1
      );
    }

    return filtered;
  };

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title:
          filteredVaults.length > 1
            ? `VAULTS [${filteredVaults.length}]`
            : `VAULT [${filteredVaults.length}]`,
        key: "readable",
        itemPrefix: (item) => (
          <Image
            className="mr-2 border-1 border-gray-200 rounded-full"
            src={item.logo}
            width={20}
            height={20}
            alt=""
          />
        ),
        rowClass: () => "lg:w-[35%]",
        format: (item) => {
          return `${item?.readable || ""} ${
            item?.deprecated ? "[WITHDRAW ONLY]" : ""
          }`;
        },
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
        format: (item) => {
          return (item?.apy || 0).toFixed(2);
        },
      },
      {
        title: "1D RETURN",
        key: "oneDayReturn",
        rowClass: () => "hidden md:table-cell",
        itemSuffix: () => "%",
        itemClass: (item) =>
          item.oneDayReturn >= 0 ? "text-green" : "text-red",
        format: (item) => {
          return (item?.oneDayReturn || 0).toFixed(2);
        },
      },
      {
        title: "7D RETURN",
        key: "sevenDayChange",
        rowClass: () => "hidden md:table-cell",
        itemSuffix: () => "%",
        itemClass: (item) =>
          item.sevenDayReturn >= 0 ? "text-green" : "text-red",
        format: (item) => {
          return (item?.sevenDayReturn || 0).toFixed(2);
        },
      },
      {
        title: "TVL",
        key: "tvl",
        itemPrefix: () => "Ξ",
        format: (item) => {
          return (item?.tvl || 0).toFixed(2);
        },
      },
      {
        title: "CREATOR",
        key: "sponsor",
        rowClass: () => "hidden md:table-cell",
        format: (item) => {
          return item?.sponsor || "SPICE";
        },
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
              if (account) {
                showDepositModal({ vault: item });
              } else {
                showConnectModal();
              }
            }}
          >
            <span className="text-xs font-bold">
              {account ? (item.deprecated ? "WITHDRAW" : "DEPOSIT") : "CONNECT"}
            </span>
          </Button>
        ),
      },
    ];
  };

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

  const filteredVaults = getFilteredVaults();

  return (
    <div className="hidden sm:flex flex-col text-white font-medium px-8 pt-[60px] pb-[60px] gap-4">
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
          <span className="text-base font-medium">
            {marketplaceFilters.length + collectionFilters.length} results
          </span>
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
        bodyClass="max-h-[528px] min-h-[224px] h-[224px]"
        isLoading={isFetching}
        walletConnectRequired={false}
        onClickItem={onClickVault}
      />
    </div>
  );
};

export default VaultList;
