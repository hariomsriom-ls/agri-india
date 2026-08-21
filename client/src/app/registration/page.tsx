"use client";
import React from "react";
import Card from "@/components/ui/customizable-cards";
import { useState, useRef } from "react";
import axios from "axios";
import {Roleselectioncard} from "@/components/cards/registrationlogin/registration";

import {AuthorityPersonalInfoForm, AuthorityAddressForm, AuthorityBankForm, LandownerForm, WorkerPersonalInfoForm
,WorkerAddressForm, WorkerBankForm, WorkerPersonalInfoFormRef, WorkerAddressFormRef, WorkerBankFormRef, AuthorityPersonalInfoFormRef,
AuthorityAddressFormRef, AuthorityBankFormRef
} from "@/components/cards/registrationlogin/form"
import {Reviewcard} from "@/components/cards/registrationlogin/registration";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";


type Role = "authority" | "landowner" | "worker" | null;

export default function Form() {
   // const {WorkerformData} = useworkerRegistration();
    //console.log(WorkerformData);
    const [selectedRole, setSelectedRole] = useState("");
    const [step, setStep] = useState(1);
    const {ResetAuthorityformdata} = useAuthorityRegistration();
    const {ResetWorkerformdata} = useworkerRegistration();
    const [showReview, setShowReview] = useState(false);


    const WorkerpersonalInfoRef = useRef<WorkerPersonalInfoFormRef>(null);
    const WorkerAddressFormRef = useRef<WorkerAddressFormRef>(null);
    const WorkerBankFormRef = useRef<WorkerBankFormRef>(null);
    const AuthoritypersonalInfoRef = useRef<AuthorityPersonalInfoFormRef>(null);
    const AuthorityAddressFormRef = useRef<AuthorityAddressFormRef>(null);
    const AuthorityBankFormRef = useRef<AuthorityBankFormRef>(null);

    const next = () => {   
    if (step === 2) {
        switch(selectedRole){
            case "worker" : 
                    WorkerpersonalInfoRef.current?.saveData();
                    break;
             case "authority" : 
                    AuthoritypersonalInfoRef.current?.saveData();
                    break;
           

            } }
   else if (step === 3) {
        switch(selectedRole){
            case "worker" :
                    WorkerAddressFormRef.current?.saveData();
                    break;
            case "authority" :
                    AuthorityAddressFormRef.current?.saveData();
                    break;
            }}
   else if (step === 4) {
        switch(selectedRole){
            case "worker" : 
                    WorkerBankFormRef.current?.saveData();
                     setShowReview(true);
                    break;
            case "authority" : 
                    AuthorityBankFormRef.current?.saveData();
                     setShowReview(true);
                    break;
            }}

    
        setStep((prev) => prev + 1);
    };


    const previous = () => {
        
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
        if(step === 2) {
            switch(selectedRole){
               case "worker" : 
                    ResetWorkerformdata();
                    break;
            case "authority" : 
                    ResetAuthorityformdata(); 
                    break;
            }
        }
    };


     const renderForm = () => {
        // Step 1
        if (step === 1) {
            return (
                <Roleselectioncard
                 selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}   />
            );
        }
       if (selectedRole === "authority") {
            switch (step) {
                case 2:
                    return <AuthorityPersonalInfoForm ref={AuthoritypersonalInfoRef} />;
                case 3:
                    return <AuthorityAddressForm ref={AuthorityAddressFormRef}/>;
                case 4:
                    return <AuthorityBankForm ref={AuthorityBankFormRef}/>
            }
        }

       // Landowner
       else if (selectedRole === "landowner") {
            switch (step) {
                case 2:
                    return <LandownerForm />;
            }
        }

        else if (selectedRole === "worker") {
            switch (step) {
                case 2:
                    return <WorkerPersonalInfoForm ref={WorkerpersonalInfoRef}/>;  
                case 3:
                    return <WorkerAddressForm ref={WorkerAddressFormRef}/>;
                case 4: 
                    return <WorkerBankForm  ref={WorkerBankFormRef} />;
            }
        }
        
    };

    


    return(
        <>
        <main className="overscroll-none bg-[url('/images/registration.png')] bg-cover bg-center">
            <div className="h-screen flex items-center justify-center ">
            <div className=" flex h-28/30 w-25/30 bg-linear-to-b from-black/30 to-black/50 justify-center items-center rounded-lg">
            <Card className="h-83/100 w-8/10 rounded-3xl shadow-2xl bg-linear-to-b from-black/50 to-black/80 relative">
            <div className="pb-2">
            <div className="flex gap-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-8 h-8 rounded-full border
                                ${index < step
                                        ? "bg-green-500 border-green-500"
                                        : "border-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-green-400 text-sm"> Step {step} of 5 </p>
             </div>
                 {renderForm()}
                    {step > 1 && (
                    <div className=" absolute bottom-5 left-5">
                    <button
                        onClick={previous}
                        disabled={step === 1}
                        className="px-8 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-500">
                        <span className="text-sm">←</span>
                        <span className="pl-4">Previous</span>
                    </button>
                    </div>
                    )}
                    <div className=" absolute bottom-5 right-5">
                    <button
                        onClick={next}
                        disabled={step === 1 && !selectedRole}
                        className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white">
                        <span className="pr-4">Next</span>
                        <span className="text-sm">→</span>
                    </button>
                    </div>
             </Card>
             {showReview && ( <Reviewcard selectedRole={selectedRole} setSelectedRole={setSelectedRole}
             onClose={() => setShowReview(false)} reduceStep={()=> setStep((prev)=>prev-1)} /> )}
            </div>  
             
            </div>
         </main>
        </>
    )
}