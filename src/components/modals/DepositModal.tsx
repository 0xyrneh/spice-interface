import prologueNfts from "@/constants/prologueNfts";
import { Card, PrologueNftCard } from "../common";
import PositionInput from "./PositionInput";
import LeverageInput, { LeverageTab } from "./LeverageInput";
import Modal, { ModalProps } from "./Modal";
import { useState } from "react";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import { TxStatus } from "@/types/common";

interface Props extends ModalProps {}

export default function DepositModal({ open, onClose }: Props) {
  const [positionSelected, setPositionSelected] = useState(true);
  const [leverageTab, setLeverageTab] = useState(LeverageTab.Increase);
  const [positionAmount, setPositionAmount] = useState("");
  const [isDeposit, setIsDeposit] = useState(true);
  const [leverage, setLeverage] = useState(0);
  const [levValue, setLevValue] = useState("");
  const [useWeth, setUseWeth] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [positionTxHash, setPositionTxHash] = useState<string>();
  const [positionStatus, setPositionStatus] = useState(TxStatus.None);
  const [leverageTxHash, setLeverageTxHash] = useState<string>();
  const [leverageStatus, setLeverageStatus] = useState(TxStatus.None);

  const onConfirmPosition = () => {
    if (positionStatus === TxStatus.None) {
      setPositionStatus(TxStatus.Pending);
      setPositionTxHash("0xabcdef");
      setTimeout(() => {
        setPositionStatus(TxStatus.Finish);
      }, 3000);
    } else if (positionStatus === TxStatus.Finish) {
      setPositionTxHash(undefined);
      setPositionStatus(TxStatus.None);
    }
  };

  const onConfirmLeverage = () => {
    if (leverageStatus === TxStatus.None) {
      setLeverageStatus(TxStatus.Pending);
      setLeverageTxHash("0xabcdef");
      setTimeout(() => {
        setLeverageStatus(TxStatus.Finish);
      }, 3000);
    } else if (leverageStatus === TxStatus.Finish) {
      setLeverageTxHash(undefined);
      setLeverageStatus(TxStatus.None);
    }
  };

  const showRightModal = () => {
    if (positionSelected) {
      return positionAmount !== "";
    } else {
      return leverage > 0 || levValue !== "";
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-8 flex items-center gap-3 font-medium h-[364px] max-w-[864px] z-50">
        <div className="flex flex-col gap-3 pt-10 h-full">
          <Card className="!py-0 flex-1 justify-center items-center leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95">
            <h2 className="font-base text-white mb-1">Prologue Vault</h2>
            <div className="flex flex-col lg:flex-row lg:gap-3">
              <div className="flex gap-1 items-center">
                <span className="font-bold text-base text-orange-200 drop-shadow-orange-200">
                  Ξ300.5
                </span>
                <span className="text-xs text-gray-200">TVL</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="font-bold text-base text-orange-200 drop-shadow-orange-200">
                  12.00%
                </span>
                <span className="text-xs text-gray-200">APY</span>
              </div>
            </div>
          </Card>
          <PrologueNftCard
            nft={prologueNfts[0]}
            footerClassName="!h-10"
            expanded
          />
        </div>
        <Card className="flex flex-col border-1 border-gray-200 !py-0 !px-0 h-full flex-1 !bg-gray-700 !bg-opacity-95 w-[calc(min(50vw,500px))] lg:w-[500px]">
          <div className="flex items-center border-b-1 border-gray-200 h-10 text-xs">
            <button
              className={`${
                positionSelected ? "flex-1" : "w-[78px] lg:flex-1 lg:w-auto"
              } h-full transition-all ${
                positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200"
              }`}
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
              onClick={() => setPositionSelected(false)}
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
              txHash={positionTxHash}
            />
          ) : (
            <LeverageInput
              tab={leverageTab}
              leverage={leverage}
              setLeverage={setLeverage}
              value={levValue}
              setValue={setLevValue}
              setTab={setLeverageTab}
              txHash={leverageTxHash}
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
          <Card className="flex flex-col border-1 border-gray-200 gap-2 !px-3 h-full justify-between !bg-gray-700 !bg-opacity-95">
            <button
              className={`${
                processing ? "text-gray-200" : "text-orange-900"
              } flex items-center font-medium gap-2`}
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
