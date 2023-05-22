import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { Card } from "@/components/common";
import { PieChart } from "@/components/portfolio";
import { VaultInfo } from "@/types/vault";
import { VAULT_RESULT_API } from "@/config/constants/backend";
import { VAULT_COLLECTION_COLORS } from "@/config/constants/vault";
import { getNFTMarketplaceDisplayName } from "@/utils/nft";

import Table, { TableRowInfo } from "../common/Table";

type Props = {
  vault?: VaultInfo;
  className?: string;
  isBreakdown?: boolean;
  hasToggle?: boolean;
  onToggle?: () => void;
};

export default function MarketplaceExposure({
  vault,
  className,
  isBreakdown,
  hasToggle,
  onToggle,
}: Props) {
  const [allocations, setAllocations] = useState<any[]>([]);

  const updateAllocations = async () => {
    const protocolAllocationsOrigin = vault?.okrs?.protocol_allocations || {};
    const protocolAllocations0 = Object.keys(protocolAllocationsOrigin)
      .map((key) => ({
        name: getNFTMarketplaceDisplayName(key),
        allocation: protocolAllocationsOrigin[key],
      }))
      .sort((a, b) => (a.allocation >= b.allocation ? -1 : 1));

    // fetch bidder vault data
    let protocolAllocations1: any[] = [];
    await Promise.all(
      protocolAllocations0.map(async (row) => {
        if (row?.name && row?.name.includes("spice-")) {
          const res = await axios.get(`${VAULT_RESULT_API}/${row.name}`);
          if (res.status === 200) {
            const bidderVaultProtocolAllocations =
              res.data?.data?.okrs?.protocol_allocations;
            if (Object.keys(bidderVaultProtocolAllocations).length > 0) {
              Object.keys(bidderVaultProtocolAllocations).map((key) => {
                protocolAllocations1 = [
                  ...protocolAllocations1,
                  {
                    name: key,
                    allocation:
                      bidderVaultProtocolAllocations[key] * row.allocation,
                  },
                ];
                return key;
              });
            }
          } else {
            protocolAllocations1 = [...protocolAllocations1, row];
          }
          return row;
        }
        protocolAllocations1 = [...protocolAllocations1, row];
        return row;
      })
    );
    setAllocations(
      protocolAllocations1.sort((a, b) =>
        a.allocation >= b.allocation ? -1 : 1
      )
    );
  };

  const getChartData = () => {
    let wethAllocation = 100;

    allocations.map((row) => {
      wethAllocation -= row.allocation * 100;
      return row;
    });

    const allocactionsWithWeth =
      wethAllocation === 0
        ? [...allocations]
        : [
            ...allocations,
            {
              name: "WETH",
              allocation: wethAllocation / 100,
            },
          ];

    return allocactionsWithWeth.map((row, id) => {
      return {
        name: row.name,
        value: 100 * row.allocation,
        color: VAULT_COLLECTION_COLORS[id % 4],
      };
    });
  };

  useEffect(() => {
    // updateChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocations]);

  useEffect(() => {
    updateAllocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAllocations([]);
    updateAllocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address]);

  const onSwitchTable = () => {
    if (!hasToggle) return;
    if (onToggle) onToggle();
  };

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `MARKETPLACES [${Math.max(allocations.length - 1, 0)}]`,
        key: "name",
        noSort: true,
        itemPrefix: (item) => (
          <div
            className="rounded w-3 h-3 mr-2"
            style={{
              backgroundColor: item.color,
            }}
          />
        ),
        rowClass: () => "w-[80%]",
      },
      {
        title: "%",
        key: "allocation",
        noSort: true,
        itemSuffix: () => "%",
        format: (item) => {
          return (100 * (item.allocation || 0)).toFixed(1);
        },
      },
    ];
  };

  return (
    <Card className={`gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 font-bold text-white font-sm whitespace-nowrap leading-[18px]">
        {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.logo}
            width={16}
            height={16}
            alt=""
          />
        )}
        <MarketExposureSVG className="text-white" />
        <h2 className="block lg:hidden">
          {isBreakdown ? "MRKTPLACE" : "MARKET"}
          {isBreakdown ? "B/D" : "EXP."}
        </h2>
        <h2 className="hidden lg:block xl:hidden">
          {isBreakdown ? "MRKTPLACE" : "MARKETPLACE"}
          {isBreakdown ? "BREAKDOWN" : "EXP."}
        </h2>
        <h2 className="hidden xl:block">
          {`MARKETPLACE ${isBreakdown ? "BREAKDOWN" : "EXPOSURE"}`}
        </h2>
        {hasToggle && (
          <button onClick={onSwitchTable}>
            <SortUpSVG className={`text-gray-100 hover:text-white`} />
          </button>
        )}
      </div>
      <div className="flex gap-2.5 overflow-hidden">
        <div className="flex-1">
          <Table
            className="block h-full"
            rowInfos={getRowInfos()}
            items={allocations}
            trStyle="h-10"
            bodyClass="h-full no-scroll"
          />
        </div>
        <div className="hidden xl:flex flex-1 min-h-[160px] 3xl:min-h-[220px] max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
          <PieChart data={getChartData()} />
        </div>
      </div>
    </Card>
  );
}
