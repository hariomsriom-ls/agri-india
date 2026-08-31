"use client";
import React from "react";
import { createPortal } from "react-dom";
import Card from "../../ui/customizable-cards";
import{useState} from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/ui/Input";
import {FaRegUserCircle, VscOrganization, GrUserWorker } from "@/components/ui/icons"
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";
import { useLandownerRegistration } from "@/contexts/registration/landownerProvider";
import {ReviewField} from "@/components/ui/ReviewField";
import Registration from "@/app/registration/layout";

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

interface RoleSelectionProps {
    selectedRole: string;
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}

const RoleselectionCard = ({ selectedRole, setSelectedRole}: RoleSelectionProps)=>{
   
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
        
    )
    }


// review card
interface ReviewProps {
    selectedRole: string;
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
    reduceStep: () => void;
    onSubmit: () => void;
}

const ReviewCard = ({selectedRole, setSelectedRole, onClose, reduceStep, onSubmit}:ReviewProps)=>{
const {WorkerformData} = useworkerRegistration();
const {AuthorityformData} = useAuthorityRegistration();
const {LandownerformData} = useLandownerRegistration();

const renderField = ()=>{
    if (selectedRole==="authority"){
        return(
        <ReviewField
           label="AuthorityID"
            value={AuthorityformData.authorityId}
            /> )
    }
    else if(selectedRole === "worker"){
        return(
       <ReviewField
            label="Date of Birth"
            value={WorkerformData.DOB}
         /> 
        )
    }
    return null;
}

const fullName = selectedRole === "landowner" ? LandownerformData.fullName : (selectedRole === "authority" ? AuthorityformData.fullName : WorkerformData.fullName);
const email = selectedRole === "landowner" ? LandownerformData.email : (selectedRole === "authority" ? AuthorityformData.email : WorkerformData.email);
const mobile = selectedRole === "landowner" ? LandownerformData.mobileNumber : (selectedRole === "authority" ? AuthorityformData.mobilenumber : WorkerformData.mobileNumber);
const username = selectedRole === "landowner" ? LandownerformData.userName : (selectedRole === "authority" ? AuthorityformData.username : WorkerformData.userName);
const password = selectedRole === "landowner" ? LandownerformData.password : (selectedRole === "authority" ? AuthorityformData.password : WorkerformData.password);

return createPortal(
    <Card className="bg-gray-200 h-95/100 w-6/10 fixed left-1/5 top-5 z-[9999] flex flex-col gap-5 overflow-y-auto">
        <div className="flex justify-between">
             <h1 className=" pl-3 text-3xl flex w-99/100 justify-center capitalize">{selectedRole} Review Form</h1>
         <button className="px-3 py-3 pt-1 pb-1 rounded-sm hover:bg-red-700 "
         onClick={()=>{onClose();
                    reduceStep();
                }}>
            ✕
          </button>
        </div>      
        <Card className="bg-white">
            <h2 className="text-xl ">{selectedRole} Personal Information</h2>
            <div>
                 <div className="grid grid-cols-2 gap-5 mt-8">
                               
                     <ReviewField
                        label="Full Name"
                        value={WorkerformData.fullName}
                    />
                       <ReviewField
                        label="Email"
                        value={WorkerformData.email}
                    />                     
                      <ReviewField
                        label="Contact Number"
                        value={WorkerformData.mobileNumber}
                    /> 
                        {renderField()}
                     <ReviewField
                        label="Username"
                        value={WorkerformData.userName}
                    />   
                      <ReviewField
                        label="Password"
                        value={WorkerformData.password}
                    />       
                  </div>
            </div>
        </Card>   
        {selectedRole !== "landowner" && (
            <>
            <Card className="bg-white">
                <h2 className="text-xl ">{selectedRole} Address Details</h2>
                <div className="flex flex-col">
                     <div className="grid grid-cols-2 gap-5 mt-8">

                        <ReviewField
                        label="houseno/streetno/name"
                        value={WorkerformData.houseno || AuthorityformData.houseno}
                        /> 
                        <ReviewField
                        label="Landmark"
                        value={WorkerformData.landmark || AuthorityformData.landmark}
                        />
                        <ReviewField
                        label="Country"
                        value={WorkerformData.country || AuthorityformData.country}
                        /> 
                        <ReviewField
                        label="State"
                        value={WorkerformData.state || AuthorityformData.state}
                        />
                        <ReviewField
                        label="District"
                        value={WorkerformData.district || AuthorityformData.district}
                        />
                        <ReviewField
                        label="City"
                        value={WorkerformData.city || AuthorityformData.city}
                        /> 
                        <ReviewField
                        label="Pincode"
                        value={WorkerformData.pincode || AuthorityformData.pincode}
                        />
                        <ReviewField
                        label="Working Zone"
                        value={WorkerformData.workingZone || AuthorityformData.workingZone}
                        />
                                    
                     </div>
                </div>
            </Card>     
            <Card className="bg-white">
                <h2 className="text-xl ">{selectedRole} Bank Details</h2>
                 <div className="flex flex-col">
                     <div className="grid grid-cols-2 gap-5 mt-8">
                        <ReviewField
                         label="Bank Account/no"
                        value={WorkerformData.bankaccount || AuthorityformData.bankaccount}
                        /> 
                        <ReviewField
                        label="IFSC Code"
                        value={WorkerformData.IFSCcode || AuthorityformData.IFSCcode}
                        />
                     </div>
                </div>
            </Card>
            </>
        )}
         <div className="flex justify-between">
            <button  
                onClick={()=>{onClose();
                    reduceStep();
                }}

                className="px-8 py-3 rounded-xl bg-red-500 hover:bg-red-700 text-white">
                <span className="pr-4">Cancel</span>
            </button>
            
            <button  
                onClick={() => { onSubmit();}}
                className="px-8 py-3 rounded-xl bg-purple-500 hover:bg-violet-700 text-white clicked?bg-violet-700 : bg-blue-500">
                <span className="pr-4">Submit</span>
            </button>
        </div>   
    </Card>,
    document.body
);
};




export {
    ReviewCard, RoleselectionCard,
}
