"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    // Join a multiplayer Liveblocks room
    <RoomProvider
      id={roomId as string}
      initialPresence={{}}
      // Set the initial values for Liveblocks Storage
      initialStorage={{
        assignee: null,
        reviewer: null,
        labels: new LiveList([]),
        actions: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}

function Loading() {
  return (
    <div className="absolute w-screen h-screen flex place-content-center place-items-center">
      <img
        src="https://liveblocks.io/loading.svg"
        alt="Loading"
        className="w-16 h-16 opacity-20"
      />
    </div>
  );
}
