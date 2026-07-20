"use client";

import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface SideMenuProps {
  children: ReactNode;
}
export function SideMenu({ children }: SideMenuProps){
   return(
    <div className="flex-8 flex gap-10 bg-olive-900" >
        {children}
        </div>
   );
}
interface SideMenuItemProps {
  item: string;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}
export function SideMenuItem({ item, active, setActive } : SideMenuItemProps){
    return(<div className="flex w-full h-full justify-center items-evenly ">
        <button className =" flex py-1 px-4 items-center justify-center  text-rose-900 rounded-lg 
        hover:bg-olive-300 hover:text-rose-300">
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