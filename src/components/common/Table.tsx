import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";

import SortDownSVG from "@/assets/icons/sort-down.svg";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConnectWallet } from "@/components/common";

export type TableRowInfo = {
  title: string;
  subTitle?: string;
  key?: string;
  noSort?: boolean;
  component?: (item: any) => ReactNode;
  itemPrefix?: (item: any) => ReactNode;
  itemSuffix?: (item: any) => ReactNode;
  itemClass?: (item: any) => string;
  headerClass?: string;
  rowClass?: () => string;
  format?: (item: any) => string;
};

type Props = {
  containerClassName?: string;
  className?: string;
  rowInfos: TableRowInfo[];
  items: any[];
  trStyle?: string;
  rowStyle?: string;
  defaultSortKey?: string;
  bodyClass?: string;
  isLoading?: boolean;
  walletConnectRequired?: boolean;
  rowPerPage?: number;
  onClickItem?: (item: any) => void;
  isActive?: (item: any) => boolean;
};

const Table = ({
  rowInfos,
  items,
  trStyle,
  rowStyle,
  defaultSortKey,
  bodyClass,
  containerClassName,
  className,
  onClickItem,
  isActive,
  isLoading,
  walletConnectRequired,
  rowPerPage,
}: Props) => {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortAsc, setSortAsc] = useState(false);
  const [hoverBody, setHoverBody] = useState(false);
  const [pageNum, setPageNum] = useState<number>(0);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const infiniteScrollBodyRef = useRef<HTMLTableSectionElement>(null);

  const { account } = useWeb3React();

  const ROW_PER_PAGE = rowPerPage || 15;
  const visibleItems = items.slice(0, pageNum * ROW_PER_PAGE);
  const hasMore =
    pageNum * ROW_PER_PAGE < items.length &&
    visibleItems.length >= pageNum * ROW_PER_PAGE;

  const getSortedItems = () => {
    if (sortKey) {
      return visibleItems.sort((a, b) => {
        if (typeof a[sortKey] === "number") {
          if (a[sortKey] === undefined || b[sortKey] === undefined) return 0;
          if (sortAsc) {
            return a[sortKey] > b[sortKey] ? 1 : -1;
          }

          return a[sortKey] > b[sortKey] ? -1 : 1;
        } else {
          if (!a[sortKey] || !b[sortKey]) return 0;
          if (sortAsc) {
            return a[sortKey].localeCompare(b[sortKey]);
          }

          return b[sortKey].localeCompare(a[sortKey]);
        }
      });
    } else {
      return visibleItems;
    }
  };

  const fetchMoreData = useCallback(() => {
    if (!hasMore) return;

    setInfiniteLoading(true);

    setTimeout(() => {
      setInfiniteLoading(false);
      setPageNum(pageNum + 1);
    }, 100);
  }, [hasMore, pageNum]);

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
    setPageNum(1);
  }, []);

  useEffect(() => {
    fetchMoreOnBottomReached(infiniteScrollBodyRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div className={`overflow-hidden pr-5 -mr-5 ${containerClassName}`}>
      <table className={`custom-table ${className}`}>
        <thead>
          <tr className={trStyle}>
            {rowInfos.map((row, idx) => (
              <th
                key={`${row.title}-${idx}`}
                className={`${row.rowClass ? row.rowClass() : ""} ${
                  row.noSort ? "" : "cursor-pointer"
                }`}
                onClick={() => {
                  if (row.noSort) return;
                  if (row.key === sortKey) {
                    setSortAsc(!sortAsc);
                  } else {
                    setSortKey(row.key);
                    setSortAsc(false);
                  }
                }}
              >
                <div
                  className={`${row.headerClass} ${rowStyle} ${
                    !row.noSort && sortKey === row.key
                      ? "text-orange-200 text-shadow-orange-900"
                      : ""
                  } ${row.noSort ? "" : "hover:text-white"}`}
                >
                  <div className="flex flex-col !items-end">
                    <span className="whitespace-nowrap">{row.title}</span>
                    {row.subTitle && <span>{row.subTitle}</span>}
                  </div>
                  {!row.noSort && sortKey === row.key && (
                    <SortDownSVG className={sortAsc ? "rotate-180" : ""} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`${bodyClass} ${
            hoverBody ? "custom-scroll" : "custom-scroll-transparent"
          }`}
          onMouseEnter={() => setHoverBody(true)}
          onMouseLeave={() => setHoverBody(false)}
          onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
          ref={infiniteScrollBodyRef}
        >
          {!account && walletConnectRequired && (
            <tr className="h-full">
              <td>
                <span className="flex justify-center align-center my-2">
                  <ConnectWallet />
                </span>
              </td>
            </tr>
          )}
          {(account || !walletConnectRequired) && isLoading && (
            <tr className="h-full">
              <td>
                <span className="flex justify-center align-center my-2">
                  <LoadingSpinner />
                </span>
              </td>
            </tr>
          )}
          {(account || !walletConnectRequired) &&
            !isLoading &&
            getSortedItems().map((item, index) => (
              <tr
                key={`item-${index}`}
                className={`${trStyle} ${
                  onClickItem ? "vault-row cursor-pointer" : ""
                } ${isActive && isActive(item) ? "active" : ""}`}
                onClick={() => {
                  if (onClickItem) onClickItem(item);
                }}
              >
                {rowInfos.map((row, idx) => (
                  <td
                    key={`item-${index}-${row.title}-${idx}`}
                    className={`${row.rowClass ? row.rowClass() : ""}`}
                  >
                    <div
                      className={`${rowStyle} ${
                        row.itemClass ? row.itemClass(item) : ""
                      }`}
                    >
                      {row.itemPrefix && row.itemPrefix(item)}
                      {row.key ? (
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis tracking-normal">
                          {row.format ? row.format(item) : item[row.key]}
                        </span>
                      ) : (
                        row.component!(item)
                      )}
                      {row.itemSuffix && row.itemSuffix(item)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          {infiniteLoading && (
            <tr className="mb-[4px]">
              <td>
                <span className="flex justify-center align-center my-2">
                  <LoadingSpinner size={16} />
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
