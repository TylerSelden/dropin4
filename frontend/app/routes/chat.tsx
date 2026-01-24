import type { Route } from "./+types/home";
import Logo from "../components/Logo.tsx";
import { MessageLeft, MessageRight, BroadTimestamp, LeftTimestamp, RightTimestamp } from "../components/ChatComponents.tsx";

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

      { /* test text bubble */ }
      <main className="p-4 pt-0">

        <BroadTimestamp timestamp={ 1769275604010 - 86400000 }></BroadTimestamp>
        <MessageLeft attachedBottom>Here is another message bubble aligned to the left. This one is for testing purposes as well. It should look different from the one on the right.</MessageLeft>
        <MessageLeft attachedTop>This is a test message bubble aligned to the left. It should have a different background color and alignment compared to the right-aligned bubble.</MessageLeft>
        <LeftTimestamp name="Alex" timestamp={ 1769275604010 }  />

        <BroadTimestamp timestamp={ 1769275604010 }></BroadTimestamp>

        <MessageRight attachedBottom>This is a test message bubble aligned to the right. It should have a different background color and alignment compared to the left-aligned bubble.</MessageRight>
        <MessageRight attachedTop attachedBottom>Here is another right-aligned message bubble for testing. It should maintain the same style as the previous right-aligned bubble.</MessageRight>
        <MessageRight attachedTop>This is the last right-aligned message bubble in this test sequence.</MessageRight>
        <RightTimestamp name="Tyler" timestamp={ 1769275604010 + 180000 } />

        <MessageLeft>This is a standalone left-aligned message bubble to test spacing and layout.</MessageLeft>
        <LeftTimestamp name="Alex" timestamp={ 1769275604010 + 320000 } />
      </main>
    </>
  );
}
