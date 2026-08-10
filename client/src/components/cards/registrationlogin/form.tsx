"use client";
import React from "react";
import { InputField } from "@/components/ui/Input";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";
import { forwardRef, useImperativeHandle, useState } from "react";
import { steps } from "framer-motion";

export interface WorkerPersonalInfoFormRef { saveData: () => void;}
export const WorkerPersonalInfoForm = forwardRef<WorkerPersonalInfoFormRef>((props, ref) => {
    const { UpdateWorkerformdata,} = useworkerRegistration();
    const [stepData, setStepData] = useState({
         name: "", email: "", mobile: "", dob: "", username: "", password: "",
});
     useImperativeHandle(ref, ()=>({
        saveData: () => {
            UpdateWorkerformdata({
                fullName: stepData.name,
                mobilenumber: stepData.mobile,
                email: stepData.email, 
                DOB: stepData.dob,
                password: stepData.password,
                username: stepData.username, 
            });
        },
     }));
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               
              <InputField
                 label="Full Name"
                 labelclassName="text-white"
                value={stepData.name}
                 onChange={(e) => {setStepData({ ...stepData, name: e.target.value }) }}
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
                value={stepData.email}
                 onChange={(e) => { setStepData({ ...stepData, email: e.target.value })}}

                  />
                            
             <InputField
                 label="Contact Number"
                 labelclassName="text-white"
                 name="WorkerNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                value={stepData.mobile}
                 onChange={(e) => {setStepData({ ...stepData, mobile: e.target.value })}}
                 required />

            <InputField
                 label="Date of Birth"
                 labelclassName="text-white"
                 name="WorkerDob"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 value={stepData.dob}
                 onChange={(e) => {setStepData({ ...stepData, dob: e.target.value })  }}
                 required />
            
              <InputField
                label="Username"
                labelclassName="text-white"
                name="WorkerUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
               value={stepData.username}
                 onChange={(e) => {setStepData({ ...stepData, username: e.target.value }) }}
                 required />
            
             <InputField
                 label="Password"
                 labelclassName="text-white"
                 name="WorkerPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                 value={stepData.password}
                 onChange={(e) => {setStepData({ ...stepData, password: e.target.value }) }}
                  required />
            </div>
        </>
    );
});

export interface WorkerAddressFormRef {saveData: () => void;}
export const WorkerAddressForm = forwardRef<WorkerAddressFormRef>((props, ref)=> {
    const { UpdateWorkerformdata} = useworkerRegistration();
    const [stepData, setStepData] = useState({
        houseno: "", landmark: "", country: "", city: "", district: "", state: "", pincode: ""

    })
    useImperativeHandle(ref,()=>({
        saveData: ()=>{
            UpdateWorkerformdata({
                houseno: stepData.houseno,
                landmark: stepData.landmark,
                country: stepData.country,
                city: stepData.city,
                district: stepData.district,
                state: stepData.state,
                pincode: stepData.pincode
            })
        }
    }))
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Worker Information
            </h1> 
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                  label="House No/Flat no/ Road no"
                  labelclassName="text-white"
                  name="woHouseno"
                  placeholder="Enter House no"
                  className="text-white hover:text-black"
                  value={stepData.houseno}
                 onChange={(e)=> setStepData({ ...stepData, houseno: e.target.value })}
                   />
               
                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="wolandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                 value={stepData.landmark}
                 onChange={(e)=> setStepData({ ...stepData, landmark: e.target.value })}
                 />
               
                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="wocountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                 value={stepData.country}
                 onChange={(e)=> setStepData({ ...stepData, country: e.target.value })}
                 required />
            
              <InputField
                label="city"
                labelclassName="text-white"
                name="Workercity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                value={stepData.city}
                 onChange={(e)=> setStepData({ ...stepData, city: e.target.value })}
                 required />
            
             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="Workerdistrict"
                 placeholder="district"
                 className="text-white hover:text-black"
                 value={stepData.district}
                 onChange={(e)=> setStepData({ ...stepData, district: e.target.value })}
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="Workerstate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                value={stepData.state}
                 onChange={(e)=> setStepData({ ...stepData, state: e.target.value })}
                 required />
            
             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="Workerpincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                 value={stepData.pincode}
                 onChange={(e)=> setStepData({ ...stepData, pincode: e.target.value })}
                  required />

            </div>
        </>
    );
});


export interface WorkerBankFormRef{ saveData: ()=> void;}
export const WorkerBankForm = forwardRef<WorkerBankFormRef>((props, ref)=>{
    const{ UpdateWorkerformdata}= useworkerRegistration();
    const[stepData, setStepData] = useState({
        bankAccount: "", IfscCode: "", Workingzone: ""
    })
    useImperativeHandle(ref, ()=>({
        saveData: ()=>{
            UpdateWorkerformdata({
                bankaccount: stepData.bankAccount,
                IFSCcode: stepData.IfscCode,
                workingZone: stepData.Workingzone
            })
        }
    }))
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Bank Account"
                 labelclassName="text-white"
                 name="Workeraccount"
                 placeholder="Enter ank Account"
                 className="text-white hover:text-black"
                 value={stepData.bankAccount}
                 onChange={(e)=>setStepData({...stepData, bankAccount: e.target.value})}
                  required />
                            
             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                 value={stepData.IfscCode}
                 onChange={(e)=> setStepData({...stepData, IfscCode: e.target.value})}
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="Workerworkingzone"
                 placeholder="workingzone"
                 className="text-white hover:text-black"
                 value={stepData.Workingzone}
                 onChange={(e)=> setStepData({...stepData, Workingzone : e.target.value})}
                  required />
                            
            </div>
        </>
    );
});


export interface AuthorityPersonalInfoFormRef{ saveData: ()=> void;}
export const AuthorityPersonalInfoForm= forwardRef<AuthorityPersonalInfoFormRef>((props, ref)=>{
     const{ UpdateAuthorityformdata}= useAuthorityRegistration();
    const[stepData, setStepData] = useState({
          name: "", email: "", mobile: "", authorityid: "", username: "", password: "", department: ""
    });
    useImperativeHandle(ref, ()=>({
        saveData: ()=>{
            UpdateAuthorityformdata({
                fullName: stepData.name,
                mobilenumber: stepData.mobile,
                email: stepData.email, 
                authorityId: stepData.authorityid,
                department: stepData.department,
                password: stepData.password,
                username: stepData.username,
            });
        }}
    ));
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Authority Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                 label="Full Name"
                 labelclassName="text-white"
                 name="auName"
                 placeholder="Enter Full Name"
                 className="text-white hover:text-black"
                 value={stepData.name}
                 onChange={(e) => {setStepData({ ...stepData, name: e.target.value }) }}
                  required />
                            
             <InputField
                 label="Email"
                 labelclassName="text-white"
                 name="auEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                 value={stepData.email}
                 onChange={(e) => {setStepData({ ...stepData,email : e.target.value }) }}
                  required />
                            
             <InputField
                 label="Contact Number"
                 labelclassName="text-white"
                 name="auNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 value={stepData.mobile}
                 onChange={(e) => {setStepData({ ...stepData, mobile: e.target.value }) }}
                 required />
            
              <InputField
                label="Username"
                labelclassName="text-white"
                name="auUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
                value={stepData.username}
                 onChange={(e) => {setStepData({ ...stepData, username: e.target.value }) }}
                 required />
            
             <InputField
                 label="Password"
                 labelclassName="text-white"
                 name="auPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                 value={stepData.password}
                 onChange={(e) => {setStepData({ ...stepData, password: e.target.value }) }}
                  required />

            <InputField
                 label="department"
                 labelclassName="text-white"
                 name="audepartment"
                 placeholder="Enter your department"
                 className="text-white hover:text-black"
                 value={stepData.department}
                 onChange={(e) => {setStepData({ ...stepData, department: e.target.value }) }}
                  required />
            
            <InputField
                 label="Authority Id"
                 labelclassName="text-white"
                 name="auid"
                 placeholder="Enter your id"
                 className="text-white hover:text-black"
                 value={stepData.authorityid}
                 onChange={(e) => {setStepData({ ...stepData,authorityid : e.target.value }) }}
                  required />
            </div>
        </>
    );
});


export interface AuthorityAddressFormRef{ saveData: ()=> void;}
export const AuthorityAddressForm = forwardRef<AuthorityAddressFormRef>((props, ref)=>  {
        const { UpdateAuthorityformdata} = useAuthorityRegistration();
    const [stepData, setStepData] = useState({
        houseno: "", landmark: "", country: "", city: "", district: "", state: "", pincode: ""

    })
    useImperativeHandle(ref,()=>({
        saveData: ()=>{
            UpdateAuthorityformdata({
                houseno: stepData.houseno,
                landmark: stepData.landmark,
                country: stepData.country,
                city: stepData.city,
                district: stepData.district,
                state: stepData.state,
                pincode: stepData.pincode
            })
        }
    }))
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
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
});


export interface AuthorityBankFormRef{ saveData: ()=> void;}
export const AuthorityBankForm = forwardRef<AuthorityBankFormRef>((props, ref)=>{
    const{ UpdateAuthorityformdata}= useAuthorityRegistration();
    const[stepData, setStepData] = useState({
        bankAccount: "", IfscCode: "", Workingzone: ""
    })
    useImperativeHandle(ref, ()=>({
        saveData: ()=>{
            UpdateAuthorityformdata({
                bankaccount: stepData.bankAccount,
                IFSCcode: stepData.IfscCode,
                workingZone: stepData.Workingzone
            })
        }
    }))
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
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
});


export function LandownerForm() {
    return (
        <>
         <h1 className="text-4xl text-white absolute top-5 right-30">
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