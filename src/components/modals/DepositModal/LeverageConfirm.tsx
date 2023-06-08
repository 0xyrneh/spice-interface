import { TxStatus } from "@/types/common";
import { Button, Stats } from "../../common";
import { LeverageTab } from "./LeverageInput";
import { useEffect, useState } from "react";

interface Props {
  txStatus: TxStatus;
  tab: LeverageTab;
  hiding?: boolean;
  onConfirm: () => void;
  onMaxClicked?: () => void;
}

export default function LeverageConfirm(props: Props) {
  const [dots, setDots] = useState("");
  const [dotsTimer, setDotsTimer] = useState<NodeJS.Timer>();
  const [tab, setTab] = useState(LeverageTab.Increase);
  const { txStatus, onConfirm, onMaxClicked } = props;

  useEffect(() => {
    if (!props.hiding) {
      setTab(props.tab);
    }
  }, [props.hiding, props.tab]);

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
      return tab.toUpperCase();
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-between">
      <h2
        className={`font-base ${
          processing() ? "text-gray-200" : "text-white"
        } whitespace-nowrap`}
      >
        Leverage Details
      </h2>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="NFT Value"
          value="Ξ30.00"
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Net APY"
          value="23.56%"
          size="xs"
          showMax={tab === LeverageTab.LeverUp || tab === LeverageTab.Increase}
          onMaxClicked={onMaxClicked}
        />
      </div>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Debt Owed"
          value="Ξ30.00"
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Borrow APY"
          value="5.09%"
          size="xs"
        />
      </div>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : "green"}
          className="flex-1"
          title="HF"
          value="1.76"
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Auto Reneu"
          value="7d"
          size="xs"
        />
      </div>
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
