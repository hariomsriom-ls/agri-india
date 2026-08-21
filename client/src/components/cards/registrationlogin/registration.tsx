"use client";
import React from "react";
import { createPortal } from "react-dom";
import Card from "../../ui/customizable-cards";
import{useState} from "react";
import api from "@/utils/services";
import { InputField } from "@/components/ui/Input";
import {FaRegUserCircle, VscOrganization, GrUserWorker } from "@/components/ui/icons"
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";

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
        
    )

    }


interface ReviewProps {
    selectedRole: string;
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
    reduceStep: () => void;
}
const Reviewcard = ({selectedRole, setSelectedRole, onClose, reduceStep}:ReviewProps)=>{
//name: "", email: "", mobile: "", dob: "", username: "", password: "",
const {WorkerformData} = useworkerRegistration();
const {AuthorityformData} = useAuthorityRegistration();
const renderField = ()=>{
    if (selectedRole==="authority"){
        return(
        <InputField
            label="Authority Id"
            labelclassName="text-black"
            name=""
            placeholder=""
            className="text-black"
            value={AuthorityformData.authorityId}
            readOnly
            />)
    }
    else if(selectedRole === "worker"){
        return(
        <InputField
            label="Date of Birth"
            labelclassName="text-black"
            name=""
            placeholder=""
            className="text-black"
            value={WorkerformData.DOB}
            readOnly
            />
        )
    }
}

const handleSubmit = async () => {
  try {
    const response = await api.post( "/pending-registration/pending-worker-request", WorkerformData );
   // console.log(response.data);
  } catch (error) {console.error(error); }
};


return createPortal(
    <Card className="bg-gray-200 h-95/100 w-85/100 fixed left-30 top-5 z-[9999] flex flex-col gap-5 overflow-y-auto">
        <div className="flex justify-between">
             <h1 className=" pl-3 text-3xl flex w-99/100 justify-center">{selectedRole} Review Form</h1>
         <button className="px-3 py-3 pt-1 pb-1 rounded-sm hover:bg-red-700 "
         onClick={()=>{onClose();
                    reduceStep();
                }}>
            ✕
          </button>
        </div>
        <Card className="bg-white">
            <h2 className="text-xl">{selectedRole} Personal Information</h2>
            <div>
                 <div className="grid grid-cols-2 gap-5 mt-8">
                               
                              <InputField
                                 label="Full Name"
                                 labelclassName="text-black"
                                value={WorkerformData.fullName || AuthorityformData.fullName}
                                 readOnly
                                name=""
                                 placeholder=""
                                 className="text-black"
                                  />
                                            
                             <InputField
                                 label="Email"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.email || AuthorityformData.email}
                                readOnly
                                  />

                                  <InputField
                                 label="Contact Number"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.mobileNumber || AuthorityformData.mobilenumber}
                                readOnly
                                  />

                                  {renderField()}
                                            
                             
                            <InputField
                                 label="Username"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.userName || AuthorityformData.username}
                                readOnly
                                  />
                            
                              <InputField
                                 label="Password"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.password || AuthorityformData.password}
                                readOnly
                                  />
                            </div>
            </div>
        </Card>
        <Card className="bg-white">
            <h2 className="text-xl" >{selectedRole} Address Details</h2>
            <div className="flex flex-col">
                 <div className="grid grid-cols-2 gap-5 mt-8">
                               
                              <InputField
                                 label="houseno/streetno/name"
                                 labelclassName="text-black"
                                value={WorkerformData.houseno || AuthorityformData.houseno}
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                 readOnly />
                                            
                             <InputField
                                 label="Landmark"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.landmark || AuthorityformData.landmark}
                                readOnly
                                  />

                                  <InputField
                                 label="Country"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.country || AuthorityformData.country}
                                readOnly
                                  />
                                            
                             <InputField
                                 label="State"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.state || AuthorityformData.state}
                                readOnly
                                  />
                
                            <InputField
                                 label="District"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.district || AuthorityformData.district}
                                readOnly
                                  />
                            
                              <InputField
                                 label="City"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={ WorkerformData.city  || AuthorityformData.city}
                                readOnly
                                  />

                                <InputField
                                 label="Pincode"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={ WorkerformData.pincode || AuthorityformData.pincode}
                                readOnly
                                  />

                                <InputField
                                 label="Working Zone"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                 readOnly
                                value={ WorkerformData.workingZone || AuthorityformData.workingZone}
                                  />
                                
                            </div>
            </div>
        </Card>
        <Card className="bg-white">
            <h2 className="text-xl">{selectedRole} Bank Details</h2>
             <div className="flex flex-col">
                 <div className="grid grid-cols-2 gap-5 mt-8">
                     <InputField
                                 label="Bank Account/no"
                                 labelclassName="text-black"
                                value={WorkerformData.bankaccount || AuthorityformData.bankaccount}
                                readOnly
                                 name=""
                                 placeholder=""
                                 className="text-black" />
                                            
                             <InputField
                                 label="IFSC Code"
                                 labelclassName="text-black"
                                 name=""
                                 placeholder=""
                                 className="text-black"
                                value={WorkerformData.IFSCcode || AuthorityformData.IFSCcode}
                                readOnly
                                  />
                 </div>
            </div>
        </Card>
         <div className="flex justify-between">
            <button  
                onClick={()=>{onClose();
                    reduceStep();
                }}

                className="px-8 py-3 rounded-xl bg-red-500 hover:bg-red-700 text-white">
                <span className="pr-4">Cancel</span>
            </button>
            
            <button  
                onClick={() => handleSubmit()}
                className="px-8 py-3 rounded-xl bg-purple-500 hover:bg-violet-700 text-white clicked?bg-violet-700 : bg-blue-500">
                <span className="pr-4">Submit</span>
            </button>
        </div>
    </Card>,
    document.body
);
};
 export {
    Reviewcard
}
