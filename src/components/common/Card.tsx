import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
  expanded?: boolean;
};

const Card = ({ className, children, expanded }: Props) => {
  return (
    <div
      className={`flex flex-col bg-gray-700 bg-opacity-80 rounded shadow-card px-4 py-5 ${className} ${
        expanded ? "absolute top-5 left-[52px] right-[52px] bottom-10 z-50" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
