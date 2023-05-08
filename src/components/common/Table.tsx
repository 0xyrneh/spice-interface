import { ReactNode, useState } from "react";
import SortDownSVG from "@/assets/icons/sort-down.svg";

export type TableRowInfo = {
  title: string;
  key?: string;
  noSort?: boolean;
  component?: (item: any) => ReactNode;
  itemPrefix?: (item: any) => ReactNode;
  itemSuffix?: (item: any) => ReactNode;
  itemClass?: (item: any) => string;
  rowClass?: () => string;
};

type Props = {
  className?: string;
  rowInfos: TableRowInfo[];
  items: any[];
  trStyle?: string;
  rowStyle?: string;
  defaultSortKey?: string;
  bodyClass?: string;
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
  className,
  onClickItem,
  isActive,
}: Props) => {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortAsc, setSortAsc] = useState(false);
  const [sortedItems, setSortedItems] = useState(items);

  const getSortedItems = () => {
    if (sortKey) {
      return items.sort((a, b) => {
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
    <table className={`custom-table ${className}`}>
      <thead>
        <tr className={trStyle}>
          {rowInfos.map((row) => (
            <th
              key={row.title}
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
                  !row.noSort && sortKey === row.key ? "text-orange-200" : ""
                } ${row.noSort ? "" : "hover:text-white"}`}
              >
                <span>{row.title}</span>
                {!row.noSort && sortKey === row.key && (
                  <SortDownSVG className={sortAsc ? "rotate-180" : ""} />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={bodyClass}>
        {getSortedItems().map((item, index) => (
          <tr
            key={`item-${index}`}
            className={`${trStyle} ${
              onClickItem ? "vault-row cursor-pointer" : ""
            } ${isActive && isActive(item) ? "active" : ""}`}
            onClick={() => {
              if (onClickItem) onClickItem(item);
            }}
          >
            {rowInfos.map((row) => (
              <td
                key={`item-${index}-${row.title}`}
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
                      {item[row.key]}
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
  );
};

export default Table;
