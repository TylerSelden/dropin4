export function Message({ children, rightSide, attachedTop, attachedBottom }: { children: React.ReactNode, rightSide?: boolean, attachedTop?: boolean, attachedBottom?: boolean }) {
  return (
    <div className={`
      max-w-sm px-4 py-3 bg-gradient-to-r rounded-xl
      ${rightSide ? 'from-violet-800 to-violet-900 bg-[length:32rem] rounded-br-none' : 'from-gray-800 to-gray-700 bg-[length:48rem] rounded-bl-none' }
      ${attachedTop ? 'rounded-t-none' : ''}
      ${attachedBottom ? 'rounded-b-none' : ''}
    `}>
      { children }
    </div>
  );
}

export function MessageGroup({ children, rightSide }: { children: React.ReactNode, rightSide: boolean }) {
  return (
    <div className={`flex my-1 ${rightSide ? 'justify-end ml-10' : 'justify-start mr-10'}`}>
      <div className="flex flex-col gap-1">
        { children }
      </div>
    </div>
  );
}

export function BroadTimestamp({ timestamp }: { timestamp: number }) {
  return (
    <h4 className="text-center text-gray-500 my-2">
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
  // e.g. 10:32 AM
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function LeftTimestamp({ name, timestamp }: { name: string; timestamp: number }) {
  return (
    <p className="ml-2 mb-2 text-md text-md font-semibold">
      { name } <span className="text-sm text-gray-500 mt-1">&middot; { timestampToTimeString(timestamp) }</span>
    </p>
  );
}

export function RightTimestamp({ name, timestamp }: { name: string; timestamp: number }) {
  return (
    <p className="mr-2 mb-2 text-md text-md font-semibold text-right">
      <span className="text-sm text-gray-500 mt-1">{ timestampToTimeString(timestamp) } &middot; </span>{ name }
    </p>
  );
}
