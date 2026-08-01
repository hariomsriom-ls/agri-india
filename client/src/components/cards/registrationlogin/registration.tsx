"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"
import {FaRegUserCircle, VscOrganization, GrUserWorker } from "@/components/ui/icons"


const roles = [
    {
        id: "authority",
        title: "Authority",
        icon: VscOrganization,
    },
    {
        id: "landowner",
        title: "Landowner",
        icon: FaRegUserCircle,
    },
    {
        id: "worker",
        title: "Worker",
        icon: GrUserWorker,
    },
];


export function Roleselectioncard() {
    const [selectedRole, setSelectedRole] = useState("");

    return(
        <div className=" flex h-25/30 w-25/30 bg-linear-to-b from-black/30 to-black/50 justify-center items-center rounded-lg">
        <Card className="h-75/100 w-8/10 rounded-3xl shadow-2xl bg-linear-to-b from-black/50 to-black/80 ">
            <div>
                 <div>

                        <p className="text-green-400 text-sm">
                            Step 1 of 3
                        </p>

                        <h2 className="text-white font-semibold">
                            Type of Registration
                        </h2>

                    </div>
                     <div className="flex gap-3">

                        {Array.from({ length: 6 }).map((_, index) => (

                            <div
                                key={index}
                                className={`w-8 h-8 rounded-full border
                                ${index === 0
                                        ? "bg-green-500 border-green-500"
                                        : "border-white/20"
                                    }`}
                            />

                        ))}

                    </div>
            </div>
             <div className="text-center">

                    <h1 className="text-4xl font-bold text-white">

                        Who Are You Representing?

                    </h1>

                    <p className="text-gray-300 mt-4">

                        Select the option that best describes you.

                    </p>

                </div>
                 <div className="grid grid-cols-3 gap-8 mt-12">

                    {roles.map((role) => {

                        const Icon = role.icon;

                        return (
                             <button

                                key={role.id}

                                onClick={() => setSelectedRole(role.id)}

                                className={`rounded-2xl border p-8 transition-all duration-300

                                ${selectedRole === role.id
                                        ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/30"
                                        : "border-white/10 hover:border-green-400"
                                    }`}

                            > 
                            <div className="flex justify-center">
                            <Icon className="text-white h-8 w-8 "/>
                            </div>
                                <h3 className="mt-6 text-white text-xl font-semibold">

                                    {role.title}

                                </h3>

                            </button>
                              );

                    })}
                     </div>
                      <div className="flex justify-end mt-12"> <button
                        className="px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white">
                        <span className="pr-4">Next</span>
                        <span className="text-xl">›</span>
                    </button>
                    </div>
        </Card>
        </div>
    )}