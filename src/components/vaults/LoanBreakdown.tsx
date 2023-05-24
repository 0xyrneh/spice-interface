import { useEffect, useState } from "react";
import Image from "next/image";
import { loans } from "@/constants/prologueNfts";
import { Card, Search, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/exposure.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";

type Props = {
  vault: VaultInfo;
  small?: boolean;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
};

export default function LoanBreakdown({
  vault,
  small,
  showIcon,
  className,
  nonExpandedClassName,
}: Props) {
  const { setBlur } = useUI();

  const [loanExpanded, setLoanExpanded] = useState(false);

  useEffect(() => {
    setBlur(loanExpanded);
  }, [loanExpanded, setBlur]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `LOANS [${loans.length}]`,
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
              src={item.logo}
              width={16}
              height={16}
              alt=""
            />
          </>
        ),
      },
      {
        title: "PRINCIPAL",
        key: "principal",
        itemPrefix: () => "Ξ",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden lg:table-cell w-[90px]"
            : "w-[90px]",
      },
      {
        title: "REPAY",
        key: "repay",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden 2xl:table-cell w-[65px]"
            : "hidden xl:table-cell w-[65px]",
        itemPrefix: () => "Ξ",
      },
      {
        title: "LTV",
        subTitle: loanExpanded ? "/SPICE/" : undefined,
        key: "ltv",
        itemSuffix: () => "%",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden 3xl:table-cell w-[50px]"
            : "hidden lg:table-cell w-[50px]",
      },
      {
        title: "LTV",
        subTitle: loanExpanded ? "/FLOOR/" : undefined,
        key: "ltvFloor",
        itemSuffix: () => "%",
        rowClass: () =>
          loanExpanded ? "hidden lg:table-cell w-[10%]" : "hidden",
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden lg:table-cell w-[50px]"
            : "w-[50px]",
      },
      {
        title: "INITIATED",
        key: "initiated",
        rowClass: () =>
          loanExpanded ? "hidden lg:table-cell w-[10%]" : "hidden",
      },
      {
        title: "DUE",
        key: "due",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden xl:table-cell w-[50px]"
            : "hidden lg:table-cell w-[50px]",
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
        rowClass: () => (loanExpanded ? "w-[10%]" : "hidden"),
      },
    ];
  };

  return (
    <Card
      className={`gap-3 overflow-hidden ${className} ${
        nonExpandedClassName && !loanExpanded ? nonExpandedClassName : ""
      }`}
      expanded={loanExpanded}
      onCollapse={() => setLoanExpanded(false)}
      animate
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
          <ExposureSVG />
          <h2
            className={`font-bold text-white font-sm ${
              small ? "hidden lg:block" : ""
            }`}
          >
            LOAN EXPOSURE
          </h2>
          {small && (
            <h2 className="lg:hidden font-bold text-white font-sm">
              LOAN EXP.
            </h2>
          )}
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
        <Search placeholder="Search loans" className="xl:flex-none w-full" />
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
