import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Header } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col h-full w-full relative main">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}
