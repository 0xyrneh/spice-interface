import { useCallback } from "react";

import { ConnectorNames } from "@/types/wallet";
import { connectorLocalStorageKey } from "@/config/constants/wallet";
import { connectorsByName } from "@/utils/web3React";
// import { setupNetwork } from "@/utils/wallet";
import { activeChainId } from "@/utils/web3";

const useAuth = () => {
  const activateInjectedProvider = (connectorID?: string) => {
    if (!connectorID) return;
    const { ethereum } = window;
    if (!ethereum?.providers) {
      return;
    }

    let provider;
    if (connectorID === "injected") {
      provider = ethereum.providers.find(
        (_provider: any) => _provider.isMetaMask && !_provider.isBraveWallet
      );
    }
    if (connectorID === "coinbase") {
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }: { isCoinbaseWallet: boolean }) =>
          isCoinbaseWallet
      );
    }

    if (provider && ethereum) {
      ethereum?.setSelectedProvider(provider);
    }
  };

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      activateInjectedProvider(connectorID);
      const { connector } = connectorsByName[connectorID];

      if (connector) {
        connector.activate(activeChainId).catch((err: Error) => {
          console.log(err.name, err.message);
        });
        window.localStorage.setItem(connectorLocalStorageKey, connectorID);
      } else {
        console.log("Can't find connector", "The connector config is wrong");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const logout = async () => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey);
    window.localStorage.removeItem(connectorLocalStorageKey);
    if (!connectorId) return;
    const { connector } = connectorsByName[connectorId as ConnectorNames];
    if (connector.deactivate) {
      await connector.deactivate();
    } else {
      await connector.resetState();
    }
  };

  return { login, logout };
};

export default useAuth;
