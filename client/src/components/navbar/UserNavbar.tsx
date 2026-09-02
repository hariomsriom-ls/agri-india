"use client";
import { useEffect, useState } from "react";
import ProfileCard from "../ui/profile-card";
import { IoHomeOutline } from "../ui/icons"
import  { SearchBar } from "../ui/searchbar"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUser } from "@/features/user"; 

export function UserNavbar() {
    const [active, setActive] = useState("");
   const dispatch = useAppDispatch();
   const role = useAppSelector((state) => state.auth.role);
   const { data: user, loading, error,} = useAppSelector((state) => state.user);
   console.log("User data in UserNavbar:", user);
   if(!role) {return <p>User role not found in user navbar page line no 15</p>} 
   
    useEffect(() => {if (!user) {dispatch(fetchUser(role));}
  }, [dispatch, user]);
  if (loading) { return <p>Loading user...</p>; }
  if (error) { return <p className="text-red-600">{error}</p>; }
  if (!user) { return <p>User not found user navbar line 21</p>;}
   
  
    return(  
       <nav className = "bg-white max-w-7xl h-1/8 mx-auto ">
             <div className = " flex h-full gap-x-2 pl-4 pb-2 rounded-lg bg-white">
                <div className="flex flex-2 items-end">
                <div className="w-14 h-14 rounded-2xl border border-green-200   bg-gradient-to-br from-white to-gray-200 shadow-md flex items-center justify-center">
                    <IoHomeOutline className="text-green-700 w-7 h-7" />
                </div>
               <div className="flex h-14 items-center pl-4 justify-center">
                <h1 className=" ">WELCOME BACK {user?.userName}</h1>
                </div>
                </div>
                <div className="flex items-start pt-2 justify-end">
                <SearchBar name="navbarsearch"
                placeholder="Search..."
                 />
                </div>
                
                 <div className ="flex-1 flex justify-center items-start gap-8">
                    <ProfileCard   name={user?.fullName || user?.username || "User"}
                                image={user?.profileImage || "images/profile.png"}
                                id="123"/>
                 </div>
                 </div>
         </nav>       
      )
}

export default UserNavbar