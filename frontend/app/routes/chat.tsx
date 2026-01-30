import type { Route } from "./+types/home";
import Logo from "../components/Logo.tsx";
import { Message, MessageGroup, BroadTimestamp, FineTimestamp, ChatInput } from "../components/ChatComponents.tsx";

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

      <main className="px-4 pb-15">
        <BroadTimestamp timestamp={ 1769275604010 - 86400000 }></BroadTimestamp>
        <MessageGroup>
          <Message attachedBottom>Here is another message bubble aligned to the left. This one is for testing purposes as well. It should look different from the one on the right.</Message>
          <Message attachedTop>This is a test message bubble aligned to the left. It should have a different background color and alignment compared to the right-aligned bubble.</Message>
          <FineTimestamp name="Alex" timestamp={ 1769275604010 }  />
        </MessageGroup>

        <BroadTimestamp timestamp={ 1769275604010 }></BroadTimestamp>
        <MessageGroup rightSide>
          <Message rightSide attachedBottom>This is a test message bubble aligned to the right. It should have a different background color and alignment compared to the left-aligned bubble.</Message>
          <Message rightSide attachedTop attachedBottom>Here is another right-aligned message bubble for testing. It should maintain the same style as the previous right-aligned bubble.</Message>
          <Message rightSide attachedTop>This is the last right-aligned message bubble in this test sequence.</Message>
          <FineTimestamp name="Tyler" timestamp={ 1769275604010 + 180000 } rightSide />
        </MessageGroup>

        <MessageGroup>
          <Message>This is a standalone left-aligned message bubble to test spacing and layout.</Message>
          <FineTimestamp name="Alex" timestamp={ 1769275604010 + 320000 } />
        </MessageGroup>

        <MessageGroup>
          <Message attachedBottom>Two more messages from me</Message>
          <Message attachedTop>This is the second message in this quick succession test.</Message>
          <FineTimestamp name="Alex" timestamp={ 1769275604010 + 1000000 } />
        </MessageGroup>
          

        <MessageGroup>
          <Message attachedBottom>Just checking</Message>
          <Message attachedTop attachedBottom>If multiple messages are sent in quick succession, they should appear connected without extra spacing.</Message>
          <Message attachedTop attachedBottom spaceTop>This mesage was sent 5-10 mins after the previos one.</Message>
          <Message attachedTop>See if the timestamp placement is correct.</Message>
          <FineTimestamp name="Samantha" timestamp={ 1769275604010 + 1800000 } />
        </MessageGroup>

        <MessageGroup rightSide>
          <Message rightSide>Lowkey don't even know anyone named alex</Message>
          <FineTimestamp name="Tyler" timestamp={ 1769275604010 + 2500000 } rightSide />
        </MessageGroup>
      </main>

      <ChatInput />
    </>
  );
}
