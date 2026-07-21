"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";
import { MdDashboardCustomize , MdPendingActions, FaRegUserCircle, RiPassPendingFill, GrDocumentVerified, FaUserCheck,
     VscLayersActive, MdOutlineSyncProblem, IoDocumentsSharp, MdNotifications, MdOutlineChat, MdReviews,
      GrProjects, TbReport, GoReport, GrAnalytics, MdOutlinePolicy } from "./ui/icons";

export function LandownersideBar() {
    const [active, setActive] = useState("");
    return(
        <div className = "bg-gray-100">
            <div className = "max-w-7xl mx-auto flex rounded-lg justify-between bg-white">
                <SideMenu>

                    <SideMenuItem
                    icon={<FaRegUserCircle />}
                    item ="Profile"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdDashboardCustomize />}
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<MdPendingActions/>}
                    item ="Pending Land Verifications"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<RiPassPendingFill />}
                    item ="Pending Worker Verifications"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<GrDocumentVerified />}
                    item ="Verified Landowners"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<FaUserCheck />}
                    item ="Verified Workers"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                     icon={<VscLayersActive />}
                    item ="Active Rentals"
                    active={active}
                    setActive={setActive}/>
                    
                    <SideMenuItem
                    icon={<MdOutlineSyncProblem />}
                    item ="complaints & Disputes"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<GrProjects/>}
                    item ="Projects"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp  />}
                    item ="Lease Documents"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<MdNotifications />}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    icon={<TbReport  />}
                    item ="Project Reports"
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

                    <SideMenuItem
                    icon={<GrAnalytics />}
                    item ="Analytics"
                    active={active}
                    setActive={setActive}/>
                
                <SideMenuItem
                icon={<MdOutlinePolicy />}
                    item ="Govenment Schemes"
                    active={active}
                    setActive={setActive}/>

                </SideMenu>

            </div>
        </div>
    )
}

export default LandownersideBar