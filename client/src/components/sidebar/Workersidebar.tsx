"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "../ui/side-bar";
import { MdDashboardCustomize , GrProjects, FaRegUserCircle, MdOutlineMessage, FcViewDetails, 
    MdOutlineRequestPage, RiExchangeBoxFill, ImHistory, IoDocumentsSharp, MdNotifications, 
    MdOutlineChat, MdReviews, GoReport } from "../ui/icons";

export function WorkersideBar() {
    const [active, setActive] = useState("");
    return(
       <div className = "max-w-xl mx-auto flex-col  w-full h-full overflow-hidden justify-items-start items-center bg-[#065035]">
                <div className="flex h-1/9 w-full justify-between items-center">
              <img className="w-20 h-20 text-white"
              src="images/logo.png"/> 
              <h1 className="text-4xl font-bold text-white font-Rolle ">AGRI INDIA</h1>
            </div>
                <SideMenu>

                    <SideMenuItem
                    icon={<FaRegUserCircle/>}
                    item ="Profile"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerProfile"/>

                    <SideMenuItem
                    icon={<MdDashboardCustomize />}
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerDashboard"/>

                     <SideMenuItem
                     icon={<MdOutlineRequestPage/>}
                    item ="Request"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerRequest"/>

                     <SideMenuItem
                     icon={<GrProjects/>}
                    item ="Projects"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerProjects"/>

                     <SideMenuItem
                     icon={<ImHistory/>}
                    item ="Salary History"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerSalaryHistory"/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp/>}
                    item ="Documents"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerDocuments"/>

                    <SideMenuItem
                    icon={<MdOutlineChat/>}
                    item ="Chat"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerChat"/>
                
                <SideMenuItem
                icon={<MdReviews />}
                    item ="Reviews"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerReviews"/>

                <SideMenuItem
                icon={<GoReport/>}
                    item ="Register Complaint"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerRegisterComplaint"/>
                </SideMenu>

            </div>
    )
}

export default WorkersideBar