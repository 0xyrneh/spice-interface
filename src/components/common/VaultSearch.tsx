import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import vaults from "@/constants/vaults";
import nfts from "@/constants/nfts";
import { Vault, Nft } from "@/types/vault";
import SearchSVG from "@/assets/icons/search.svg";

const VaultSearch = () => {
  const inputDiv = useRef<HTMLInputElement>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<Nft[]>([]);
  const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    setSearchQuery("");
    setFocused(false);
  };

  const handleMouseEnter = () => {
    if (inputDiv.current) {
      inputDiv.current.focus();
      setFocused(true);
    }
  };

  useEffect(() => {
    setFilteredVaults(
      vaults
        .filter((vault) =>
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
    <div
      className={`relative hidden w-[224px] h-8 lg:flex text-gray-200 text-xs border-1 px-3 py-1 items-center gap-3
      ${
        focused
          ? "text-gray-300 border-gray-300"
          : "text-gray-200 border-gray-200"
      } ${searchQuery !== "" ? "rounded-t" : "rounded"}`}
    >
      <SearchSVG />
      <input
        ref={inputDiv as any}
        className="flex-1 font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50 text-white"
        placeholder="Search Vaults and NFTs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
      />

      {searchQuery !== "" && (
        <div className="font-medium absolute flex flex-col top-[100%] -left-px -right-px bg-gray-700 bg-opacity-45 border-b-1 border-x-1 border-gray-300 px-2 pt-2.5 pb-3 gap-2 rounded-b">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-300">VAULTS</span>
            <div className="flex flex-col gap-px">
              {filteredVaults.map((vault, index) => (
                <button
                  key={`vault-${index}`}
                  className="flex justify-between items-center text-xs rounded p-[5px] hover:bg-gray-300 hover:bg-opacity-10 hover:text-white"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Image src={vault.icon} width={16} height={16} alt="" />
                    {vault.name}
                  </div>
                  <span>
                    Ξ{vault.tvl} / {vault.apy}%
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
                    <Image src={vault.icon} width={16} height={16} alt="" />
                    {vault.name}
                  </div>
                  <span>{vault.tvl}</span>
                </button>
              ))}
              {filteredNfts.length === 0 && <span>No vault found</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultSearch;
