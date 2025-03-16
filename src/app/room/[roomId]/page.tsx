import Room from "./room";
import { Timeline } from "@/components/timeline";
import { Properties } from "@/components/properties";
import { ActionUser } from "@/components/actions";
import { getUser } from "@/app/api/database";
import { Timestamp } from "@liveblocks/react-ui/primitives";

export default function Page() {
  return (
    <Room>
      <main className="">
        <div className="max-w-5xl mx-auto">
          <div>
            <div className="pt-10 mb-2 mx-8 pb-6 flex flex-col gap-1">
              <div className="text-[34px] font-normal">Page title</div>
              <div className="text-neutral-500 text-sm flex items-center gap-1">
                <ActionUser user={getUser("emil.joyce@example.com")} /> created
                this
                <Timestamp
                  className=""
                  date={new Date().setHours(new Date().getHours() - 7)}
                />
              </div>
            </div>
          </div>
          <div className="mx-8 flex gap-6">
            <div className="grow">
              <Timeline />
            </div>
            <div className="w-[300px]">
              <Properties />
            </div>
          </div>
        </div>
      </main>
    </Room>
  );
}
