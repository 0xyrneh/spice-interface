import { useContext } from "react";
import { NotificationContext } from "@/contexts/NotificationContext";

const useWallet = () => useContext(NotificationContext);

export default useWallet;
