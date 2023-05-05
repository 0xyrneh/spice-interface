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
        className={`flex flex-col bg-gray-700 rounded shadow-card px-4 py-5 ${className} ${
          expanded
            ? "absolute top-5 left-[52px] right-[52px] bottom-10 z-50 bg-opacity-95"
            : "bg-opacity-80"
        } ${blur && !expanded ? "blur-[2px]" : ""}`}
      >
        {children}
      </div>
    </>
  );
};

export default Card;
