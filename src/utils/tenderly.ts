import axios from "axios";
import { activeChainId } from "@/utils/web3";

const TENDERLY_SERVICE_URL = "https://api.tenderly.co/api/v1/public-contract/";

export const getTransactionByHash = async (hash?: string): Promise<string> => {
  if (!hash) return "Unknown Error";

  const apiUrl = `${TENDERLY_SERVICE_URL}/${activeChainId}/tx/${hash}`;
  try {
    const res = await axios.get(apiUrl);
    if (res.status === 200) {
      return res.data.error_message;
    }
    return "Unknown Error";
  } catch {
    return "Unknown Error";
  }
};
