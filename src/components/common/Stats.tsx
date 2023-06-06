type Props = {
  title: string;
  value: string;
  className?: string;
  type?: "green" | "gray";
  size?: "xs" | "sm" | "lg";
  valueSize?: "xl" | "xs" | "sm" | "lg";
  showMax?: boolean;
  onMaxClicked?: () => void;
};

const valueStyles = {
  default: "text-orange-200 drop-shadow-orange-200",
  green: "text-green drop-shadow-green",
  gray: "text-gray-200",
};

const maxStyle = {
  default: "text-orange-900 text-shadow-orange-900-sm",
  green: "",
  gray: "text-gray-200",
};

export default function Stats({
  title,
  value,
  className,
  type,
  size,
  valueSize,
  showMax,
  onMaxClicked,
}: Props) {
  return (
    <div className={`flex flex-col tracking-normal ${className}`}>
      <div className="flex items-center justify-between">
        <span
          className={`${
            size ? "text-" + size : "text-sm"
          } font-medium text-gray-200`}
        >
          {title}
        </span>
        {showMax && (
          <button
            className={`text-[8px] ${maxStyle[type ?? "default"]}`}
            onClick={onMaxClicked}
          >
            MAX
          </button>
        )}
      </div>
      <span
        className={`font-bold ${valueSize ? "text-" + valueSize : "text-xl"} ${
          valueStyles[type ?? "default"]
        }`}
      >
        {value}
      </span>
    </div>
  );
}
