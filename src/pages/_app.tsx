import React from "react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";

import { Header, Footer, NotSupported } from "@/components";
import NotificationProvider from "@/contexts/NotificationContext";
import UIProvider from "@/contexts/UIContext";
import { store } from "@/state/store";
import { connectors } from "@/utils/web3React";

import "@/styles/globals.scss";

declare global {
  var ethereum: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Provider store={store}>
        <UIProvider>
          <NotificationProvider>
            <div className="flex flex-col h-full w-full relative main font-SpaceGrotesk items-center">
              <Header />
              <Component {...pageProps} />
              <Footer />
              <NotSupported />
            </div>
          </NotificationProvider>
        </UIProvider>
      </Provider>
    </Web3ReactProvider>
  );
}
