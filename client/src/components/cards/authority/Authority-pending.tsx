"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"

export function AuthorityPendingWorkerTotalCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Total Request</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">All Time</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingWorkerRequestCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Pending Request</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">Need Review</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingWorkerApprovedCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Approved Today</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">Today</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingWorkerRejectedCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Rejected Today</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">Today</h1>
            </div>
        </Card>
    )}

// pending landowner//

    export function AuthorityPendingLandownerTotalCard() {
    const [active, setActive] = useState("");
    return(
       <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Total Request</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">All Time</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingLandownerRequestCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Pending Request</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">Need Review</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingLandownerApprovedCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Approved Today</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">Today</h1>
            </div>
        </Card>
    )}

    export function AuthorityPendingLandownerRejectedCard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 bg-white">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Rejected Today</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">Today</h1>
            </div>
        </Card>
    )}