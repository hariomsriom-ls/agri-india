"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"

export function Workertaskassignedcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Task Assigned</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">Average task per user</h1>
            </div>
        </Card>
    )}

    export function Workertaskcompletioncard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Task Completion</h1>
            <h1 className="text-black font-semibold">percentage</h1>
            <h1 className="pl-2 border-l-gray-500">Average task per user</h1>
            </div>
        </Card>
    )}

    export function Workerattendancecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Attendance</h1>
            <h1 className="text-black font-semibold">percentage</h1>
            <h1 className="pl-2 border-l-gray-500">score</h1>
            </div>
        </Card>
    )}

    export function Workerleavescard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Leaves %</h1>
            <h1 className="text-black font-semibold">percentage</h1>
            <h1 className="pl-2 border-l-gray-500">score</h1>
            </div>
        </Card>
    )}
