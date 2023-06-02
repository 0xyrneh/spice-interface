import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useNotification } from "@/hooks";
import { checkIfBlocked } from "@/utils";
import { Button } from "@/components/common";
import useAuth from "@/hooks/useAuth";
import { ConnectorNames } from "@/types/wallet";

const ConnectWallet = () => {
  const [blockedRegion, setBlockedRegion] = useState<string>();

  const { account } = useWeb3React();
  const { login } = useAuth();
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
      // TODO: should be changed automatically later once wallet modal is prepared
      const defaultConnectName = ConnectorNames.Injected;
      await login(defaultConnectName);
    }
  };

  return (
    <div>
      {account ? (
        <div className="flex items-center gap-3">
          <Image
            className="border-1 border-orange-200 rounded-full drop-shadow-orange-200"
            src="/assets/images/vaultIcon.svg"
            width={28}
            height={28}
            alt=""
          />
          <span className="text-xs text-bold text-orange-200 text-shadow-orange-200">
            {account.slice(0, 8)}
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
