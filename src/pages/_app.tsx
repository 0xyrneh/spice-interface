import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";

import { Header, Footer, NotSupported } from "@/components";
import WalletProvider from "@/contexts/WalletContext";
import NotificationProvider from "@/contexts/NotificationContext";
import UIProvider from "@/contexts/UIContext";
import { store } from "@/state/store";
import { getLibrary } from "@/utils/web3React";

import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <UIProvider>
          <NotificationProvider>
            {/* <WalletProvider> */}
            <div className="flex flex-col h-full w-full relative main font-SpaceGrotesk items-center">
              <Header />
              <Component {...pageProps} />
              <Footer />
              <NotSupported />
            </div>
            {/* </WalletProvider> */}
          </NotificationProvider>
        </UIProvider>
      </Provider>
    </Web3ReactProvider>
  );
}
