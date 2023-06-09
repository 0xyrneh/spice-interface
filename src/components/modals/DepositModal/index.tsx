import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import LeverageInput, { LeverageTab } from "./LeverageInput";
import Modal, { ModalProps } from "../Modal";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import { TxStatus } from "@/types/common";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { PrologueNftInfo } from "@/types/nft";
import { useAppSelector } from "@/state/hooks";
import { accLoans } from "@/utils/lend";
import { getBalanceInEther, getBalanceInWei } from "@/utils/formatBalance";
import { Button, Card, Erc20Card, PrologueNftCard } from "../../common";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import PositionInput from "./PositionInput";
import { YEAR_IN_SECONDS } from "@/config/constants/time";
import { getNetApy } from "@/utils/apy";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import ConfirmPopup from "./ConfirmPopup";

interface Props extends ModalProps {
  vault: VaultInfo;
  defaultNftId?: number;
  isLeverageModal?: boolean;
}

export default function DepositModal({
  open,
  defaultNftId,
  isLeverageModal,
  vault,
  onClose,
}: Props) {
  const [positionSelected, setPositionSelected] = useState(true);
  const [leverageTab, setLeverageTab] = useState(LeverageTab.Increase);
  const [positionAmount, setPositionAmount] = useState("");
  const [isDeposit, setIsDeposit] = useState(true);
  const [leverage, setLeverage] = useState(0);
  const [targetLeverage, setTargetLeverage] = useState("");
  const [useWeth, setUseWeth] = useState(true);
  const [positionTxHash, setPositionTxHash] = useState<string>();
  const [positionStatus, setPositionStatus] = useState(TxStatus.None);
  const [leverageTxHash, setLeverageTxHash] = useState<string>();
  const [leverageStatus, setLeverageStatus] = useState(TxStatus.None);
  const [selectedNftId, setSelectedNftId] = useState<number | undefined>();
  const [focused, setFocused] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [leverageHover, setLeverageHover] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);
  const [myNfts, setMyNfts] = useState<PrologueNftInfo[]>([]);
  const [hiding, setHiding] = useState(false);

  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);

  const loans = accLoans(lendData);
  const userNfts = vault?.userInfo?.nftsRaw || [];
  const isDeprecatedVault = vault?.deprecated;
  const selectedNft = myNfts.find((nft) => nft.tokenId === selectedNftId);

  const handleHidePopup = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
    }, 700);
  };

  useEffect(() => {
    setTooltipVisible(leverageHover || tooltipHover);

    if (selectedNft && !selectedNft.isEscrowed) {
      if (leverageTab == LeverageTab.LeverUp) return;
      setLeverageTab(LeverageTab.LeverUp);
    } else {
      if (
        [
          LeverageTab.Increase,
          LeverageTab.Decrease,
          LeverageTab.Refinance,
        ].includes(leverageTab)
      )
        return;

      setLeverageTab(LeverageTab.Increase);
    }
  }, [selectedNft]);

  useEffect(() => {
    setTooltipVisible(leverageHover || tooltipHover);
  }, [leverageHover, tooltipHover]);

  // fetch nft information from backend
  const fetchData = async () => {
    if (!account) {
      return;
    }

    const myNfts = loans.map((row: any) => {
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
        const vaultApy = (vault?.apr || 0) / 100;

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

    setMyNfts([...myNfts]);
  };

  useEffect(() => {
    if (defaultNftId) {
      setSelectedNftId(defaultNftId);
    }
  }, [defaultNftId]);

  useEffect(() => {
    setTooltipVisible(false);
    setPositionSelected(isLeverageModal ? false : true);
    setIsDeposit(true);
    setLeverageTab(LeverageTab.Increase);
  }, [open, isLeverageModal, vault, onClose]);

  useEffect(() => {
    if (vault?.address) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address, account]);

  const reset = () => {
    setPositionAmount("");
    setLeverage(leverageTab === LeverageTab.Decrease ? 150 : 0);
    setTargetLeverage("");
    setPositionTxHash(undefined);
    setPositionStatus(TxStatus.None);
    setLeverageTxHash(undefined);
    setLeverageStatus(TxStatus.None);
    setClosed(false);
    setFocused(false);
  };

  const onConfirmPosition = () => {
    if (positionStatus === TxStatus.None) {
      setPositionStatus(TxStatus.Pending);
      setPositionTxHash("0xabcdef");
      setTimeout(() => {
        setPositionStatus(TxStatus.Finish);
      }, 5000);
    } else if (positionStatus === TxStatus.Finish) {
      reset();
    }
  };

  const onConfirmLeverage = () => {
    if (leverageStatus === TxStatus.None) {
      setLeverageStatus(TxStatus.Pending);
      setLeverageTxHash("0xabcdef");
      setTimeout(() => {
        setLeverageStatus(TxStatus.Finish);
      }, 5000);
    } else if (leverageStatus === TxStatus.Finish) {
      reset();
    }
  };

  const showRightModal = useCallback(() => {
    if (closed) return false;
    if (focused) return true;
    if (positionSelected) {
      return positionAmount !== "";
    } else {
      return (
        leverageTab === LeverageTab.Refinance ||
        (leverageTab === LeverageTab.Decrease
          ? leverage < 150
          : leverage > 0) ||
        targetLeverage !== ""
      );
    }
  }, [
    closed,
    focused,
    positionSelected,
    positionAmount,
    leverageTab,
    leverage,
    targetLeverage,
  ]);

  useEffect(() => {
    setClosed(false);
    setFocused(false);
  }, [positionAmount, leverage, targetLeverage]);

  useEffect(() => {
    setClosed(false);
  }, [focused]);

  useEffect(() => {
    reset();
  }, [isDeposit, positionSelected, leverageTab]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-8 flex items-center gap-3 font-medium h-[364px] max-w-[864px] z-50">
        <div className="flex flex-col gap-3 pt-10 h-full">
          <Card
            className="!pt-4 !pb-2 !px-2 justify-center items-center leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95"
            notBlur
          >
            <h2 className="font-base text-white leading-5">
              {vault?.readable || ""}
            </h2>
            <div className="flex flex-col lg:flex-row gap-x-3 font-bold text-base text-orange-200 my-1 tracking-tight">
              <div className="flex gap-1 items-center">
                <span className="drop-shadow-orange-200 leading-5">Ξ300.5</span>
                <span className="text-xs text-gray-200">TVL</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="drop-shadow-orange-200 leading-5">12.00%</span>
                <span className="text-xs text-gray-200">APY</span>
              </div>
            </div>
          </Card>
          {vault.receiptToken === ReceiptToken.NFT ? (
            <PrologueNftCard
              containerClassName="w-[176px] lg:w-[198px]"
              nfts={myNfts}
              selectedNftId={selectedNftId}
              onItemChanged={(_: any, idx: number) => setSelectedNftId(idx)}
              footerClassName="!h-10"
              expanded
              showBorder
            />
          ) : (
            <>
              <Erc20Card
                className="w-[176px] lg:w-[198px]"
                bgImg={vault.logo}
                footerClassName="!h-10"
                expanded
              />
            </>
          )}
        </div>
        <Card
          className="flex flex-col border-1 border-gray-200 !py-0 !px-0 h-full flex-1 !bg-gray-700 !bg-opacity-95 w-[calc(min(50vw,500px))] lg:w-[500px]"
          notBlur
        >
          <div className="flex items-center border-b-1 border-gray-200 h-10 text-xs">
            <button
              className={`${
                positionSelected ? "flex-1" : "w-[78px] lg:flex-1 lg:w-auto"
              } h-full transition-all ${
                positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200 hover:text-gray-300"
              }`}
              disabled={positionSelected}
              onClick={() => {
                handleHidePopup();
                setPositionSelected(true);
              }}
            >
              POSITION
            </button>
            <button
              className={`flex-1 h-full transition-all ${
                !positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200"
              } ${
                vault.receiptToken !== ReceiptToken.ERC20
                  ? "hover:text-gray-300"
                  : ""
              }`}
              disabled={!positionSelected}
              onClick={() => {
                if (vault.receiptToken === ReceiptToken.NFT) {
                  handleHidePopup();
                  setPositionSelected(false);
                  if (selectedNft && !selectedNft.isEscrowed) {
                    setLeverageTab(LeverageTab.LeverUp);
                  } else {
                    setLeverageTab(LeverageTab.Increase);
                  }
                }
              }}
              onMouseOver={() => {
                if (vault.receiptToken === ReceiptToken.ERC20) {
                  setLeverageHover(true);
                }
              }}
              onMouseLeave={() => {
                if (vault.receiptToken === ReceiptToken.ERC20) {
                  setLeverageHover(false);
                }
              }}
            >
              LEVERAGE
            </button>
          </div>
          {positionSelected ? (
            <>
              <div className="flex items-center px-2 py-3">
                <div className="flex items-center gap-2 w-1/2 pr-2">
                  {!isDeprecatedVault && (
                    <Button
                      type={isDeposit ? "third" : "secondary"}
                      className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                        isDeposit ? "" : "shadow-transparent"
                      }`}
                      disabled={isDeposit}
                      onClick={() => {
                        handleHidePopup();
                        setIsDeposit(true);
                      }}
                    >
                      <span className="text-xs">DEPOSIT</span>
                    </Button>
                  )}
                  <Button
                    type={
                      !isDeposit || isDeprecatedVault ? "third" : "secondary"
                    }
                    className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                      !isDeposit || isDeprecatedVault
                        ? ""
                        : "shadow-transparent"
                    }`}
                    disabled={!isDeposit || isDeprecatedVault}
                    onClick={() => {
                      handleHidePopup();
                      if (!isDeprecatedVault) {
                        setIsDeposit(false);
                      }
                    }}
                  >
                    <span className="text-xs">WITHDRAW</span>
                  </Button>
                </div>
                {tooltipVisible && (
                  <div
                    className="flex flex-1 -mt-6 ml-2"
                    onMouseEnter={() => setTooltipHover(true)}
                    onMouseLeave={() => setTooltipHover(false)}
                  >
                    <div className="text-gray-200 rounded bg-gray-200 bg-opacity-10 shadow-card flex-1 mt-6 h-6 w-[78px] flex items-center justify-center !border-0 shadow-transparent text-xs gap-1 cursor-pointer">
                      <a className="underline">Prologue NFT</a>
                      <span className="lg:hidden">only.</span>
                      <span className="hidden lg:block">
                        exclusive feature.
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <PositionInput
                isDeposit={isDeposit}
                useWeth={useWeth}
                toggleEth={() => setUseWeth(!useWeth)}
                value={positionAmount}
                setValue={setPositionAmount}
                txStatus={positionStatus}
                txHash={positionTxHash}
                showTooltip={tooltipVisible}
                onFocus={() => setFocused(true)}
              />
            </>
          ) : (
            <>
              <div className="flex flex-row-reverse px-2 py-3">
                {selectedNft && selectedNft.isEscrowed && (
                  <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
                    <Button
                      type={
                        leverageTab === LeverageTab.Increase
                          ? "third"
                          : "secondary"
                      }
                      className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                        leverageTab === LeverageTab.Increase
                          ? ""
                          : "shadow-transparent"
                      }`}
                      disabled={leverageTab === LeverageTab.Increase}
                      onClick={() => {
                        handleHidePopup();
                        setLeverageTab(LeverageTab.Increase);
                      }}
                    >
                      <span className="text-xs">INCREASE</span>
                    </Button>
                    <Button
                      type={
                        leverageTab === LeverageTab.Decrease
                          ? "third"
                          : "secondary"
                      }
                      className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                        leverageTab === LeverageTab.Decrease
                          ? ""
                          : "shadow-transparent"
                      }`}
                      disabled={leverageTab === LeverageTab.Decrease}
                      onClick={() => {
                        handleHidePopup();
                        setLeverageTab(LeverageTab.Decrease);
                      }}
                    >
                      <span className="text-xs">DECREASE</span>
                    </Button>
                    <Button
                      type={
                        leverageTab === LeverageTab.Refinance
                          ? "third"
                          : "secondary"
                      }
                      className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                        leverageTab === LeverageTab.Refinance
                          ? ""
                          : "shadow-transparent"
                      }`}
                      disabled={leverageTab === LeverageTab.Refinance}
                      onClick={() => {
                        handleHidePopup();
                        setLeverageTab(LeverageTab.Refinance);
                      }}
                    >
                      <span className="text-xs">REFINANCE</span>
                    </Button>
                  </div>
                )}
                {selectedNft && !selectedNft.isEscrowed && (
                  <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
                    <Button
                      type={
                        leverageTab === LeverageTab.LeverUp
                          ? "third"
                          : "secondary"
                      }
                      className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                        leverageTab === LeverageTab.LeverUp
                          ? ""
                          : "shadow-transparent"
                      }`}
                      disabled={leverageTab === LeverageTab.LeverUp}
                      onClick={() => setLeverageTab(LeverageTab.LeverUp)}
                    >
                      <span className="text-xs">LEVER UP</span>
                    </Button>
                  </div>
                )}
              </div>
              <LeverageInput
                tab={leverageTab}
                leverage={leverage}
                setLeverage={setLeverage}
                targetLeverage={targetLeverage}
                setTargetLeverage={setTargetLeverage}
                txStatus={leverageStatus}
                txHash={leverageTxHash}
                onFocus={() => setFocused(true)}
              />
            </>
          )}
        </Card>

        <ConfirmPopup
          vault={vault}
          positionSelected={positionSelected}
          isDeposit={isDeposit}
          positionStatus={positionStatus}
          leverageTab={leverageTab}
          leverageStatus={leverageStatus}
          onLeverageMaxClicked={() => {
            setLeverage(150);
            setTargetLeverage("4");
          }}
          show={showRightModal()}
          hiding={hiding}
          onConfirm={() =>
            positionSelected ? onConfirmPosition() : onConfirmLeverage()
          }
          onClose={() => setClosed(true)}
        />
      </div>
    </Modal>
  );
}