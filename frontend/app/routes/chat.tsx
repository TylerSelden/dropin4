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
          <Message attachedBottom text="Here is another message bubble aligned to the left. This one is for testing purposes as well. It should look different from the one on the right." />
          <Message attachedTop text="This is a test message bubble aligned to the left. It should have a different background color and alignment compared to the right-aligned bubble." />
          <FineTimestamp name="Alex" timestamp={ 1769275604010 }  />
        </MessageGroup>

        <BroadTimestamp timestamp={ 1769275604010 }></BroadTimestamp>
        <MessageGroup rightSide>
          <Message rightSide attachedBottom text="This is a test message bubble aligned to the right. It should have a different background color and alignment compared to the left-aligned bubble." />
          <Message rightSide attachedTop attachedBottom text="Here is another right-aligned message bubble for testing. It should maintain the same style as the previous right-aligned bubble." />
          <Message rightSide attachedTop text="This is the last right-aligned message bubble in this test sequence." />
          <FineTimestamp name="Tyler" timestamp={ 1769275604010 + 180000 } rightSide />
        </MessageGroup>

        <MessageGroup>
          <Message text="This is a standalone left-aligned message bubble to test spacing and layout." />
          <FineTimestamp name="Alex" timestamp={ 1769275604010 + 320000 } />
        </MessageGroup>

        <MessageGroup>
          <Message attachedBottom text="Two more messages from me" />
          <Message attachedTop text="This is the second message in this quick succession test." />
          <FineTimestamp name="Alex" timestamp={ 1769275604010 + 1000000 } />
        </MessageGroup>
          

        <MessageGroup>
          <Message attachedBottom text="Just checking" />
          <Message attachedTop attachedBottom text="If multiple messages are sent in quick succession, they should appear connected without extra spacing." />
          <Message attachedTop attachedBottom spaceTop text="This mesage was sent 5-10 mins after the previos one." />
          <Message attachedTop text="See if the timestamp placement is correct." />
          <FineTimestamp name="Samantha" timestamp={ 1769275604010 + 1800000 } />
        </MessageGroup>

        <MessageGroup rightSide>
          <Message rightSide text="Lowkey don't even know anyone named alex" />
          <FineTimestamp name="Tyler" timestamp={ 1769275604010 + 2500000 } rightSide />
        </MessageGroup>
      </main>

      <ChatInput />
    </>
  );
}
