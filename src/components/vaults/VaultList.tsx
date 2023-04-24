import Image from "next/image";
import { Listbox } from "@headlessui/react";
import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import { useState } from "react";
import { MarketplaceFilter, VaultFilter } from "@/types/common";
import { Button } from "@/components/common";
import { FaChevronDown } from "react-icons/fa";
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
  const [marketplaceFilter, setMarketplaceFilter] = useState<
    MarketplaceFilter | undefined
  >();
  const [collectionFilter, setCollectionFilter] = useState<
    string | undefined
  >();

  return (
    <div className="hidden sm:flex flex-col text-white font-medium px-8 pt-[72px] pb-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-orange-200 font-bold text-shadow-orange-200">
          VAULT LIST
        </h1>
        <div className="hidden md:flex gap-6">
          <div className="relative">
            <Listbox value={vaultFilter} onChange={setVaultFilter}>
              <Listbox.Button className="w-[124px] h-8 px-3 border-1 text-left rounded border-gray-200 flex items-center justify-between text-xs text-white">
                {vaultFilter}
                <FaChevronDown />
              </Listbox.Button>
              <Listbox.Options className="absolute w-[124px] top-10 px-3 text-xs text-white bg-gray-700 bg-opacity-45 border-1 border-orange-50 px-2 rounded">
                {VAULT_FILTERS.map((filter) => (
                  <Listbox.Option
                    className="h-8 flex items-center cursor-pointer"
                    key={filter}
                    value={filter}
                  >
                    {filter}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
          <div className="relative">
            <Listbox value={marketplaceFilter} onChange={setMarketplaceFilter}>
              <Listbox.Button className="w-[140px] h-8 px-3 border-1 text-left rounded border-gray-200 flex items-center justify-between text-xs text-white">
                {marketplaceFilter ?? "Marketplaces"}
                <FaChevronDown />
              </Listbox.Button>

              <Listbox.Options className="absolute w-[140px] top-10 px-3 text-xs text-white bg-gray-700 bg-opacity-45 border-1 border-orange-50 px-2 rounded">
                {MARKETPLACE_FILTERS.map((filter) => (
                  <Listbox.Option
                    className="h-8 flex items-center cursor-pointer"
                    key={filter}
                    value={filter}
                  >
                    {filter}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>

          <div className="relative">
            <Listbox value={collectionFilter} onChange={setCollectionFilter}>
              <Listbox.Button className="w-[140px] h-8 px-3 border-1 text-left rounded border-gray-200 flex items-center justify-between text-xs text-white">
                {collectionFilter ?? "Collections"}
                <FaChevronDown />
              </Listbox.Button>

              <Listbox.Options className="absolute w-[140px] max-h-[320px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 top-10 px-3 text-xs text-white bg-gray-700 bg-opacity-45 border-1 border-orange-50 px-2 rounded">
                {COLLECTION_FILTERS.map((filter) => (
                  <Listbox.Option
                    className="h-8 flex items-center cursor-pointer"
                    key={filter}
                    value={filter}
                  >
                    {filter}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
      </div>

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
                <div className="flex items-center gap-2 pl-1">
                  <Image src={vault.icon} width={20} height={20} alt="" />
                  {vault.name}
                </div>
              </td>
              <td className="h-14">Ξ{vault.tvl}</td>
              <td className="h-14">{vault.apy}%</td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.oneDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                {vault.oneDayChange >= 0
                  ? "+" + vault.oneDayChange
                  : vault.oneDayChange}
                %
              </td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.sevenDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                {vault.sevenDayChange >= 0
                  ? "+" + vault.sevenDayChange
                  : vault.sevenDayChange}
                %
              </td>
              <td className="h-14 hidden md:table-cell">{vault.creator}</td>
              <td className="h-14">{vault.receiptToken}</td>
              <td className="h-14">
                <div className="flex justify-end items-center pr-1">
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
