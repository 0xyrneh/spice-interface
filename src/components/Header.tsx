import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavOption } from "@/types/common";
import { VaultSearch, ConnectWallet } from "@/components/common";
import { NAV_OPTIONS } from "@/constants";

const Header = () => {
  const router = useRouter();

  const linkClass = (option: NavOption) => {
    if (
      router.pathname === option.href ||
      router.pathname.startsWith(option.href + "/", 0)
    ) {
      return "text-orange-200 text-shadow-orange-200";
    }
    return "";
  };

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
      className={`z-50 hidden sm:flex fixed w-full top-0 h-16 bg-gray-700 bg-opacity-90 items-center justify-between px-7.5 xl:px-20 font-bold
      max-w-[${activeTab().maxWidth}]`}
    >
      <div className="flex-1 flex items-center gap-7 xl:gap-10 min-w-[420px] xl:min-w-[500px]">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="spice"
            width={108}
            height={32}
          />
        </Link>

        {NAV_OPTIONS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`hidden md:flex text-gray-200 text-xs xl:text-sm ${linkClass(
              item
            )}`}
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
