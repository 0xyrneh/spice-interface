import { useEffect, useState } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";

import { Button, Card, Stats } from "@/components/common";
import { DetailChart, LoanBreakdown, PrologueNfts } from "@/components/vaults";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import ChartSVG from "@/assets/icons/chart.svg";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { useAppSelector } from "@/state/hooks";
import { accLoans } from "@/utils/lend";
import { getBalanceInEther, getBalanceInWei } from "@/utils/formatBalance";
import { PrologueNftInfo } from "@/types/nft";

type Props = {
  vault: VaultInfo;
};

export default function VaultDetails({ vault }: Props) {
  const [nfts, setNfts] = useState<PrologueNftInfo[]>([]);
  const [prologueNftExpanded, setPrologueNftExpanded] = useState(false);

  const { data: lendData } = useAppSelector((state) => state.lend);
  const { allNfts } = useAppSelector((state) => state.nft);
  const loans = accLoans(lendData);
  const userNftIds = loans.map((row: any) => row.tokenId);

  // fetch nft information from backend
  const fetchData = async () => {
    const vaultTvl = vault?.tvl || 0;
    const vaultTotalShares = vault?.totalShares || 0;

    const nfts1 = allNfts.map((row: any) => {
      const tokenId = Number(row.tokenId);
      const isEscrowed = userNftIds.includes(tokenId);
      return {
        owner: row.owner.address,
        amount: getBalanceInEther(
          vaultTotalShares === 0
            ? BigNumber.from(row.shares)
            : BigNumber.from(row.shares)
                .mul(BigNumber.from(getBalanceInWei(vaultTvl.toString())))
                .div(
                  BigNumber.from(getBalanceInWei(vaultTotalShares.toString()))
                )
        ),
        tokenId,
        tokenImg: row.tokenImg,
        isEscrowed,
        apy: isEscrowed ? 45.24 : 0,
      };
    });

    setNfts([...nfts1]);
  };

  useEffect(() => {
    if (vault?.address) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address, userNftIds.length]);

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
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
          <span className="tracking-normal text-white text-xs font-medium whitespace-nowrap xl:whitespace-normal overflow-hidden leading-4 xl:h-8 h-auto">
            This Vault routes liquidity to all whitelisted NFT lending
            marketplaces and NFT collections. Receipt tokens for deposits into
            this vault are represented by Prologue NFT.
          </span>
          <div className="flex xl:hidden items-center gap-5 flex-1">
            <Button type="primary" className="h-9 flex-1">
              <span className="text-base font-bold">DEPOSIT</span>
            </Button>
            <Button type="secondary" className="h-9 flex-1">
              <span className="text-base font-bold">POSITION</span>
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
          <PrologueNfts nfts={nfts} />
        )}
        <LoanBreakdown vault={vault} className="flex-1" />
      </div>

      <DetailChart />
    </div>
  );
}
