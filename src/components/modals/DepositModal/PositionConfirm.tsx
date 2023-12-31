import { TxStatus } from "@/types/common";
import { Button, Stats } from "../../common";
import { useEffect, useState } from "react";

interface Props {
  oldPosition: string;
  positionChange: string;
  newPosition: string;
  isDeposit: boolean;
  isApprove: boolean;
  txStatus: TxStatus;
  hiding?: boolean;
  disabled: boolean;
  onConfirm: () => void;
}

export default function PositionConfirm(props: Props) {
  const [dots, setDots] = useState("");
  const [dotsTimer, setDotsTimer] = useState<NodeJS.Timer>();
  const [isDeposit, setIsDeposit] = useState(false);
  const { txStatus, disabled, onConfirm } = props;

  useEffect(() => {
    if (!props.hiding) {
      setIsDeposit(props.isDeposit);
    }
  }, [props.hiding, props.isDeposit]);

  useEffect(() => {
    if (dotsTimer) {
      clearInterval(dotsTimer);
      setDotsTimer(undefined);
    }

    if (txStatus === TxStatus.Pending) {
      setDots("");
      setDotsTimer(
        setInterval(() => {
          setDots((prevDots) => {
            let newDots = prevDots + ".";
            if (newDots.length === 4) {
              newDots = "";
            }

            return newDots;
          });
        }, 1000)
      );
    }
  }, [txStatus]);

  const processing = () => txStatus === TxStatus.Pending;
  const confirmTitle = () => {
    if (txStatus === TxStatus.Pending) {
      return "WORKING";
    } else if (txStatus === TxStatus.Finish) {
      return "FINISH";
    } else {
      return isDeposit ? (props.isApprove ? "APPROVE" : "DEPOSIT") : "WITHDRAW";
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <h2
        className={`font-base ${
          processing() ? "text-gray-200" : "text-white"
        } whitespace-nowrap`}
      >
        Position Details
      </h2>
      <Stats
        title="Old Position"
        value={`Ξ${props.oldPosition}`}
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Stats
        title={isDeposit ? "Deposit" : "Withdraw"}
        value={`Ξ${props.positionChange}`}
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Stats
        title="New Position"
        value={`Ξ${props.newPosition}`}
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Button
        type={processing() ? "secondary" : "primary"}
        disabled={processing() || disabled}
        className="h-10 flex items-center justify-center"
        onClick={() => {
          if (!processing()) {
            onConfirm();
          }
        }}
      >
        <span className="text-base">
          {confirmTitle()}
          {txStatus === TxStatus.Pending ? dots : ""}
        </span>
      </Button>
    </div>
  );
}
