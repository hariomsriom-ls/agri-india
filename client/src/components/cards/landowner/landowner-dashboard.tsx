"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"

export function LandownerTotalPlotcard() {
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

    export function LandownerActivePlotcard() {
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

    export function LandownerTotalIncomecard() {
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

    export function LandownerStatscard() {
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

    export function LandownerActiveServicecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Performance</h1>
            <h1 className="text-black font-semibold">percentage</h1>
            <h1 className="pl-2 border-l-gray-500">score</h1>
            </div>
        </Card>
    )}

    export function LandownerPaymentDuecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Expenses</h1>
            <h1 className="text-black font-semibold">percentage</h1>
            <h1 className="pl-2 border-l-gray-500">score</h1>
            </div>
        </Card>
    )}