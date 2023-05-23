import { useEffect, useState } from "react";
import { Card, PrologueNftCard, Search, Select } from "@/components/common";
import UserSVG from "@/assets/icons/user.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";
import { VaultNftsSortFilter } from "@/types/common";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { PrologueNftInfo } from "@/types/nft";

type Props = {
  nfts: PrologueNftInfo[];
  className?: string;
};

export default function PrologueNfts({ nfts, className }: Props) {
  const { setBlur } = useUI();

  const [prologueNftExpanded, setPrologueNftExpanded] = useState(false);
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );

  useEffect(() => {
    setBlur(prologueNftExpanded);
  }, [prologueNftExpanded, setBlur]);

  return (
    <Card
      className={`gap-3 ${className}`}
      expanded={prologueNftExpanded}
      onCollapse={() => setPrologueNftExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          <UserSVG />
          <h2 className="font-bold text-white font-sm">PROLOGUE NFTS</h2>
        </div>
        <button onClick={() => setPrologueNftExpanded(!prologueNftExpanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              prologueNftExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div className="flex items-center justify-between gap-5">
        <Search
          placeholder={`Search NFTID [${nfts.length}]`}
          className={`${
            prologueNftExpanded ? "flex-none" : "flex-1 xl:flex-none"
          }`}
        />
        <div
          className={`${
            prologueNftExpanded ? "flex" : "hidden xl:flex"
          } flex-1 justify-end text-gray-200 font-medium text-xs`}
        >
          <Select
            className="w-[170px] text-gray-200 border-gray-200 hover:text-gray-300 hover:border-gray-300"
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
      <div className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 h-full overflow-y-auto">
        <div
          className={`flex gap-y-3 gap-px custom-scroll ${
            prologueNftExpanded
              ? "overflow-y-auto flex-wrap"
              : "overflow-x-hidden"
          }`}
        >
          {nfts.map((nft, idx) => (
            <PrologueNftCard
              key={`prologue-nft-${idx}`}
              nfts={[nft]}
              expanded={prologueNftExpanded}
              className={`${
                prologueNftExpanded
                  ? "min-w-[calc((100%-5px)/6)] lg:min-w-[calc((100%-6px)/7)] xl:min-w-[calc((100%-7px)/8)]"
                  : "min-w-[calc((100%-2px)/3)] lg:min-w-[calc((100%-3px)/4)] xl:min-w-[calc((100%-4px)/5)] 3xl:min-w-[calc((100%-5px)/6)]"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
