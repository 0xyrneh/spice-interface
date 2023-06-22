import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import UserSVG from "@/assets/icons/user.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { Card } from "@/components/common";
import { PieChart } from "@/components/portfolio";
import { VaultInfo } from "@/types/vault";
import { getNFTCollectionDisplayName } from "@/utils/nft";
import { COLLECTION_API_BASE } from "@/config/constants/backend";
import { VAULT_COLLECTION_COLORS } from "@/config/constants/vault";
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

export default function CollectionExposure({
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

  const updateAllocationsOld = async () => {
    if (!account && walletConnectRequired) return;

    const collectionAllocationsOrigin =
      vault?.okrs?.collection_allocations || {};
    let collectionAllocations0 = await Promise.all(
      Object.keys(collectionAllocationsOrigin).map(async (key) => {
        try {
          const collectionRes = await axios.get(
            `${COLLECTION_API_BASE}/${key}`
          );

          if (collectionRes.status === 200) {
            return {
              slug: key,
              name:
                collectionRes.data.data.readable ||
                getNFTCollectionDisplayName(key),
              allocation: collectionAllocationsOrigin[key],
            };
          }
        } catch (err) {
          console.log("Collection API error:", err);
        }
        return {
          slug: key,
          name: getNFTCollectionDisplayName(key),
          allocation: collectionAllocationsOrigin[key],
        };
      })
    );

    if (collectionAllocations0.length === 0) {
      collectionAllocations0 = [
        ...collectionAllocations0,
        { name: "Prologue", slug: "Prologue", allocation: 1 },
      ];
    }

    setAllocations(
      collectionAllocations0
        .map((row, id) => {
          return { ...row, color: VAULT_COLLECTION_COLORS[id % 4] };
        })
        .sort((a, b) => (a.allocation >= b.allocation ? -1 : 1))
    );
  };

  const updateAllocations = async () => {
    if (!account && walletConnectRequired) return;

    let collectionAllocations: any[] = [];

    if (!vault) {
      // vaults excepting blur vault
      const vaults0 = vaults.filter((vault) => !vault.isBlur);

      let userTotalPosition = 0;
      vaults0.map((vault: VaultInfo) => {
        userTotalPosition += vault?.userPosition || 0;
      });

      let collectionAllocationsObj: any = {};
      vaults0.map((row) => {
        const vaultPortion = (row?.userPosition || 0) / userTotalPosition;
        (row?.collectionExposures || []).map((row1) => {
          const { name, allocation } = row1;
          collectionAllocationsObj[name] =
            (collectionAllocationsObj[name] || 0) + vaultPortion * allocation;
        });

        collectionAllocations = Object.entries(collectionAllocationsObj).map(
          (row) => {
            return {
              name: row[0],
              allocation: row[1],
            };
          }
        );
      });
    } else {
      collectionAllocations = vault?.collectionExposures || [];
    }

    if (collectionAllocations.length === 0) {
      collectionAllocations = [
        ...collectionAllocations,
        { name: "Prologue", slug: "Prologue", allocation: 1 },
      ];
    }

    setAllocations(
      collectionAllocations
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

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `COLLECTIONS [${allocations.length}]`,
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

  useEffect(() => {
    updateAllocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAllocations([]);
    updateAllocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address, vaults.length, account]);

  const onSwitchTable = () => {
    if (!hasToggle) return;
    if (onToggle) onToggle();
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
        {<UserSVG className="text-white" />}

        <h2 className="block lg:hidden">
          {isBreakdown ? "COLLECTION" : "NFT"} {isBreakdown ? "B/D" : "EXP."}
        </h2>
        <h2 className="hidden lg:block xl:hidden">
          {isBreakdown ? "COLLECTION BREAKDOWN" : "COLLECTION EXP."}
        </h2>
        <h2 className="hidden xl:block">
          {isBreakdown ? "COLLECTION BREAKDOWN" : "COLLECTION EXPOSURE"}
        </h2>
        {hasToggle && (
          <button onClick={onSwitchTable}>
            <SortUpSVG
              className={`text-gray-100 hover:text-white rotate-180`}
            />
          </button>
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
        {/* <div className="flex flex-1 min-h-[140px] 3xl:min-h-[220px] max-w-[160px] 3xl:max-w-[220px] items-center justify-center"> */}
        <div className="flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
          <PieChart data={getChartData()} />
        </div>
      </div>
    </Card>
  );
}
