import multicall from "@/utils/multicall";
import OracleAbi from "@/config/abi/Oracle.json";
import { getETHOracleAddress } from "@/utils/addressHelpers";

export const fetchETHPrice = async () => {
  const [ethPrice] = await multicall(OracleAbi, [
    {
      address: getETHOracleAddress(),
      name: "latestAnswer",
      params: [],
    },
  ]);

  return parseInt(ethPrice.toString()) / (10 ** 8);
};
