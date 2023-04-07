import Image from "next/image";
import Link from "next/link";

const VaultFooter = () => {
  return (
    <div className="bg-secondary bg-opacity-[.95] hidden md:flex items-center justify-center pt-11 pb-10 text-gray text-xs xl:text-base">
      <div className="flex gap-11 xl:gap-16">
        <div className="flex flex-col gap-3 xl:gap-[30px]">
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/docs.svg" width={20} height={20} alt="" />
            <Link target="__blank" href="https://docs.spicefi.xyz/">
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/github.svg"
              width={20}
              height={20}
              alt=""
            />
            <Link target="__blank" href="https://github.com">
              Github
            </Link>
          </div>
        </div>

        <Image src="/assets/icons/spice.png" width={81.75} height={75} alt="" />

        <div className="flex flex-col gap-3 xl:gap-[30px]">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/discord.svg"
              width={20}
              height={20}
              alt=""
            />
            <Link
              target="__blank"
              href="https://discord.com/invite/spicefinance"
            >
              Discord
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/twitter.svg"
              width={20}
              height={20}
              alt=""
            />
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
