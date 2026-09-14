"use client";
import React, { useEffect } from "react";
import { InputField } from "@/components/ui/Input";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";
import { useLandownerRegistration } from "@/contexts/registration/landownerProvider";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  personalInfoSchema, workerPersonalInfoSchema, authorityPersonalInfoSchema,
  addressSchema, workerAddressSchema, bankSchema, workerImagesSchema,
} from "@/validations/registration";
import { useRegistrationStep } from "./useRegistrationStep";

export interface WorkerPersonalInfoFormRef {
  saveData: () => boolean;
}

export const WorkerPersonalInfoForm = forwardRef<WorkerPersonalInfoFormRef>((props, ref) => {
  const { WorkerformData, UpdateWorkerformdata } = useworkerRegistration();

      const { stepData, setStepData, errors, validate } = useRegistrationStep(workerPersonalInfoSchema, {
        name: WorkerformData.fullName || "",
        email: WorkerformData.email || "",
        mobile: WorkerformData.mobileNumber || "",
        dob: WorkerformData.DOB || "",
        username: WorkerformData.userName || "",
        password: WorkerformData.password || "",
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateWorkerformdata({
                fullName: values.name,
                mobileNumber: values.mobile,
                email: values.email,
                DOB: values.dob,
                password: values.password,
                userName: values.username,
            });
            return true;
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
                error={errors.name}
                 value={stepData.name}
                 onChange={(e) => {setStepData({ ...stepData, name: e.target.value }) }}
                 name="WorkerName"
                 placeholder="Enter Full Name"
                 className="text-white hover:text-black"
                  required />

             <InputField
                 type="email"
                 label="Email"
                 labelclassName="text-white"
                 name="WorkerEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                error={errors.email}
                 value={stepData.email}
                 onChange={(e) => { setStepData({ ...stepData, email: e.target.value })}}

                  required />

             <InputField
                 type="tel"
                 label="Contact Number"
                 labelclassName="text-white"
                 name="WorkerNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                error={errors.mobile}
                 value={stepData.mobile}
                 onChange={(e) => {setStepData({ ...stepData, mobile: e.target.value })}}
                 required />

            <InputField
                 label="Date of Birth"
                 labelclassName="text-white"
                 type="date"
                 name="WorkerDob"
                 placeholder="YYYY-MM-DD"
                 className="text-white hover:text-black [color-scheme:dark]"
                 error={errors.dob}
                 value={stepData.dob}
                 onChange={(e) => {setStepData({ ...stepData, dob: e.target.value })  }}
                 required />

              <InputField
                label="Username"
                labelclassName="text-white"
                name="WorkerUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
               error={errors.username}
                 value={stepData.username}
                 onChange={(e) => {setStepData({ ...stepData, username: e.target.value }) }}
                 required />

             <InputField
                 type="password"
                 label="Password"
                 labelclassName="text-white"
                 name="WorkerPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                 error={errors.password}
                 value={stepData.password}
                 onChange={(e) => {setStepData({ ...stepData, password: e.target.value }) }}
                  required />
            </div>
        </>
    );
});
WorkerPersonalInfoForm.displayName = "WorkerPersonalInfoForm";

export interface WorkerAddressFormRef {saveData: () => boolean;}
export const WorkerAddressForm = forwardRef<WorkerAddressFormRef>((props, ref)=> {
    const { WorkerformData, UpdateWorkerformdata} = useworkerRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(workerAddressSchema, {
                houseno: WorkerformData.houseno  || "",
                street: WorkerformData.street || "",
                landmark: WorkerformData.landmark || "",
                country: WorkerformData.country || "",
                city: WorkerformData.city || "",
                district: WorkerformData.district || "",
                state: WorkerformData.state || "",
                pincode: WorkerformData.pincode || ""
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateWorkerformdata({
                houseno: values.houseno,
                street: values.street,
                landmark: values.landmark,
                country: values.country,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            });
            return true;
        },
    }));
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
                  error={errors.houseno}
                 value={stepData.houseno}
                 onChange={(e)=> setStepData({ ...stepData, houseno: e.target.value })}

                   required />
                   <InputField
                 label="Street"
                 labelclassName="text-white"
                  name="wostreet"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                 error={errors.street}
                 value={stepData.street}
                 onChange={(e)=> setStepData({ ...stepData, street: e.target.value })}
                 required />

                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="wolandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                 error={errors.landmark}
                 value={stepData.landmark}
                 onChange={(e)=> setStepData({ ...stepData, landmark: e.target.value })}
                 required />

                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="wocountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                 error={errors.country}
                 value={stepData.country}
                 onChange={(e)=> setStepData({ ...stepData, country: e.target.value })}
                 required />

              <InputField
                label="city"
                labelclassName="text-white"
                name="Workercity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                error={errors.city}
                 value={stepData.city}
                 onChange={(e)=> setStepData({ ...stepData, city: e.target.value })}
                 required />

             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="Workerdistrict"
                 placeholder="district"
                 className="text-white hover:text-black"
                 error={errors.district}
                 value={stepData.district}
                 onChange={(e)=> setStepData({ ...stepData, district: e.target.value })}
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="Workerstate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                error={errors.state}
                 value={stepData.state}
                 onChange={(e)=> setStepData({ ...stepData, state: e.target.value })}
                 required />

             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="Workerpincode"
                 placeholder="Enter pincode"
                 className="text-white hover:text-black"
                 error={errors.pincode}
                 value={stepData.pincode}
                 onChange={(e)=> setStepData({ ...stepData, pincode: e.target.value })}
                  required />

            </div>
        </>
    );
});
WorkerAddressForm.displayName = "WorkerAddressForm";

export interface WorkerBankFormRef{ saveData: () => boolean;}
export const WorkerBankForm = forwardRef<WorkerBankFormRef>((props, ref)=>{
    const{ WorkerformData, UpdateWorkerformdata}= useworkerRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(bankSchema, {
                bankAccount: WorkerformData.bankaccount  || "",
                IfscCode: WorkerformData.IFSCcode || "",
                Workingzone: WorkerformData.workingZone || "",

    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateWorkerformdata({
                bankaccount: values.bankAccount,
                IFSCcode: values.IfscCode,
                workingZone: values.Workingzone
            });
            return true;
        },
    }));
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
                 placeholder="Enter Bank Account Number"
                 className="text-white hover:text-black"
                 error={errors.bankAccount}
                 value={stepData.bankAccount}
                 onChange={(e)=>setStepData({...stepData, bankAccount: e.target.value})}
                  required />

             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                 error={errors.IfscCode}
                 value={stepData.IfscCode}
                 onChange={(e)=> setStepData({...stepData, IfscCode: e.target.value})}
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="Workerworkingzone"
                 placeholder="Ente working zone"
                 className="text-white hover:text-black"
                 error={errors.Workingzone}
                 value={stepData.Workingzone}
                 onChange={(e)=> setStepData({...stepData, Workingzone : e.target.value})}
                  required />

            </div>
        </>
    );
});
WorkerBankForm.displayName = "WorkerBankForm";

export interface WorkerImageFormRef { saveData: () => boolean; }

function ImageUploadField({ name, label, file, error, onChange }: {
    name: string;
    label: string;
    file: File | null;
    error?: string;
    onChange: (file: File | null) => void;
}) {
    const [preview, setPreview] = useState(() => file ? URL.createObjectURL(file) : "");

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    return (
        <div className="flex min-w-0 flex-col gap-3 text-white">
            <label htmlFor={name}>{label}<span className="text-red-500 ml-1">*</span></label>
            <div className="h-40 border-2 border-white/50 rounded-xl overflow-hidden">
                {preview && (
                    // Local file previews use a temporary blob URL.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt={`${label} preview`} className="w-full h-full object-contain" />
                )}
            </div>
            <input
                id={name}
                name={name}
                type="file"
                accept="image/jpeg,image/png"
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={`${name}-help${error ? ` ${name}-error` : ""}`}
                className="w-full bg-gray-200 text-black p-2 rounded"
                onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null;
                    onChange(selectedFile);
                    setPreview(selectedFile && ["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)
                        ? URL.createObjectURL(selectedFile) : "");
                }}
            />
            <p id={`${name}-help`} className="text-xs text-gray-300">JPG or PNG, up to 10 MB{file ? ` ? ${file.name}` : ""}</p>
            {error && <p id={`${name}-error`} role="alert" className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}

export const WorkerImageForm = forwardRef<WorkerImageFormRef>((props, ref) => {
    const { WorkerformData, UpdateWorkerformdata } = useworkerRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep<{
        image: File | null;
        governmentid: File | null;
    }>(workerImagesSchema, {
        image: WorkerformData.image,
        governmentid: WorkerformData.governmentid,
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateWorkerformdata(values);
            return true;
        },
    }));

    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">Worker Information</h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
                <ImageUploadField name="WorkerImage" label="Profile image" file={stepData.image}
                    error={errors.image} onChange={(image) => setStepData({ ...stepData, image })} />
                <ImageUploadField name="WorkerGovernmentImage" label="Government ID image" file={stepData.governmentid}
                    error={errors.governmentid} onChange={(governmentid) => setStepData({ ...stepData, governmentid })} />
            </div>
        </>
    );
});
WorkerImageForm.displayName = "WorkerImageForm";

export interface AuthorityPersonalInfoFormRef{ saveData: () => boolean;}
export const AuthorityPersonalInfoForm= forwardRef<AuthorityPersonalInfoFormRef>((props, ref)=>{
     const{AuthorityformData, UpdateAuthorityformdata}= useAuthorityRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(authorityPersonalInfoSchema, {
        name: AuthorityformData.fullName || "",
        email: AuthorityformData.email || "",
        mobile: AuthorityformData.mobilenumber || "",
        authorityid: AuthorityformData.authorityId || "",
        username: AuthorityformData.username || "",
        password: AuthorityformData.password || "",
        department: AuthorityformData.department || "",
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateAuthorityformdata({
                fullName: values.name,
                mobilenumber: values.mobile,
                email: values.email,
                authorityId: values.authorityid,
                department: values.department,
                password: values.password,
                username: values.username,
            });
            return true;
        },
    }));
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
                 error={errors.name}
                 value={stepData.name}
                 onChange={(e) => {setStepData({ ...stepData, name: e.target.value }) }}
                  required />

             <InputField
                 type="email"
                 label="Email"
                 labelclassName="text-white"
                 name="auEmail"
                 placeholder="Enter Registered Email"
                 className="text-white hover:text-black"
                 error={errors.email}
                 value={stepData.email}
                 onChange={(e) => {setStepData({ ...stepData,email : e.target.value }) }}
                  required />

             <InputField
                 type="tel"
                 label="Contact Number"
                 labelclassName="text-white"
                 name="auNumber"
                 placeholder="Enter Contact Number"
                 className="text-white hover:text-black"
                 error={errors.mobile}
                 value={stepData.mobile}
                 onChange={(e) => {setStepData({ ...stepData, mobile: e.target.value }) }}
                 required />

              <InputField
                label="Username"
                labelclassName="text-white"
                name="auUsername"
                placeholder="Enter Username"
                className="text-white hover:text-black"
                error={errors.username}
                 value={stepData.username}
                 onChange={(e) => {setStepData({ ...stepData, username: e.target.value }) }}
                 required />

             <InputField
                 type="password"
                 label="Password"
                 labelclassName="text-white"
                 name="auPassword"
                 placeholder="Enter strong password"
                 className="text-white hover:text-black"
                 error={errors.password}
                 value={stepData.password}
                 onChange={(e) => {setStepData({ ...stepData, password: e.target.value }) }}
                  required />

            <InputField
                 label="department"
                 labelclassName="text-white"
                 name="audepartment"
                 placeholder="Enter your department"
                 className="text-white hover:text-black"
                 error={errors.department}
                 value={stepData.department}
                 onChange={(e) => {setStepData({ ...stepData, department: e.target.value }) }}
                  required />

            <InputField
                 label="Authority Id"
                 labelclassName="text-white"
                 name="auid"
                 placeholder="Enter your id"
                 className="text-white hover:text-black"
                 error={errors.authorityid}
                 value={stepData.authorityid}
                 onChange={(e) => {setStepData({ ...stepData,authorityid : e.target.value }) }}
                  required />
            </div>
        </>
    );
});
AuthorityPersonalInfoForm.displayName = "AuthorityPersonalInfoForm";

export interface AuthorityAddressFormRef{ saveData: () => boolean;}
export const AuthorityAddressForm = forwardRef<AuthorityAddressFormRef>((props, ref)=>  {
        const {AuthorityformData, UpdateAuthorityformdata} = useAuthorityRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(addressSchema, {
                houseno: AuthorityformData.houseno  || "",
                landmark: AuthorityformData.landmark || "",
                country: AuthorityformData.country || "",
                city: AuthorityformData.city || "",
                district: AuthorityformData.district || "",
                state: AuthorityformData.state || "",
                pincode: AuthorityformData.pincode || ""
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateAuthorityformdata({
                houseno: values.houseno,
                landmark: values.landmark,
                country: values.country,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            });
            return true;
        },
    }));
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
                   error={errors.houseno}
                 value={stepData.houseno}
                 onChange={(e) => {setStepData({ ...stepData,houseno : e.target.value }) }}
                   required />

                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="aulandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                  error={errors.landmark}
                 value={stepData.landmark}
                 onChange={(e) => {setStepData({ ...stepData, landmark: e.target.value }) }}
                  required />

                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="aucountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                  error={errors.country}
                 value={stepData.country}
                 onChange={(e) => {setStepData({ ...stepData, country: e.target.value }) }}
                 required />

              <InputField
                label="city"
                labelclassName="text-white"
                name="aucity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                 error={errors.city}
                 value={stepData.city}
                 onChange={(e) => {setStepData({ ...stepData, city: e.target.value }) }}
                 required />

             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="audistrict"
                 placeholder="district"
                  error={errors.district}
                 value={stepData.district}
                 onChange={(e) => {setStepData({ ...stepData, district: e.target.value }) }}
                 className="text-white hover:text-black"
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="austate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                 error={errors.state}
                 value={stepData.state}
                 onChange={(e) => {setStepData({ ...stepData, state: e.target.value }) }}
                 required />

             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="aupincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                  error={errors.pincode}
                 value={stepData.pincode}
                 onChange={(e) => {setStepData({ ...stepData, pincode: e.target.value }) }}
                  required />

            </div>
        </>
    );
});
AuthorityAddressForm.displayName = "AuthorityAddressForm";

export interface AuthorityBankFormRef{ saveData: () => boolean;}
export const AuthorityBankForm = forwardRef<AuthorityBankFormRef>((props, ref)=>{
    const{ AuthorityformData, UpdateAuthorityformdata}= useAuthorityRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(bankSchema, {
                bankAccount: AuthorityformData.bankaccount  || "",
                IfscCode: AuthorityformData.IFSCcode || "",
                Workingzone: AuthorityformData.workingZone || "",

    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateAuthorityformdata({
                bankaccount: values.bankAccount,
                IFSCcode: values.IfscCode,
                workingZone: values.Workingzone
            });
            return true;
        },
    }));
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
                 placeholder="Enter Bank Account Number"
                 className="text-white hover:text-black"
                  error={errors.bankAccount}
                 value={stepData.bankAccount}
                 onChange={(e) => {setStepData({ ...stepData, bankAccount: e.target.value }) }}
                  required />

             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                  error={errors.IfscCode}
                 value={stepData.IfscCode}
                 onChange={(e) => {setStepData({ ...stepData, IfscCode: e.target.value }) }}
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="auworkingzone"
                 placeholder=" Enter working zone"
                 className="text-white hover:text-black"
                  error={errors.Workingzone}
                 value={stepData.Workingzone}
                 onChange={(e) => {setStepData({ ...stepData, Workingzone: e.target.value }) }}
                  required />

            </div>
        </>
    );
});
AuthorityBankForm.displayName = "AuthorityBankForm";

export interface LandownerFormRef { saveData: () => boolean; }
export const LandownerForm = forwardRef<LandownerFormRef>((props, ref) => {
    const { LandownerformData, UpdateLandownerformdata } = useLandownerRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(personalInfoSchema, {
            name: LandownerformData.fullName || "",
            email: LandownerformData.email || "",
            mobile: LandownerformData.mobileNumber || "",
            username: LandownerformData.userName || "",
            password: LandownerformData.password || "",
        });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateLandownerformdata({
                fullName: values.name,
                email: values.email,
                mobileNumber: values.mobile,
                userName: values.username,
                password: values.password,
            });
            return true;
        },
    }));
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Landowner Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
                <InputField
                    label="Full Name"
                    labelclassName="text-white"
                    name="landownerName"
                    placeholder="Enter Full Name"
                    className="text-white hover:text-black"
                    error={errors.name}
                 value={stepData.name}
                    onChange={(e) => setStepData({ ...stepData, name: e.target.value })}
                    required
                />

                <InputField
                 type="email"
                    label="Email"
                    labelclassName="text-white"
                    name="landownerEmail"
                    placeholder="Enter Registered Email"
                    className="text-white hover:text-black"
                    error={errors.email}
                 value={stepData.email}
                    onChange={(e) => setStepData({ ...stepData, email: e.target.value })}
                    required
                />

                <InputField
                 type="tel"
                    label="Contact Number"
                    labelclassName="text-white"
                    name="landownerNumber"
                    placeholder="Enter Contact Number"
                    className="text-white hover:text-black"
                    error={errors.mobile}
                 value={stepData.mobile}
                    onChange={(e) => setStepData({ ...stepData, mobile: e.target.value })}
                    required
                />

                <InputField
                    label="Username"
                    labelclassName="text-white"
                    name="landownerUsername"
                    placeholder="Enter Username"
                    className="text-white hover:text-black"
                    error={errors.username}
                 value={stepData.username}
                    onChange={(e) => setStepData({ ...stepData, username: e.target.value })}
                    required
                />

                <InputField
                    label="Password"
                    labelclassName="text-white"
                    type="password"
                    name="landownerPassword"
                    placeholder="Enter strong password"
                    className="text-white hover:text-black"
                    error={errors.password}
                 value={stepData.password}
                    onChange={(e) => setStepData({ ...stepData, password: e.target.value })}
                    required
                />
            </div>
        </>
    );
});
LandownerForm.displayName = "LandownerForm";

export interface LandownerAddressFormRef{ saveData: () => boolean;}
export const LandownerAddressForm = forwardRef<LandownerAddressFormRef>((props, ref)=>  {
    const {LandownerformData, UpdateLandownerformdata} = useLandownerRegistration();
    const { stepData, setStepData, errors, validate } = useRegistrationStep(addressSchema, {
                houseno: LandownerformData.houseno  || "",
                landmark: LandownerformData.landmark || "",
                country: LandownerformData.country || "",
                city: LandownerformData.city || "",
                district: LandownerformData.district || "",
                state: LandownerformData.state || "",
                pincode: LandownerformData.pincode || ""
    });

    useImperativeHandle(ref, () => ({
        saveData: () => {
            const values = validate();
            if (!values) return false;
            UpdateLandownerformdata({
                houseno: values.houseno,
                landmark: values.landmark,
                country: values.country,
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode
            });
            return true;
        },
    }));
    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Landowner Information
            </h1>
            <div className="grid grid-cols-2 gap-5 mt-8">
               <InputField
                  label="House No/Flat no/ Road no"
                  labelclassName="text-white"
                  name="loHouseno"
                  placeholder="Enter House no"
                  className="text-white hover:text-black"
                   error={errors.houseno}
                 value={stepData.houseno}
                 onChange={(e) => {setStepData({ ...stepData,houseno : e.target.value }) }}
                   required />

                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="lolandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                  error={errors.landmark}
                 value={stepData.landmark}
                 onChange={(e) => {setStepData({ ...stepData, landmark: e.target.value }) }}
                  required />

                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="locountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                  error={errors.country}
                 value={stepData.country}
                 onChange={(e) => {setStepData({ ...stepData, country: e.target.value }) }}
                 required />

              <InputField
                label="city"
                labelclassName="text-white"
                name="locity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                 error={errors.city}
                 value={stepData.city}
                 onChange={(e) => {setStepData({ ...stepData, city: e.target.value }) }}
                 required />

             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="lodistrict"
                 placeholder="district"
                  error={errors.district}
                 value={stepData.district}
                 onChange={(e) => {setStepData({ ...stepData, district: e.target.value }) }}
                 className="text-white hover:text-black"
                  required />

            <InputField
                label="state"
                labelclassName="text-white"
                name="lostate"
                placeholder="Enter state"
                className="text-white hover:text-black"
                 error={errors.state}
                 value={stepData.state}
                 onChange={(e) => {setStepData({ ...stepData, state: e.target.value }) }}
                 required />

             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="lopincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                  error={errors.pincode}
                 value={stepData.pincode}
                 onChange={(e) => {setStepData({ ...stepData, pincode: e.target.value }) }}
                  required />

            </div>
        </>
    );
});
LandownerAddressForm.displayName = "LandownerAddressForm";
