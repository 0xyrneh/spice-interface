import { PrologueNftInfo } from "@/types/nft";

type Props = {
  className?: string;
  footerClassName?: string;
  bgImg: string;
  expanded?: boolean;
  position?: string;
};

export default function Erc20Card({
  bgImg,
  className,
  footerClassName,
  expanded,
  position,
}: Props) {
  return (
    <div
      key={`prologue-nft`}
      className={`rounded flex flex-col font-bold ${className} border-1 border-gray-200 text-white drop-shadow-sm`}
    >
      <div
        className="flex flex-col w-full bg-cover aspect-square relative justify-center"
        style={{
          backgroundImage: `url(${bgImg})`,
        }}
      />
      <div
        className={`rounded-b flex items-center justify-center bg-gray-700 text-base p-2 ${
          expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
        } ${footerClassName}`}
      >
        <span className="text-white font-bold">Your Position: Ξ{position}</span>
      </div>
    </div>
  );
}
