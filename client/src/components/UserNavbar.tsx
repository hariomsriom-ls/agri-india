"use client";
import { useState } from "react";
import ProfileCard from "./ui/profile-card";
import { IoHomeOutline } from "./ui/icons"
import  SearchBar from "./ui/searchbar"

export function UserNavbar() {
    const [active, setActive] = useState("");
    return(  
       <nav className = "bg-white max-w-7xl mx-auto ">
             <div className = " flex h-full gap-x-2 pl-4 pb-2 rounded-lg bg-white">
                <div className="flex flex-2 items-end">
                <div className="w-14 h-14 rounded-2xl border border-green-200   bg-gradient-to-br from-white to-gray-200
                shadow-md flex items-center justify-center">
                    <IoHomeOutline className="text-green-700 w-7 h-7" />
                </div>
               <div className="flex h-14 items-center pl-4 justify-center">
                <h1 className=" ">WELCOME BACK USERNAME</h1>
                </div>
                </div>
                <div className="flex items-start pt-2 justify-end">
                    <SearchBar />
                </div>
                
                 <div className ="flex-1 flex justify-center items-start gap-8">
                    <ProfileCard   name="Roslyn Jackson"
                                image="/images/profile.jpg"
                                id="123"/>
                 </div>
                 </div>
         </nav>       
      )
}

export default UserNavbar