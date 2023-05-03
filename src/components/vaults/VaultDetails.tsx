import { useState } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  Select,
  Stats,
  Table,
  PrologueNftCard,
} from "@/components/common";
import { DetailChart } from "@/components/vaults";
import prologueNfts, { loans } from "@/constants/prologueNfts";
import { VaultNftsSortFilter } from "@/types/common";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import ExposureSVG from "@/assets/icons/exposure.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import SearchSVG from "@/assets/icons/search.svg";
import ChartSVG from "@/assets/icons/chart.svg";
import UserSVG from "@/assets/icons/user.svg";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { TableRowInfo } from "@/components/common/Table";
import { ReceiptToken, Vault } from "@/types/vault";

type Props = {
  vault: Vault;
};

export default function VaultDetails({ vault }: Props) {
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );
  const [loanExpanded, setLoanExpanded] = useState(false);
  const [prologueNftExpanded, setPrologueNftExpanded] = useState(false);

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
      },
      {
        title: "REPAY",
        key: "repay",
        rowClass: () => (loanExpanded ? "" : "hidden lg:table-cell"),
        itemPrefix: () => "Ξ",
      },
      {
        title: "LTV",
        key: "ltv",
        itemSuffix: () => "%",
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
      },
      {
        title: "DUE",
        key: "due",
        rowClass: () => (loanExpanded ? "" : "hidden lg:table-cell"),
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
    <div className="relative hidden md:flex tracking-wide w-full min-h-[838px] max-h-[calc(max(982px,100vh)-144px)] mt-[84px] px-8 pb-5 gap-5 overflow-y-hidden">
      <div className="flex flex-col min-w-[41%] w-[41%] gap-5">
        <Card className="gap-3">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <Image
                src="/assets/images/vaultIcon.svg"
                width={40}
                height={40}
                alt=""
              />
              <h2 className="font-bold text-white font-base">{vault.name}</h2>
            </div>
            <div className="hidden xl:flex items-center justify-end gap-5 flex-1">
              <Button type="primary" className="h-9 flex-1 max-w-[148px]">
                <span className="text-base">DEPOSIT</span>
              </Button>
              <Button type="secondary" className="h-9 flex-1 max-w-[148px]">
                <span className="text-base">POSITION</span>
              </Button>
            </div>
            <div className="flex xl:hidden items-center text-green">
              <CircleDotSvg />
              <span className="hidden lg:block font-semibold text-xs">
                LOW RISK
              </span>
            </div>
          </div>
          <div className="hidden xl:flex items-center text-green">
            <CircleDotSvg />
            <span className="font-semibold text-xs">LOW RISK</span>
          </div>
          <span className="text-white text-xs font-medium whitespace-nowrap xl:whitespace-normal overflow-hidden leading-4 xl:h-8 h-auto">
            This Vault routes liquidity to all whitelisted NFT lending
            marketplaces and NFT collections. Receipt tokens for deposits into
            this vault are represented by Prologue NFT.
          </span>
          <div className="flex xl:hidden items-center gap-5 flex-1">
            <Button type="primary" className="h-9 flex-1">
              <span className="text-base">DEPOSIT</span>
            </Button>
            <Button type="secondary" className="h-9 flex-1">
              <span className="text-base">POSITION</span>
            </Button>
          </div>
        </Card>
        <Card className="gap-3">
          <div className="flex items-center gap-2.5">
            <ChartSVG />
            <h2 className="font-bold text-white font-sm">VAULT STATS</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Stats
              className="hidden lg:flex"
              title="Total Deposits"
              value="Ξ30.00"
            />
            <Stats title="Total Earnings" value="Ξ30.00" />
            <Stats title="Historical APY" value="20.10%" />
            <Stats className="hidden xl:flex" title="Up Time" value="100d" />
          </div>
        </Card>
        {vault.receiptToken === ReceiptToken.NFT && (
          <Card className="gap-5" expanded={prologueNftExpanded}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white">
                <UserSVG />
                <h2 className="font-bold text-white font-sm">PROLOGUE NFTS</h2>
              </div>
              <button
                onClick={() => setPrologueNftExpanded(!prologueNftExpanded)}
              >
                <ExternalLinkSVG
                  className={`text-gray-100 hover:text-white ${
                    prologueNftExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between gap-5">
              <div className="flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
                <SearchSVG />
                <input
                  className="flex-1 font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
                  placeholder="Search NFTID"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  // onFocus={handleFocus}
                  // onBlur={handleBlur}
                />
              </div>
              <div className="hidden xl:flex flex-1 justify-end text-gray-200 font-medium text-xs">
                <Select
                  className="w-[170px]"
                  itemClassName="text-gray-200 hover:text-gray-300"
                  dropdownClassName="bg-gray-700 bg-opacity-95"
                  title={vaultNftsSortFilter}
                  values={[vaultNftsSortFilter]}
                  items={VAULT_NFTS_SORT_FILTERS.filter(
                    (item) => item !== vaultNftsSortFilter
                  )}
                  onChange={(item) =>
                    setVaultNftsSortFilter(item as VaultNftsSortFilter)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 overflow-y-hidden">
              <div className="flex gap-y-3 gap-px overflow-x-hidden custom-scroll">
                {prologueNfts.map((nft, idx) => (
                  <PrologueNftCard
                    key={`prologue-nft-${idx}`}
                    nft={nft}
                    className="min-w-[calc((100%-2px)/3)] lg:min-w-[calc((100%-3px)/4)] xl:min-w-[calc((100%-4px)/5)] 3xl:min-w-[calc((100%-5px)/6)]"
                  />
                ))}
              </div>
            </div>
          </Card>
        )}
        <Card className="gap-3 overflow-hidden" expanded={loanExpanded}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
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
            <div className="flex flex-1 text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-8">
              <SearchSVG />
              <input
                className="flex-1 font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
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
      </div>

      <DetailChart />
    </div>
  );
}
