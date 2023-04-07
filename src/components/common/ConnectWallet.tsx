import Image from "next/image";
import { useWallet } from "@/hooks";
import { shortAddress } from "@/utils";

const ConnectWallet = () => {
  const { connect, account } = useWallet();

  return (
    <div>
      {account ? (
        <div className="flex items-center gap-3.5">
          <Image
            src="/assets/images/vaultIcon.svg"
            width={32}
            height={32}
            alt=""
          />
          <span className="text-xs xl:text-sm text-light">
            {shortAddress(account)}
          </span>
        </div>
      ) : (
        <button
          className="text-yellow border-2 border-yellow rounded px-2.5 py-1 bg-yellow bg-opacity-10"
          onClick={connect}
        >
          <span className="text-xs xl:text-sm text-shadow-yellow">
            CONNECT WALLET
          </span>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
