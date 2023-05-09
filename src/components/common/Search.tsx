import SearchSVG from "@/assets/icons/search.svg";

type Props = {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function Search({
  className,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div
      className={`${className} flex flex-1 xl:flex-none text-gray-200 font-medium text-xs rounded border-1 border-gray-200 items-center gap-3 px-3 h-max-8 h-8 hover:text-gray-300 hover:border-gray-300`}
    >
      <SearchSVG />
      <input
        className="min-w-[0px] flex-1 text-white font-medium bg-transparent outline-0 placeholder:text-gray-200 placeholder:text-opacity-50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
