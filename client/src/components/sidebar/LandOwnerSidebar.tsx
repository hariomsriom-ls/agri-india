"use client";
import { useState, useEffect } from "react";
import {SideMenu, SideMenuItem} from "../ui/side-bar";
import { MdDashboardCustomize , LuLandPlot, FaRegUserCircle, MdOutlineAdd, GiPayMoney, MdOutlineRequestPage,
     VscLayersActive, ImHistory, IoDocumentsSharp, MdNotifications, MdOutlineChat, MdReviews,
      GoReport } from "../ui/icons";
import Card from "../ui/customizable-cards";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserPayments } from "@/features/landowner/paymenthistory";


export function LandOwnerSideBar() {
    const dispatch = useAppDispatch();
     const role = useAppSelector((state) => state.auth.role);
    

    const [active, setActive] = useState("");
    return(
            <div className = "max-w-xl mx-auto flex-col  w-full h-full overflow-hidden justify-items-start items-center bg-[#065035]">
                <div className="flex h-1/8 w-full justify-center items-center pt-10">
              <img className="w-20 h-20 text-white bg-none"
              src="/images/finallogo.png"/> 
              <h1 className="text-4xl font-bold text-white font-Rolle ">AGRI INDIA</h1>
            </div>
            <Card className="w-full h-3/4 rounded-lg ">
                <SideMenu>

                      <SideMenuItem
                    icon={<FaRegUserCircle/>}
                    item ="Profile"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerProfile"/>
            
                    <SideMenuItem
                    icon={<MdDashboardCustomize />}
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerDashboard"/>

                     <SideMenuItem
                     icon={<LuLandPlot />}
                    item ="My Lands"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerMyLands"/>

                     <SideMenuItem
                     icon={<GiPayMoney />}
                    item ="Earnings"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerEarnings"/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp />}
                    item ="Lease Documents"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerLeaseDocuments"/>

                    <SideMenuItem
                    icon={<MdNotifications />}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerNotifications"/>

                    <SideMenuItem
                    icon={<MdOutlineChat />}
                    item ="Chat"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerChat"/>
                
                <SideMenuItem
                icon={<MdReviews />}
                    item ="Reviews"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerReviews"/>

                <SideMenuItem
                icon={<GoReport />}
                    item ="Register Complaint"
                    active={active}
                    setActive={setActive}
                    href="/Landowner/LandownerRegisterComplaint"/>
                </SideMenu>
                </Card>

            </div>
    )
}

export default LandOwnerSideBar