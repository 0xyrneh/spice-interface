import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import TosDocsSVG from "@/assets/icons/tos-docs.svg";
import Modal, { ModalProps } from "./Modal";
import { Button, Card } from "../common";
import Image from "next/image";
import { useUI } from "@/hooks";

export default function DepositModal({ open, onClose }: ModalProps) {
  const { account } = useWeb3React();
  const [agreed, setAgreed] = useState(false);
  const { hideTosModal } = useUI();

  useEffect(() => {
    if (account && onClose) onClose();
  }, [account, onClose]);

  const handleConsent = () => {
    window.localStorage.setItem("tos", "true");
    hideTosModal();
  };

  return (
    <Modal open={open}>
      <Card
        className="!py-7 !px-6 gap-6 leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95 w-[432px]"
        notBlur
      >
        <h2 className="font-semibold text-orange-200 font-xl w-full text-shadow-orange-900 mb-2">
          TERMS OF SERVICE
        </h2>
        <div className="flex flex-col items-center px-2 gap-4 text-white text-xs font-SpaceGrotesk">
          <span className="">
            By clicking the &quot;Consent&quot; button below, you signify that
            you have read, understood and agree to be bound by the Terms of
            Service.
          </span>
          <a
            href="https://docs.spicefi.xyz/info/terms-of-service"
            target="__blank"
            className="text-orange-200 text-shadow-orange-900 flex items-center gap-1 underline"
          >
            Terms of Service <TosDocsSVG />
          </a>
          <div className="flex items-center gap-4">
            <button
              className="min-w-5 min-h-5"
              onClick={() => setAgreed(!agreed)}
            >
              {agreed ? (
                <Image
                  src="/assets/icons/tos/checked.svg"
                  width={20}
                  height={20}
                  alt=""
                />
              ) : (
                <Image
                  src="/assets/icons/tos/unchecked.svg"
                  width={20}
                  height={20}
                  alt=""
                />
              )}
            </button>
            <span className="w-[calc(100%-36px)]">
              Check the box to confirm that you have read, understood and agree
              to be bound by the Terms of Service.
            </span>
          </div>
          <div className="flex justify-center">
            <Button
              type={agreed ? "primary" : "secondary"}
              className="h-9 px-4 text-base"
              disabled={!agreed}
              onClick={handleConsent}
            >
              CONSENT
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
}
