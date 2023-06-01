import { ReactNode, useState } from "react";
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
}: Props) => {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortAsc, setSortAsc] = useState(false);
  const [hoverBody, setHoverBody] = useState(false);

  const { account } = useWeb3React();

  const getSortedItems = () => {
    if (sortKey) {
      return items.sort((a, b) => {
        if (!a[sortKey] || !b[sortKey]) return false;
        if (typeof a[sortKey] === "number") {
          if (sortAsc) {
            return a[sortKey] > b[sortKey] ? 1 : -1;
          }

          return a[sortKey] > b[sortKey] ? -1 : 1;
        } else {
          if (sortAsc) {
            return a[sortKey].localeCompare(b[sortKey]);
          }

          return b[sortKey].localeCompare(a[sortKey]);
        }
      });
    } else {
      return items;
    }
  };

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
                  className={`${rowStyle} ${
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
        >
          {!account && (
            <tr className="h-full">
              <td>
                <span className="flex justify-center align-center my-2">
                  <ConnectWallet />
                </span>
              </td>
            </tr>
          )}
          {account && isLoading && (
            <tr className="h-full">
              <td>
                <span className="flex justify-center align-center my-2">
                  <LoadingSpinner />
                </span>
              </td>
            </tr>
          )}
          {account &&
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
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
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
        </tbody>
      </table>
    </div>
  );
};

export default Table;
