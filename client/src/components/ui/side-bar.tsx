"use client";

import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SideMenuProps {
  children: ReactNode;
}
export function SideMenu({ children }: SideMenuProps){
   return(
    <div className="flex-col scrollbar-thumb-slate-900 scrollbar-track-gray-200 w-full h-full  justify-items-center overflow-y-auto gap-2 rounded-xl" >
        {children}
        </div>
   );
}
interface SideMenuItemProps {
    icon: React.ReactNode;
  item: string;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}
export function SideMenuItem({ icon, item, active, setActive } : SideMenuItemProps){
    return(<div className="flex w-full h-13 justify-start overflow-y-auto overflow-hidden items-evenly rounded-lg">
         <span className="flex items-center justify-end px-3 w-16 h-12 text-3xl text-white">
    {icon}
  </span>
        <button className =" py-1 px-5 flex w-4/5 items-center justify-start text-gray-300 hover:text-white rounded-lg 
        hover:bg-emerald-700">
            {item}
            {active === item && (
                <motion.div  
                layoutId ="underline"
                className ="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-600"
                />

            )}
        </button>
        </div>
    )
}