"use client";
import { AuthorityPendingWorkerTotalCard, AuthorityPendingWorkerRequestCard, AuthorityPendingWorkerApprovedCard
 , AuthorityPendingWorkerRejectedCard
 } from "@/components/cards/authority/Authority-pending";
 import {AuthorityPendingTab} from "@/components/Tabs/Authority/Authoritytab"

export default function AuthorityPendingWorkerVerification() {
  return (
    <>
   <div className="h-full">
     <div className="flex flex-1 gap-4 pt-4 pl-3">
             <AuthorityPendingWorkerTotalCard />
             <AuthorityPendingWorkerRequestCard/>
             <AuthorityPendingWorkerApprovedCard />
             <AuthorityPendingWorkerRejectedCard />
      </div>
      <div className="w-full pt-4 pl-3 flex">
                <AuthorityPendingTab/>
      </div>

   </div>
    </>
  );
}