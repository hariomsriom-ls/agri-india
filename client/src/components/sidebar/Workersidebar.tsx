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
                    item ="Leave request"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerLeaveRequest"/>

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
                     icon={<MdOutlineMessage/>}
                    item ="Messages"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerMessages"/>

                     <SideMenuItem
                     icon={<FcViewDetails />}
                    item ="Authority Details"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerAuthoritydetails"/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp/>}
                    item ="Documents"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerDocuments"/>

                    <SideMenuItem
                    icon={<RiExchangeBoxFill/>}
                    item ="Region Change"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerRegionChange"/>

                    <SideMenuItem
                    icon={<MdNotifications/>}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}
                    href="/Worker/WorkerNotifications"/>

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