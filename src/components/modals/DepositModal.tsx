import prologueNfts from "@/constants/prologueNfts";
import { Button, Card, PrologueNftCard, Stats } from "../common";
import PositionInput from "./PositionInput";
import LeverageInput from "./LeverageInput";
import Modal, { ModalProps } from "./Modal";
import { useState } from "react";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import PositionConfirm from "./PositionConfirm";

interface Props extends ModalProps {}

export default function DepositModal({ open, onClose }: Props) {
  const [positionSelected, setPositionSelected] = useState(true);
  const [isDeposit, setIsDeposit] = useState(false);
  const [leverage, setLeverage] = useState(90);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mx-8 w-full flex items-center gap-3 font-medium h-[364px] max-w-[864px] z-50">
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
        <Card className="flex flex-col border-1 border-gray-200 !py-0 !px-0 h-full flex-1 !bg-gray-700 !bg-opacity-95">
          <div className="flex items-center border-b-1 border-gray-200 h-10 text-xs">
            <button
              className={`flex-1 h-full px-10 ${
                positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200"
              }`}
              onClick={() => setPositionSelected(true)}
            >
              POSITION
            </button>
            <button
              className={`flex-1 h-full px-10 ${
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
            <PositionInput isDeposit={isDeposit} setIsDeposit={setIsDeposit} />
          ) : (
            <LeverageInput leverage={leverage} setLeverage={setLeverage} />
          )}
        </Card>
        <div className="flex pt-10 h-full">
          <Card className="flex flex-col border-1 border-gray-200 gap-2 !px-3 h-full justify-between !bg-gray-700 !bg-opacity-95">
            <button className="text-orange-900 flex items-center font-medium gap-2">
              <ArrowLeftSVG />
              Back
            </button>
            <PositionConfirm isDeposit={isDeposit} />
          </Card>
        </div>
      </div>
    </Modal>
  );
}
