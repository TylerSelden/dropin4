import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { UseToast } from "./ToastContext";

const socketContext = createContext();

function sortMessages(messages) {
	return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function SocketProvider({ children }) {
	const { addToast } = UseToast();
	const loc = useLocation();
	const nav = useNavigate();
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
			reconnectionDelayMax: 5000,
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
					reconnect: true,
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
			setMessages((prev) => sortMessages([...prev, ...data.messages]));
			if (
				loc.pathname !== "/chat" &&
				currentRoomRef.current &&
				currentUsernameRef.current
			)
				nav("/chat");
		});

		s.on("message", (data) => {
			setMessages((prev) => sortMessages([...prev, data]));
		});

		return () => {
			s.disconnect();
			setSocket(null);
		};
	}, [addToast, loc.pathname, nav]);

	return (
		<socketContext.Provider
			value={{ socket, status, messages, currentRoomRef, currentUsernameRef }}
		>
			{children}
		</socketContext.Provider>
	);
}

export function UseSocket() {
	return useContext(socketContext);
}
