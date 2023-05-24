import { useEffect, useState } from "react";
import useBreakpoint from "use-breakpoint";
import { Card, PrologueNftCard, Search, Select } from "@/components/common";
import UserSVG from "@/assets/icons/user.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { useUI } from "@/hooks";
import { VaultNftsSortFilter } from "@/types/common";
import { BREAKPOINTS, VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { PrologueNftInfo } from "@/types/nft";

type Props = {
  nfts: PrologueNftInfo[];
  className?: string;
};

export default function PrologueNfts({ nfts, className }: Props) {
  const { setBlur } = useUI();
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const [prologueNftExpanded, setPrologueNftExpanded] = useState(false);
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );
  const [selectedIdx, setSelectedIdx] = useState<number>();

  useEffect(() => {
    setSelectedIdx(undefined);
  }, [prologueNftExpanded]);

  const cardInRow = () => {
    if (prologueNftExpanded) {
      if (breakpoint === "3xl" || breakpoint === "2xl" || breakpoint === "xl")
        return 8;
      else if (breakpoint === "lg") return 7;
      else return 6;
    } else {
      if (breakpoint === "3xl") return 6;
      else if (breakpoint === "2xl" || breakpoint === "xl") return 5;
      else if (breakpoint === "lg") return 4;
      else return 3;
    }
  };

  const side = (idx: number) => {
    const _cardInRow = cardInRow();
    const sides: string[] = [];
    if (idx % _cardInRow === 0) sides.push("left");
    else if ((idx + 1) % _cardInRow === 0) sides.push("right");
    if (prologueNftExpanded) {
      if (idx < _cardInRow) sides.push("top");
      else if (nfts.length - idx <= nfts.length % _cardInRow)
        sides.push("bottom");
    } else {
      sides.push("bottom");
    }

    return sides as any;
  };

  useEffect(() => {
    setBlur(prologueNftExpanded);
  }, [prologueNftExpanded, setBlur]);

  return (
    <Card
      className={`gap-3 ${className}`}
      expanded={prologueNftExpanded}
      onCollapse={() => setPrologueNftExpanded(false)}
    >
      {selectedIdx !== undefined && (
        <div
          className="z-10 absolute top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-80"
          onClick={() => setSelectedIdx(undefined)}
        />
      )}
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
              : "overflow-hidden"
          }`}
        >
          {nfts.map((nft, idx) => (
            <div
              key={`prologue-nft-${idx}`}
              className={`${
                prologueNftExpanded
                  ? "min-w-[calc((100%-5px)/6)] lg:min-w-[calc((100%-6px)/7)] xl:min-w-[calc((100%-7px)/8)] max-w-[calc((100%-5px)/6)] lg:max-w-[calc((100%-6px)/7)] xl:max-w-[calc((100%-7px)/8)]"
                  : "min-w-[calc((100%-2px)/3)] lg:min-w-[calc((100%-3px)/4)] xl:min-w-[calc((100%-4px)/5)] 3xl:min-w-[calc((100%-5px)/6)]"
              }`}
            >
              <PrologueNftCard
                nfts={[nft]}
                expanded={prologueNftExpanded}
                active={idx === selectedIdx}
                side={side(idx)}
                className={`${idx === selectedIdx ? "" : ""}`}
                onClick={() => setSelectedIdx(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
