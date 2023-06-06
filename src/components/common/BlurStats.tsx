import Tooltip from "./Tooltip";
import Button from "@mui/material/Button";
import QuestionSVG from "@/assets/icons/question.svg";

type Props = {
  title: string;
  value: string;
  tooltip: string;
  className?: string;
  type?: "orange";
};

const containerStyles = {
  default: "border-gray-200",
  orange: "border-orange-200 drop-shadow-orange-200",
};

const titleStyles = {
  default: "text-gray-200",
  orange: "text-orange-200",
};

const styles = {
  default: "!text-gray-200",
  orange: "!text-orange-200 !text-shadow-orange-900",
};

export default function BlurStats({
  title,
  value,
  className,
  tooltip,
  type,
}: Props) {
  return (
    <div
      className={`flex flex-col tracking-normal border-2 rounded-lg px-3 py-2 gap-1 items-center ${
        containerStyles[type ?? "default"]
      } ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-1  ${
          titleStyles[type ?? "default"]
        }`}
      >
        <span className={`text-sm font-medium ${styles[type ?? "default"]}`}>
          {title}
        </span>
        <Tooltip tooltip={tooltip} className={styles[type ?? "default"]}>
          <QuestionSVG />
        </Tooltip>
      </div>
      <span className={`font-bold text-xs ${styles[type ?? "default"]}`}>
        {value}
      </span>
    </div>
  );
}
