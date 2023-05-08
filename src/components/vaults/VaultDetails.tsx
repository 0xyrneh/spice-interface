import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  Select,
  Stats,
  PrologueNftCard,
  Search,
} from "@/components/common";
import { DetailChart, LoanBreakdown } from "@/components/vaults";
import prologueNfts from "@/constants/prologueNfts";
import { VaultNftsSortFilter } from "@/types/common";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import ChartSVG from "@/assets/icons/chart.svg";
import UserSVG from "@/assets/icons/user.svg";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { ReceiptToken, Vault } from "@/types/vault";
import { useUI } from "@/hooks";

type Props = {
  vault: Vault;
};

export default function VaultDetails({ vault }: Props) {
  const { setBlur } = useUI();
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );
  const [prologueNftExpanded, setPrologueNftExpanded] = useState(false);

  useEffect(() => {
    setBlur(prologueNftExpanded);
  }, [prologueNftExpanded, setBlur]);

  return (
    <div className="relative hidden md:flex tracking-wide w-full min-h-[838px] max-h-[calc(max(982px,100vh)-144px)] mt-[84px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[41%] w-[41%] gap-5">
        <Card className="gap-3 !py-3">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <Image
                className="border-1 border-gray-200 rounded-full"
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
              <span className="hidden lg:block font-semibold text-xs text-shadow-green">
                LOW RISK
              </span>
            </div>
          </div>
          <div className="hidden xl:flex items-center text-green h-4">
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
            <h2 className="font-bold text-white font-sm leading-[18px]">
              VAULT STATS
            </h2>
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
          <Card
            className="gap-3"
            expanded={prologueNftExpanded}
            onCollapse={() => setPrologueNftExpanded(false)}
          >
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
              <Search
                placeholder={`Search NFTID [${prologueNfts.length}]`}
                className={`${
                  prologueNftExpanded ? "flex-none" : "flex-1 xl:flex-none"
                }`}
              />
              <div
                className={`${
                  prologueNftExpanded ? "flex" : "hidden xl:flex"
                } flex-1 justify-end text-gray-200 font-medium text-xs`}
              >
                <Select
                  className="w-[170px] text-gray-200 border-gray-200 hover:text-gray-300 hover:border-gray-300"
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
            <div className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 h-full overflow-y-auto">
              <div
                className={`flex gap-y-3 gap-px custom-scroll ${
                  prologueNftExpanded
                    ? "overflow-y-auto flex-wrap"
                    : "overflow-x-hidden"
                }`}
              >
                {prologueNfts.map((nft, idx) => (
                  <PrologueNftCard
                    key={`prologue-nft-${idx}`}
                    nft={nft}
                    className={`${
                      prologueNftExpanded
                        ? "min-w-[calc((100%-5px)/6)] lg:min-w-[calc((100%-6px)/7)] xl:min-w-[calc((100%-7px)/8)] 2xl:min-w-[calc((100%-8px)/9)] 3xl:min-w-[calc((100%-9px)/10)]"
                        : "min-w-[calc((100%-2px)/3)] lg:min-w-[calc((100%-3px)/4)] xl:min-w-[calc((100%-4px)/5)] 3xl:min-w-[calc((100%-5px)/6)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}
        <LoanBreakdown vault={vault} />
      </div>

      <DetailChart />
    </div>
  );
}
