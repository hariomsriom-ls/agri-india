"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";
import { MdDashboardCustomize , LuLandPlot, FaRegUserCircle, MdOutlineAdd, GiPayMoney, MdOutlineRequestPage,
     VscLayersActive, ImHistory, IoDocumentsSharp, MdNotifications, MdOutlineChat, MdReviews,
      GoReport } from "./ui/icons";



export function LandOwnerSideBar() {
    const [active, setActive] = useState("");
    return(
            <div className = "max-w-xl mx-auto flex-col  w-full h-full overflow-hidden justify-items-start items-center bg-[#065035]">
                <SideMenu>

                      <SideMenuItem
                    icon={<FaRegUserCircle/>}
                    item ="Profile"
                    active={active}
                    setActive={setActive}/>
            
                    <SideMenuItem
                    icon={<MdDashboardCustomize />}
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<MdOutlineAdd />}
                    item ="Add New Land"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<LuLandPlot />}
                    item ="My Lands"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<GiPayMoney />}
                    item ="Earnings"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<MdOutlineRequestPage />}
                    item ="Rental Requests"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<VscLayersActive/>}
                    item ="Active Rentals"
                    active={active}
                    setActive={setActive}/>
                    
                    <SideMenuItem
                    icon={<ImHistory />}
                    item ="Rental History"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp />}
                    item ="Lease Documents"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdNotifications />}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdOutlineChat />}
                    item ="Chat"
                    active={active}
                    setActive={setActive}/>
                
                <SideMenuItem
                icon={<MdReviews />}
                    item ="Reviews"
                    active={active}
                    setActive={setActive}/>

                <SideMenuItem
                icon={<GoReport />}
                    item ="Register Complaint"
                    active={active}
                    setActive={setActive}/>
                </SideMenu>

            </div>
    )
}

export default LandOwnerSideBar