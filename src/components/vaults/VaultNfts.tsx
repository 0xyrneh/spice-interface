import { useState } from "react";
import Image from "next/image";
import prologueNfts from "@/constants/prologueNfts";
import { Card, PrologueNftCard, Select } from "@/components/common";
import SearchSVG from "@/assets/icons/search.svg";
import KeySVG from "@/assets/icons/key.svg";
import { Vault } from "@/types/vault";
import { VaultNftsSortFilter } from "@/types/common";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";

type Props = {
  vault?: Vault;
  showIcon?: boolean;
  className?: string;
};

export default function VaultNfts({ vault, showIcon, className }: Props) {
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );

  return (
    <Card className="gap-5 overflow-hidden max-h-[370px]">
      <div className="flex items-center gap-2.5">
        {vault && <Image src={vault.icon} width={16} height={16} alt="" />}
        <KeySVG />
        <h2 className="font-bold text-white font-sm">
          {vault ? "YOUR PROLOGUE NFTS" : "VAULT NFTS"}{" "}
        </h2>
      </div>
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
          <SearchSVG />
          <input
            className="flex-1 text-white font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
            placeholder="Search your NFTs"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          />
        </div>
        <div className="hidden xl:flex flex-1 justify-end text-gray-200 font-medium text-xs">
          <Select
            className="w-[170px]"
            itemClassName="text-gray-200 hover:text-gray-300"
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
        <span className="font-medium text-white text-xs">Prologue NFT</span>
        <div className="flex flex-wrap gap-y-3 gap-x-[0.5%] overflow-y-auto custom-scroll">
          {prologueNfts.map((nft, idx) => (
            <PrologueNftCard
              key={`prologue-nft-${idx}`}
              nft={nft}
              className="w-[calc(99%/3)] lg:w-[calc(98.5%/4)] xl:w-[calc(98%/5)] 3xl:w-[calc(97.5%/6)]"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
