import { useEffect, useRef, ReactNode } from "react";

type Props = {
  children: ReactNode[];
  opened: boolean;
  onClose?: () => void;
};

function Dropdown({ children, opened, onClose }: Props) {
  const options = useRef();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        options &&
        options.current &&
        !(options.current as any).contains(event.target) &&
        onClose
      ) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose]);

  return (
    <div ref={options as any} className="relative">
      {children[0]}
      {opened && <div className="absolute z-10 w-full">{children[1]}</div>}
    </div>
  );
}

export default Dropdown;
