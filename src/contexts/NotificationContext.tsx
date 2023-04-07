import { createContext, ReactNode, useState } from "react";

interface NotificationContextType {
  showNotification: (title: string, message: string) => void;
  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType
);

type Props = {
  children: ReactNode;
};

const NotificationProvider = ({ children }: Props) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showNotification = (_title: string, _message: string) => {
    setTitle(_title);
    setMessage(_message);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
      }}
    >
      {children}
      {visible && (
        <div className="fixed bg-secondary bg-opacity-90 top-16 right-20 w-[300px] flex flex-col rounded-l rounded-b border-1 border-light text-xs text-white font-SuisseIntl p-2">
          <span>{title}</span>
          <br />
          <span>{message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
