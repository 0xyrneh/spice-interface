import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import { Card } from "@/components/common";
import { PieChart } from "@/components/portfolio";
import { VaultInfo } from "@/types/vault";
import { VAULT_API } from "@/config/constants/backend";
import { VAULT_COLLECTION_COLORS } from "@/config/constants/vault";
import { getNFTMarketplaceDisplayName } from "@/utils/nft";
import { useAppSelector } from "@/state/hooks";

import Table, { TableRowInfo } from "../common/Table";

type Props = {
  vault?: VaultInfo;
  vaults: VaultInfo[];
  className?: string;
  isBreakdown?: boolean;
  hasToggle?: boolean;
  walletConnectRequired?: boolean;
  onToggle?: () => void;
};

export default function MarketplaceExposure({
  vault,
  vaults,
  className,
  isBreakdown,
  hasToggle,
  walletConnectRequired,
  onToggle,
}: Props) {
  const [allocations, setAllocations] = useState<any[]>([]);

  const { account } = useWeb3React();
  const { isFullDataFetched: isVaultFullDataFetched } = useAppSelector(
    (state) => state.vault
  );

  const updateAllocationsOld = async () => {
    if (!account && walletConnectRequired) return;

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
          const res = await axios.get(`${VAULT_API}/result/${row.name}`);
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

    if (protocolAllocations1.length === 0) {
      protocolAllocations1 = [
        ...protocolAllocations1,
        { name: "SPICE", allocation: 1 },
      ];
    }

    setAllocations(
      protocolAllocations1
        .map((row, id) => {
          return { ...row, color: VAULT_COLLECTION_COLORS[id % 4] };
        })
        .sort((a, b) => (a.allocation >= b.allocation ? -1 : 1))
    );
  };

  const updateAllocations = async () => {
    if (!account && walletConnectRequired) return;

    let protocolAllocations: any[] = [];

    if (!vault) {
      let userTotalPosition = 0;
      vaults.map((vault: VaultInfo) => {
        userTotalPosition += vault?.userPosition || 0;
      });

      let protocolAllocationsObj: any = {};
      vaults.map((row) => {
        const vaultPortion = (row?.userPosition || 0) / userTotalPosition;

        (row?.marketplaceExposures || []).map((row1) => {
          const { name, allocation } = row1;
          protocolAllocationsObj[name] =
            (protocolAllocationsObj[name] || 0) + vaultPortion * allocation;
        });

        protocolAllocations = Object.entries(protocolAllocationsObj).map(
          (row) => {
            return {
              name: row[0],
              allocation: row[1],
            };
          }
        );
      });
    } else {
      protocolAllocations = vault?.marketplaceExposures || [];
    }

    setAllocations(
      protocolAllocations
        .map((row, id) => {
          return { ...row, color: VAULT_COLLECTION_COLORS[id % 4] };
        })
        .sort((a, b) => (a.allocation >= b.allocation ? -1 : 1))
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
  }, [
    vault?.marketplaceExposures,
    vaults.length,
    isVaultFullDataFetched,
    account,
  ]);

  const onSwitchTable = () => {
    if (!hasToggle) return;
    if (onToggle) onToggle();
  };

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `MARKETPLACES [${allocations.length}]`,
        key: "name",
        noSort: true,
        itemPrefix: (item) => (
          <div
            className="rounded w-3 h-3 mr-2 min-w-[12px] min-h-[12px]"
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
          return (100 * (item.allocation || 0)).toFixed(
            item.allocation === 1 ? 0 : 1
          );
        },
      },
    ];
  };

  return (
    <Card className={`gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 font-bold text-white font-sm whitespace-nowrap leading-[18px]">
        {/* {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.logo}
            width={16}
            height={16}
            alt=""
          />
        )} */}
        <MarketExposureSVG className="text-white" />
        <h2 className="block lg:hidden">
          {isBreakdown ? "MRKTPLACE B/D" : "MARKET EXP."}
        </h2>
        <h2 className="hidden lg:block xl:hidden">
          {isBreakdown ? "MRKTPLACE BREAKDOWN" : "MARKETPLACE EXP."}
        </h2>
        <h2 className="hidden xl:block">
          {isBreakdown ? "MARKETPLACE BREAKDOWN" : "MARKETPLACE EXPOSURE"}
        </h2>
        {hasToggle && (
          <div className="flex items-center gap-[4px]">
            {[0, 1].map((val) => (
              <div
                className={`w-[24px] h-[8px] rounded-full cursor-pointer ${
                  val === 1
                    ? "bg-orange-200 box-shadow-orange-200"
                    : "bg-gray-200"
                }`}
                key={val}
                onClick={() => val === 0 && onSwitchTable()}
              />
            ))}
          </div>
        )}
      </div>
      <Table
        containerClassName="xl:hidden flex-1"
        className="block h-full"
        rowInfos={getRowInfos()}
        items={allocations}
        trStyle="h-10"
        bodyClass="h-[calc(100%-40px)]"
        walletConnectRequired={walletConnectRequired}
      />
      <div className="hidden xl:flex xl:h-full gap-3.5 overflow-hidden">
        <Table
          containerClassName="flex-1"
          className="block h-full xl:min-w-[160px]"
          rowInfos={getRowInfos()}
          items={allocations}
          trStyle="h-10"
          bodyClass="h-[calc(100%-40px)]"
          walletConnectRequired={walletConnectRequired}
        />
        {/* <div className="flex flex-1 max-h-full min-h-[140px] 3xl:min-h-[220px] max-w-[160px] 3xl:max-w-[220px] items-center justify-center"> */}
        <div className="flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
          <PieChart data={getChartData()} />
        </div>
      </div>
    </Card>
  );
}
