import prologueNfts from "@/constants/prologueNfts";
import { Card, Erc20Card, PrologueNftCard } from "../common";
import PositionInput from "./PositionInput";
import LeverageInput, { LeverageTab } from "./LeverageInput";
import Modal, { ModalProps } from "./Modal";
import { useEffect, useState } from "react";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import { TxStatus } from "@/types/common";
import { ReceiptToken, Vault } from "@/types/vault";

interface Props extends ModalProps {
  vault: Vault;
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
              className="w-[176px] lg:w-[198px]"
              nfts={[prologueNfts[0], prologueNfts[2], prologueNfts[3]]}
              selectedIdx={selectedIdx}
              onItemChanged={(_, idx) => setSelectedIdx(idx)}
              footerClassName="!h-10"
              expanded
            />
          ) : (
            <Erc20Card
              className="w-[176px] lg:w-[198px]"
              nft={prologueNfts[0]}
              footerClassName="!h-10"
              expanded
            />
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
            <PositionInput
              isDeposit={isDeposit}
              setIsDeposit={setIsDeposit}
              useWeth={useWeth}
              toggleEth={() => setUseWeth(!useWeth)}
              value={positionAmount}
              setValue={setPositionAmount}
              txStatus={positionStatus}
              txHash={positionTxHash}
              showTooltip={tooltipVisible}
              onFocus={() => setFocused(true)}
            />
          ) : (
            <LeverageInput
              tab={leverageTab}
              leverage={leverage}
              setLeverage={setLeverage}
              targetLeverage={targetLeverage}
              setTargetLeverage={setTargetLeverage}
              setTab={setLeverageTab}
              txStatus={leverageStatus}
              txHash={leverageTxHash}
              onFocus={() => setFocused(true)}
            />
          )}
        </Card>

        <div
          className={`flex pt-10 h-full ${
            showRightModal()
              ? "w-auto opacity-100"
              : "w-0 max-w-0 overflow-x-hidden opacity-0"
          } transition-all duration-[1000ms] ease-in`}
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
              />
            )}
          </Card>
        </div>
      </div>
    </Modal>
  );
}
