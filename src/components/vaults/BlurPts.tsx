import { useEffect, useState } from "react";
import Image from "next/image";
import { BlurStats, Card } from "@/components/common";
import BlurSVG from "@/assets/icons/blur.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";

type Props = {
  vault: VaultInfo;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
};

export default function BlurPts({
  vault,
  showIcon,
  className,
  nonExpandedClassName,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const { setBlur } = useUI();

  useEffect(() => {
    setBlur(expanded);
  }, [expanded, setBlur]);

  return (
    <Card
      className={`gap-3 overflow-hidden ${className} ${
        nonExpandedClassName && !expanded ? nonExpandedClassName : ""
      }`}
      expanded={expanded}
      onCollapse={() => setExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          {showIcon && (
            <Image
              className="border-1 border-gray-200 rounded-full"
              src={vault.logo}
              width={16}
              height={16}
              alt=""
            />
          )}
          <BlurSVG />
          <h2 className="font-bold text-white font-sm">SP-BLUR PTS</h2>
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-center lg:gap-2 xl:gap-0 3xl:gap-2 mb-2">
        <BlurStats title="SP-BLUR Vault" value="1X | 800 SPB" type="orange" />
        <BlurStats
          title="Flagship Vault"
          value="?? | ????"
          type="orange"
          className="hidden lg:flex"
        />
        <BlurStats
          title="Leverage Vault"
          value="?? | ????"
          className="hidden xl:flex"
        />
        <BlurStats
          title="Prologue Vault"
          value="?? | ????"
          className="hidden 2xl:flex"
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        <button className="bg-orange-200 w-6 lg:w-8 h-1 rounded-lg" />
        <button className="bg-gray-200 w-6 lg:w-8 h-1 rounded-lg 2xl:hidden" />
        <button className="bg-gray-200 w-6 lg:w-8 h-1 rounded-lg xl:hidden" />
        <button className="bg-gray-200 w-6 lg:w-8 h-1 rounded-lg lg:hidden" />
        <button className="bg-gray-200 w-6 lg:w-8 h-1 rounded-lg lg:hidden" />
      </div>
    </Card>
  );
}
