"use client";
import React from "react";
import { InputField } from "@/components/ui/Input";

export function WorkerPersonalInfoForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Full Name"
                 labelclassName="text-white"
                 name="WorkerName"
                 placeholder="Enter Full Name"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Email"
                 labelclassName="text-white"
                 name="WorkerEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                  />
                            
             <InputField
                 label="Contact Number"
                 labelclassName="text-white"
                 name="WorkerNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 required />
            
              <InputField
                label="Username"
                labelclassName="text-white"
                name="WorkerUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="Password"
                 labelclassName="text-white"
                 name="WorkerPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                  required />
            </div>
        </>
    );
}

export function WorkerAddressForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                  label="House No/Flat no/ Road no"
                  labelclassName="text-white"
                  name="woHouseno"
                  placeholder="Enter House no"
                  className="text-white hover:text-black"
                   />
               
                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="wolandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                 />
               
                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="wocountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                 required />
            
              <InputField
                label="city"
                labelclassName="text-white"
                name="Workercity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="Workerdistrict"
                 placeholder="district"
                 className="text-white hover:text-black"
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="Workerstate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="Workerpincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                  required />

            </div>
        </>
    );
}

export function WorkerBankForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Bank Account"
                 labelclassName="text-white"
                 name="Workeraccount"
                 placeholder="Enter ank Account"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="Workerworkingzone"
                 placeholder="workingzone"
                 className="text-white hover:text-black"
                  required />
                            
            </div>
        </>
    );
}

export function AuthorityPersonalInfoForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Authority Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Full Name"
                 labelclassName="text-white"
                 name="auName"
                 placeholder="Enter Full Name"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Email"
                 labelclassName="text-white"
                 name="auEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Contact Number"
                 labelclassName="text-white"
                 name="auNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 required />
            
              <InputField
                label="Username"
                labelclassName="text-white"
                name="auUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="Password"
                 labelclassName="text-white"
                 name="auPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                  required />

            <InputField
                 label="department"
                 labelclassName="text-white"
                 name="audepartment"
                 placeholder="Enter your department"
                 className="text-white hover:text-black"
                  required />
            
            <InputField
                 label="Authority Id"
                 labelclassName="text-white"
                 name="auid"
                 placeholder="Enter your id"
                 className="text-white hover:text-black"
                  required />
            </div>
        </>
    );
}

export function AuthorityAddressForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Authority Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                  label="House No/Flat no/ Road no"
                  labelclassName="text-white"
                  name="auHouseno"
                  placeholder="Enter House no"
                  className="text-white hover:text-black"
                   />
               
                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="aulandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                  required />
               
                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="aucountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                 required />
            
              <InputField
                label="city"
                labelclassName="text-white"
                name="aucity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="audistrict"
                 placeholder="district"
                 className="text-white hover:text-black"
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="austate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="aupincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                  required />

            </div>
        </>
    );
}

export function AuthorityBankForm() {
    return (
        <>
            <h1 className="text-4xl text-white">
                Authority Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Bank Account"
                 labelclassName="text-white"
                 name="auaccount"
                 placeholder="Enter ank Account"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="auworkingzone"
                 placeholder="workingzone"
                 className="text-white hover:text-black"
                  required />
                            
            </div>
        </>
    );
}

export function LandownerForm() {
    return (
        <>
         <h1 className="text-4xl text-white">
            Landowner Information
         </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
             <InputField
                 label="Full Name"
                 labelclassName="text-white"
                 name="authorityName"
                 placeholder="Enter Full Name"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Email"
                 labelclassName="text-white"
                 name="authorityEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                  required />
                            
             <InputField
                 label="Contact Number"
                 labelclassName="text-white"
                 name="authorityNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 required />
            
              <InputField
                label="Username"
                labelclassName="text-white"
                name="authorityUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
                 required />
            
             <InputField
                 label="Password"
                 labelclassName="text-white"
                 name="authorityNumber"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                  required />
            </div>
        </>
    );
}