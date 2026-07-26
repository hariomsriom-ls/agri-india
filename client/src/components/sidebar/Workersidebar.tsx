"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";
import { MdDashboardCustomize , GrProjects, FaRegUserCircle, MdOutlineMessage, FcViewDetails, 
    MdOutlineRequestPage, RiExchangeBoxFill, ImHistory, IoDocumentsSharp, MdNotifications, 
    MdOutlineChat, MdReviews, GoReport } from "./ui/icons";

export function WorkersideBar() {
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
                     icon={<MdOutlineRequestPage/>}
                    item ="Leave request"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<GrProjects/>}
                    item ="Projects"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<ImHistory/>}
                    item ="Salary History"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<MdOutlineMessage/>}
                    item ="Messages"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<FcViewDetails />}
                    item ="Authority Details"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp/>}
                    item ="Documents"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<RiExchangeBoxFill/>}
                    item ="Region Change"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdNotifications/>}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdOutlineChat/>}
                    item ="Chat"
                    active={active}
                    setActive={setActive}/>
                
                <SideMenuItem
                icon={<MdReviews />}
                    item ="Reviews"
                    active={active}
                    setActive={setActive}/>

                <SideMenuItem
                icon={<GoReport/>}
                    item ="Register Complaint"
                    active={active}
                    setActive={setActive}/>
                </SideMenu>

            </div>
    )
}

export default WorkersideBar