import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LeverageTab } from "./LeverageInput";
import { VaultInfo } from "@/types/vault";
import ArrowLeftSVG from "@/assets/icons/arrow-left.svg";
import { TxStatus, ActionStatus } from "@/types/common";
import { PrologueNftPortofolioInfo } from "@/types/nft";
import { useAppSelector } from "@/state/hooks";
import PositionConfirm from "./PositionConfirm";
import LeverageConfirm from "./LeverageConfirm";
import { Card } from "../../common";
import {
  setActionStatus,
  setActionError,
  setPendingTxHash,
} from "@/state/modal/modalSlice";

interface Props {
  nft: PrologueNftPortofolioInfo | undefined;
  vault: VaultInfo;
  netApy: number;
  sliderStep: number;
  targetAmount: string;
  oldPosition: string;
  positionChange: string;
  newPosition: string;
  positionSelected: boolean;
  isDeposit: boolean;
  isApprove: boolean;
  positionStatus: TxStatus;

  leverageTab: LeverageTab;
  show: boolean;
  hiding: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onLeverageMaxClicked: () => void;
  onSetSliderStep: (step: number) => void;
  onSetTargetAmount: (value: string) => void;
}

export default function ConfirmPopup(props: Props) {
  const {
    nft,
    vault,
    netApy,
    sliderStep,
    targetAmount,
    oldPosition,
    positionChange,
    newPosition,
    isDeposit,
    isApprove,
    positionStatus,
    leverageTab,
    onLeverageMaxClicked,
    onConfirm,
    show,
    onClose,
    onSetSliderStep,
    onSetTargetAmount,
  } = props;

  const [positionSelected, setPositionSelected] = useState(false);

  const dispatch = useDispatch();
  const { actionStatus } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (!props.hiding) {
      setPositionSelected(props.positionSelected);
    }
  }, [props.hiding, props.positionSelected]);

  useEffect(() => {
    dispatch(setActionError(undefined));
    dispatch(setPendingTxHash(""));
  }, [show]);

  const processing = () => {
    if (positionSelected) {
      return positionStatus === TxStatus.Pending;
    } else {
      return actionStatus === ActionStatus.Pending;
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
          disabled={processing()}
          onClick={onClose}
        >
          <ArrowLeftSVG />
          Back
        </button>
        {positionSelected ? (
          <PositionConfirm
            oldPosition={oldPosition}
            positionChange={positionChange}
            newPosition={newPosition}
            isDeposit={isDeposit}
            isApprove={isApprove}
            txStatus={positionStatus}
            onConfirm={onConfirm}
            hiding={props.hiding}
          />
        ) : nft ? (
          <LeverageConfirm
            nft={nft}
            netApy={netApy}
            sliderStep={sliderStep}
            targetAmount={targetAmount}
            isOpen={show}
            tab={leverageTab}
            onMaxClicked={onLeverageMaxClicked}
            hiding={props.hiding}
            onClose={onClose}
            onSetSliderStep={onSetSliderStep}
            onSetTargetAmount={onSetTargetAmount}
          />
        ) : (
          false
        )}
      </Card>
    </div>
  );
}
