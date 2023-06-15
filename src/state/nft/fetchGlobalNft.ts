import axios from "axios";

import { activeChainId } from "@/utils/web3";
import { getSpiceNfts } from "@/utils/subgraph";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import { COLLECTION_API_BASE } from "@/config/constants/backend";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { getPrologueVaultWithdrawable } from "@/state/vault/fetchGlobalVault";

// fetch spice nfts
export const fetchSpiceNfts = async () => {
  try {
    const nftsRawData = await getSpiceNfts();
    const nfts = nftsRawData.map((row: any) => {
      return {
        ...row,
        tokenImg: getTokenImageFromReservoir(
          PROLOGUE_NFT_ADDRESS,
          Number(row.tokenId)
        ),
      };
    });

    const callData = nfts.map((row: any) => {
      return {
        address: PROLOGUE_NFT_ADDRESS,
        name: "previewRedeem",
        params: [row.shares],
      };
    });
    const nftRedeemables = await getPrologueVaultWithdrawable({
      callData: callData,
      tokenIds: nfts.map((row: any) => row.tokenId),
    });

    return {
      nfts: nfts.map((nft: any, index: number) => {
        return {
          ...nft,
          ...nftRedeemables[index],
        };
      }),
    };
  } catch {
    return {
      nfts: [],
    };
  }
};

// fetch all collections
export const fetchCollections = async () => {
  try {
    const res = await axios.get(`${COLLECTION_API_BASE}`);

    if (res.status === 200) {
      return { collections: res.data.data };
    }
    return { collections: [] };
  } catch {
    return {
      collections: [],
    };
  }
};
