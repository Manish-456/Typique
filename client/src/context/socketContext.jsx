import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "../config";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{socket: socket}}>
      {children}
    </SocketContext.Provider>
  );
};
  