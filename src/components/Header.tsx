import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavOption } from "@/types/common";

const NAV_OPTIONS: NavOption[] = [
  { href: "/", name: "Vaults" },
  { href: "/portfolio", name: "Portfolio" },
  { href: "/prologue-nfts", name: "Prologue NFTs" },
];

const Header = () => {
  const router = useRouter();
  const linkClass = (option: NavOption) => {
    if (
      router.pathname === option.href ||
      router.pathname.startsWith(option.href + "/", 0)
    ) {
      return "text-yellow-light text-shadow-yellow-light";
    }
    return "";
  };

  return (
    <div className="z-50 hidden md:flex fixed left-0 top-0 right-0 h-[62px] bg-secondary bg-opacity-45 items-center justify-between px-7.5 xl:px-20 font-SuisseIntl font-semibold">
      <div className="flex-1 flex items-center gap-7 xl:gap-10">
        <Image
          src="/assets/icons/logo.svg"
          alt="spice"
          width={108}
          height={32}
        />
        {NAV_OPTIONS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-gray text-xs xl:text-sm ${linkClass(item)}`}
          >
            {item.name.toUpperCase()}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex rounded border-1 border-gray px-3 py-1 items-center gap-3">
        <Image src="/assets/icons/search.svg" alt="" width={14} height={14} />
        <input
          className="bg-transparent text-gray font-SuisseIntl text-xs xl:text-sm outline-0 placeholder:text-gray placeholder:text-opacity-50"
          placeholder="Search Vaults and NFTs"
        />
      </div>
      <div className="flex-1 flex justify-end">
        <button className="text-yellow border-2 border-yellow rounded px-2.5 py-1 bg-yellow bg-opacity-10">
          <span className="text-xs xl:text-sm text-shadow-yellow">
            CONNECT WALLET
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
