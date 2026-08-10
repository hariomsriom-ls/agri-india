"use client";
import React from "react";
import Card from "@/components/ui/customizable-cards";
import { useState, useRef } from "react";

import {Roleselectioncard} from "@/components/cards/registrationlogin/registration";

import {AuthorityPersonalInfoForm, AuthorityAddressForm, AuthorityBankForm, LandownerForm, WorkerPersonalInfoForm
,WorkerAddressForm, WorkerBankForm, WorkerPersonalInfoFormRef, WorkerAddressFormRef, WorkerBankFormRef, AuthorityPersonalInfoFormRef,
AuthorityAddressFormRef, AuthorityBankFormRef
} from "@/components/cards/registrationlogin/form"
//import AuthorityReview from "../forms/authority/Review";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";



type Role = "authority" | "landowner" | "worker" | null;

export default function Form() {

    const {WorkerformData} = useworkerRegistration();
    console.log("FORM DATA:", WorkerformData);
    const [selectedRole, setSelectedRole] = useState("");
    const [step, setStep] = useState(1);

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
                    WorkerpersonalInfoRef.current?.saveData();
             case "authority" : 
                    AuthoritypersonalInfoRef.current?.saveData();
                    AuthoritypersonalInfoRef.current?.saveData();
            } }
    if (step === 3) {
        switch(selectedRole){
            case "worker" :
                    WorkerAddressFormRef.current?.saveData();
                    WorkerAddressFormRef.current?.saveData();
            case "authority" :
                    AuthorityAddressFormRef.current?.saveData();
                    AuthorityAddressFormRef.current?.saveData();
            }}
    if (step === 4) {
        switch(selectedRole){
            case "worker" : 
                    WorkerBankFormRef.current?.saveData();
                    WorkerBankFormRef.current?.saveData();
            case "authority" : 
                    AuthorityBankFormRef.current?.saveData();
                    AuthorityBankFormRef.current?.saveData();
            }}
    
        setStep((prev) => prev + 1);
    };


    const previous = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
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
                    return <AuthorityPersonalInfoForm />;
                case 3:
                    return <AuthorityAddressForm/>;
                case 4:
                    return <AuthorityBankForm />;
               // case 5:
                  //  return <AuthorityReview />;
                default:
                    return null;
            }
        }

       // Landowner
        if (selectedRole === "landowner") {
            switch (step) {
                case 2:
                    return <LandownerForm />;
               // case 6:
                  //  return <LandownerReview />;
                default:
                    return null;
            }
        }

          if (selectedRole === "worker") {
            switch (step) {
                case 2:{
                    return <WorkerPersonalInfoForm ref={WorkerpersonalInfoRef}/>;
                }
                case 3:
                    return <WorkerAddressForm ref={WorkerAddressFormRef}/>;
                case 4: 
                return <WorkerBankForm  ref={WorkerBankFormRef} />;
                //case 6:
                  //  return <WorkerReview />;
                default:
                    return null;
            }
        }

         return null;
    };


    return(
        <>
        <main className="overscroll-none">
            <div className="h-screen flex items-center justify-center bg-[url('/images/registration.png')] bg-cover bg-center">
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
            </div>  
            </div>
         </main>
        </>
    )
}