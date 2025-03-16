import { LiveList, LiveObject } from "@liveblocks/client";

export type BaseAction = {
  type: "action";
  userId: string;
  timestamp: number;
};

export type ActionAssign = BaseAction & {
  kind: "assign";
  assigneeId: string | null;
};

export type ActionUnAssign = BaseAction & {
  kind: "unassign";
};

export type ActionReview = BaseAction & {
  kind: "review";
  reviewerId: string | null;
};

export type ActionUnReview = BaseAction & {
  kind: "unreview";
};

export type Action =
  | ActionAssign
  | ActionUnAssign
  | ActionReview
  | ActionUnReview;

declare global {
  interface Liveblocks {
    UserMeta: {
      id: string;
      // info is set in your authentication endpoint
      // src/app/api/liveblocks-auth/route.ts
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    // Set real-time Storage types for each room
    Storage: {
      assignee: string | null;
      reviewer: string | null;
      labels: LiveList<string>;
      actions: LiveList<LiveObject<Action>>;
    };
  }
}
