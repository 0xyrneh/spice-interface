import { useCallback } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";

import { ConnectorNames } from "@/types/wallet";
import { connectorLocalStorageKey } from "@/config/constants/wallet";
import { connectorsByName } from "@/utils/web3React";
import { setupNetwork } from "@/utils/wallet";

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();

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
      const connector = connectorsByName[connectorID];

      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();

            if (hasSetup) {
              activate(connector);
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey);
            if (error instanceof NoEthereumProviderError) {
              console.log("Provider Error", "No provider was found");
            } else if (error instanceof UserRejectedRequestErrorInjected) {
              console.log(
                "Authorization Error",
                "Please authorize to access your account"
              );
            } else {
              console.log(error.name, error.message);
            }
          }
        });
        window.localStorage.setItem(connectorLocalStorageKey, connectorID);
      } else {
        console.log("Can't find connector", "The connector config is wrong");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(connectorLocalStorageKey);
    deactivate();
  }, [deactivate]);

  return { login, logout };
};

export default useAuth;
