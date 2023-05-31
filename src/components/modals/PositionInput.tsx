import { Button, Card } from "../common";
import WethSVG from "@/assets/icons/weth.svg";
import EthSVG from "@/assets/icons/eth.svg";
import TriangleSVG from "@/assets/icons/triangle.svg";
import { TxStatus } from "@/types/common";

type Props = {
  isDeposit: boolean;
  useWeth: boolean;
  value: string;
  txStatus: TxStatus;
  txHash?: string;
  showTooltip?: boolean;
  setIsDeposit: (isDeposit: boolean) => void;
  setValue: (value: string) => void;
  toggleEth: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PositionInput({
  isDeposit,
  useWeth,
  setIsDeposit,
  toggleEth,
  value,
  setValue,
  txHash,
  txStatus,
  onFocus,
  onBlur,
  showTooltip,
}: Props) {
  const processing = () => txStatus === TxStatus.Pending;

  return (
    <div className="flex flex-col px-2 py-3 flex-1">
      <div className="flex items-center">
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
        {showTooltip && (
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
      <div className="flex flex-1 items-center justify-center">
        <Card
          className="mx-2.5 border-1 border-gray-200 shadow-transparent px-8 py-5 text-gray-200 gap-1 text-xs max-w-[324px] w-full"
          notBlur
        >
          <div className="flex items-center justify-between">
            <input
              className="text-2xl w-[100px] flex-1 hover:placeholder:text-gray-300 placeholder:text-gray-200 text-white"
              placeholder="0.000"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              className="flex items-center gap-2 bg-gray-200 bg-opacity-20 h-7 rounded px-3"
              onClick={toggleEth}
            >
              {useWeth ? <WethSVG /> : <EthSVG />}
              <span className="text-white text-base text-left w-[47px]">
                {useWeth ? "WETH" : "ETH"}
              </span>
              <TriangleSVG className={useWeth ? "" : "rotate-180"} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">$0.00</span>
            <div className="flex items-center gap-2">
              <span className="">Balance: 1.245</span>
              <Button
                className={
                  processing() ? "" : "text-orange-900 text-shadow-orange-900"
                }
              >
                MAX
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-between text-gray-200 text-xs">
        <span className={`${txHash ? "opacity-100" : "opacity-0"}`}>
          Tx Hash:{" "}
          {txHash && (
            <a
              className="underline"
              href="https://etherscan.io"
              target="__blank"
            >
              {txHash}
            </a>
          )}
        </span>
        {!isDeposit && <span>Vault Liquid Balance: Ξ300</span>}
      </div>
    </div>
  );
}
