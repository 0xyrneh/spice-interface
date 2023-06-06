import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";

import LeverageInput, { LeverageTab } from "./LeverageInput";
import Modal, { ModalProps } from "./Modal";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import { TxStatus } from "@/types/common";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { PrologueNftInfo } from "@/types/nft";
import { useAppSelector } from "@/state/hooks";
import { accLoans } from "@/utils/lend";
import { getBalanceInEther, getBalanceInWei } from "@/utils/formatBalance";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import { Button, Card, Erc20Card, PrologueNftCard } from "../common";
import PositionInput from "./PositionInput";

interface Props extends ModalProps {
  vault: VaultInfo;
}

export default function DepositModal({ open, vault, onClose }: Props) {
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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [nfts, setNfts] = useState<PrologueNftInfo[]>([]);

  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const { allNfts } = useAppSelector((state) => state.nft);

  const loans = accLoans(lendData);
  const userNftIds = loans.map((row: any) => row.tokenId);

  // fetch nft information from backend
  const fetchData = async () => {
    const vaultTvl = vault?.tvl || 0;
    const vaultTotalShares = vault?.totalShares || 0;

    const nfts1 = allNfts.map((row: any) => {
      const tokenId = Number(row.tokenId);
      const isEscrowed = userNftIds.includes(tokenId);
      return {
        owner: row.owner.address,
        amount: getBalanceInEther(
          vaultTotalShares === 0
            ? BigNumber.from(row.shares)
            : BigNumber.from(row.shares)
                .mul(BigNumber.from(getBalanceInWei(vaultTvl.toString())))
                .div(
                  BigNumber.from(getBalanceInWei(vaultTotalShares.toString()))
                )
        ),
        tokenImg: row.tokenImg,
        tokenId,
        isEscrowed,
        apy: isEscrowed ? 45.24 : 0,
      };
    });

    setNfts([...nfts1]);
  };

  useEffect(() => {
    setTooltipVisible(false);
    setPositionSelected(true);
    setIsDeposit(true);
    setLeverageTab(LeverageTab.Increase);
  }, [open, vault, onClose]);

  useEffect(() => {
    if (vault?.address) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address, userNftIds.length]);

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

  const showRightModal = () => {
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
  };

  const processing = () => {
    if (positionSelected) {
      return positionStatus === TxStatus.Pending;
    } else {
      return leverageStatus === TxStatus.Pending;
    }
  };

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

  const userNfts = nfts.filter(
    (row) =>
      row.owner.toLowerCase() === account?.toLowerCase() ||
      userNftIds.includes(row.tokenId)
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-8 flex items-center gap-3 font-medium h-[364px] max-w-[864px] z-50">
        <div className="flex flex-col gap-3 pt-10 h-full">
          <Card
            className="!pt-4 !pb-2 !px-2 justify-center items-center leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95"
            notBlur
          >
            <h2 className="font-base text-white leading-5">Prologue Vault</h2>
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
              nfts={userNfts}
              selectedIdx={selectedIdx}
              onItemChanged={(_, idx) => setSelectedIdx(idx)}
              footerClassName="!h-10"
              expanded
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
                  : "text-gray-200"
              }`}
              disabled={positionSelected}
              onClick={() => setPositionSelected(true)}
            >
              POSITION
            </button>
            <button
              className={`flex-1 h-full transition-all ${
                !positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200"
              }`}
              disabled={!positionSelected}
              onClick={() => {
                if (vault.receiptToken === ReceiptToken.NFT) {
                  setPositionSelected(false);
                }
              }}
              onMouseEnter={() => {
                if (vault.receiptToken === ReceiptToken.ERC20) {
                  setTooltipVisible(true);
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
                  <Button
                    type={isDeposit ? "third" : "secondary"}
                    className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                      isDeposit ? "" : "shadow-transparent"
                    }`}
                    disabled={isDeposit}
                    onClick={() => setIsDeposit(true)}
                  >
                    <span className="text-xs">DEPOSIT</span>
                  </Button>
                  <Button
                    type={!isDeposit ? "third" : "secondary"}
                    className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                      !isDeposit ? "" : "shadow-transparent"
                    }`}
                    disabled={!isDeposit}
                    onClick={() => setIsDeposit(false)}
                  >
                    <span className="text-xs">WITHDRAW</span>
                  </Button>
                </div>
                {tooltipVisible && (
                  <Button
                    type="secondary"
                    className="flex-1 h-6 w-[78px] flex items-center justify-center !border-0 shadow-transparent text-xs gap-1"
                    disabled
                  >
                    <a className="underline">Prologue NFT</a>
                    <span className="lg:hidden">only.</span>
                    <span className="hidden lg:block">exclusive feature.</span>
                  </Button>
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
                    onClick={() => setLeverageTab(LeverageTab.Increase)}
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
                    onClick={() => setLeverageTab(LeverageTab.Decrease)}
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
                    onClick={() => setLeverageTab(LeverageTab.Refinance)}
                  >
                    <span className="text-xs">REFINANCE</span>
                  </Button>
                </div>
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

        <div
          className={`flex pt-10 h-full ${
            showRightModal()
              ? "max-w-[1000px] opacity-100"
              : "max-w-[0] opacity-0"
          } transition-all duration-[700ms]`}
        >
          <Card
            className="flex flex-col border-1 border-gray-200 gap-2 !px-3 h-full justify-between !bg-gray-700 !bg-opacity-95"
            notBlur
          >
            <button
              className={`${
                processing() ? "text-gray-200" : "text-orange-900"
              } flex items-center font-medium gap-2 text-xs leading-[15.31px]`}
              onClick={() => setClosed(true)}
            >
              <ArrowLeftSVG />
              Back
            </button>
            {positionSelected ? (
              <PositionConfirm
                isDeposit={isDeposit}
                txStatus={positionStatus}
                onConfirm={onConfirmPosition}
              />
            ) : (
              <LeverageConfirm
                txStatus={leverageStatus}
                onConfirm={onConfirmLeverage}
                tab={leverageTab}
                onMaxClicked={() => {
                  setLeverage(150);
                  setTargetLeverage("4");
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </Modal>
  );
}
