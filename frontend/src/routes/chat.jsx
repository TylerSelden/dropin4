import { Link } from "react-router";
import { Navigate } from "react-router-dom";
import { ChatContainer, ChatInput } from "../components/ChatComponents";
import Logo from "../components/Logo";
import { UseSocket } from "../components/SocketContext";

import Spinner from "../components/Spinner";

export default function Chat() {
	const { socket, status, messages, currentRoomRef, currentUsernameRef } =
		UseSocket();
	if (!currentRoomRef.current) {
		return (
			<>
				<Spinner />
				<Navigate to="/" />
			</>
		);
	}

	const unsubscribe = () => {
		socket.emit("unsubscribe", currentRoomRef.current);
	};

	return (
		<div className="flex h-dvh flex-col">
			<header className="px-3 py-2 w-full bg-gray-800 flex justify-between sticky top-0 z-10 items-center">
				<Link to="/" onClick={unsubscribe}>
					<Logo />
				</Link>
				<p className="flex items-center gap-1 ml-2">
					<span
						className={`w-3 h-3 rounded-full animate-pulse ${status === "Connected" ? "bg-green-600" : status === "Disconnected" ? "bg-red-500" : "bg-yellow-600"}`}
					></span>
					<span className="max-[350px]:hidden">{status}</span>
				</p>
			</header>

			<ChatContainer
				messages={messages}
				username={currentUsernameRef.current}
			/>

			<ChatInput />
		</div>
	);
}
