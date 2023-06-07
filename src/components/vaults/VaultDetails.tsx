import Image from "next/image";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";

import { Button, Card, Stats } from "@/components/common";
import {
  BlurLeaderboard,
  DetailChart,
  LoanBreakdown,
  PrologueNfts,
} from "@/components/vaults";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import ChartSVG from "@/assets/icons/chart.svg";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { activeChainId } from "@/utils/web3";
import { useWeb3React } from "@web3-react/core";
import { getNftPortfolios } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { useAppSelector } from "@/state/hooks";
import { useUI } from "@/hooks";
import { getVaultUpTime } from "@/utils/vault";

type Props = {
  vault: VaultInfo;
};

export default function VaultDetails({ vault }: Props) {
  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);
  const router = useRouter();
  const { showDepositModal, showConnectModal } = useUI();

  const getVaultWithPosition = () => {
    let userPositionRaw = BigNumber.from(0);
    let userNftPortfolios: any[] = [];

    if (account) {
      if (vault.fungible) {
        userPositionRaw = vault?.userInfo?.depositAmnt || BigNumber.from(0);
      } else {
        const userNfts = vault?.userInfo?.nftsRaw || [];
        userNftPortfolios =
          vault.address === DEFAULT_AGGREGATOR_VAULT[activeChainId]
            ? getNftPortfolios(loans, userNfts)
            : [];

        userNftPortfolios.map((row1: any) => {
          userPositionRaw = userPositionRaw.add(row1.value);
          return row1;
        });
      }
    }

    return {
      ...vault,
      userPositionRaw,
      userPosition: getBalanceInEther(userPositionRaw),
      userNftPortfolios,
    };
  };

  const { userPosition } = getVaultWithPosition();

  const getVaultHistoricalApy = () => {
    const aprField = activeChainId === 1 ? "actual_returns" : "expected_return";
    return (
      (activeChainId === 1 ? 1 : 100) *
      (vault?.okrs ? vault?.okrs[aprField] : 0)
    );
  };

  const getExpectedReturn = () => ((vault?.tvl || 0) * (vault?.apr || 0)) / 100;
  const isWithdrawOnly = vault.deprecated;

  return (
    <div className="relative hidden md:flex tracking-wide w-full h-[calc(100vh-112px)] mt-[80px] px-8 pb-5 gap-5 overflow-hidden">
      <div className="flex flex-col min-w-[35%] w-[41%] gap-5 pt-1">
        <Card className="gap-3 !py-3">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <Image
                className="border-1 border-gray-200 rounded-full"
                src={vault.logo}
                width={40}
                height={40}
                alt=""
              />
              <h2 className="font-bold text-white font-base">
                {vault?.readable || vault?.name}
                {isWithdrawOnly ? " [WITHDRAW ONLY]" : ""}
              </h2>
            </div>
            <div className="hidden xl:flex items-center justify-end gap-5 flex-1">
              <Button
                type="primary"
                className="h-9 flex-1 max-w-[148px] px-2"
                onClick={() => {
                  if (account) {
                    showDepositModal(vault);
                  } else {
                    handleConnect();
                  }
                }}
              >
                <span className="text-base">
                  {isWithdrawOnly ? "WITHDRAW" : "DEPOSIT"}
                </span>
              </Button>
              {userPosition > 0 && (
                <Button
                  type="secondary"
                  className="h-9 flex-1 max-w-[148px] px-2"
                  onClick={() => {
                    router.push(`/portfolio`);
                  }}
                >
                  <span className="text-base">POSITION</span>
                </Button>
              )}
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
              value={`Ξ${(vault.tvl || 0).toFixed(2)}`}
            />
            <Stats
              title="Total Earnings"
              value={`Ξ${getExpectedReturn().toFixed(2)}`}
            />
            <Stats
              title="Historical APY"
              value={`${getVaultHistoricalApy().toFixed(2)}%`}
            />
            <Stats
              className="hidden xl:flex"
              title="Up Time"
              value={`${getVaultUpTime(vault?.address)}d`}
            />
          </div>
        </Card>
        {!vault.isBlur && vault.receiptToken === ReceiptToken.NFT && (
          <PrologueNfts
            vault={vault}
            walletConnectRequired={false}
            className="h-[30%]"
          />
        )}

        {vault.isBlur ? (
          <div className="flex flex-col h-full gap-5">
            <BlurLeaderboard vault={vault} showIcon onlyPts />
            <BlurLeaderboard
              vault={vault}
              showIcon
              nonExpandedClassName="flex-1"
              showAccumulated
            />
          </div>
        ) : (
          <LoanBreakdown
            vault={vault}
            walletConnectRequired={false}
            className="flex-1 h-[34%]"
          />
        )}
      </div>

      <DetailChart vault={vault} />
    </div>
  );
}
