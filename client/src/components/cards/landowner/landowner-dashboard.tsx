"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"

export function LandownerTotalPlotcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Total Plots</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">s1</h1>
            </div>
        </Card>
    )}

    export function LandownerActivePlotcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Active Used Plots</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">percentage of plots used</h1>
            </div>
        </Card>
    )}

    export function LandownerTotalIncomecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Total Income</h1>
            <h1 className="text-black font-semibold">Number</h1>
            <h1 className="pl-2 border-l-gray-500">Amount</h1>
            </div>
        </Card>
    )}

    export function LandownerStatscard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Stats Card %</h1>
            <h1 className="text-black font-semibold">Graph</h1>
            <h1 className="pl-2 border-l-gray-500">Description</h1>
            </div>
        </Card>
    )}

    export function LandownerActiveServicecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Active Services</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">details of services</h1>
            </div>
        </Card>
    )}

    export function LandownerPaymentDuecard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Duue Payments</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">due date</h1>
            </div>
        </Card>
    )}

    export function LandownerPendingPaymentcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1">
            <div className="flex w-2/3 flex-col">
            <h1 className="text-gray-600">Pending Payment</h1>
            <h1 className="text-black font-semibold">Numbers</h1>
            <h1 className="pl-2 border-l-gray-500">Expected Date</h1>
            </div>
        </Card>
    )}