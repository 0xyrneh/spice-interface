import Link from "next/link";
import CircleDotSvg from "@/assets/icons/circle-dot.svg";
import DocsSVG from "@/assets/icons/docs.svg";
import GithubSVG from "@/assets/icons/github.svg";
import DiscordSVG from "@/assets/icons/discord.svg";
import TwitterSVG from "@/assets/icons/twitter.svg";
import { useRouter } from "next/router";
import { NAV_OPTIONS } from "@/constants";
import { useUI } from "@/hooks";

const VaultFooter = () => {
  const router = useRouter();
  const { blur } = useUI();

  const activeTab = () => {
    for (let i = 0; i < NAV_OPTIONS.length; i += 1) {
      const option = NAV_OPTIONS[i];
      if (
        router.pathname === option.href ||
        router.pathname.startsWith(option.href + "/", 0)
      ) {
        return option;
      }
    }
    return NAV_OPTIONS[1];
  };

  return (
    <div
      className={`w-full h-[60px] bg-gray-700 bg-opacity-90 hidden ${
        activeTab().breakpoint
      }:flex items-center justify-between px-8 text-gray-200 text-[10px] lg:text-xs xl:text-base max-w-[${
        activeTab().maxWidth
      }] ${blur ? "blur-[5px]" : ""}`}
    >
      <div className="flex gap-4 items-center">
        <div className="flex items-center">
          <CircleDotSvg />
          <span className="text-green font-bold text-xs text-shadow-green">
            SPICE MARKET IS OPEN
          </span>
        </div>
        <span className="text-xs text-orange-200 text-shadow-orange-900 font-bold">
          Ξ600 TVL
        </span>
        <Link
          target="__blank"
          href="https://docs.spicefi.xyz/"
          className="text-gray-200 hover:text-gray-300"
        >
          <DocsSVG />
        </Link>
        <Link
          target="__blank"
          href="https://github.com"
          className="text-gray-200 hover:text-gray-300"
        >
          <GithubSVG />
        </Link>
        <Link
          target="__blank"
          href="https://discord.com/invite/spicefinance"
          className="text-gray-200 hover:text-gray-300"
        >
          <DiscordSVG />
        </Link>
        <Link
          target="__blank"
          href="https://twitter.com/spice_finance"
          className="text-gray-200 hover:text-gray-300"
        >
          <TwitterSVG />
        </Link>
      </div>
      <span className="hidden md:flex text-gray-200 font-bold text-xs">
        SPICE FINANCE (C) 2023
      </span>
    </div>
  );
};

export default VaultFooter;
