import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";

type Props = {
  text: string;
  width?: number;
  height?: number;
  className?: string;
};

const CopyClipboard = ({ text, width, height, className }: Props) => {
  const [isCopied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <CopyToClipboard onCopy={onCopy} text={text}>
      <button className={`${className || "min-w-[24px] min-h-[24px]"}`}>
        <Image
          src={isCopied ? "/assets/icons/check.svg" : "/assets/icons/copy.svg"}
          width={width || 24}
          height={height || 24}
          alt=""
          className="cursor-pointer"
        />
      </button>
    </CopyToClipboard>
  );
};

export default CopyClipboard;
