"use client";

import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface MenuProps {
  children: ReactNode;
}
export function Menu({ children }: MenuProps){
   return(
    <div className="flex-8 flex gap-10 bg-gray-120" >
        {children}
        </div>
   );
}
interface MenuItemProps {
  item: string;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}
export function MenuItem({ item, active, setActive } : MenuItemProps){
    return(<div className="flex w-full h-full justify-evenly items-center ">
        <button className =" flex py-1 px-4 items-center justify-center  text-black rounded-lg 
        hover:bg-gray-300 hover:text-white">
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