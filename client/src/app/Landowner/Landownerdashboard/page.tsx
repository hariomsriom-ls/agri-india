"use client";
import React from "react";
import { LandownerActivePlotcard, LandownerActiveServicecard, LandownerPaymentDuecard, LandownerStatscard,
  LandownerTotalIncomecard, LandownerTotalPlotcard}
 from "@/components/cards/landowner/landowner-dashboard";


export default function LandownerDashboard() {
  return (
    <>
   <div className="h-full overscroll-none">
      <div className="flex flex-1 gap-4 pt-4 pl-3">
              <LandownerTotalPlotcard />
              < LandownerActivePlotcard />
              <LandownerTotalIncomecard />
              <LandownerActiveServicecard />
           </div>
        </div>
    </>
  );
}