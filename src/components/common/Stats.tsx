type Props = {
  title: string;
  value: string;
  className?: string;
  type?: "green" | "gray";
  size?: "xs" | "sm" | "lg";
};

const valueStyles = {
  default: "text-orange-200 drop-shadow-orange-200",
  green: "text-green drop-shadow-green",
  gray: "text-gray-200",
};

export default function Stats({ title, value, className, type, size }: Props) {
  return (
    <div className={`flex flex-col tracking-normal ${className}`}>
      <span
        className={`${
          size ? "text-" + size : "text-sm"
        } font-medium text-gray-200`}
      >
        {title}
      </span>
      <span className={`font-bold text-xl ${valueStyles[type ?? "default"]}`}>
        {value}
      </span>
    </div>
  );
}
