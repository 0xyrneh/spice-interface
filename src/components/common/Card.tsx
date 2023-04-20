import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
};

const Card = ({ className, children }: Props) => {
  return (
    <div
      className={`flex flex-col bg-gray-700 bg-opacity-80 rounded shadow-white px-4 py-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
