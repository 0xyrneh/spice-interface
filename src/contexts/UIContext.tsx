import { DepositModal } from "@/components/modals";
import { Vault } from "@/types/vault";
import { createContext, ReactNode, useState } from "react";

interface UIContextType {
  blur: boolean;
  setBlur: (val: boolean) => void;
  showDepositModal: (vault: Vault) => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

type Props = {
  children: ReactNode;
};

const UIProvider = ({ children }: Props) => {
  const [blur, setBlur] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [depositModalProps, setDepositModalProps] = useState<any>();

  const showDepositModal = (vault: Vault) => {
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
          onClose={() => setDepositModalVisible(false)}
          {...depositModalProps}
        />
      )}
    </UIContext.Provider>
  );
};

export default UIProvider;
