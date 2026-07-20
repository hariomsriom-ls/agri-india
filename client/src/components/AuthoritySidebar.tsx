"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";

export function LandownersideBar() {
    const [active, setActive] = useState("");
    return(
        <div className = "bg-gray-100">
            <div className = "max-w-7xl mx-auto flex rounded-lg justify-between bg-white">
                <SideMenu>

                    <SideMenuItem
                    item ="Profile"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Dashboard"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Pending Land Verifications"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Pending Worker Verifications"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Verified Landowners"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Verified Workers"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Active Rentals"
                    active={active}
                    setActive={setActive}/>
                    
                    <SideMenuItem
                    item ="complaints & Disputes"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Projects"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Lease Documents"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Notifications"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Project Reports"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Chat"
                    active={active}
                    setActive={setActive}/>
                
                <SideMenuItem
                    item ="Reviews"
                    active={active}
                    setActive={setActive}/>

                <SideMenuItem
                    item ="Register Complaint"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Analytics"
                    active={active}
                    setActive={setActive}/>
                
                <SideMenuItem
                    item ="Govenment Schemes"
                    active={active}
                    setActive={setActive}/>

                </SideMenu>

            </div>
        </div>
    )
}

export default LandownersideBar