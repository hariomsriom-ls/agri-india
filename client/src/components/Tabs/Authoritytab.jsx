"use client";

import React from "react";
import{useState} from "react"
import Card from "../ui/customizable-cards";

export function AuthorityteamTab() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex aspect-3/2 w-2/3">
            <div className="flex flex-col w-2/3">
            <h1 className="text-gray-600">Task Assigned</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">Average task per user</h1>
            </div>
        </Card>
    )}