"use client";

import { useStorage, useThreads } from "@liveblocks/react/suspense";
import { Composer } from "@liveblocks/react-ui";
import { ClientSideSuspense } from "@liveblocks/react";
import { Action } from "@/liveblocks.config";
import { ThreadData } from "@liveblocks/core";
import { ActionRow } from "@/components/actions";
import { CustomThread } from "@/components/threads";

export function Timeline() {
  return (
    <ClientSideSuspense fallback={null}>
      <MainTimeline />
    </ClientSideSuspense>
  );
}

function MainTimeline() {
  // Get all threads and actions, and sort by creation
  const { threads } = useThreads();
  const actions = useStorage((root) => root.actions);
  const items = sortByDate([...actions, ...threads]);

  return (
    <div className="flex flex-col gap-6">
      {items.length ? (
        <div className="relative">
          <div className="w-full h-[3px] bg-neutral-200 mb-3" />
          <div className="h-full w-[2px] bg-neutral-200 absolute top-0 left-[18px] bottom-0" />

          {items.map((item) =>
            item.type === "thread" ? (
              <CustomThread key={item.id} thread={item} />
            ) : (
              <ActionRow key={item.timestamp} action={item} />
            )
          )}

          <div className="w-full h-[3px] bg-neutral-200 mt-3" />
        </div>
      ) : null}

      <Composer className="border border-neutral-300 rounded-lg overflow-hidden text-sm" />
    </div>
  );
}

function sortByDate(items: Array<Action | ThreadData>) {
  return items.sort((a, b) => {
    const dateA = "timestamp" in a ? a.timestamp : a.createdAt.getTime();
    const dateB = "timestamp" in b ? b.timestamp : b.createdAt.getTime();
    return dateA - dateB;
  });
}
