import {
  ConnectModal,
  DisconnectModal,
  DepositModal,
  TosModal,
} from "@/components/modals";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchETHPriceAsync } from "@/state/oracle/oracleSlice";
import { updateActiveVault } from "@/state/vault/vaultSlice";
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
  const dispatch = useAppDispatch();
  const [blur, setBlur] = useState(false);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const [tosModalVisible, setTosModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [isLeverageModalOpened, setIsLeverageModalOpened] = useState(false);
  const [defaultNftId, setDefaultNftId] = useState<number | undefined>();

  const { activeVault } = useAppSelector((state) => state.vault);

  const showDepositModal = ({
    vault,
    nftId,
    isLeverageModal,
  }: {
    vault: VaultInfo;
    nftId?: number;
    isLeverageModal?: boolean;
  }) => {
    dispatch(updateActiveVault(vault));
    dispatch(fetchETHPriceAsync());
    setIsLeverageModalOpened(!!isLeverageModal);
    if (nftId) {
      setDefaultNftId(nftId);
    }
    setDepositModalVisible(true);
  };

  const closeDepositModal = () => {
    setDepositModalVisible(false);
    setTimeout(() => {
      dispatch(updateActiveVault(null));
    }, 0);
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
      {activeVault && (
        <DepositModal
          open={depositModalVisible}
          defaultNftId={defaultNftId}
          isLeverageModal={isLeverageModalOpened}
          onClose={closeDepositModal}
          vault={activeVault}
          vaultId={activeVault.id}
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
