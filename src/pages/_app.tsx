import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Header, Footer } from "@/components";
import WalletProvider from "@/contexts/WalletContext";
import NotificationProvider from "@/contexts/NotificationContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <WalletProvider>
        <div className="flex flex-col h-full w-full relative main font-SpaceGrotesk items-center">
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </WalletProvider>
    </NotificationProvider>
  );
}
