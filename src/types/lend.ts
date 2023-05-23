import { BigNumber } from "ethers";

export interface LendInfo {
  address: string;
  lenderNote: string;
  loanRatio: number;
  liquidationRatio: number;
  wethBalance: BigNumber;
  wethAllowance: BigNumber;
  status: boolean;
  userInfo: any[];
}
