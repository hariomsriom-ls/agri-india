"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "../ui/side-bar";
import { MdDashboardCustomize , MdPendingActions, FaRegUserCircle, RiPassPendingFill, GrDocumentVerified, FaUserCheck,
     VscLayersActive, MdOutlineSyncProblem, IoDocumentsSharp, MdNotifications, MdOutlineChat, MdReviews,
      GrProjects, TbReport, GoReport, GrAnalytics, MdOutlinePolicy } from "../ui/icons";

export function AuthoritySideBar() {
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
                    icon={<FaRegUserCircle />}
                    item ="Profile"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityProfile"
                    />

                    <SideMenuItem
                    icon={<MdDashboardCustomize />}
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityDashboard"/>

                     <SideMenuItem
                     icon={<GrDocumentVerified />}
                    item ="Verified Landowners"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityVerifiedLandowners"/>

                     <SideMenuItem
                     icon={<FaUserCheck />}
                    item ="Verified Workers"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityVerifiedWorkers"/>

                     <SideMenuItem
                     icon={<VscLayersActive />}
                    item ="Active Rentals"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityActiveRentals"/>
                    
                    <SideMenuItem
                    icon={<MdOutlineSyncProblem />}
                    item ="complaints & Disputes"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityComplaints"/>

                    <SideMenuItem
                    icon={<GrProjects/>}
                    item ="Projects"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityProjects"/>

                    <SideMenuItem
                    icon={<IoDocumentsSharp  />}
                    item ="Lease Documents"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityLeaseDocuments"/>

                    <SideMenuItem
                    icon={<MdNotifications />}
                    item ="Notifications"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityNotifications"/>

                    <SideMenuItem
                    icon={<MdOutlineChat />}
                    item ="Chat"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityChat"/>
                
                <SideMenuItem
                icon={<MdOutlinePolicy />}
                    item ="Govenment Schemes"
                    active={active}
                    setActive={setActive}
                    href="/Authority/authorityGovernmentSchemes"/>

                </SideMenu>

            </div>
    )
}

export default AuthoritySideBar