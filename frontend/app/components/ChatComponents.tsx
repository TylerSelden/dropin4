import { useRef, useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { BsFillMarkdownFill } from "react-icons/bs";
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export function Message({ text, rightSide, attachedTop, attachedBottom, spaceTop }: { text: string, rightSide?: boolean, attachedTop?: boolean, attachedBottom?: boolean, spaceTop?: boolean }) {
  return (
    <div className={`
      max-w-sm px-4 py-3 bg-gradient-to-r rounded-xl prose prose-invert
      ${rightSide ? 'from-violet-800 to-violet-900 bg-[length:32rem] rounded-br-none' : 'from-gray-800 to-gray-700 bg-[length:48rem] rounded-bl-none' }
      ${attachedTop ? 'rounded-t-none' : 'mt-2'}
      ${attachedBottom ? 'rounded-b-none' : ''}
      ${spaceTop ? 'mt-2' : ''}
    `}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text)) }}
    >
    </div>
  );
}

export function MessageGroup({ children, rightSide }: { children: React.ReactNode, rightSide: boolean }) {
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

export function BroadTimestamp({ timestamp }: { timestamp: number }) {
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

function timestampToTimeString(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function FineTimestamp({ name, timestamp, rightSide }: { name: string; timestamp: number; rightSide: boolean }) {
  return (
    <p className={`m-2 mt-0 text-md font-semibold ${rightSide ? 'text-right' : ''}`}>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [markdownShowing, setMarkdownShowing] = useState(false);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const scrollY = window.scrollY;
      const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + 2 + "px"; // +2 for border
      scrollTo(0, atBottom ? document.body.scrollHeight : scrollY);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const resizeObserver = new ResizeObserver(() => {
      adjustTextareaHeight();
    });

    resizeObserver.observe(textarea);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  return (
    <footer className="p-3 w-full fixed bottom-0 flex justify-center pointer-events-none">
      <div className="relative w-4xl flex items-end pointer-events-auto">
        <div className={`w-full max-h-[80dvh] overflow-scroll rounded-[25px] min-h-[50px] p-3 pl-5 pr-21 bg-gray-800 border border-gray-600 z-10 ${markdownShowing ? '' : 'hidden'}`}>
          <div
            className="max-w-full prose prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(textareaRef.current?.value || '')) }}
          ></div>
        </div>

        <textarea
          className={`w-full resize-none max-h-[80dvh] overflow-scroll rounded-[25px] p-3 pl-5 pr-21 bg-gray-800 border border-gray-600 outline-none focus:ring-1 focus:ring-violet-600 z-10 ${markdownShowing ? 'hidden' : ''}`}
          rows={1}
          ref={textareaRef}
          placeholder="Type your message..."
          onInput={adjustTextareaHeight}
        ></textarea>

        <div className="absolute left-0 bottom-0 h-[50px] w-full flex items-center justify-end">
          <button className={`mr-2 rounded-3/4 hover:text-gray-300 active:text-gray-500 transition-colors z-15 text-${markdownShowing ? 'gray-300' : 'gray-500'}`} onClick={() => setMarkdownShowing(!markdownShowing)}>
            <BsFillMarkdownFill size={28} />
          </button>
          <button className="bg-violet-700 p-1 mr-2 rounded-full hover:bg-violet-600 active:bg-violet-800 transition-colors z-15">
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </footer>
  );
}
