import Image from "next/image";
import { PrologueNft } from "@/types/nft";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type Props = {
  className?: string;
  footerClassName?: string;
  nfts: PrologueNft[];
  selectedIdx?: number;
  onItemChanged?: (nft: PrologueNft, idx: number) => void;
  expanded?: boolean;
};

export default function PrologueNftCard({
  nfts,
  selectedIdx,
  className,
  footerClassName,
  expanded,
  onItemChanged,
}: Props) {
  const [opened, setOpened] = useState(false);
  const activeNft = () => nfts[selectedIdx ?? 0];

  return (
    <div
      key={`prologue-nft`}
      className={`rounded flex flex-col font-bold ${className} border-1 ${
        activeNft().featured
          ? "border-orange-200 drop-shadow-orange-200 text-shadow-orange-200 text-orange-200"
          : "border-transparent text-white"
      }`}
    >
      <div
        className="flex flex-col w-full bg-cover aspect-square relative justify-center"
        style={{
          backgroundImage: `url(${activeNft().icon})`,
        }}
      >
        {activeNft().featured && (
          <Image
            className="absolute -top-1.5 -left-1.5"
            src="/assets/icons/circle-dot.svg"
            width={28}
            height={28}
            alt=""
          />
        )}
        {activeNft().featured && (
          <span
            className={`text-center font-bold whitespace-nowrap tracking-normal ${
              expanded ? "text-base" : "text-xs md:text-sm xl:text-base"
            }`}
          >
            [LEVERED]
            <br />
            Net APY:
            <br className={expanded ? "lg:hidden" : "2xl:hidden"} />{" "}
            {activeNft().apy}%
          </span>
        )}
      </div>
      <div
        className={`rounded-b flex items-center justify-between bg-gray-700 text-xs p-2 ${
          expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
        } ${footerClassName}`}
      >
        {nfts.length === 1 && <span>#{activeNft().rank}</span>}
        {nfts.length > 1 && (
          <Dropdown opened={opened} onClose={() => setOpened(false)}>
            <button
              className={`flex items-center justify-between border-1 border-gray-200 hover:border-gray-300 w-[68px] h-7 px-2 ${
                opened ? "rounded-t" : "rounded"
              }`}
              onClick={() => setOpened(!opened)}
            >
              <span
                className={activeNft().featured ? "text-shadow-orange-900" : ""}
              >
                #{activeNft().rank}
              </span>
              <FaChevronDown className="text-gray-200" />
            </button>
            <div className="bg-gray-700 bg-opacity-95 border-x-1 border-b-1 border-gray-300 rounded-b p-2 text-xs max-h-[356px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
              {nfts.map((nft, idx) => (
                <button
                  key={`nfts--${nft}-${idx}}`}
                  className={`h-8 flex items-center gap-2 hover:text-gray-300 ${
                    nft.featured
                      ? "text-orange-200 text-shadow-orange-900"
                      : "text-gray-200"
                  } ${idx === (selectedIdx ?? 0) ? "hidden" : ""}`}
                  onClick={() => {
                    if (onItemChanged) onItemChanged(nft, idx);
                    setOpened(false);
                  }}
                >
                  <span>#{nft.rank}</span>
                </button>
              ))}
            </div>
          </Dropdown>
        )}
        <span>Ξ{activeNft().tvl}</span>
      </div>
    </div>
  );
}
