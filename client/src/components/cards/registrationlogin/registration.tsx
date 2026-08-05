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

interface Props {
    selectedRole: string;
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}


export function Roleselectioncard({
    selectedRole,
    setSelectedRole,
}: Props) {

    return(    
        <div>    
         <div>
             
            <h2 className="text-white font-semibold">
                  Type of Registration
             </h2>
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
                     
        </div>  
        
    )}


