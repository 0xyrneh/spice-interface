import { useScrollLock, useUI } from "@/hooks";
import { ReactNode, useEffect } from "react";

export interface ModalProps {
  open?: boolean;
  children?: ReactNode | ReactNode[];
  onClose?: () => void;
}

export default function Modal({ children, open, onClose }: ModalProps) {
  const { setBlur } = useUI();
  const { lockScroll, unlockScroll } = useScrollLock();

  useEffect(() => {
    setBlur(!!open);

    if (open) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [open, setBlur, lockScroll, unlockScroll]);

  return (
    <div
      className={`fixed left-0 top-0 right-0 bottom-0 z-50 items-center justify-center ${
        open ? "hidden md:flex" : "hidden"
      }`}
    >
      <div
        className={`fixed left-0 top-0 right-0 bottom-0`}
        onClick={onClose}
      />
      {children}
    </div>
  );
}
