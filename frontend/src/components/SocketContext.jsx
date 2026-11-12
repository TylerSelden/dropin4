import { createContext, useContext, useEffect, useState, useRef } from "react";
import { UseToast } from "./ToastContext";
import { io } from "socket.io-client";

const socketContext = createContext();

export function SocketProvider({ children }) {
  const { addToast } = UseToast();
  const [socket, setSocket] = useState();
  const [status, setStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const currentRoomRef = useRef(null);
  const currentUsernameRef = useRef(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    setSocket(s);

    s.onAnyOutgoing((evt, data) => {
      if (evt === "subscribe") {
        currentRoomRef.current = data.room;
        currentUsernameRef.current = data.username;
      }
      if (evt === "unsubscribe") {
        currentRoomRef.current = null;
        currentUsernameRef.current = null;
        setMessages([]);
      }
    });

    s.on("connect", () => {
      setStatus("Connected");
      if (currentRoomRef.current && currentUsernameRef.current) {
        s.emit("subscribe", {
          room: currentRoomRef.current,
          username: currentUsernameRef.current,
          reconnect: true
        });
      }
    });

    s.on("disconnect", () => {
      setStatus("Reconnecting");
    });

    s.on("err", (data) => {
      console.error(data);
      addToast("error", data);
    });

    s.on("page", (data) => {
      setMessages((prev) => [...prev, ...data.messages]);
    });

    s.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });


    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, status, messages, currentRoomRef, currentUsernameRef }}>
      { children }
    </socketContext.Provider>
  );
};

export function UseSocket() {
  return useContext(socketContext);
}
