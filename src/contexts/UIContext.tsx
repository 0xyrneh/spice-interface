import { createContext, ReactNode, useState } from "react";

interface UIContextType {
  blur: boolean;
  setBlur: (val: boolean) => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

type Props = {
  children: ReactNode;
};

const UIProvider = ({ children }: Props) => {
  const [blur, setBlur] = useState(false);

  return (
    <UIContext.Provider
      value={{
        blur,
        setBlur,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
