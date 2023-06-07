import {
  ConnectModal,
  DisconnectModal,
  DepositModal,
  TosModal,
} from "@/components/modals";
import { VaultInfo } from "@/types/vault";
import { createContext, ReactNode, useState } from "react";

interface UIContextType {
  blur: boolean;
  setBlur: (val: boolean) => void;
  showConnectModal: () => void;
  showDisconnectModal: () => void;
  showTosModal: () => void;
  hideTosModal: () => void;
  showDepositModal: ({
    vault,
    nftId,
    isLeverageModal,
  }: {
    vault: VaultInfo;
    nftId?: number;
    isLeverageModal?: boolean;
  }) => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

type Props = {
  children: ReactNode;
};

const UIProvider = ({ children }: Props) => {
  const [blur, setBlur] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const [tosModalVisible, setTosModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [depositModalProps, setDepositModalProps] = useState<any>();
  const [isLeverageModalOpened, setIsLeverageModalOpened] = useState(false);
  const [defaultNftId, setDefaultNftId] = useState<number | undefined>();

  const showDepositModal = ({
    vault,
    nftId,
    isLeverageModal,
  }: {
    vault: VaultInfo;
    nftId?: number;
    isLeverageModal?: boolean;
  }) => {
    setIsLeverageModalOpened(!!isLeverageModal);
    if (nftId) {
      setDefaultNftId(nftId);
    }
    setDepositModalVisible(true);
    setDepositModalProps({
      vault: vault,
    });
  };

  const showConnectModal = () => {
    setConnectModalVisible(true);
  };

  const showDisconnectModal = () => {
    setDisconnectModalVisible(true);
  };

  const showTosModal = () => {
    setTosModalVisible(true);
  };

  const hideTosModal = () => {
    setTosModalVisible(false);
  };

  return (
    <UIContext.Provider
      value={{
        blur,
        setBlur,
        showDepositModal,
        showConnectModal,
        showDisconnectModal,
        showTosModal,
        hideTosModal,
      }}
    >
      {children}
      {depositModalProps && (
        <DepositModal
          open={depositModalVisible && !!depositModalProps}
          defaultNftId={defaultNftId}
          isLeverageModal={isLeverageModalOpened}
          onClose={() => setDepositModalVisible(false)}
          {...depositModalProps}
        />
      )}
      <ConnectModal
        open={connectModalVisible}
        onClose={() => setConnectModalVisible(false)}
      />
      <DisconnectModal
        open={disconnectModalVisible}
        onClose={() => setDisconnectModalVisible(false)}
      />
      <TosModal open={tosModalVisible} />
    </UIContext.Provider>
  );
};

export default UIProvider;
