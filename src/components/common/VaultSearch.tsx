import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import SearchSVG from "@/assets/icons/search.svg";
import { VaultFilter } from "@/types/common";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/state/hooks";
import { VaultInfo } from "@/types/vault";
import { PrologueNftInfo } from "@/types/nft";
import { generateRandomNumber } from "@/utils/number";

const VaultSearch = () => {
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { vaults, defaultVault } = useAppSelector((state) => state.vault);
  const { allNfts: spiceNfts } = useAppSelector((state) => state.nft);

  const nfts = spiceNfts.map((row) => {
    return { ...row, name: `Prologue NFT` };
  });

  useEffect(() => {
    if (!opened) setSearchQuery("");
  }, [opened]);

  const filteredVipVaults: VaultInfo[] = vaults
    .filter(
      (vault) =>
        vault.category === VaultFilter.VIP &&
        (vault?.readable || "")
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim())
    )
    .sort((a, b) => {
      if ((a?.tvl || 0) < (b?.tvl || 0)) return 1;
      return -1;
    })
    .slice(0, 5);

  const filteredVaults: VaultInfo[] = vaults
    .filter(
      (vault) =>
        vault.category === VaultFilter.Public &&
        (vault?.readable || "")
          .toLowerCase()
          .trim()
          .includes(searchQuery.toLowerCase().trim())
    )
    .sort((a, b) => {
      if ((a?.tvl || 0) < (b?.tvl || 0)) return 1;
      return -1;
    })
    .slice(0, 5);

  const filteredNfts: PrologueNftInfo[] =
    nfts.length > 0
      ? [nfts[generateRandomNumber(0, nfts.length - 1)]].filter((nft) =>
          (nft?.name || "")
            .toLowerCase()
            .trim()
            .includes(searchQuery.toLowerCase().trim())
        )
      : [];

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
                    {vault.readable}
                  </span>
                </div>
                <span className="w-[60px] whitespace-nowrap text-right">
                  {`${vault.apy?.toFixed(2)}% APY`}
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
                    {vault.readable}
                  </span>
                </div>
                <span className="w-[60px] whitespace-nowrap text-right">
                  {`${vault.apy?.toFixed(2)}% APY`}
                </span>
              </button>
            ))}
            {filteredVaults.length === 0 && <span>No vault found</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-300">NFTS</span>
          <div className="flex flex-col gap-px">
            {filteredNfts.map((nft, index) => (
              <button
                key={`vault-${index}`}
                className="flex justify-between items-center text-xs rounded p-[5px] hover:bg-gray-300 hover:bg-opacity-10"
                onClick={() => {
                  setOpened(false);
                  if (defaultVault?.id) {
                    router.push(`/vault/${defaultVault?.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-3 text-left">
                  <Image
                    className="border-1 border-gray-200 rounded-full"
                    src={nft.tokenImg}
                    width={16}
                    height={16}
                    alt=""
                  />
                  {nft?.name || ""}
                </div>
              </button>
            ))}
            {filteredNfts.length === 0 && <span>No nft found</span>}
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

export default VaultSearch;
