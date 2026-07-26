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
