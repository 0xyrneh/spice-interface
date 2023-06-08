import Image from "next/image";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { checkIfBlocked } from "@/utils";
import { Button } from "@/components/common";
import { useUI } from "@/hooks";

type Props = {
  isHeader?: boolean;
};

const ConnectWallet = ({ isHeader }: Props) => {
  const [blockedRegion, setBlockedRegion] = useState<string>();
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const { showConnectModal } = useUI();

  const { account } = useWeb3React();

  useEffect(() => {
    checkIfBlocked().then(setBlockedRegion);
  }, []);

  const handleMouseEnter = () => {
    if (!blockedRegion) return;
    if (!isHeader) return;

    setShowToolTip(true);
  };

  const handleMouseLeave = () => {
    if (!blockedRegion) return;
    if (!isHeader) return;

    setShowToolTip(false);
  };

  const handleConnect = async () => {
    if (!blockedRegion) {
      showConnectModal();
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
        <div className="relative">
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
          {showToolTip && (
            <div className="absolute bg-gray-700 bg-opacity-90 top-8 right-0 w-[300px] flex flex-col rounded-l rounded-b border-1 border-warm-gray-50 text-xs text-white p-2">
              <span>{`You are accessing this website from ${blockedRegion}.`}</span>
              <br />
              <span>{`The following countries are geo-blocked: United States, Canada, North Korea, Syria, Iran, Cuba, and Russia. `}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
