import { useState, useEffect } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { Card, PrologueNftCard, Search, Select } from "@/components/common";
import KeySVG from "@/assets/icons/key.svg";
import { VaultInfo } from "@/types/vault";
import { PrologueNftInfo } from "@/types/nft";
import { VaultNftsSortFilter } from "@/types/common";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { getBalanceInEther, getBalanceInWei } from "@/utils/formatBalance";
import { useAppSelector } from "@/state/hooks";
import { accLoans } from "@/utils/lend";

type Props = {
  vault?: VaultInfo;
  className?: string;
};

export default function VaultNfts({ vault, className }: Props) {
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ValueHighToLow
  );
  const [nfts, setNfts] = useState<PrologueNftInfo[]>([]);

  const { account } = useWeb3React();
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

  const myPrologueNfts = nfts.filter(
    (row) =>
      row.owner.toLowerCase() === account?.toLowerCase() ||
      userNftIds.includes(row.tokenId)
  );

  const sortNfts = (): PrologueNftInfo[] => {
    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueHighToLow) {
      return myPrologueNfts.sort((a, b) => (a.amount <= b.amount ? 1 : -1));
    }
    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueLowToHigh) {
      return myPrologueNfts.sort((a, b) => (a.amount >= b.amount ? 1 : -1));
    }
    // TODO: show escrowed nfts first sorted by apy (high to low), then non escrowed nfts sorted by position size (high to low) - this should be default sorting
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyHighToLow) {
      return myPrologueNfts.sort((a, b) => (a.apy <= b.apy ? 1 : -1));
    }
    // TODO: show escrowed nfts first reverse sorted by apy (low to high), then non escrowed nfts sorted by position size (high to low)
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyLowToHigh) {
      return myPrologueNfts.sort((a, b) => {
        return a.apy >= b.apy ? 1 : -1;
      });
    }

    return myPrologueNfts;
  };

  const sortedNfts = sortNfts();

  return (
    <Card className={`gap-5 overflow-hidden ${className}`}>
      <div className="flex items-center gap-2.5">
        {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.logo}
            width={16}
            height={16}
            alt=""
          />
        )}
        <KeySVG />
        <h2 className="font-bold text-white font-sm">
          {vault ? "YOUR VAULT NFTS" : "VAULT NFTS"}
        </h2>
      </div>
      <div className="flex items-center justify-between gap-5">
        <Search
          placeholder="Search your NFTs"
          className="flex-1 xl:flex-none"
        />
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
      <div className="flex flex-col border-y-1 border-y-gray-200 px-1 gap-4 py-2 overflow-y-hidden h-full">
        <span className="font-medium text-white text-xs">Prologue NFT</span>
        <div className="flex flex-wrap gap-y-3 gap-x-[0.5%] overflow-y-auto no-scroll">
          {sortedNfts.map((nft, idx) => (
            <PrologueNftCard
              key={`prologue-nft-${idx}`}
              nfts={[nft]}
              containerClassName="w-[calc(99%/3)] lg:w-[calc(98.5%/4)] xl:w-[calc(98%/5)] 3xl:w-[calc(97.5%/6)]"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
