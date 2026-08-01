"use client";
import { AuthorityPendingLandownerTotalCard, AuthorityPendingLandownerRequestCard, AuthorityPendingLandownerApprovedCard
  , AuthorityPendingLandownerRejectedCard
 } from "@/components/cards/authority/Authority-pending";
 import {AuthorityPendingTab} from "@/components/Tabs/Authority/Authoritytab"



export default function AuthorityProfile() {
  return (
    <>
   <div className="h-full">
     <div className="flex flex-1 gap-4 pt-4 pl-3">
             <AuthorityPendingLandownerTotalCard/>
             <AuthorityPendingLandownerRequestCard/>
             <AuthorityPendingLandownerApprovedCard/>
             <AuthorityPendingLandownerRejectedCard/>
     </div>
       <div className="w-full pt-4 pl-3 flex">
            <AuthorityPendingTab/>
        </div>
   </div>
    </>
  );
}