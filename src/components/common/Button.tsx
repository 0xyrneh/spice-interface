import { ReactNode, useState } from "react";

type Props = {
  className?: string;
  hoverClassName?: string;
  clickClassName?: string;
  hideHoverStyle?: boolean;
  type?: "primary" | "secondary";
  children: ReactNode | ReactNode[];
  style?: object;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const defaultClass = {
  primary:
    "text-orange-900 border-1 border-orange-900 rounded bg-orange-900 bg-opacity-10 shadow-orange-900",
  secondary:
    "text-gray-200 border-1 border-gray-200 rounded bg-gray-200 bg-opacity-10 shadow-card",
};

const hoverDefaultClass = {
  primary:
    "hover:bg-orange-300 hover:border-orange-300 hover:text-orange-300 hover:bg-opacity-10",
  secondary:
    "hover:bg-orange-300 hover:border-orange-300 hover:text-orange-300 hover:bg-opacity-10",
};

const Button = ({
  className,
  hoverClassName,
  clickClassName,
  hideHoverStyle,
  type,
  style,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  const [clicked, setClicked] = useState(false);

  const handleMouseLeave = () => {
    setClicked(false);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <button
      className={`${type ? defaultClass[type] : ""} ${className} ${
        clicked
          ? clickClassName
          : !hideHoverStyle
          ? (type ? hoverDefaultClass[type] : "") + " " + hoverClassName
          : ""
      }`}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </button>
  );
};

export default Button;
