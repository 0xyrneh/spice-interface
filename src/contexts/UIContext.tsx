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
  showDepositModal: (vault: VaultInfo, isLeverageModal?: boolean) => void;
  showConnectModal: () => void;
  showDisconnectModal: () => void;
  showTosModal: () => void;
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

  const showDepositModal = (vault: VaultInfo, isLeverageModal?: boolean) => {
    setIsLeverageModalOpened(!!isLeverageModal);
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

  return (
    <UIContext.Provider
      value={{
        blur,
        setBlur,
        showDepositModal,
        showConnectModal,
        showDisconnectModal,
        showTosModal,
      }}
    >
      {children}
      {depositModalProps && (
        <DepositModal
          open={depositModalVisible && !!depositModalProps}
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
      <TosModal
        open={tosModalVisible}
        onClose={() => setTosModalVisible(false)}
      />
    </UIContext.Provider>
  );
};

export default UIProvider;
