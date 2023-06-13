import Image from "next/image";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";

import { Button, Card } from "@/components/common";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import { VaultInfo } from "@/types/vault";
import { activeChainId } from "@/utils/web3";
import { useWeb3React } from "@web3-react/core";
import { getNftPortfolios } from "@/utils/nft";
import { getBalanceInEther } from "@/utils/formatBalance";
import { accLoans } from "@/utils/lend";
import { DEFAULT_AGGREGATOR_VAULT } from "@/config/constants/vault";
import { useAppSelector } from "@/state/hooks";
import { useUI } from "@/hooks";

type Props = {
  vault: VaultInfo;
  showFullDesc?: boolean;
  onShowFullDesc?: () => void;
  onHideFullDesc?: () => void;
};

export default function VaultDesc({
  vault,
  showFullDesc,
  onShowFullDesc,
  onHideFullDesc,
}: Props) {
  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const loans = accLoans(lendData);
  const router = useRouter();
  const { showDepositModal } = useUI();

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

  const isWithdrawOnly = vault.deprecated;

  return (
    <Card
      className={`gap-3 !py-3 ${
        showFullDesc ? "absolute top-0 !z-50 bg-opacity-95" : ""
      }`}
      onMouseLeave={onHideFullDesc}
    >
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
          {account && (
            <Button
              type="primary"
              className="h-9 flex-1 max-w-[148px] px-2"
              onClick={() => {
                showDepositModal({ vault: vault });
              }}
            >
              <span className="text-base">
                {isWithdrawOnly ? "WITHDRAW" : "DEPOSIT"}
              </span>
            </Button>
          )}

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
      {showFullDesc ? (
        <div className="tracking-normal text-white text-xs font-medium leading-4 h-auto relative">
          Requirement: {vault.requirement ?? "N/A"}
          <br />
          <br />
          {vault.description}
        </div>
      ) : (
        <div
          className="tracking-normal text-white text-xs font-medium leading-4 h-auto relative overflow-hidden xl:h-8 whitespace-nowrap xl:whitespace-normal"
          onMouseEnter={onShowFullDesc}
        >
          {vault.description}
        </div>
      )}
      <div className="flex xl:hidden items-center gap-5 flex-1">
        <Button type="primary" className="h-9 flex-1">
          <span className="text-base font-bold">DEPOSIT</span>
        </Button>
        <Button type="secondary" className="h-9 flex-1">
          <span className="text-base font-bold">POSITION</span>
        </Button>
      </div>
    </Card>
  );
}
