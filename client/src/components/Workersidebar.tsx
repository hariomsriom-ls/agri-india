"use client";
import { useState } from "react";
import {SideMenu, SideMenuItem} from "./ui/side-bar";

export function WorkersideBar() {
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
                    item ="Leave request"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Projects"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Salary History"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Messages"
                    active={active}
                    setActive={setActive}/>

                     <SideMenuItem
                    item ="Authority Details"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Documents"
                    active={active}
                    setActive={setActive}/>

                    <SideMenuItem
                    item ="Region Change"
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

export default WorkersideBar