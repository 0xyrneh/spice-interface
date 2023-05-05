import { useContext } from "react";
import { UIContext } from "@/contexts/UIContext";

const useUI = () => useContext(UIContext);

export default useUI;
