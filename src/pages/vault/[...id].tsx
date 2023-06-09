import { useRouter } from "next/router";
import { BigNumber } from "ethers";

import { VaultDetails } from "@/components/vaults";
import { useEffect, useState } from "react";
import { VaultInfo, ReceiptToken } from "@/types/vault";
import { useAppSelector } from "@/state/hooks";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { getNftPortfolios } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";

export default function VaultDetailsPage() {
  const [vault, setVault] = useState<VaultInfo>();

  const router = useRouter();
  const { id }: { id?: string[] } = router.query;

  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);

  const vaults = vaultsOrigin.map((row: VaultInfo) => {
    let userPositionRaw = BigNumber.from(0);
    let userNftPortfolios: any[] = [];
    if (row.fungible) {
      userPositionRaw = row?.userInfo?.depositAmnt || BigNumber.from(0);
    } else {
      const userNfts = row?.userInfo?.nftsRaw || [];
      userNftPortfolios =
        row.address === DEFAULT_AGGREGATOR_VAULT[activeChainId]
          ? getNftPortfolios(loans, userNfts)
          : [];

      userNftPortfolios.map((row1: any) => {
        userPositionRaw = userPositionRaw.add(row1.value);
        return row1;
      });
    }

    return {
      ...row,
      userPositionRaw,
      userPosition: getBalanceInEther(userPositionRaw),
      userNftPortfolios,
      receiptToken: row.fungible ? ReceiptToken.ERC20 : ReceiptToken.NFT,
    };
  });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const selectedVault = vaults.find(
      (vault: VaultInfo) => id && vault.id === Number(id[0])
    );

    if (selectedVault) {
      setVault(selectedVault);
    }
    if (!selectedVault && vaults.length > 0) {
      router.push(`/`);
    }
  }, [id, router, vaults.length]);

  if (vault) {
    return (
      <VaultDetails
        vault={{
          ...vault,
          // isBlur: true,
        }}
      />
    );
  } else {
    return <div></div>;
  }
}
