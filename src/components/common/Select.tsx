import { useState, useEffect, useRef, ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
import CheckedSVG from "@/assets/icons/checked.svg";
import UncheckedSVG from "@/assets/icons/unchecked.svg";

type Props = {
  className?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  type?: "primary";
  title: string;
  items: string[];
  values: string[];
  multiple?: boolean;
  itemComponent?: (item: string) => ReactNode;
  onChange: (items: string[] | string) => void;
};

const defaultClass = {
  primary: "border-orange-200 text-orange-200 drop-shadow-orange-200",
  default: "border-gray-200 text-gray-200 hover:text-gray-300 hover:border-gray-300",
};

const defaultOptionsClass = {
  primary: "border-orange-200 text-orange-200",
  default: "border-gray-200 text-gray-200",
};

function Dropdown({
  className,
  dropdownClassName,
  itemClassName,
  type,
  title,
  items,
  values,
  multiple,
  itemComponent,
  onChange,
}: Props) {
  const [opened, setOpened] = useState(false);
  const options = useRef();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        options &&
        options.current &&
        !(options.current as any).contains(event.target)
      ) {
        setOpened(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleOnChange = (items: string[] | string) => {
    if (!multiple) setOpened(false);
    onChange(items);
  };

  const handleSelect = (item: string) => {
    if (multiple) {
      const idx = values.findIndex((_item) => _item === item);
      if (idx === -1) {
        onChange([...values, item]);
      } else {
        const newValues = [...values];
        newValues.splice(idx, 1);
        onChange(newValues);
      }
    } else {
      handleOnChange(item);
    }
  };

  return (
    <div ref={options as any} className={`relative ${className}`}>
      <button
        className={`w-full h-8 px-3 border-1 text-left flex items-center justify-between text-xs ${
          opened ? "rounded-t" : "rounded"
        } ${defaultClass[type ?? "default"]}`}
        onClick={() => setOpened(!opened)}
      >
        <span className="drop-shadow-none">{title}</span>
        <FaChevronDown />
      </button>
      <div
        className={`absolute z-10 w-full top-[31px] px-3 py-[7px] text-xs bg-black border-1 rounded-b max-h-[320px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 ${
          opened ? "flex flex-col" : "hidden"
        } ${defaultOptionsClass[type ?? "default"]} ${dropdownClassName}`}
      >
        {items.map((item) => (
          <button
            className={`h-8 min-h-[32px] flex items-center cursor-pointer gap-2 ${itemClassName}`}
            key={item}
            onClick={() => handleSelect(item)}
          >
            {multiple &&
              (values.includes(item) ? (
                <div className="w-min-[16px]">
                  <CheckedSVG className="w-4 h-[17px]" />
                </div>
              ) : (
                <div className="w-min-[16px]">
                  <UncheckedSVG className="w-4 h-[17px]" />
                </div>
              ))}
            {itemComponent ? (
              itemComponent(item)
            ) : (
              <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                {item}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
