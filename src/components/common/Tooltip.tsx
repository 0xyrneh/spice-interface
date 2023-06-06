import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { ReactNode } from "react";

type Props = {
  tooltip: string;
  className?: string;
  children: ReactNode;
};

export default function TooltipComp({ className, tooltip, children }: Props) {
  return (
    <Tooltip
      title={tooltip}
      classes={{
        tooltip:
          "!bg-gray-700 !bg-opacity-95 !border-1 !border-gray-200 !border-opacity-30 !text-sm !font-medium !font-SpaceGrotesk !tracking-normal",
      }}
      className={`!min-w-[14px] !p-0 ${className}`}
      placement="top-end"
    >
      <Button variant="text" size="small">
        {children}
      </Button>
    </Tooltip>
  );
}
