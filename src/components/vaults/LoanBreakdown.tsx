import { useEffect, useState } from "react";
import Image from "next/image";
import { loans } from "@/constants/prologueNfts";
import { Card, Search, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/exposure.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { Vault } from "@/types/vault";
import { useUI } from "@/hooks";

type Props = {
  vault: Vault;
  showIcon?: boolean;
  className?: string;
  hideRepay?: boolean;
};

export default function LoanBreakdown({
  vault,
  showIcon,
  className,
  hideRepay,
}: Props) {
  const { setBlur } = useUI();

  const [loanExpanded, setLoanExpanded] = useState(false);

  useEffect(() => {
    setBlur(loanExpanded);
  }, [loanExpanded, setBlur]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `LOAN [${loans.length}]`,
        key: "name",
        itemPrefix: (item) => (
          <>
            {!loanExpanded && (
              <Image
                className="mr-1"
                src={item.market}
                width={16}
                height={16}
                alt=""
              />
            )}
            <Image
              className="mr-1 border-1 border-gray-200 rounded-full"
              src={item.icon}
              width={16}
              height={16}
              alt=""
            />
          </>
        ),
        rowClass: () => "w-[45%]",
      },
      {
        title: "PRINCIPAL",
        key: "principal",
        itemPrefix: () => "Ξ",
        rowClass: () => "w-[90px]",
      },
      {
        title: "REPAY",
        key: "repay",
        rowClass: () =>
          hideRepay
            ? "hidden"
            : loanExpanded
            ? ""
            : "hidden xl:table-cell w-[60px]",
        itemPrefix: () => "Ξ",
      },
      {
        title: "LTV",
        key: "ltv",
        itemSuffix: () => "%",
        rowClass: () => (loanExpanded ? "" : "hidden lg:table-cell w-[50px]"),
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
        rowClass: () => "w-[50px]",
      },
      {
        title: "DUE",
        key: "due",
        rowClass: () => (loanExpanded ? "" : "hidden lg:table-cell w-[50px]"),
        itemSuffix: () => "d",
      },
      {
        title: "MARKET",
        component: (item) => (
          <Image
            className="mr-1"
            src={item.market}
            width={16}
            height={16}
            alt=""
          />
        ),
        rowClass: () => (loanExpanded ? "" : "hidden"),
      },
    ];
  };

  return (
    <Card
      className={`gap-3 overflow-hidden ${className}`}
      expanded={loanExpanded}
      onCollapse={() => setLoanExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          {showIcon && (
            <Image
              className="border-1 border-gray-200 rounded-full"
              src={vault.icon}
              width={16}
              height={16}
              alt=""
            />
          )}
          <ExposureSVG />
          <h2 className="font-bold text-white font-sm">LOAN EXPOSURE</h2>
        </div>
        <button onClick={() => setLoanExpanded(!loanExpanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              loanExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex">
        <Search placeholder="Search loans" className="flex-1 xl:flex-none" />
      </div>
      <div className="flex-1 overflow-hidden">
        <Table
          className="block h-full"
          rowInfos={getRowInfos()}
          items={loans}
          trStyle="h-10"
          rowStyle="h-8"
          defaultSortKey="apy"
          bodyClass="h-[calc(100%-40px)]"
        />
      </div>
    </Card>
  );
}
