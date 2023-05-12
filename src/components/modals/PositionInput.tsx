import { Button, Card } from "../common";
import WethSVG from "@/assets/icons/weth.svg";

type Props = {
  isDeposit: boolean;
  setIsDeposit: (isDeposit: boolean) => void;
};

export default function PositionInput({ isDeposit, setIsDeposit }: Props) {
  return (
    <div className="flex flex-col px-2 pt-3 pb-10 flex-1">
      <div className="flex items-center gap-2">
        <Button
          type={isDeposit ? "third" : "secondary"}
          className={`h-6 w-[78px] flex items-center justify-center border-0 ${
            isDeposit ? "" : "shadow-transparent"
          }`}
          onClick={() => setIsDeposit(true)}
        >
          <span className="text-xs">DEPOSIT</span>
        </Button>
        <Button
          type={!isDeposit ? "third" : "secondary"}
          className={`h-6 w-[78px] flex items-center justify-center border-0 ${
            !isDeposit ? "" : "shadow-transparent"
          }`}
          onClick={() => setIsDeposit(false)}
        >
          <span className="text-xs">WITHDRAW</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="mx-2.5 border-1 border-gray-200 shadow-transparent px-8 py-5 text-gray-200 gap-1 text-xs max-w-[324px] w-full">
          <div className="flex items-center justify-between">
            <input
              className="text-2xl bg-transparent outline-0 w-[100px] flex-1"
              placeholder="0.000"
            />
            <div className="flex items-center gap-2 bg-gray-200 bg-opacity-20 h-7 rounded px-3">
              <WethSVG />
              <span className="text-white text-base">WETH</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">$0.00</span>
            <div className="flex items-center gap-2">
              <span className="">Balance: 1.245</span>
              <Button className="text-orange-900 text-shadow-orange-900">
                MAX
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
