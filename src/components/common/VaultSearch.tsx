import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import vaults from "@/constants/vaults";
import nfts from "@/constants/nfts";
import { Vault, Nft } from "@/types/vault";

const VaultSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<Nft[]>([]);
  const [visibleResults, setVisibleResults] = useState(false);

  const handleFocus = () => {
    setVisibleResults(true);
  };

  const handleBlur = () => {
    setVisibleResults(false);
    setSearchQuery("");
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
    <div className="relative hidden lg:w-[268px] xl:w-[350px] h-9 lg:flex text-gray text-xs xl:text-sm rounded border-1 border-gray px-3 py-1 items-center gap-3">
      <FaSearch />
      <input
        className="flex-1 bg-transparent font-SuisseIntl outline-0 placeholder:text-gray placeholder:text-opacity-50"
        placeholder="Search Vaults and NFTs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {visibleResults && (
        <div className="absolute flex flex-col top-[calc(100%+16px)] left-0 right-0 bg-secondary bg-opacity-45 border-1 border-light px-2 pt-2.5 pb-3 gap-2 rounded">
          <div className="flex flex-col gap-1">
            <span className="text-xs xl:text-sm">VAULTS</span>
            <div className="flex flex-col gap-px">
              {filteredVaults.map((vault, index) => (
                <button
                  key={`vault-${index}`}
                  className="flex justify-between items-center text-xs border-1 border-transparent hover:border-light rounded p-[5px]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Image src={vault.icon} width={20} height={20} alt="" />
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
            <span className="text-xs xl:text-sm">NFTS</span>
            <div className="flex flex-col gap-px">
              {filteredNfts.map((vault, index) => (
                <button
                  key={`vault-${index}`}
                  className="flex justify-between items-center text-xs border-1 border-transparent hover:border-light rounded p-[5px]"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Image src={vault.icon} width={20} height={20} alt="" />
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
