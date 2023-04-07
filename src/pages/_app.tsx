import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Header } from "@/components";
import WalletProvider from "@/contexts/WalletProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <div className="flex flex-col h-full w-full relative main">
        <Header />
        <Component {...pageProps} />
      </div>
    </WalletProvider>
  );
}
