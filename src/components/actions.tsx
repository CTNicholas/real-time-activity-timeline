import { getUser } from "@/app/api/database";
import Image from "next/image";
import { ReactNode } from "react";
import { Action } from "@/liveblocks.config";
import { Timestamp } from "@liveblocks/react-ui/primitives";

// Action messages e.g. Jody assigned this to Charlie
export function ActionRow({ action }: { action: Action }) {
  const me = getUser(action.userId);

  if (action.kind === "assign") {
    const assignee = getUser(action.assigneeId || "");

    return (
      <ActionLayout user={me}>
        <span className="whitespace-pre"> assigned this to </span>
        <ActionUser user={assignee} />
        <span className="whitespace-pre">
          {" "}
          <Timestamp className="" date={action.timestamp} />
        </span>
      </ActionLayout>
    );
  }

  if (action.kind === "unassign") {
    return (
      <ActionLayout user={me}>
        <span className="whitespace-pre"> unassigned this </span>
        <span className="whitespace-pre">
          <Timestamp className="" date={action.timestamp} />
        </span>
      </ActionLayout>
    );
  }

  if (action.kind === "review") {
    const reviewer = getUser(action.reviewerId || "");

    return (
      <ActionLayout user={me}>
        <span className="whitespace-pre"> requested a review from </span>{" "}
        <ActionUser user={reviewer} />
        <span className="whitespace-pre ml-1">
          <Timestamp className="" date={action.timestamp} />
        </span>
      </ActionLayout>
    );
  }

  if (action.kind === "unreview") {
    return (
      <ActionLayout user={me}>
        <span className="whitespace-pre"> set it as not ready to review </span>
        <span className="whitespace-pre">
          <Timestamp className="" date={action.timestamp} />
        </span>
      </ActionLayout>
    );
  }

  return null;
}

function ActionLayout({
  user,
  children,
}: {
  user: Liveblocks["UserMeta"] | null;
  children: ReactNode;
}) {
  return (
    <div className="text-xs flex mx-4 my-4 text-sm text-neutral-500 relative isolate">
      <div className="z-10">
        {user ? (
          <div className="-ml-[10px] grow flex items-center">
            <ActionUser user={user} />
            {children}
          </div>
        ) : (
          <div className="grow py-4 flex items-center">{children}</div>
        )}
      </div>
    </div>
  );
}

export function ActionUser({ user }: { user: Liveblocks["UserMeta"] | null }) {
  if (!user) {
    return <div>Someone</div>;
  }

  return (
    <div className="inline-flex items-center gap-[5px] pl-[3px] font-medium text-neutral-800">
      <ActionAvatar src={user.info.avatar} />
      {user.info.name}
    </div>
  );
}

function ActionAvatar({ src }: { src: string | null }) {
  if (!src) {
    return (
      <div className="bg-neutral-300 w-5 h-5 rounded-full overflow-hidden ring-3 ring-neutral-50" />
    );
  }

  return (
    <Image
      className="rounded-full overflow-hidden ring-3 ring-neutral-50"
      src={src}
      alt="avatar"
      width={20}
      height={20}
    />
  );
}
