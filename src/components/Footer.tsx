import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFile } from "react-icons/fa";

const VaultFooter = () => {
  return (
    <div className="w-full h-[60px] bg-gray-700 bg-opacity-90 hidden sm:flex items-center justify-between px-8 text-gray-200 text-[10px] lg:text-xs xl:text-base">
      <div className="flex gap-4 items-center">
        <span className="text-green font-bold text-xs">
          SPICE MARKET IS OPEN
        </span>
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
      <span className="text-gray-200 font-bold text-xs">
        SPICE FINANCE (C) 2023
      </span>
    </div>
  );
};

export default VaultFooter;
