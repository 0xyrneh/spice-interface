import Image from "next/image";
import { PrologueNft } from "@/types/nft";

type Props = {
  className?: string;
  footerClassName?: string;
  nft: PrologueNft;
  expanded?: boolean;
};

export default function PrologueNftCard({
  nft,
  className,
  footerClassName,
  expanded,
}: Props) {
  return (
    <div
      key={`prologue-nft`}
      className={`rounded flex flex-col font-bold ${className} border-1 ${
        nft.featured
          ? "border-orange-200 drop-shadow-orange-200 text-shadow-orange-200 text-orange-200"
          : "border-transparent text-white"
      }`}
    >
      <div
        className="flex flex-col w-full bg-cover aspect-square relative justify-center"
        style={{
          backgroundImage: `url(${nft.icon})`,
        }}
      >
        {nft.featured && (
          <Image
            className="absolute -top-1.5 -left-1.5"
            src="/assets/icons/circle-dot.svg"
            width={28}
            height={28}
            alt=""
          />
        )}
        {nft.featured && (
          <span
            className={`text-center font-bold whitespace-nowrap tracking-normal ${
              expanded ? "text-base" : "text-xs md:text-sm xl:text-base"
            }`}
          >
            [LEVERED]
            <br />
            Net APY:
            <br className={expanded ? "lg:hidden" : "2xl:hidden"} /> {nft.apy}%
          </span>
        )}
      </div>
      <div
        className={`flex items-center justify-between bg-gray-700 text-xs p-2 ${
          expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
        } ${footerClassName}`}
      >
        <span>#{nft.rank}</span>
        <span>Ξ{nft.tvl}</span>
      </div>
    </div>
  );
}
