"use client";

import React from "react";
import{useState} from "react"
import Card from "../../ui/customizable-cards";
import { AuthorityPerformanceTable, AuthorityPendingTable } from "./Authoritytable"
import { SearchBar } from "@/components/ui/searchbar";


export function AuthorityteamTab() {
    const [active, setActive] = useState("");
    return(
       
        <Card className=" bg-white flex flex-col aspect-3/2 w-2/3">
            <div className="flex flex-col h-1/4  border border-2 pt-2 border-white border-b-gray-300 ">
            <h1 className=" text-2xl pl-5">My Team</h1>
            <div className="flex flex-1 gap-6 items-center">
                <button className="text-black hover:text-emerald-600 hover:bg-gray-200 rounded-2xl h-14 px-2">Performance</button>
                <button className="text-black hover:text-emerald-600 hover:bg-gray-200 rounded-2xl h-14 px-2">Goal</button>
                <button className="text-black hover:text-emerald-600 hover:bg-gray-200 rounded-2xl h-14 px-2">Reports</button>
                <button className="text-black hover:text-emerald-600 hover:bg-gray-200 rounded-2xl h-14 px-2">Feedbacks</button>
            </div>
            </div>
            <div className=" p-2 rounded-lg">
                <AuthorityPerformanceTable/>
            </div> 
        </Card>
    )}


export function AuthorityPendingTab() {
    const [active, setActive] = useState("");
    return(
       
        <Card className=" bg-white flex flex-col w-full aspect-3/2">
            <div className="flex flex-col h-1/7  border border-2 pt-2 border-white border-b-gray-300 ">
            <div className="flex items-start pt-2 w-2/3 justify-start">
            <SearchBar name="auPenWork"
                placeholder="Search by name, request id, mobile number"
                />
            </div>
            <div className="flex gap-6 items-center justify-end">
                <button className="text-black hover:text-emerald-600  bg-gray-300 hover:bg-gray-500 rounded-2xl h-14 px-2">Filters</button>
            </div>
            </div>
            <div className=" p-2 rounded-lg">
                <AuthorityPendingTable/>
            </div> 
        </Card>
    )}
