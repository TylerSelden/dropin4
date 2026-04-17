import { Link } from "react-router";
import { Navigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Message, MessageGroup, BroadTimestamp, FineTimestamp, ChatInput, ChatContainer } from "../components/ChatComponents";
import { UseSocket } from "../components/SocketContext";

import Spinner from "../components/Spinner";

export default function Chat() {
  const { status, messages, currentRoom, currentUsername } = UseSocket();
  if (!currentRoom) {
    return (
      <>
        <Spinner />
        <Navigate to="/" />
      </>
    );
  }

  return (
    <>
      <header className="px-3 py-2 w-full bg-gray-800 flex justify-between sticky top-0 z-10 items-center">
        <Link to="/"><Logo /></Link>
        <p className="flex items-center gap-1">
          <span className={`w-3 h-3 rounded-full animate-pulse ${status === "Connected" ? "bg-green-600" : status === "Disconnected" ? "bg-red-500" : "bg-yellow-600"}`}></span>
          { status }
        </p>
      </header>

      <ChatContainer messages={ messages } username={ currentUsername } />

      <ChatInput />
    </>
  );
}
