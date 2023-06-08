import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";

import Modal, { ModalProps } from "./Modal";
import { Card } from "../common";
import Connectors from "@/constants/connectors";
import useAuth from "@/hooks/useAuth";
import { Connector } from "@/types/wallet";

export default function DepositModal({ open, onClose }: ModalProps) {
  const { account } = useWeb3React();
  const { login } = useAuth();

  useEffect(() => {
    if (account && onClose) onClose();
  }, [account, onClose]);

  const handleLogin = async (connector: Connector) => {
    await login(connector.connector);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card
        className="!py-7 !px-6 gap-4 leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95 w-[432px]"
        notBlur
      >
        <h2 className="font-semibold text-orange-200 font-xl w-full text-shadow-orange-900 mb-2">
          CONNECT WALLET
        </h2>
        {Connectors.map((connector) => (
          <button
            key={connector.name}
            className="flex text-white gap-4 text-sm font-semibold border-1 border-gray-200 hover:border-gray-100 rounded bg-black hover:bg-white hover:bg-opacity-10 bg-opacity-10 px-4 py-2.5"
            onClick={() => handleLogin(connector)}
          >
            <Image src={connector.icon} width={24} height={24} alt="" />
            <span>{connector.name}</span>
          </button>
        ))}
      </Card>
    </Modal>
  );
}
