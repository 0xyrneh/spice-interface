import Image from "next/image";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { Button } from "@/components/common";
import { useUI } from "@/hooks";
import { useAppSelector } from "@/state/hooks";
import { accLoans } from "@/utils/lend";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants";

type Props = {
  isHeader?: boolean;
};

const ConnectWallet = ({ isHeader }: Props) => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false);
  const { showConnectModal, showDisconnectModal } = useUI();

  const { account } = useWeb3React();
  const { data: lendData } = useAppSelector((state) => state.lend);
  const { geolocation, isBlocked } = useAppSelector(
    (state) => state.geolocation
  );

  const loans = accLoans(lendData);

  const accountImage = () => {
    if (loans.length === 0) {
      return undefined;
    } else {
      return getTokenImageFromReservoir(
        PROLOGUE_NFT_ADDRESS,
        Number(loans[0].tokenId)
      );
    }
  };

  const handleMouseEnter = () => {
    if (!isBlocked) return;
    if (!isHeader) return;

    setShowToolTip(true);
  };

  const handleMouseLeave = () => {
    if (!isBlocked) return;
    if (!isHeader) return;

    setShowToolTip(false);
  };

  const handleConnect = async () => {
    if (isBlocked === false) {
      showConnectModal();
    }
  };

  return (
    <div>
      {account ? (
        <button
          className="flex items-center gap-3"
          onClick={showDisconnectModal}
        >
          {accountImage() ? (
            <Image
              className="border-1 border-orange-200 rounded-full drop-shadow-orange-200"
              src={accountImage()!}
              width={28}
              height={28}
              alt=""
            />
          ) : (
            <Image
              className=""
              src="/assets/images/profile.svg"
              width={36}
              height={36}
              alt=""
            />
          )}

          <span className="text-xs text-bold text-orange-200 text-shadow-orange-200">
            {account.slice(0, 8)}
          </span>
        </button>
      ) : (
        <div className="relative">
          <Button
            className="px-2 h-8"
            type="primary"
            hideHoverStyle={!!geolocation}
            onClick={handleConnect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-xs font-medium">CONNECT WALLET</span>
          </Button>
          {showToolTip && (
            <div className="absolute bg-gray-700 bg-opacity-90 top-8 right-0 w-[300px] flex flex-col rounded-l rounded-b border-1 border-warm-gray-50 text-xs text-white p-2">
              <span>{`You are accessing this website from ${geolocation}.`}</span>
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
