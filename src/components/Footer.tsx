import Link from "next/link";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFile } from "react-icons/fa";

const VaultFooter = () => {
  return (
    <div className="w-full h-[60px] bg-gray-700 bg-opacity-90 hidden sm:flex items-center justify-between px-8 text-gray-200 text-[10px] lg:text-xs xl:text-base">
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
        <Link target="__blank" href="https://docs.spicefi.xyz/">
          <FaFile size={16} />
        </Link>
        <Link target="__blank" href="https://github.com">
          <FaGithub size={16} />
        </Link>
        <Link target="__blank" href="https://discord.com/invite/spicefinance">
          <FaDiscord size={16} />
        </Link>
        <Link target="__blank" href="https://twitter.com/spice_finance">
          <FaTwitter size={16} />
        </Link>
      </div>
      <span className="hidden md:flex text-gray-200 font-bold text-xs">
        SPICE FINANCE (C) 2023
      </span>
    </div>
  );
};

export default VaultFooter;
