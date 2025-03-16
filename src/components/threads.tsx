import { useState } from "react";
import { ThreadData } from "@liveblocks/core";
import { Comment, Thread } from "@liveblocks/react-ui";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CustomThread({ thread }: { thread: ThreadData }) {
  const [temporarilyOpen, setTemporarilyOpen] = useState(false);
  const showFullThread = !thread.resolved || temporarilyOpen;

  return (
    <>
      <div
        style={showFullThread ? { display: "none" } : undefined}
        className="relative w-full text-sm text-neutral-500 my-4"
      >
        <div className="overflow-hidden rounded-lg bg-white border border-neutral-300">
          <button
            className="cursor-pointer border-b border-neutral-200 bg-gray-50 font-medium text-xs w-full text-left py-2 px-3 text-neutral-600 flex justify-between items-center"
            onClick={() => setTemporarilyOpen(true)}
          >
            Show resolved <ChevronDown size={16} />
          </button>
          <div className="text-sm max-h-22 overflow-hidden relative">
            <Comment comment={thread.comments[0]} indentContent={false} />
            <div className="bg-gradient-to-b from-transparent to-white inset-0 absolute" />
          </div>
        </div>
      </div>

      <div
        style={!showFullThread ? { display: "none" } : undefined}
        className="relative text-sm border border-neutral-300 rounded-lg mb-4"
      >
        <div className="rounded-lg overflow-hidden">
          {temporarilyOpen ? (
            <button
              className="cursor-pointer border-b rounded-t-md border-neutral-200 bg-gray-50 font-medium text-xs w-full text-left py-2 px-3 text-neutral-600 flex justify-between items-center"
              onClick={() => setTemporarilyOpen(false)}
            >
              Hide resolved <ChevronUp size={16} />
            </button>
          ) : null}
          <Thread
            thread={thread}
            indentCommentContent={false}
            showActions={true}
            showComposer={temporarilyOpen ? false : "collapsed"}
            onResolvedChange={() => setTemporarilyOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
