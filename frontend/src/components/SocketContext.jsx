import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const s = io("https://backend.benti.dev:444", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    setSocket(s);

    s.on("connect", () => {
      setStatus("Connected");
    });

    s.on("disconnect", () => {
      setStatus("Reconnecting");
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, status }}>
      {children}
    </socketContext.Provider>
  );
};

export function UseSocket() {
  return useContext(socketContext);
}
