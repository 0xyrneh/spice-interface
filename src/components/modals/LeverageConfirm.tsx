import { Button, Stats } from "../common";

interface Props {
  isDeposit: boolean;
}

export default function LeverageConfirm({ isDeposit }: Props) {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <h2 className="font-base text-white">Position Details</h2>
      <Stats title="Old Position" value="Ξ30.00" />
      <Stats title="Deposit" value="Ξ30.00" />
      <Stats title="New Position" value="Ξ30.00" />
      <Button type="primary" className="h-10 flex items-center justify-center">
        <span className="text-base">{isDeposit ? "DEPOSIT" : "WITHDRAW"}</span>
      </Button>
    </div>
  );
}
