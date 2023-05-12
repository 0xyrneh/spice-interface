import { ReactNode } from "react";

export interface ModalProps {
  open?: boolean;
  children?: ReactNode | ReactNode[];
  onClose?: () => void;
}

export default function Modal({ children, open, onClose }: ModalProps) {
  return (
    <div
      className={`fixed left-0 top-0 right-0 bottom-0 bg-opacity-40 z-50 bg-black items-center justify-center ${
        open ? "flex" : "hidden"
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
