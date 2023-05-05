import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Header, Footer, NotSupported } from "@/components";
import WalletProvider from "@/contexts/WalletContext";
import NotificationProvider from "@/contexts/NotificationContext";
import UIProvider from "@/contexts/UIContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UIProvider>
      <NotificationProvider>
        <WalletProvider>
          <div className="flex flex-col h-full w-full relative main font-SpaceGrotesk items-center">
            <Header />
            <Component {...pageProps} />
            <Footer />
            <NotSupported />
          </div>
        </WalletProvider>
      </NotificationProvider>
    </UIProvider>
  );
}
