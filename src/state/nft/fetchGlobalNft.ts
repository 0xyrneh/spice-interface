import { activeChainId } from "@/utils/web3";
import { getSpiceNfts } from "@/utils/subgraph";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import { getTokenImageFromReservoir } from "@/utils/nft";

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

    return {
      nfts,
    };
  } catch {
    return {
      nfts: [],
    };
  }
};
