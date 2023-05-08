import Image from "next/image";
import { useWallet, useNotification } from "@/hooks";
import { shortAddress, checkIfBlocked } from "@/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/common";

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
            className="border-1 border-gray-200 rounded-full"
            src="/assets/images/vaultIcon.svg"
            width={28}
            height={28}
            alt=""
          />
          <span className="text-xs text-bold text-orange-200 text-shadow-orange-900">
            {shortAddress(account)}
          </span>
        </div>
      ) : (
        <Button
          className="px-2 h-8"
          type="primary"
          hideHoverStyle={!!blockedRegion}
          onClick={handleConnect}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="text-xs font-medium">CONNECT WALLET</span>
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
