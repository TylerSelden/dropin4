import { Link } from "react-router";
import Logo from "../components/Logo";
import { Message, MessageGroup, BroadTimestamp, FineTimestamp, ChatInput, ChatContainer } from "../components/ChatComponents";

const messages = [
  // === ~3 weeks ago ===
  {
    user: "Alex",
    message: "Is anyone else seeing flaky CI runs?",
    timestamp: 1770057067731 - 21 * 86_400_000
  },
  {
    user: "Tyler",
    message: "Yeah, looks like a race condition in the auth.",
    timestamp: 1770057067731 - 21 * 86_400_000 + 3 * 60_000
  },

  // === ~2 weeks ago ===
  {
    user: "Samantha",
    message: "Pushing a small refactor to the session manager.",
    timestamp: 1770057067731 - 14 * 86_400_000
  },
  {
    user: "Alex",
    message: "Nice — I’ll review after lunch.",
    timestamp: 1770057067731 - 14 * 86_400_000 + 4 * 60_000
  },

  // === 7 days ago ===
  {
    user: "Tyler",
    message: "Heads up: prod deploy scheduled for tonight.",
    timestamp: 1770057067731 - 7 * 86_400_000
  },
  {
    user: "Samantha",
    message: "I’ll be around if anything goes sideways.",
    timestamp: 1770057067731 - 7 * 86_400_000 + 2 * 60_000
  },

  // === 6 days ago ===
  {
    user: "Alex",
    message: "Deploy went smoothly 🎉",
    timestamp: 1770057067731 - 6 * 86_400_000
  },
  {
    user: "Tyler",
    message: "Nice. Monitoring logs now.",
    timestamp: 1770057067731 - 6 * 86_400_000 + 90 * 1000
  },
  {
    user: "Tyler",
    message: "Seeing a small spike in refresh-token retries.",
    timestamp: 1770057067731 - 6 * 86_400_000 + 6 * 60_000
  },

  // === 3 days ago ===
  {
    user: "Samantha",
    message: "That retry spike might explain yesterday’s alert.",
    timestamp: 1770057067731 - 3 * 86_400_000
  },
  {
    user: "Tyler",
    message: "Agreed — digging into it now.",
    timestamp: 1770057067731 - 3 * 86_400_000 + 2 * 60_000
  },
  // === Today ===
  {
    user: "Alex",
    message: "Morning folks — did anyone actually sleep?",
    timestamp: 1770057067731
  },
  // +30 sec
  {
    user: "Samantha",
    message: "Barely 😅",
    timestamp: 1770057097731
  },
  // +30 sec
  {
    user: "Samantha",
    message: "I stayed up fixing that `weird bug` we saw yesterday.",
    timestamp: 1770057127731
  },
  // +1 min
  {
    user: "Tyler",
    message: "Respect. I crashed immediately.",
    timestamp: 1770057187731
  },
  // +1 min
  {
    user: "Alex",
    message: "Same here. Coffee is doing the heavy lifting.",
    timestamp: 1770057247731
  },
  // +2 min
  {
    user: "Tyler",
    message: "## Quick update\nI started reviewing the logs from last night.",
    timestamp: 1770057367731
  },
  // +50 sec
  {
    user: "Tyler",
    message: "Found something odd about the auth flow…",
    timestamp: 1770057417731
  },
  // +6 min
  {
    user: "Tyler",
    message: "It *might* be related to the token refresh timing.",
    timestamp: 1770057777731
  },
  // +11 min
  {
    user: "Tyler",
    message: "Here’s a tiny repro I put together:\n```js\nrefreshToken(user);alskdfflksdjflksdjflksdfjlksdjflksdjflksdjflksdjflksdfjljk\nvalidateSession(user);\n```",
    timestamp: 1770058437731
  },
  // +30 min
  {
    user: "Tyler",
    message: "Basically, the order matters more than we thought.",
    timestamp: 1770060237731
  },
  // +2 hrs
  {
    user: "Tyler",
    message: "**Good news:** it’s fixable.\n*Bad news:* it’s subtle.",
    timestamp: 1770067557731
  }
];


export default function Chat() {
  return (
    <>
      <header className="px-3 py-2 w-full bg-gray-800 flex justify-between sticky top-0 z-10 items-center">
        <Link to="/"><Logo /></Link>
        <p className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
          Connected
        </p>
      </header>

      <ChatContainer messages={messages} username="Tyler" />

      <ChatInput />
    </>
  );
}
