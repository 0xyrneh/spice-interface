import { useEffect, useRef, useState, useCallback } from "react";
import useBreakpoint from "use-breakpoint";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { Card, PrologueNftCard, Search, Select } from "@/components/common";
import UserSVG from "@/assets/icons/user.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { useUI } from "@/hooks";
import { VaultNftsSortFilter } from "@/types/common";
import { BREAKPOINTS, VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { PrologueNftInfo } from "@/types/nft";
import { VaultInfo } from "@/types/vault";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { getNetApy } from "@/utils/apy";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { YEAR_IN_SECONDS } from "@/config/constants/time";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import { useAppSelector } from "@/state/hooks";
import { getBalanceInWei } from "@/utils/formatBalance";

type Props = {
  vault?: VaultInfo;
  className?: string;
  headerClassName?: string;
  walletConnectRequired?: boolean;
  onActive: () => void;
  onCardPopup: (status: boolean) => void;
};

export default function PrologueNfts({
  vault,
  className,
  headerClassName,
  walletConnectRequired,
  onActive,
  onCardPopup,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );
  const [selectedIdx, setSelectedIdx] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverList, setHoverList] = useState(false);
  const [pageNum, setPageNum] = useState<number>(0);
  const [nftsOrigin, setNftsOrigin] = useState<any[]>([]);

  const { setBlur } = useUI();
  const { breakpoint } = useBreakpoint(BREAKPOINTS);
  const infiniteScrollBodyRef = useRef<HTMLDivElement>(null);
  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const { allNfts } = useAppSelector((state) => state.nft);

  const loans = accLoans(lendData);
  const userNfts = vault?.userInfo?.nftsRaw || [];

  const getFilteredNfts = (): PrologueNftInfo[] => {
    return searchQuery.length > 0
      ? nftsOrigin.filter((row) => String(row.tokenId).includes(searchQuery))
      : nftsOrigin;
  };

  const ROW_PER_PAGE = expanded ? 40 : 20;
  const filteredNfts = getFilteredNfts();
  const visibleNfts = filteredNfts.slice(0, pageNum * ROW_PER_PAGE);
  const hasMore =
    pageNum * ROW_PER_PAGE < filteredNfts.length &&
    visibleNfts.length >= pageNum * ROW_PER_PAGE;

  const getNftPortolios = () => {
    if (!vault) return [];
    const allNfts1 = allNfts.map((row) => {
      return {
        owner: row.owner.address,
        amount: BigNumber.from(row.shares)
          .mul(BigNumber.from(getBalanceInWei((vault?.tvl || 0).toString())))
          .div(
            BigNumber.from(
              getBalanceInWei((vault?.totalShares || 0).toString())
            )
          ),
        tokenId: row.tokenId,
        tokenImg: row.tokenImg,
        isEscrowed: false,
        apy: 0,
      };
    });

    if (!account) {
      return allNfts1;
    }

    const myNfts = loans.map((row: any) => {
      const userNft = userNfts.find(
        (row1: any) => row1.tokenId === row.tokenId
      );

      const value: BigNumber =
        row?.loan?.tokenAmntInVault ||
        userNft?.depositAmnt ||
        BigNumber.from(0);

      const debtOwed = row?.loan?.repayAmount || BigNumber.from(0);

      const borrowApr = row.loan?.terms?.interestRate
        ? row.loan?.terms?.interestRate.toNumber() / 10000
        : 0;
      const loanDuration = row.loan?.terms?.duration || 0;

      // calculate net APY
      let netApy = 0;
      let borrowApy = 0;
      if (loanDuration > 0) {
        const m = YEAR_IN_SECONDS / loanDuration;
        // eslint-disable-next-line no-restricted-properties
        borrowApy = Math.pow(1 + borrowApr / m, m) - 1;
        const vaultApy = (vault?.apr || 0) / 100;

        netApy = getNetApy(
          getBalanceInEther(value),
          vaultApy,
          getBalanceInEther(debtOwed),
          borrowApy
        );
      }

      return {
        owner: account,
        amount: value,
        tokenId: row.tokenId,
        tokenImg: getTokenImageFromReservoir(
          PROLOGUE_NFT_ADDRESS,
          Number(row.tokenId)
        ),
        isEscrowed: !!row?.loan?.loanId,
        apy: netApy,
      };
    });

    return [...allNfts1, ...myNfts];
  };

  // fetch more nfts
  const fetchMoreData = useCallback(() => {
    if (!hasMore) return;

    setTimeout(() => {
      setPageNum(pageNum + 1);
    }, 100);
  }, [hasMore, pageNum]);

  // event trigger when scroll is at bottom
  const fetchMoreOnBottomReached = useCallback(
    (infiniteScrollElement?: HTMLDivElement | null) => {
      if (infiniteScrollElement) {
        const { scrollHeight, scrollTop, clientHeight } = infiniteScrollElement;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          fetchMoreData();
        }
      }
    },
    [fetchMoreData]
  );

  useEffect(() => {
    setSelectedIdx(undefined);
    onCardPopup(expanded);
  }, [expanded]);

  useEffect(() => {
    setBlur(expanded);
  }, [expanded, setBlur]);

  useEffect(() => {
    setNftsOrigin(getNftPortolios());
  }, [vault?.address, allNfts.length, loans.length]);

  useEffect(() => {
    setPageNum(1);
  }, []);

  useEffect(() => {
    fetchMoreOnBottomReached(infiniteScrollBodyRef.current);
  }, [fetchMoreOnBottomReached]);

  // get sorted nfts
  const getSortedNfts = (): PrologueNftInfo[] => {
    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueHighToLow) {
      return visibleNfts.sort((a, b) => (a.amount.gte(b.amount) ? -1 : 1));
    }
    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueLowToHigh) {
      return visibleNfts.sort((a, b) => (a.amount.gt(b.amount) ? 1 : -1));
    }
    // show escrowed nfts first sorted by apy (high to low), then non escrowed nfts sorted by position size (high to low) - this should be default sorting
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyHighToLow) {
      return visibleNfts
        .sort((a, b) => (a.apy <= b.apy ? 1 : -1))
        .sort((a, b) => {
          if (a.isEscrowed || b.isEscrowed) return 0;
          return BigNumber.from(a.amount).gte(b.amount) ? 1 : -1;
        });
    }
    // show escrowed nfts first reverse sorted by apy (low to high), then non escrowed nfts sorted by position size (high to low)
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyLowToHigh) {
      return visibleNfts
        .sort((a, b) => {
          return a.apy > b.apy ? 1 : -1;
        })
        .sort((a, b) => {
          if (a.isEscrowed) return 1;
          return -1;
        })
        .sort((a, b) => {
          if (a.isEscrowed && b.isEscrowed) return a.apy > b.apy ? 1 : -1;
          return a.amount.gte(b.amount) ? 1 : -1;
        });
    }

    return visibleNfts;
  };

  const cardInRow = () => {
    if (expanded) {
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
    if (expanded) {
      if (idx < _cardInRow) sides.push("top");
      else if (
        getSortedNfts().length - idx <=
        getSortedNfts().length % _cardInRow
      )
        sides.push("bottom");
    } else {
      sides.push("bottom");
    }

    return sides as any;
  };

  return (
    <Card
      className={`${className} ${expanded ? "h-[90%] my-auto" : "relative"}`}
      expanded={expanded}
      onCollapse={() => setExpanded(false)}
      onClick={onActive}
    >
      {selectedIdx !== undefined && (
        <div
          className="z-10 absolute top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-80"
          onClick={() => setSelectedIdx(undefined)}
        />
      )}
      <div className={`flex items-center justify-between ${headerClassName}`}>
        <div className="flex items-center gap-2.5 text-white">
          <UserSVG />
          <h2 className="font-bold text-white font-sm">PROLOGUE NFTS</h2>
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div className="flex items-center justify-between gap-5">
        <Search
          placeholder={`Search NFTID [${nftsOrigin.length}]`}
          className={`${expanded ? "flex-none" : "flex-1 xl:flex-none"}`}
          onChange={(val) => setSearchQuery(val)}
        />
        <div
          className={`${
            expanded ? "flex" : "hidden xl:flex"
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
      <div
        className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 h-full overflow-y-auto overflow-x-auto table"
        onMouseEnter={() => setHoverList(true)}
        onMouseLeave={() => setHoverList(false)}
      >
        <div
          ref={infiniteScrollBodyRef as any}
          className={`h-full block flex gap-y-3 gap-px -mr-2.5 pr-2 ${
            hoverList ? "custom-scroll" : "custom-scroll-transparent"
          } overflow-y-auto flex-wrap`}
          onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        >
          {getSortedNfts().map((nft, idx) => (
            <PrologueNftCard
              key={`prologue-nft-${idx}`}
              nfts={[nft]}
              expanded={expanded}
              selectable
              active={idx === selectedIdx}
              side={side(idx)}
              containerClassName={
                expanded
                  ? "min-w-[calc((100%-5px)/6)] lg:min-w-[calc((100%-6px)/7)] xl:min-w-[calc((100%-7px)/8)] max-w-[calc((100%-5px)/6)] lg:max-w-[calc((100%-6px)/7)] xl:max-w-[calc((100%-7px)/8)]"
                  : "w-[calc(99%/3)] lg:w-[calc(98.5%/4)] xl:w-[calc(98%/5)] 3xl:w-[calc(97.5%/6)]"
              }
              className={`${
                selectedIdx === undefined ? "hover:cursor-pointer" : ""
              }`}
              parent={infiniteScrollBodyRef}
              onClick={() => setSelectedIdx(idx)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
