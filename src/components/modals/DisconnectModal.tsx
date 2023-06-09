import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";

import Modal, { ModalProps } from "./Modal";
import { Card } from "../common";
import Connectors from "@/constants/connectors";
import useAuth from "@/hooks/useAuth";
import { Connector } from "@/types/wallet";
import { connectorLocalStorageKey } from "@/config/constants/wallet";
import { shortAddress } from "@/utils";

export default function DisconnectModal({ open, onClose }: ModalProps) {
  const { account } = useWeb3React();
  const { logout } = useAuth();
  const [connector, setConnector] = useState<Connector>();

  useEffect(() => {
    const connectorID = window.localStorage.getItem(connectorLocalStorageKey);
    if (connectorID) {
      setConnector(Connectors.find((item) => item.connector === connectorID));
    } else {
      setConnector(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!account && onClose) onClose();
  }, [account, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Card
        className="!py-7 !px-6 gap-4 items-start leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95 w-[432px]"
        notBlur
      >
        <h2 className="font-semibold text-orange-200 font-xl w-full text-shadow-orange-900 mb-2">
          DISCONNECT WALLET
        </h2>
        {connector && account && (
          <div className="w-full items-center flex text-white gap-4 text-xs font-semibold border-1 border-gray-200 hover:border-gray-100 rounded bg-black hover:bg-white hover:bg-opacity-10 bg-opacity-10 px-4 py-2.5">
            <Image src={connector.icon} width={24} height={24} alt="" />
            <span>Account {shortAddress(account)}</span>
          </div>
        )}
        <button
          className="underline text-gray-200 hover:text-gray-300 text-xs"
          onClick={logout}
        >
          Disconnect Wallet
        </button>
      </Card>
    </Modal>
  );
}
