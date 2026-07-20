"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";

export function LandownersideBar() {
    const [active, setActive] = useState("");
    return(
        <nav className = "bg-gray-100">
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
                    item ="Add New Land"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="My Lands"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Earnings"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Rental Requests"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Active Rentals"
                    active={active}
                    setActive={setActive}/>
                    
                    <SideMenuItem
                    item ="Rental History"
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
                </SideMenu>

            </div>
        </nav>
    )
}

export default LandownersideBar