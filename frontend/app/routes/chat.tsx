import type { Route } from "./+types/home";
import Logo from "../components/Logo.tsx";
import { Message, MessageGroup, BroadTimestamp, LeftTimestamp, RightTimestamp } from "../components/ChatComponents.tsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DropIn Chat" },
    { name: "description", content: "DropIn is a simple, web-based chat app" },
  ];
}

export default function Chat() {
  return (
    <>
      <header className="px-3 py-2 w-full bg-gray-800 flex justify-between sticky top-0 z-10 items-center">
        <Logo />
        <p className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
          Connected
        </p>
      </header>

      <main className="p-4 pt-0">
        <BroadTimestamp timestamp={ 1769275604010 - 86400000 }></BroadTimestamp>
        <MessageGroup>
          <Message attachedBottom>Here is another message bubble aligned to the left. This one is for testing purposes as well. It should look different from the one on the right.</Message>
          <Message attachedTop>This is a test message bubble aligned to the left. It should have a different background color and alignment compared to the right-aligned bubble.</Message>
          <LeftTimestamp name="Alex" timestamp={ 1769275604010 }  />
        </MessageGroup>

        <BroadTimestamp timestamp={ 1769275604010 }></BroadTimestamp>
        <MessageGroup rightSide>
          <Message rightSide attachedBottom>This is a test message bubble aligned to the right. It should have a different background color and alignment compared to the left-aligned bubble.</Message>
          <Message rightSide attachedTop attachedBottom>Here is another right-aligned message bubble for testing. It should maintain the same style as the previous right-aligned bubble.</Message>
          <Message rightSide attachedTop>This is the last right-aligned message bubble in this test sequence.</Message>
          <RightTimestamp name="Tyler" timestamp={ 1769275604010 + 180000 } />
        </MessageGroup>

        <MessageGroup>
          <Message>This is a standalone left-aligned message bubble to test spacing and layout.</Message>
          <LeftTimestamp name="Alex" timestamp={ 1769275604010 + 320000 } />
        </MessageGroup>

        <MessageGroup>
          <Message attachedBottom>Just checking</Message>
          <Message attachedTop>This happened later in the conversation.</Message>
          <LeftTimestamp name="Alex" timestamp={ 1769275604010 + 600000 } />
        </MessageGroup>

        <MessageGroup rightSide>
          <Message rightSide>Lowkey don't even know anyone named alex</Message>
          <RightTimestamp name="Tyler" timestamp={ 1769275604010 + 900000 } />
        </MessageGroup>
      </main>
    </>
  );
}
