import { ReactNode } from "react";
import { useUI } from "@/hooks";

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
  expanded?: boolean;
  onCollapse?: () => void;
};

const Card = ({ className, children, expanded, onCollapse }: Props) => {
  const { blur } = useUI();

  return (
    <>
      {expanded && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-10"
          onClick={onCollapse}
        />
      )}
      <div
        className={`ease-linear flex flex-col bg-gray-700 rounded shadow-card px-4 py-5 ${className} ${
          expanded
            ? "absolute top-5 left-1/2 -translate-x-1/2 w-[calc(min(1176px,100vw-104px))] bottom-10 z-50 bg-opacity-95"
            : "bg-opacity-80"
        } ${blur && !expanded ? "blur-[5px]" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default Card;
