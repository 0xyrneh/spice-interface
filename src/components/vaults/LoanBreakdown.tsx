import { useEffect, useState } from "react";
import Image from "next/image";
import { loans } from "@/constants/prologueNfts";
import { Card, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/exposure.svg";
import SearchSVG from "@/assets/icons/search.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { Vault } from "@/types/vault";
import { useUI } from "@/hooks";

type Props = {
  vault: Vault;
  showIcon?: boolean;
  className?: string;
};

export default function LoanBreakdown({ vault, showIcon, className }: Props) {
  const { setBlur } = useUI();

  const [loanExpanded, setLoanExpanded] = useState(false);

  useEffect(() => {
    setBlur(loanExpanded);
  }, [loanExpanded, setBlur]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: "LOAN",
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
              className="mr-1"
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
        rowClass: () => "min-w-[90px]",
      },
      {
        title: "REPAY",
        key: "repay",
        rowClass: () => (loanExpanded ? "" : "hidden lg:table-cell w-[60px]"),
        itemPrefix: () => "Ξ",
      },
      {
        title: "LTV",
        key: "ltv",
        itemSuffix: () => "%",
        rowClass: () => "w-[50px]",
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
          {showIcon && <Image src={vault.icon} width={16} height={16} alt="" />}
          <ExposureSVG />
          <h2 className="font-bold text-white font-sm">LOAN BREAKDOWN</h2>
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
        <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
          <SearchSVG />
          <input
            className="flex-1 text-white font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
            placeholder="Search loans"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          />
        </div>
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
