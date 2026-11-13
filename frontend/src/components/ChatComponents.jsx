import { useRef, useEffect, useLayoutEffect, useState, Fragment } from 'react';
import { UseSocket } from './SocketContext';
import { IoIosSend } from 'react-icons/io';
import { BsFillMarkdownFill } from "react-icons/bs";
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Schemas, Validate } from '../../../shared/schemas';

export function Message({ text, rightSide, attachedTop, attachedBottom }) {
  return (
    <div className={`
      max-w-sm px-4 py-3 bg-gradient-to-r rounded-xl prose prose-invert break-words
      ${rightSide ? 'from-violet-800 to-violet-900 bg-[length:32rem] rounded-br-none' : 'from-gray-800 to-gray-700 bg-[length:48rem] rounded-bl-none' }
      ${attachedTop ? 'rounded-t-none' : 'mt-2'}
      ${attachedBottom && 'rounded-b-none'}
    `}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text)) }}
    >
    </div>
  );
}

export function MessageGroup({ children, rightSide }) {
  return (
    <div className={`flex my-1 ${rightSide ? 'justify-end ml-6' : 'justify-start mr-6'}`}>
      <div className="flex flex-col gap-1">
        { children }
      </div>
    </div>
  );
}

export function SmallMessageSpacer() {
  return (
    <div></div>
  );
}

export function BroadTimestamp({ timestamp }) {
  return (
    <h4 className="text-center text-gray-500 mt-2">
      {(() => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        if (diff < oneDay && date.getDate() === now.getDate()) {
          return 'Today';
        } else if (diff < 2 * oneDay && date.getDate() === now.getDate() - 1) {
          return 'Yesterday';
        } else if (diff < 7 * oneDay) {
          return date.toLocaleDateString(undefined, { weekday: 'long' });
        } else {
          return date.toLocaleDateString();
        }
      })()}
    </h4>
  );
}

function timestampToTimeString(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function FineTimestamp({ name, timestamp, rightSide }) {
  return (
    <p className={`m-2 mt-0 text-md truncate font-semibold ${rightSide && 'text-right'}`}>
      { rightSide ? (
        <>
          <span className="text-sm text-gray-500 mt-1">{ timestampToTimeString(timestamp) } &middot;</span> { name }
        </>
      ) : (
        <>
          { name } <span className="text-sm text-gray-500 mt-1">&middot; { timestampToTimeString(timestamp) }</span>
        </>
      )}
    </p>
  );
}

export function ChatInput() {
  const { status, socket, currentRoomRef } = UseSocket();
  const textareaRef = useRef(null);
  const [messageContentIsValid, setMessageContentIsValid] = useState(false);
  const [markdownShowing, setMarkdownShowing] = useState(false);

  const send = () => {
    const message = {
      room: currentRoomRef.current,
      content: textareaRef.current.value.trim()
    }
    if (messageContentIsValid && status === "Connected") {
      socket.emit("message", message);
      textareaRef.current.value = "";
      setMarkdownShowing(false);
      handleInput();
      return;
    }
  };

  const handleInput = (evt) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const value = textarea.value.trim();
    setMessageContentIsValid(Validate(Schemas.messageContent, "Message", value) === null);

    const scrollY = window.scrollY;
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 2 + "px"; // +2 for border
    scrollTo(0, atBottom ? document.body.scrollHeight : scrollY);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeObserver = new ResizeObserver(() => {
      handleInput();
    });

    resizeObserver.observe(textarea);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  return (
    <footer className="p-3 w-full max-w-screen fixed bottom-0 flex justify-center pointer-events-none">
      <div className="relative w-4xl max-w-full flex items-end pointer-events-auto">
        <div className={`w-full overflow-y-scroll max-h-[80dvh] rounded-[25px] min-h-[50px] p-3 pl-5 pr-21 bg-gray-800 border border-gray-600 z-10 ${!markdownShowing && 'hidden'}`}>
          <div
            className="w-full max-w-none break-words prose prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(textareaRef.current?.value || '')) }}
          ></div>
        </div>

        <textarea
          className={`w-full resize-none max-h-[80dvh] overflow-scroll rounded-[25px] p-3 pl-5 pr-21 bg-gray-800 border border-gray-600 outline-none focus:ring-1 focus:ring-violet-600 z-10 ${markdownShowing && 'hidden'}`}
          rows={1}
          ref={textareaRef}
          placeholder="Type your message..."
          onKeyDown={(evt) => {
            if (evt.key === "Enter" && !evt.shiftKey) {
              evt.preventDefault();
              send();
            }
          }}
          onInput={ handleInput }
        ></textarea>

        <div className="absolute left-0 bottom-0 h-[50px] w-full flex items-center justify-end">
          <button className={`mr-2 rounded-3/4 hover:text-gray-300 active:text-gray-500 transition-colors z-15 text-${markdownShowing ? 'gray-300' : 'gray-500'}`} onClick={() => setMarkdownShowing(!markdownShowing)}>
            <BsFillMarkdownFill size={28} />
          </button>
          <button
            className={
              `bg-violet-700 p-1 mr-2 rounded-full hover:bg-violet-800 active:bg-violet-900 transition-colors z-15 transition-opacity duration-100
              ${(!messageContentIsValid || status !== "Connected") && 'opacity-50'}
            `}
            onClick={ send }
            disabled={ !messageContentIsValid || status !== "Connected" }
          >
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export function ChatContainer({ messages, username }) {
  const { socket, currentRoomRef } = UseSocket();
  const chatRef = useRef(null);
  const chatInitialized = useRef(false);
  const wasAtBottom = useRef(true);
  const sentinelRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const loadingRef = useRef(false);
  const prevScrollHeight = useRef(0);
  const prevOldest = useRef(null);

  useEffect(() => {
    loadingRef.current = false;
  }, [messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const current = messagesRef.current;
      if (!chatInitialized.current || !entry.isIntersecting || !current.length || loadingRef.current) return;
      loadingRef.current = true;
      socket.emit("page", {
        room: currentRoomRef.current,
        timestamp: current[0].timestamp
      });
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [socket, currentRoomRef]);

  const handleScroll = () => {
    const chat = chatRef.current;
    if (!chat) return;
    wasAtBottom.current = (chat.scrollHeight - chat.scrollTop - chat.clientHeight) < 50;
  }

  useLayoutEffect(() => {
    const chat = chatRef.current;
    const oldest = messages[0]?.timestamp ?? null;
    const prepended = chatInitialized.current && prevOldest.current !== null && oldest !== null && oldest < prevOldest.current;

    if (prepended) {
      chat.scrollTop = chat.scrollHeight - prevScrollHeight.current;
    } else if (wasAtBottom.current) {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: chatInitialized.current ? 'smooth' : 'auto'
      });
    }

    prevScrollHeight.current = chat.scrollHeight;
    prevOldest.current = oldest;
    chatInitialized.current = true;
  }, [messages]);

  const messageGroups = [];

  messages.forEach((message) => {
    const lastGroup = messageGroups[messageGroups.length - 1];

    if (lastGroup && lastGroup.username === message.username && message.timestamp - lastGroup.messages[0].timestamp < 5 * 60 * 1000) {
      lastGroup.messages.push(message);
    } else {
      messageGroups.push({ username: message.username, messages: [message] });
    }
  });

  return (
    <main className="relative px-4 pb-20 flex-grow overflow-y-auto" ref={ chatRef } onScroll={ handleScroll }>
      <div className="absolute -z-100 top-0 left-0 w-full h-75" ref={ sentinelRef }></div>
      { messageGroups.map((group, groupIndex) => {
        const broadTimestampNeeded = groupIndex === 0 || (new Date(group.messages[0].timestamp).toDateString() !== new Date(messageGroups[groupIndex - 1].messages[0].timestamp).toDateString());
        const rightSide = group.username === username;
        return (
          <Fragment key={groupIndex}>
            { broadTimestampNeeded && <BroadTimestamp timestamp={group.messages[0].timestamp} /> }
            <MessageGroup rightSide={rightSide}>
              { group.messages.map((message, messageIndex) => {
                const attachedTop = messageIndex > 0;
                const attachedBottom = messageIndex < group.messages.length - 1;
                return (
                  <Message
                    key={messageIndex}
                    text={message.content}
                    rightSide={rightSide}
                    attachedTop={attachedTop}
                    attachedBottom={attachedBottom}
                  />
                );
              }) }
            </MessageGroup>
            <FineTimestamp name={group.username} timestamp={group.messages[group.messages.length - 1].timestamp} rightSide={rightSide} />
          </Fragment>
        );
      }) }
    </main>
  );
}
