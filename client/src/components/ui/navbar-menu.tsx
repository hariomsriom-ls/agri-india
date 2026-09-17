"use client";

import React from "react";
import { ReactNode } from "react";

interface MenuProps {
  children: ReactNode;
}
export function Menu({ children }: MenuProps){
   return(
    <div className="order-3 mt-2 flex w-full items-center justify-between gap-1 border-t border-[#e1ebe6] sm:justify-center sm:gap-5 lg:order-2 lg:mt-0 lg:w-auto lg:flex-1 lg:gap-4 lg:border-0 xl:gap-6" >
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
    return(<div className="flex shrink-0 items-center justify-center self-stretch">
        <button type="button" onClick={() => setActive(item)} aria-pressed={active === item}
        className={`relative flex items-center justify-center rounded-sm px-1 py-4 text-[11px] font-medium whitespace-nowrap transition-colors hover:text-[#23773d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-2 sm:text-xs lg:py-7 ${active === item ? "text-[#23773d]" : "text-[#34413a]"}`}>
            {item}
            {active === item && (
                <span aria-hidden="true"
                className="absolute inset-x-1 bottom-1 h-0.5 rounded-full bg-[#4b8b5e] lg:bottom-4"
                />

            )}
        </button>
        </div>
    )
}
