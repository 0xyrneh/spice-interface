import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import vaults from "@/constants/vaults";
import nfts from "@/constants/nfts";
import { Vault, Nft } from "@/types/vault";
import SearchSVG from "@/assets/icons/search.svg";
import { VaultFilter } from "@/types/common";
import Dropdown from "./Dropdown";

const VaultSearch = () => {
  const router = useRouter();

  const [opened, setOpened] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVipVaults, setFilteredVipVaults] = useState<Vault[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<Nft[]>([]);

  useEffect(() => {
    if (!opened) setSearchQuery("");
  }, [opened]);

  useEffect(() => {
    setFilteredVipVaults(
      vaults
        .filter(
          (vault) =>
            vault.type === VaultFilter.VIP &&
            vault.name
              .toLowerCase()
              .trim()
              .includes(searchQuery.toLowerCase().trim())
        )
        .sort((a, b) => {
          if (a.tvl < b.tvl) return 1;
          return -1;
        })
        .slice(0, 5)
    );

    setFilteredVaults(
      vaults
        .filter(
          (vault) =>
            vault.type === VaultFilter.Public &&
            vault.name
              .toLowerCase()
              .trim()
              .includes(searchQuery.toLowerCase().trim())
        )
        .sort((a, b) => {
          if (a.tvl < b.tvl) return 1;
          return -1;
        })
        .slice(0, 5)
    );

    setFilteredNfts(
      nfts
        .filter((nft) =>
          nft.name
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim())
        )
        .sort((a, b) => {
          if (a.tvl < b.tvl) return 1;
          return -1;
        })
        .slice(0, 5)
    );
  }, [searchQuery]);

  return (
    <Dropdown opened={opened} onClose={() => setOpened(false)}>
      <div
        className={`hidden w-[224px] h-8 lg:flex text-gray-200 text-xs border-1 px-3 py-1 items-center gap-3 hover:text-gray-300 hover:border-gray-300 ${
          opened
            ? "text-gray-300 border-gray-300 rounded-t"
            : "rounded text-gray-200 border-gray-200"
        }`}
      >
        <SearchSVG />
        <input
          className="text-xs font-medium placeholder:text-gray-200 text-white"
          placeholder="Search Vaults and NFTs"
          onFocus={() => setOpened(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="font-medium text-gray-200 flex flex-col top-[100%] -left-px -right-px bg-gray-700 bg-opacity-95 border-b-1 border-x-1 border-gray-300 px-2 pt-2.5 pb-3 gap-2 rounded-b">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">VIP VAULTS</span>
          <div className="flex flex-col gap-px">
            {filteredVipVaults.map((vault, index) => (
              <button
                key={`vault-${index}`}
                className="flex justify-between items-center text-xs rounded p-[5px] hover:bg-gray-300 hover:bg-opacity-10 hover:text-white gap-1"
                onClick={() => {
                  setOpened(false);
                  router.push(`/vault/${vault.id}`);
                }}
              >
                <div className="flex items-center gap-3 text-left w-[calc(100%-60px)]">
                  <Image
                    className="border-1 border-gray-200 rounded-full"
                    src={vault.logo}
                    width={16}
                    height={16}
                    alt=""
                  />
                  <span className="whitespace-nowrap overflow-hidden w-full text-ellipsis">
                    {vault.name}
                  </span>
                </div>
                <span className="w-[60px] whitespace-nowrap text-right">
                  {vault.apy}% APY
                </span>
              </button>
            ))}
            {filteredVipVaults.length === 0 && <span>No vault found</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">PUBLIC VAULTS</span>
          <div className="flex flex-col gap-px">
            {filteredVaults.map((vault, index) => (
              <button
                key={`vault-${index}`}
                className="flex justify-between items-center text-xs rounded p-[5px] hover:bg-gray-300 hover:bg-opacity-10 hover:text-white"
                onClick={() => {
                  router.push(`/vault/${vault.id}`);
                }}
              >
                <div className="flex items-center gap-3 text-left w-[calc(100%-60px)]">
                  <Image
                    className="border-1 border-gray-200 rounded-full"
                    src={vault.logo}
                    width={16}
                    height={16}
                    alt=""
                  />
                  <span className="whitespace-nowrap overflow-hidden w-full text-ellipsis">
                    {vault.name}
                  </span>
                </div>
                <span className="w-[60px] whitespace-nowrap text-right">
                  {vault.apy}% APY
                </span>
              </button>
            ))}
            {filteredVaults.length === 0 && <span>No vault found</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">NFTS</span>
          <div className="flex flex-col gap-px">
            {filteredNfts.map((vault, index) => (
              <button
                key={`vault-${index}`}
                className="flex justify-between items-center text-xs rounded p-[5px] hover:bg-gray-300 hover:bg-opacity-10"
              >
                <div className="flex items-center gap-3 text-left">
                  <Image
                    className="border-1 border-gray-200 rounded-full"
                    src={vault.logo}
                    width={16}
                    height={16}
                    alt=""
                  />
                  {vault.name}
                </div>
                {/* <span>{vault.tvl}</span> */}
              </button>
            ))}
            {filteredNfts.length === 0 && <span>No vault found</span>}
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

export default VaultSearch;
