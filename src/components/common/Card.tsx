import { ReactNode, useEffect, useRef, useState } from "react";
import { useUI } from "@/hooks";
import { motion } from "framer-motion";

type Props = {
  className?: string;
  children: ReactNode | ReactNode[];
  expanded?: boolean;
  notBlur?: boolean;
  animate?: boolean;
  onCollapse?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
};

const Card = ({
  className,
  children,
  expanded,
  onCollapse,
  animate,
  notBlur,
  onMouseLeave,
  onClick,
}: Props) => {
  const { blur } = useUI();
  const comp = useRef();

  const onLayoutAnimationComplete = () => {
    if (!expanded) {
      (comp.current as any).style.zIndex = "0";
    }
  };

  useEffect(() => {
    if (expanded) {
      (comp.current as any).style.zIndex = "50";
    }
  }, [expanded]);

  return (
    <>
      {expanded && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-10"
          onClick={onCollapse}
        />
      )}
      <motion.div
        ref={comp as any}
        layout
        transition={{ duration: animate ? (expanded ? 0.4 : 0) : 0 }}
        onLayoutAnimationComplete={onLayoutAnimationComplete}
        className={`flex flex-col bg-gray-700 rounded shadow-card px-4 py-5 ${className} ${
          expanded
            ? "absolute top-5 left-[calc(50vw-min(1176px,100vw-104px)/2)] w-[calc(min(1176px,100vw-104px))] bottom-10 bg-opacity-95"
            : "bg-opacity-80"
        } ${!notBlur && blur && !expanded ? "blur-[5px]" : ""}`}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </>
  );
};

export default Card;
