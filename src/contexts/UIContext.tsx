import { DepositModal } from "@/components/modals";
import { createContext, ReactNode, useState } from "react";

interface UIContextType {
  blur: boolean;
  setBlur: (val: boolean) => void;
  showDepositModal: () => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

type Props = {
  children: ReactNode;
};

const UIProvider = ({ children }: Props) => {
  const [blur, setBlur] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);

  const showDepositModal = () => {
    setDepositModalVisible(true);
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
      <DepositModal
        open={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
      />
    </UIContext.Provider>
  );
};

export default UIProvider;
