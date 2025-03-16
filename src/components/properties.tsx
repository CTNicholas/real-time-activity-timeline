"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import {
  ClientSideSuspense,
  useMutation,
  useStorage,
} from "@liveblocks/react/suspense";
import { getUser, getUsers } from "@/app/api/database";
import { Select } from "@/components/select";
import { LiveObject } from "@liveblocks/client";
import { ActionUser } from "@/components/actions";

// Display real-time properties using Liveblocks Storage
export function Properties() {
  return (
    <ClientSideSuspense fallback={null}>
      <div className="flex flex-col gap-5 divide-y">
        <AssigneeOrReviewer type="assignee" />
        <AssigneeOrReviewer type="reviewer" />
      </div>
    </ClientSideSuspense>
  );
}

// Assignee and reviewer work the same way, so no need to duplicate logic
function AssigneeOrReviewer({ type }: { type: "assignee" | "reviewer" }) {
  // Get the real-time assignee or reviewer's user ID from Storage
  const userId = useStorage((root) => root[type]);

  // In a real app, get user info from your database
  const user = getUser(userId || "");

  // Change the assignee or reviewer
  const changeUser = useMutation(
    ({ storage, self }, newUserId: string) => {
      // Get user info from IDs
      const me = getUser(self.id);
      const newUser = getUser(newUserId);

      if (!me || !newUser) {
        return;
      }

      // Set the new assignee or reviewer
      storage.set(type, newUserId);

      // Create an action for the timeline
      // e.g. Jody assigned this to Charlie
      if (type === "assignee") {
        storage.get("actions").push(
          new LiveObject({
            type: "action",
            userId: me.id,
            timestamp: Date.now(),
            kind: "assign",
            assigneeId: newUserId,
          })
        );
      } else if (type === "reviewer") {
        storage.get("actions").push(
          new LiveObject({
            type: "action",
            userId: me.id,
            timestamp: Date.now(),
            kind: "review",
            reviewerId: newUserId,
          })
        );
      }
    },
    [type]
  );

  // Remove the assignee or reviewer
  const removeUser = useMutation(
    ({ storage, self }) => {
      // Get user info from ID
      const me = getUser(self.id);

      if (!me) {
        return;
      }

      // Remove the assignee or reviewer
      storage.set(type, null);

      // Create an action for the timeline
      // e.g. Jody unassigned Charlie
      storage.get("actions").push(
        new LiveObject({
          type: "action",
          userId: me.id,
          timestamp: Date.now(),
          kind: type === "assignee" ? "unassign" : "unreview",
        })
      );
    },
    [type]
  );

  return (
    <PropertiesItem
      title={type === "assignee" ? "Assignee" : "Reviewer"}
      titleSlot={
        <Select
          id={type}
          adjustFirstItem="split"
          items={userItems}
          value={userId || ""}
          onValueChange={(val) =>
            val === "none" ? removeUser() : changeUser(val)
          }
        />
      }
    >
      <div className="text-xs h-[24px] flex items-center">
        {user ? (
          <ActionUser user={user} />
        ) : (
          <div className="text-neutral-600">No {type}</div>
        )}
      </div>
    </PropertiesItem>
  );
}

export function PropertiesItem({
  title,
  titleSlot,
  children,
}: {
  title: string;
  titleSlot: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pb-4">
      <div className="text-xs text-neutral-500 font-medium mb-1 flex justify-between items-center">
        {title}
        {titleSlot}
      </div>
      <div>{children}</div>
    </div>
  );
}

// In your app, get your users from your database
const userItems = [
  {
    id: "none",
    jsx: <div className="text-neutral-600 text-xs">Unassign</div>,
  },
  ...getUsers().map((user) => ({
    id: user.id,
    jsx: (
      <div className="text-xs inline-flex items-center gap-[6px] text-neutral-800 font-medium">
        <Image
          className="rounded-full overflow-hidden"
          src={user.info.avatar}
          alt="avatar"
          width={20}
          height={20}
        />
        {user.info.name}
      </div>
    ),
  })),
];
