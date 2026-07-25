"use client";
import { Workertaskassignedcard, Workertaskcompletioncard, Workerattendancecard, Workerleavescard

} from "@/components/cards/worker/worker-dashboard";

export default function WorkerDashboard() {
  return (
    <>
   <div className="h-full overscroll-none">
    <div className="flex flex-1 gap-4 pt-4 pl-3">
     <Workertaskassignedcard />
     <Workertaskcompletioncard />
     <Workerattendancecard />
     <Workerleavescard />
    </div>
        </div>
    </>
  );
}