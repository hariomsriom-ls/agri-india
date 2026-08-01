"use client";
import React from "react";
import DataTable from "../../ui/customizable-table"
import {authorityperformanceData} from "@/data/AuthorityTab-data"
import {useState} from "react"


export function AuthorityPerformanceTable() {
    const [active, setActive] = useState("");
    const columns = [
  { key: "name", label: "Worker" },
  { key: "project", label: "Project" },
  { key: "tasks", label: "Task" },
  { key: "completedTask", label: "Completed" },
  { key: "attendance", label: "Attendance" },
  { key: "action", label: "Action" },
];
    return(
        <DataTable columns={columns}
        data={authorityperformanceData}
         headerClassName="bg-gray-100 text-black text-base rounded-xl"/>
    )}


export function AuthorityPendingTable() {
    const [active, setActive] = useState("");
    const columns = [
  { key: "requestId", label: "Request Id" },
  { key: "name", label: "Applicant Name" },
  { key: "district", label: "District" },
  { key: "submittedOn", label: "Submitted On" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];
    return(
        <DataTable columns={columns}
        data={authorityperformanceData}
         headerClassName="bg-gray-100 text-black text-base rounded-xl"/>
    )}

