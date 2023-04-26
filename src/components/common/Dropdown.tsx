import { useState, useEffect, useRef } from "react";
import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import CheckedSVG from "@/assets/icons/checked.svg";
import UncheckedSVG from "@/assets/icons/unchecked.svg";

type Props = {
  className?: string;
  title: string;
  items: string[];
  values: string[];
  multiple?: boolean;
  onChange: (items: string[] | string) => void;
};

const Dropdown = ({
  className,
  title,
  items,
  values,
  multiple,
  onChange,
}: Props) => {
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
      <Listbox value={title} onChange={handleOnChange} multiple={multiple}>
        <Listbox.Button
          className={`w-full h-8 px-3 border-1 text-left border-gray-200 flex items-center justify-between text-xs text-white ${
            opened ? "rounded-t" : "rounded"
          }`}
          onClick={() => setOpened(!opened)}
        >
          {title}
          <FaChevronDown />
        </Listbox.Button>
        <div
          className={`absolute w-full top-[31px] px-3 text-xs text-white bg-black border-1 border-gray-200 px-2 rounded-b max-h-[320px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 ${
            opened ? "flex flex-col" : "hidden"
          }`}
        >
          {items.map((item) => (
            <button
              className="h-8 min-h-[32px] flex items-center cursor-pointer gap-2"
              key={item}
              onClick={() => handleSelect(item)}
            >
              {multiple &&
                (values.includes(item) ? (
                  <div className="w-min-[16px]">
                    <CheckedSVG class="w-4 h-[17px]" />
                  </div>
                ) : (
                  <div className="w-min-[16px]">
                    <UncheckedSVG class="w-4 h-[17px]" />
                  </div>
                ))}
              <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                {item}
              </span>
            </button>
          ))}
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
