import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import BlurSVG from "@/assets/icons/blur.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";
import { shortAddress } from "@/utils";
import useBreakpoint from "use-breakpoint";
import { BREAKPOINTS } from "@/constants";

type Props = {
  vault: VaultInfo;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
};

export default function BlurRanking({
  vault,
  showIcon,
  className,
  nonExpandedClassName,
}: Props) {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const [expanded, setExpanded] = useState(false);
  const [loans, setRank] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);

  const { setBlur } = useUI();

  const fetchData = async () => {
    setIsFetching(true);

    if (!vault?.address) return;
    setRank([
      {
        rank: 55,
        wallet: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        day: 1500,
        week: 1500,
        total: 15000,
      },
      {
        rank: 56,
        wallet: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        day: 1500,
        week: 1500,
        total: 15000,
      },
    ]);
    setIsFetching(false);
  };

  useEffect(() => {
    setRank([]);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address]);

  useEffect(() => {
    setBlur(expanded);
  }, [expanded, setBlur]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: "RANK",
        key: "rank",
        rowClass: () => "w-[60px]",
      },
      {
        title: "WALLET",
        key: "wallet",
        headerClass: "!justify-start",
        itemClass: () => "!justify-start",
        itemPrefix: (item) => {
          return (
            <button className="hidden lg:flex items-center min-w-4 w-4 h-4 mr-1">
              <Image
                src="/assets/icons/copy.svg"
                width={16}
                height={16}
                alt=""
              />
            </button>
          );
        },
        format: (item) => {
          if (expanded) return item.wallet;
          if (breakpoint === "md" || breakpoint === "sm")
            return item.wallet.slice(0, 7);
          if (breakpoint === "lg") return item.wallet.slice(0, 8);
          return shortAddress(item.wallet);
        },
      },
      {
        title: "1D",
        key: "day",
        rowClass: () =>
          expanded
            ? "w-[16%]"
            : "hidden lg:table-cell w-[60px] lg:w-[16%] 2xl:w-1/5",
      },
      {
        title: "1W",
        key: "week",
        rowClass: () =>
          expanded ? "w-[16%]" : "w-[60px] lg:w-[16%] 2xl:w-1/5",
      },
      {
        title: "TOTAL",
        key: "total",
        rowClass: () =>
          expanded ? "w-[16%]" : "w-[60px] lg:w-[16%] 2xl:w-1/5",
      },
    ];
  };

  return (
    <Card
      className={`gap-3 overflow-hidden ${className} ${
        nonExpandedClassName && !expanded ? nonExpandedClassName : ""
      }`}
      expanded={expanded}
      onCollapse={() => setExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          {showIcon && (
            <Image
              className="border-1 border-gray-200 rounded-full"
              src={vault.logo}
              width={16}
              height={16}
              alt=""
            />
          )}
          <BlurSVG />
          <h2 className="font-bold text-white font-sm">SP-BLUR RANKINGS</h2>
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <Table
        containerClassName="flex-1"
        className="block h-full"
        rowInfos={getRowInfos()}
        items={loans}
        trStyle="h-10"
        rowStyle="h-8"
        defaultSortKey="apy"
        bodyClass="h-[calc(100%-40px)]"
        isLoading={isFetching}
      />
    </Card>
  );
}
