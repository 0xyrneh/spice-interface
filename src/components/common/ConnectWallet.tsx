import Image from "next/image";
import { useWallet, useNotification } from "@/hooks";
import { shortAddress, checkIfBlocked } from "@/utils";
import { useEffect, useState } from "react";

const ConnectWallet = () => {
  const { connect, account } = useWallet();
  const [blockedRegion, setBlockedRegion] = useState<string>();

  const { showNotification, hideNotification } = useNotification();

  useEffect(() => {
    checkIfBlocked().then(setBlockedRegion);
  }, []);

  const handleMouseEnter = () => {
    if (blockedRegion) {
      showNotification(
        `You are accessing this website from ${blockedRegion}.`,
        "The following countries are geo-blocked: United States, Canada, North Korea, Syria, Iran, Cuba, and Russia."
      );
    }
  };

  const handleMouseLeave = () => {
    if (blockedRegion) {
      hideNotification();
    }
  };

  const handleConnect = async () => {
    if (!blockedRegion) {
      await connect();
    }
  };

  return (
    <div>
      {account ? (
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/vaultIcon.svg"
            width={28}
            height={28}
            alt=""
          />
          <span className="text-xs text-bold text-orange-200 text-shadow-orange-200">
            {shortAddress(account)}
          </span>
        </div>
      ) : (
        <button
          className="text-orange-900 border-2 border-orange-900 rounded px-2.5 py-1 bg-orange-900 bg-opacity-10"
          onClick={handleConnect}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="text-xs xl:text-sm text-shadow-orange-900">
            CONNECT WALLET
          </span>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
