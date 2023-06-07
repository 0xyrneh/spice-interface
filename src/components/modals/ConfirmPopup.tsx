import { useEffect, useState } from "react";
import { LeverageTab } from "./LeverageInput";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import { TxStatus } from "@/types/common";
import { VaultInfo } from "@/types/vault";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import { Card } from "../common";

interface Props {
  vault: VaultInfo;
  positionSelected: boolean;
  isDeposit: boolean;
  positionStatus: TxStatus;

  leverageTab: LeverageTab;
  leverageStatus: TxStatus;
  show: boolean;
  hiding: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onLeverageMaxClicked: () => void;
}

export default function DepositModal(props: Props) {
  const {
    vault,
    isDeposit,
    positionStatus,
    leverageTab,
    leverageStatus,
    onLeverageMaxClicked,
    onConfirm,
    show,
    onClose,
  } = props;

  const [positionSelected, setPositionSelected] = useState(false);

  useEffect(() => {
    if (!props.hiding) {
      setPositionSelected(props.positionSelected);
    }
  }, [props.hiding, props.positionSelected]);

  const processing = () => {
    if (positionSelected) {
      return positionStatus === TxStatus.Pending;
    } else {
      return leverageStatus === TxStatus.Pending;
    }
  };

  return (
    <div
      className={`flex pt-10 h-full ${
        show ? "max-w-[1000px] opacity-100" : "max-w-[0] opacity-0"
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
          onClick={onClose}
        >
          <ArrowLeftSVG />
          Back
        </button>
        {positionSelected ? (
          <PositionConfirm
            isDeposit={isDeposit}
            txStatus={positionStatus}
            onConfirm={onConfirm}
            hiding={props.hiding}
          />
        ) : (
          <LeverageConfirm
            txStatus={leverageStatus}
            onConfirm={onConfirm}
            tab={leverageTab}
            onMaxClicked={onLeverageMaxClicked}
            hiding={props.hiding}
          />
        )}
      </Card>
    </div>
  );
}
