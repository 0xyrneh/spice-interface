import { DepositModal } from "@/components/modals";
import { VaultInfo } from "@/types/vault";
import { createContext, ReactNode, useState } from "react";

interface UIContextType {
  blur: boolean;
  setBlur: (val: boolean) => void;
  showDepositModal: (vault: VaultInfo, isLeverageModal?: boolean) => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

type Props = {
  children: ReactNode;
};

const UIProvider = ({ children }: Props) => {
  const [blur, setBlur] = useState(false);
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

  return (
    <UIContext.Provider
      value={{
        blur,
        setBlur,
        showDepositModal,
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
    </UIContext.Provider>
  );
};

export default UIProvider;
