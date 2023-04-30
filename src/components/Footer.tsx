import Link from "next/link";
import Image from "next/image";
import DocsSVG from "@/assets/icons/docs.svg";
import GithubSVG from "@/assets/icons/github.svg";
import DiscordSVG from "@/assets/icons/discord.svg";
import TwitterSVG from "@/assets/icons/twitter.svg";
import { useRouter } from "next/router";
import { NAV_OPTIONS } from "@/constants";

const VaultFooter = () => {
  const router = useRouter();

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
    return NAV_OPTIONS[0];
  };

  return (
    <div
      className={`w-full h-[60px] bg-gray-700 bg-opacity-90 hidden ${
        activeTab().breakpoint
      }:flex items-center justify-between px-8 text-gray-200 text-[10px] lg:text-xs xl:text-base max-w-[${
        activeTab().maxWidth
      }]`}
    >
      <div className="flex gap-4 items-center">
        <div className="flex items-center">
          <Image
            src="/assets/icons/circle-dot.svg"
            width={28}
            height={28}
            alt=""
          />
          <span className="text-green font-bold text-xs">
            SPICE MARKET IS OPEN
          </span>
        </div>
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
