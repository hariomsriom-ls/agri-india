"use client";
import { useState } from "react";
import {Menu, MenuItem} from "./ui/navbar-menu";

export function Navbar() {
    const [active, setActive] = useState("");
    return(
        <nav className = "bg-gray-100">
            <div className = "max-w-7xl mx-auto flex rounded-lg justify-between bg-white">
                <div className="flex-1 flex items-center justify-center bg-gray-150 hover:bg-black hover:text-white rounded-lg">
                    Myapp</div>
                <Menu>
                    <MenuItem
                    item ="Home"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="About Us"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="services"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="Contact"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="apply"
                    active={active}
                    setActive={setActive}/>
                </Menu>

                <div className ="flex-2 flex justify-center py-2 gap-8">
                    <button className=" rounded-lg px-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        login
                    </button>
    
                    <button className=" rounded-lg px-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        sign up
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
