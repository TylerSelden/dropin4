import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [status, setStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  // FIXME: Allow for multiple rooms in future builds
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);

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

    s.on("err", (data) => {
      console.error(data);
    });

    s.on("page", (data) => {
      if (currentRoom && currentRoom !== data.room) return;

      setCurrentRoom(data.room);
      setCurrentUsername(data.username);
      setMessages((prev) => [...prev, ...data.messages]);
    });

    s.on("message", (data) => {
      if (currentRoom && currentRoom !== data.room) return;

      setMessages((prev) => [...prev, data]);
    });


    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, status, messages, currentRoom, currentUsername }}>
      { children }
    </socketContext.Provider>
  );
};

export function UseSocket() {
  return useContext(socketContext);
}
