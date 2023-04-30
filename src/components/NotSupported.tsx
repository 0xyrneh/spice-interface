import { useRouter } from "next/router";
import { NAV_OPTIONS } from "@/constants";

const NotSupported = () => {
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
      className={`flex flex-col justify-center ${
        activeTab().breakpoint
      }:hidden h-screen text-orange-200 px-[26px] gap-3 font-semibold`}
    >
      <h1 className="text-[26px] text-shadow-orange-200">
        Mobile is not supported.
      </h1>
      <h3 className="text-base text-shadow-orange-200">
        To interact with the Spice dApp, please use a desktop.
      </h3>
    </div>
  );
};

export default NotSupported;
