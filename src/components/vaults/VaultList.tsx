import Image from "next/image";
import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import { useState } from "react";
import { MarketplaceFilter, VaultFilter } from "@/types/common";
import { Button, Dropdown } from "@/components/common";
import CircleXSVG from "@/assets/icons/circleX.svg";
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
  const [marketplaceFilters, setMarketplaceFilters] = useState<
    MarketplaceFilter[]
  >([]);
  const [collectionFilters, setCollectionFilters] = useState<string[]>([]);

  return (
    <div className="hidden sm:flex flex-col text-white font-medium px-8 pt-[72px] pb-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-orange-200 font-bold text-shadow-orange-900">
          VAULT LIST
        </h1>
        <div className="hidden md:flex gap-6">
          <Dropdown
            className="w-[124px]"
            title={vaultFilter}
            values={[vaultFilter]}
            items={VAULT_FILTERS.filter((item) => item !== vaultFilter)}
            onChange={(item) => setVaultFilter(item as VaultFilter)}
          />
          <Dropdown
            className="w-[140px]"
            title={"Marketplaces"}
            values={marketplaceFilters}
            items={MARKETPLACE_FILTERS}
            multiple
            onChange={(items) =>
              setMarketplaceFilters(items as MarketplaceFilter[])
            }
          />
          <Dropdown
            className="w-[140px]"
            title={"Collections"}
            values={collectionFilters}
            items={COLLECTION_FILTERS}
            multiple
            onChange={(items) => setCollectionFilters(items as string[])}
          />
        </div>
      </div>

      {(marketplaceFilters.length !== 0 || collectionFilters.length !== 0) && (
        <div className="flex gap-4 flex-wrap items-center">
          <span className="text-base font-medium">23 results</span>
          {marketplaceFilters.map((item) => (
            <div
              key={item}
              className="bg-gray-500 rounded h-8 flex items-center text-xs font-medium pl-8 pr-2 gap-2"
            >
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
              className="bg-gray-500 rounded h-8 flex items-center text-xs font-medium pl-8 pr-2 gap-2"
            >
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
          <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200">
            <th className="text-left pl-1 lg:w-[35%] h-14">Vault</th>
            <th className="h-14">TVL</th>
            <th className="h-14">APY</th>
            <th className="hidden md:table-cell h-14">1d Change</th>
            <th className="hidden md:table-cell h-14">7d Change</th>
            <th className="h-14 hidden md:table-cell">Creator</th>
            <th className="h-14">Receipt</th>
            <th className="h-14 pr-1">Deposit</th>
          </tr>
        </thead>
        <tbody className="block max-h-[728px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
          {vaults.map((vault, index) => (
            <tr
              key={`vault-${index}`}
              onClick={() => onClickVault(vault, index)}
              className="vault-row table table-fixed w-full text-right cursor-pointer"
            >
              <td className="text-left lg:w-[35%] h-14">
                <div className="flex items-center gap-2 pl-1 h-10 rounded-l">
                  <Image src={vault.icon} width={20} height={20} alt="" />
                  {vault.name}
                </div>
              </td>
              <td className="h-14">
                <div className="h-10 flex items-center justify-end">
                  Ξ{vault.tvl}
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
