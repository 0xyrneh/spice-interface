import { TxStatus } from "@/types/common";
import { Button, Stats } from "../common";
import { useEffect, useState } from "react";

interface Props {
  isDeposit: boolean;
  txStatus: TxStatus;
  hiding?: boolean;
  onConfirm: () => void;
}

export default function PositionConfirm(props: Props) {
  const [dots, setDots] = useState("");
  const [dotsTimer, setDotsTimer] = useState<NodeJS.Timer>();
  const [isDeposit, setIsDeposit] = useState(false);
  const { txStatus, onConfirm } = props;

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
      return "Finish";
    } else {
      return isDeposit ? "DEPOSIT" : "WITHDRAW";
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
        value="Ξ30.00"
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Stats
        title={isDeposit ? "Deposit" : "Withdraw"}
        value="Ξ30.00"
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Stats
        title="New Position"
        value="Ξ30.00"
        type={processing() ? "gray" : undefined}
        size="xs"
      />
      <Button
        type={processing() ? "secondary" : "primary"}
        disabled={processing()}
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
