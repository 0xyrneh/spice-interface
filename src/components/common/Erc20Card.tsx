import { PrologueNft } from "@/types/nft";

type Props = {
  className?: string;
  footerClassName?: string;
  nft: PrologueNft;
  expanded?: boolean;
};

export default function Erc20Card({
  nft,
  className,
  footerClassName,
  expanded,
}: Props) {
  return (
    <div
      key={`prologue-nft`}
      className={`rounded flex flex-col font-bold ${className} border-1 border-transparent text-white`}
    >
      <div
        className="flex flex-col w-full bg-cover aspect-square relative justify-center"
        style={{
          backgroundImage: `url(${nft.icon})`,
        }}
      />
      <div
        className={`rounded-b flex items-center justify-center bg-gray-700 text-base p-2 ${
          expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
        } ${footerClassName}`}
      >
        <span className="text-white">Your Position: Ξ30</span>
      </div>
    </div>
  );
}
