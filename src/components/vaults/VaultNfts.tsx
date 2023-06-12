import { useState } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import {
  Card,
  PrologueNftCard,
  Search,
  Select,
  ConnectWallet,
} from "@/components/common";
import KeySVG from "@/assets/icons/key.svg";
import { VaultInfo } from "@/types/vault";
import { PrologueNftInfo } from "@/types/nft";
import { VaultNftsSortFilter } from "@/types/common";
import { VAULT_NFTS_SORT_FILTERS } from "@/constants";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { getNetApy } from "@/utils/apy";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { YEAR_IN_SECONDS } from "@/config/constants/time";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import { useAppSelector } from "@/state/hooks";
import { useUI } from "@/hooks";

type Props = {
  vault?: VaultInfo;
  className?: string;
};

export default function VaultNfts({ vault, className }: Props) {
  const [vaultNftsSortFilter, setVaultNftsSortFilter] = useState(
    VaultNftsSortFilter.ApyHighToLow
  );

  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const { defaultVault } = useAppSelector((state) => state.vault);
  const { showDepositModal } = useUI();
  const [hoverNftList, setHoverNftList] = useState(false);

  const loans = accLoans(lendData);
  const activeVault = vault || defaultVault;
  const userNfts = activeVault?.userInfo?.nftsRaw || [];

  const onClickPrologueNft = (item: PrologueNftInfo) => {
    if (!defaultVault) return;
    if (item.isEscrowed) {
      // show increase leverage modal
      showDepositModal({
        vault: defaultVault,
        isLeverageModal: true,
        nftId: item.tokenId,
      });
    } else {
      showDepositModal({ vault: defaultVault, nftId: item.tokenId });
    }
  };

  const getNftPortolios = () => {
    if (!account) return [];
    return loans.map((row: any) => {
      const userNft = userNfts.find(
        (row1: any) => row1.tokenId === row.tokenId
      );

      const value =
        row?.loan?.tokenAmntInVault ||
        userNft?.depositAmnt ||
        BigNumber.from(0);
      const debtOwed = row?.loan?.repayAmount || BigNumber.from(0);

      const borrowApr = row.loan?.terms?.interestRate
        ? row.loan?.terms?.interestRate.toNumber() / 10000
        : 0;
      const loanDuration = row.loan?.terms?.duration || 0;

      // calculate net APY
      let netApy = 0;
      let borrowApy = 0;
      if (loanDuration > 0) {
        const m = YEAR_IN_SECONDS / loanDuration;
        // eslint-disable-next-line no-restricted-properties
        borrowApy = Math.pow(1 + borrowApr / m, m) - 1;
        const vaultApy = (activeVault?.apr || 0) / 100;

        netApy = getNetApy(
          getBalanceInEther(value),
          vaultApy,
          getBalanceInEther(debtOwed),
          borrowApy
        );
      }

      return {
        owner: account,
        amount: getBalanceInEther(value),
        tokenId: row.tokenId,
        tokenImg: getTokenImageFromReservoir(
          PROLOGUE_NFT_ADDRESS,
          Number(row.tokenId)
        ),
        isEscrowed: !!row?.loan?.loanId,
        apy: netApy,
      };
    });
  };

  const sortNfts = (): PrologueNftInfo[] => {
    const myPrologueNfts = getNftPortolios();

    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueHighToLow) {
      return myPrologueNfts.sort((a, b) => (a.amount <= b.amount ? 1 : -1));
    }
    if (vaultNftsSortFilter === VaultNftsSortFilter.ValueLowToHigh) {
      return myPrologueNfts.sort((a, b) => (a.amount < b.amount ? -1 : 1));
    }
    // show escrowed nfts first sorted by apy (high to low), then non escrowed nfts sorted by position size (high to low) - this should be default sorting
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyHighToLow) {
      return myPrologueNfts
        .sort((a, b) => (a.apy <= b.apy ? 1 : -1))
        .sort((a, b) => {
          if (a.isEscrowed || b.isEscrowed) return 0;
          return a.amount <= b.amount ? 1 : -1;
        });
    }
    // show escrowed nfts first reverse sorted by apy (low to high), then non escrowed nfts sorted by position size (high to low)
    if (vaultNftsSortFilter === VaultNftsSortFilter.ApyLowToHigh) {
      return myPrologueNfts
        .sort((a, b) => {
          return a.apy > b.apy ? 1 : -1;
        })
        .sort((a, b) => {
          if (a.isEscrowed) return 1;
          return -1;
        })
        .sort((a, b) => {
          if (a.isEscrowed && b.isEscrowed) return a.apy > b.apy ? 1 : -1;
          return a.amount <= b.amount ? 1 : -1;
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
      <div className="table flex flex-col border-y-1 border-y-gray-200 px-1 py-2 overflow-y-hidden h-full">
        <div className="pb-4">
          <span className="font-medium text-white text-xs">Prologue NFT</span>
        </div>
        <div
          className={`h-[calc(100%-38px)] max-h-[calc(100%-38px)] flex flex-wrap gap-y-3 gap-x-[0.5%] overflow-y-auto h-full ${
            account ? "-mr-2.5 pr-2" : ""
          } ${hoverNftList ? "custom-scroll" : "custom-scroll-transparent"}`}
          onMouseEnter={() => setHoverNftList(true)}
          onMouseLeave={() => setHoverNftList(false)}
        >
          {!account && (
            <div className="flex mx-auto items-center">
              <ConnectWallet />
            </div>
          )}
          {account &&
            sortedNfts.map((nft, idx) => (
              <PrologueNftCard
                key={`prologue-nft-${idx}`}
                nfts={[nft]}
                containerClassName="w-[calc(99%/3)] lg:w-[calc(98.5%/4)] xl:w-[calc(98%/5)] 3xl:w-[calc(97.5%/6)]"
                onClick={onClickPrologueNft}
              />
            ))}
        </div>
      </div>
    </Card>
  );
}
