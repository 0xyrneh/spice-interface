import { Button, Card } from "../../common";
import WethSVG from "@/assets/icons/weth.svg";
import EthSVG from "@/assets/icons/eth.svg";
import TriangleSVG from "@/assets/icons/triangle.svg";
import { TxStatus } from "@/types/common";
import { getExpolorerUrl, shortenTxHash } from "@/utils/string";
import { useAppSelector } from "@/state/hooks";

type Props = {
  isDeposit: boolean;
  useWeth: boolean;
  value: string;
  txStatus: TxStatus;
  showTooltip?: boolean;
  balance: string;
  usdVal: string;
  vaultBalance: string;
  setValue: (value: string) => void;
  onMax?: () => void;
  toggleEth: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PositionInput({
  isDeposit,
  useWeth,
  toggleEth,
  value,
  setValue,
  onMax,
  txStatus,
  onFocus,
  onBlur,
  showTooltip,
  balance,
  usdVal,
  vaultBalance,
}: Props) {
  const processing = () => txStatus === TxStatus.Pending;

  const { pendingTxHash, actionError } = useAppSelector((state) => state.modal);

  return (
    <div className="flex flex-col px-2 pb-3 flex-1">
      <div className="flex flex-1 items-center justify-center">
        <Card
          className="mx-2.5 border-1 border-gray-200 shadow-transparent px-8 py-5 text-gray-200 gap-1 text-xs max-w-[324px] w-full"
          notBlur
        >
          <div className="flex items-center justify-between">
            <input
              className={`text-2xl w-[100px] flex-1 hover:placeholder:text-gray-300 placeholder:text-gray-200 ${
                processing() ? "text-gray-200" : "text-white"
              }`}
              placeholder="0.000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              disabled={processing()}
            />
            <button
              className="flex items-center gap-2 bg-gray-200 bg-opacity-20 h-7 rounded px-3"
              disabled={processing()}
              onClick={toggleEth}
            >
              {useWeth ? <WethSVG /> : <EthSVG />}
              <span
                className={`${
                  processing() ? "text-gray-200" : "text-white"
                } text-base text-left w-[47px]`}
              >
                {useWeth ? "WETH" : "ETH"}
              </span>
              <TriangleSVG
                className={`${useWeth ? "" : "rotate-180"} ${
                  processing() ? "text-gray-200" : "text-white"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">${usdVal}</span>
            <div className="flex items-center gap-2">
              <span className="">Balance: {balance}</span>
              <Button
                className={
                  processing() ? "" : "text-orange-900 text-shadow-orange-900"
                }
                onClick={onMax}
              >
                MAX
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex justify-between text-gray-200 text-xs">
        <span className={`${pendingTxHash ? "opacity-100" : "opacity-0"}`}>
          {` Tx Hash: `}
          {pendingTxHash && (
            <a
              className="underline"
              href={getExpolorerUrl(pendingTxHash)}
              target="__blank"
            >
              {shortenTxHash(pendingTxHash, 8)}
            </a>
          )}
        </span>
        {isDeposit && (
          <>
            {actionError && (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            )}
          </>
        )}
        {!isDeposit && (
          <>
            {actionError ? (
              <span className="text-red">{`ERROR: ${actionError}`}</span>
            ) : (
              <span>
                <span>Vault Liquid Balance: Ξ{vaultBalance}</span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
