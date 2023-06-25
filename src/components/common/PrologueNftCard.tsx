import { BigNumber } from "ethers";

import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import useBreakpoint from "use-breakpoint";
import { getBalanceInEther } from "@/utils/formatBalance";

import { accLoans } from "@/utils/lend";
import { PrologueNftInfo } from "@/types/nft";
import Dropdown from "./Dropdown";
import { BREAKPOINTS } from "@/constants";
import { CopyClipboard } from "@/components/common";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import { useAppSelector } from "@/state/hooks";

type Props = {
  containerClassName?: string;
  className?: string;
  footerClassName?: string;
  selectable?: boolean;
  active?: boolean;
  showBorder?: boolean;
  nfts: PrologueNftInfo[];
  selectedNftId?: number;
  expanded?: boolean;
  side?: ("left" | "top" | "right" | "bottom")[];
  parent?: any;
  onItemChanged?: (nft: PrologueNftInfo, idx: number) => void;
  onClick?: (item: PrologueNftInfo) => void;
};

export default function PrologueNftCard({
  nfts,
  selectedNftId,
  containerClassName,
  className,
  footerClassName,
  selectable,
  expanded,
  active,
  showBorder,
  side,
  parent,
  onItemChanged,
  onClick,
}: Props) {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const { data: lendData } = useAppSelector((state) => state.lend);

  const comp = useRef();
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const activeNft =
    nfts.find((nft) => nft.tokenId === selectedNftId) || nfts[0];

  useEffect(() => {
    let currentComp = comp.current as any;

    const scale = 1.4;

    if (active) {
      const prevWidth = currentComp.offsetWidth;
      const prevHeight = currentComp.offsetHeight;
      currentComp.style.position = "absolute";
      currentComp.style.width = `${prevWidth}px`;
      currentComp.style.zIndex = 50;

      if (side) {
        const marginY = (prevHeight * (scale - 1)) / 2;
        const marginX = (prevWidth * (scale - 1)) / 2;

        let marginTop = 0;

        if (parent) {
          marginTop += parent.current.scrollTop * -1;

          let offsetFromParent =
            parent.current.offsetHeight -
            (currentComp.offsetTop -
              parent.current.offsetTop -
              parent.current.scrollTop +
              currentComp.offsetHeight);
          if (offsetFromParent < marginY) {
            marginTop += offsetFromParent - marginY;
          }
        }

        if (side.includes("top")) {
          marginTop += marginY;
        }
        currentComp.style.marginTop = `${marginTop}px`;
        if (side.includes("left")) {
          currentComp.style.marginLeft = `${marginX}px`;
        }
        if (side.includes("right")) {
          currentComp.style.marginLeft = `${marginX * -1}px`;
        }
      }
      currentComp.style.scale = scale;
    } else {
      currentComp.style.position = "relative";
      currentComp.style.scale = 1;
      currentComp.style.width = "auto";
      currentComp.style.marginTop = 0;
      currentComp.style.marginLeft = 0;
      (comp.current as any).style.zIndex = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const ownerAddr = activeNft?.owner || "";

  const hfClassName = () => {
    const loans = accLoans(lendData);
    const loan = loans.find((row) => row.tokenId === activeNft.tokenId);
    if (!loan) return "";

    const lendGlobalData = lendData.find(
      (row1: any) => row1.address === loan.lendAddr
    );

    const value = loan.loan?.tokenAmntInVault || BigNumber.from(0);
    const debtOwed = loan.loan?.repayAmount || BigNumber.from(0);

    const healthFactor =
      getBalanceInEther(debtOwed) > 0 && getBalanceInEther(value) > 0
        ? ((lendGlobalData?.liquidationRatio || 0) * getBalanceInEther(value)) /
          getBalanceInEther(debtOwed)
        : 0;

    if (healthFactor === 0) return "";
    if (healthFactor <= 1.0) return "text-hf-red drop-shadow-hf-red";
    if (healthFactor <= 1.1) return "text-hf-orange drop-shadow-hf-orange";
    if (healthFactor <= 1.2) return "text-yellow drop-shadow-yellow";
    return "text-hf-green drop-shadow-hf-green";
  };

  return (
    <div className={`rounded ${containerClassName} cursor-pointer`}>
      <motion.div
        ref={comp as any}
        layout
        transition={{ duration: active ? 0.3 : 0 }}
        key={`prologue-nft`}
        className={`relative rounded flex flex-col font-bold ${className} border-1 ${
          activeNft?.isEscrowed
            ? "border-orange-200 drop-shadow-orange-200 text-shadow-orange-200 text-orange-200"
            : showBorder
            ? "border-gray-200 text-white drop-shadow-sm"
            : "border-transparent text-white"
        }`}
        onClick={() => {
          if (!activeNft) return;
          if (onClick) onClick(activeNft);
        }}
      >
        {active && (
          <div
            className={`rounded-t flex items-center justify-between bg-gray-700 text-xs p-2 ${
              expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
            }`}
          >
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              {ownerAddr}
            </span>
            <CopyClipboard
              text={ownerAddr}
              width={14}
              height={14}
              className="min-w-[14px] min-h-[14px]"
            />
          </div>
        )}
        <div
          className={`flex flex-col w-full bg-cover aspect-square relative justify-center ${
            active ? "" : "rounded-t"
          }`}
          style={{
            backgroundImage: `url(${activeNft?.tokenImg})`,
          }}
        >
          {activeNft?.isEscrowed && (
            <div className="absolute top-[2px] left-[2px]">
              <CircleDotSvg className={hfClassName()} />
            </div>
          )}
          {activeNft?.isEscrowed && (
            <span
              className={`text-center font-bold tracking-normal ${
                expanded
                  ? "text-base whitespace-nowrap"
                  : "text-xs md:text-sm xl:text-md whitespace-break-spaces px-1"
              }`}
            >
              [LEVERED]
              <br />
              {`Net APY: `}
              <br className={expanded ? "lg:hidden" : "2xl:hidden"} />
              {`${(100 * (activeNft?.apy || 0)).toFixed(2)}%`}
            </span>
          )}
        </div>
        <div
          className={`rounded-b flex items-center justify-between bg-gray-700 text-xs p-2 ${
            expanded ? "h-7 xl:h-8" : "h-6 xl:h-7 2xl:h-8"
          } ${footerClassName}`}
        >
          {nfts.length === 1 && <span>{`#${activeNft?.tokenId}`}</span>}
          {nfts.length > 1 && (
            <Dropdown
              opened={dropdownOpened}
              onClose={() => setDropdownOpened(false)}
            >
              <button
                className={`flex items-center justify-between border-1 border-gray-200 hover:border-gray-300 w-[68px] h-7 px-2 ${
                  dropdownOpened ? "rounded-t" : "rounded"
                }`}
                onClick={() => setDropdownOpened(!dropdownOpened)}
              >
                <span
                  className={
                    activeNft?.isEscrowed ? "text-shadow-orange-900" : ""
                  }
                >
                  {`#${activeNft?.tokenId}`}
                </span>
                <FaChevronDown className="text-gray-200" />
              </button>
              <div className="bg-gray-700 bg-opacity-95 border-x-1 border-b-1 border-gray-300 rounded-b p-2 text-xs max-h-[356px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                {nfts.map((nft, idx) => (
                  <button
                    key={`nfts--${nft}-${idx}}`}
                    className={`h-8 flex items-center gap-2 hover:text-gray-300 ${
                      nft.isEscrowed
                        ? "text-orange-200 text-shadow-orange-900"
                        : "text-gray-200"
                    } ${nft.tokenId === selectedNftId ? "hidden" : ""}`}
                    onClick={() => {
                      if (onItemChanged) onItemChanged(nft, nft.tokenId);
                      setDropdownOpened(false);
                    }}
                  >
                    <span>{`#${nft.tokenId}`}</span>
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
          <span>{`Ξ${getBalanceInEther(
            activeNft?.amount || BigNumber.from("0")
          ).toFixed(2)}`}</span>
        </div>
        {selectable && !active && (
          <div className="absolute top-0 left-0 right-0 bottom-0 hover:shadow-nft z-50 rounded" />
        )}
      </motion.div>
    </div>
  );
}
