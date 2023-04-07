import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavOption } from "@/types/common";
import { VaultSearch, ConnectWallet } from "@/components/common";

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

      <VaultSearch />
      <div className="flex-1 flex justify-end">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
