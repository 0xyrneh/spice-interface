import { useContext } from "react";
import { WalletContext } from "@/contexts/WalletProvider";

const useWallet = () => useContext(WalletContext);

export default useWallet;
