"use client";
import { Authoritytaskassignedcard, Authoritytaskcompletioncard, Authorityattendancecard, Authorityleavescard
, AuthorityPerformancecard, AuthorityExpensescard} from "@/components/cards/authority/Authority-dashboard";
import {AuthorityteamTab} from "@/components/Tabs/Authority/Authoritytab"

export default function AuthorityDashboard() {
  return (
    <>
   <div>
     <div className="flex flex-1 gap-4 pt-4 pl-3">
         <Authoritytaskassignedcard />
         <Authoritytaskcompletioncard />
         <Authorityattendancecard />
         <Authorityleavescard />
      </div>
      <div className="w-full pt-4 pl-3 flex">
          <AuthorityteamTab />
          <div className=" pt-3 pl-2 w-1/3">
            <div className="flex h-full w-full gap-4 flex-col">
            <AuthorityPerformancecard />
            <AuthorityExpensescard />
            </div>
          </div>
      </div>
   </div>
    </>
  );
}