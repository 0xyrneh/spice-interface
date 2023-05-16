import { TxStatus } from "@/types/common";
import { Button, Stats } from "../common";
import { useEffect, useState } from "react";

interface Props {
  isDeposit: boolean;
  txStatus: TxStatus;
  onConfirm: () => void;
}

export default function PositionConfirm({
  isDeposit,
  txStatus,
  onConfirm,
}: Props) {
  const [dots, setDots] = useState("");
  const [dotsTimer, setDotsTimer] = useState<NodeJS.Timer>();

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
        className={`font-base ${processing() ? "text-gray-200" : "text-white"}`}
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
        title="Deposit"
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
