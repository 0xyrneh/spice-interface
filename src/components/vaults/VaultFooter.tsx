import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaFile } from "react-icons/fa";

const VaultFooter = () => {
  return (
    <div className="bg-secondary bg-opacity-[.95] hidden md:flex items-center justify-center pt-5 lg:pt-7.5 xl:pt-12 pb-4 lg:pb-7.5 xl:pb-10 text-gray text-[10px] lg:text-xs xl:text-base">
      <div className="flex gap-6 lg:gap-11 xl:gap-16">
        <div className="flex flex-col gap-1 lg:gap-3 xl:gap-[30px]">
          <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 h-[20px]">
            <FaFile />
            <Link target="__blank" href="https://docs.spicefi.xyz/">
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 h-[20px]">
            <FaGithub />
            <Link target="__blank" href="https://github.com">
              Github
            </Link>
          </div>
        </div>

        <div>
          <img
            className="w-12 lg:w-12.5 xl:w-[75px]"
            src="/assets/icons/spice.png"
            alt=""
          />
        </div>

        <div className="flex flex-col gap-1 lg:gap-3 xl:gap-[30px]">
          <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 h-[20px]">
            <FaDiscord />
            <Link
              target="__blank"
              href="https://discord.com/invite/spicefinance"
            >
              Discord
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:gap-2.5 xl:gap-3 h-[20px]">
            <FaTwitter />
            <Link target="__blank" href="https://twitter.com/spice_finance">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultFooter;
