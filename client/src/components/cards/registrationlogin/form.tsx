"use client";
import React, { useEffect } from "react";
import {useForm, SubmitHandler} from "React-hook-form";
import { InputField } from "@/components/ui/Input";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";
import { useLandownerRegistration } from "@/contexts/registration/landownerProvider";
import { forwardRef, useImperativeHandle, useState } from "react";
import {MdOutlineFileUpload } from "react-icons/md";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/*
type WorkerPersonalFormValues = {
  fullName: string;
  email: string;
  mobileNumber: string;
  DOB: string;
  userName: string;
  password: string;
};

const WorkerPersonalInfoSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.string().trim().min(1, "Name is required").pipe(z.email({error:"Enter a valid email address"})),
  mobileNumber: z.string().trim().min(1, "Name is required").regex(/^[6-9]\d{9}$/,{error: "Enter a valid 10-digit Indian mobile number"}),
  DOB: z.string().min(1, { error: "Date of birth is required" }).refine((value) => !isNaN(Date.parse(value)), "Enter a valid date"),
  userName: z.string().trim().min(4, "Username must be at least 4 characters"),
  password: z.string().trim().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, {error: "Password must contain at least one uppercase letter",})
  .regex(/[^A-Za-z0-9\s]/, { error: "Password must contain at least one special character", }),
});*/

export interface WorkerPersonalInfoFormRef {
  saveData: () => void;
}

export const WorkerPersonalInfoForm = forwardRef<WorkerPersonalInfoFormRef>((props, ref) => {
  const { WorkerformData, UpdateWorkerformdata } = useworkerRegistration();
  /*const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<WorkerPersonalFormValues>({
    resolver: zodResolver(WorkerPersonalInfoSchema),
    defaultValues: {
      fullName: WorkerformData.fullName || "",
      email: WorkerformData.email || "",
      mobileNumber: WorkerformData.mobileNumber || "",
      DOB: WorkerformData.DOB || "",
      userName: WorkerformData.userName || "",
      password: WorkerformData.password || "",
    },
  });*/
      const [stepData, setStepData] = useState({
         name: "", email: "", mobile: "", dob: "", username: "", password: "",
});
    useEffect(() => {
    setStepData({
        name: WorkerformData.fullName || "",
        email: WorkerformData.email || "",
        mobile: WorkerformData.mobileNumber || "",
        dob: WorkerformData.DOB || "",
        username: WorkerformData.userName || "",
        password: WorkerformData.password || "",
    });
    }, []);

  /*useEffect(() => {
    reset({
      fullName: WorkerformData.fullName || "",
      email: WorkerformData.email || "",
      mobileNumber: WorkerformData.mobileNumber || "",
      DOB: WorkerformData.DOB || "",
      userName: WorkerformData.userName || "",
      password: WorkerformData.password || "",
    });
  }, []);*/

 /* useImperativeHandle(ref, () => ({
    saveData: () => {
      const values = getValues();
      UpdateWorkerformdata({
        fullName: values.fullName,
        mobileNumber: values.mobileNumber,
        email: values.email,
        DOB: values.DOB,
        password: values.password,
        userName: values.userName,
      });
    },
  }));*/
     useImperativeHandle(ref, ()=>({
        saveData: () => {
            UpdateWorkerformdata({
                fullName: stepData.name,
                mobileNumber: stepData.mobile,
                email: stepData.email, 
                DOB: stepData.dob,
                password: stepData.password,
                userName: stepData.username, 
            });
        },
     }),[stepData]);
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
                 type="date"
                 name="WorkerDob"
                 placeholder="YYYY-MM-DD"
                 className="text-white hover:text-black [color-scheme:dark]"
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

 /* return (
    <>
      <h1 className="text-4xl text-white absolute top-5 right-30">
        Worker Information
      </h1>

      <div className="grid grid-cols-2 gap-5 mt-8">

        <div className="flex flex-col gap-1">
          <InputField
            label="Full Name"
            labelclassName="text-white"
            placeholder="Enter Full Name"
            className="text-white hover:text-black"
            required 
            {/*...register("fullName")
          />
        </div>

        <div className="flex flex-col gap-1">
          <InputField
            label="Email"
            labelclassName="text-white"
            placeholder="Enter Registered Email"
            className="text-white hover:text-black"
            {/*...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <InputField
            label="Contact Number"
            labelclassName="text-white"
            placeholder="Enter 10-digit mobile number"
            className="text-white hover:text-black"
            required
            {/*...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit Indian mobile number",
              },
            })}
          />
          {errors.mobileNumber && (
            <span className="text-red-400 text-xs mt-1">{errors.mobileNumber.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <InputField
            label="Date of Birth"
            labelclassName="text-white"
            type="date"
            placeholder="YYYY-MM-DD"
            className="text-white hover:text-black [color-scheme:dark]"
            required
            {...register("DOB", {
              required: "Date of birth is required",
            })}
          />
          {errors.DOB && (
            <span className="text-red-400 text-xs mt-1">{errors.DOB.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <InputField
            label="Username"
            labelclassName="text-white"
            placeholder="Enter Username"
            className="text-white hover:text-black"
            required
            {...register("userName", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers, and underscores allowed",
              },
            })}
          />
          {errors.userName && (
            <span className="text-red-400 text-xs mt-1">{errors.userName.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <InputField
            label="Password"
            labelclassName="text-white"
            type="password"
            placeholder="Enter strong password (min 8 chars)"
            className="text-white hover:text-black"
            required
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          {errors.password && (
            <span className="text-red-400 text-xs mt-1">{errors.password.message}</span>
          )}
        </div>

      </div>
    </>
  );
});*/
WorkerPersonalInfoForm.displayName = "WorkerPersonalInfoForm";


export interface WorkerAddressFormRef {saveData: () => void;}
export const WorkerAddressForm = forwardRef<WorkerAddressFormRef>((props, ref)=> {
    const { WorkerformData, UpdateWorkerformdata} = useworkerRegistration();
    const [stepData, setStepData] = useState({
        houseno: "", landmark: "", country: "", city: "", district: "", state: "", pincode: "", street: "",

    })
     useEffect(() => {
    setStepData({
                houseno: WorkerformData.houseno  || "",
                street: WorkerformData.street || "",
                landmark: WorkerformData.landmark || "",
                country: WorkerformData.country || "",
                city: WorkerformData.city || "",
                district: WorkerformData.district || "",
                state: WorkerformData.state || "",
                pincode: WorkerformData.pincode || ""
    });
    }, []);

    useImperativeHandle(ref,()=>({
        saveData: ()=>{
            UpdateWorkerformdata({
                houseno: stepData.houseno,
                street: stepData.street,
                landmark: stepData.landmark,
                country: stepData.country,
                city: stepData.city,
                district: stepData.district,
                state: stepData.state,
                pincode: stepData.pincode
            })
        }
    }),[stepData])
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
                 label="Street"
                 labelclassName="text-white"
                  name="wostreet"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                 value={stepData.street}
                 onChange={(e)=> setStepData({ ...stepData, street: e.target.value })}
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
                 placeholder="Enter pincode"
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
    const{ WorkerformData, UpdateWorkerformdata}= useworkerRegistration();
    const[stepData, setStepData] = useState({
        bankAccount: "", IfscCode: "", Workingzone: ""
    })
    useEffect(() => {
    setStepData({
                bankAccount: WorkerformData.bankaccount  || "",
                IfscCode: WorkerformData.IFSCcode || "",
                Workingzone: WorkerformData.workingZone || "",
                
    });
    }, []);
    useImperativeHandle(ref, ()=>({
        saveData: ()=>{
            UpdateWorkerformdata({
                bankaccount: stepData.bankAccount,
                IFSCcode: stepData.IfscCode,
                workingZone: stepData.Workingzone
            })
        }
    }),[stepData])
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
                 placeholder="Ente working zone"
                 className="text-white hover:text-black"
                 value={stepData.Workingzone}
                 onChange={(e)=> setStepData({...stepData, Workingzone : e.target.value})}
                  required />
                            
            </div>
        </>
    );
});

export interface WorkerImageFormRef{ saveData: ()=> void;}
export const WorkerImageForm = forwardRef<WorkerImageFormRef>((props, ref)=>{
    const{ WorkerformData, UpdateWorkerformdata}= useworkerRegistration();
    const[image, setImage] = useState<File | null>(null);
    const[imagePreview, setImagePreview] = useState<string>("");
    const[governmentid, setgovernmentid] = useState<File | null>(null);
    const[governmentidPreview, setgovernmentidPreview] = useState<string>("");
    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        setImage(file);
        const PreviewUrl = URL.createObjectURL(file);
        setImagePreview(PreviewUrl);
        UpdateWorkerformdata({image: file});
    }
    const handledocumentimageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        setgovernmentid(file);
        const PreviewUrl = URL.createObjectURL(file);
        setgovernmentidPreview(PreviewUrl);
        UpdateWorkerformdata({governmentid: file});
    }
    

    return (
        <>
            <h1 className="text-4xl text-white absolute top-5 right-30">
                Worker Information
            </h1>
            <div className="grid grid-cols-2 gap-2 mt-8 h-full ">
            <div className="w-1/2 h-1/3">
            <div className="w-7/10 h-full bg-black ml-20  border-2 border-white/50">
            {imagePreview && (
                <img 
                src={imagePreview} 
                alt="Image Preview"
                className="w-full h-full object-cover rounded-xs"
             />)}
            </div>
              <input
              name="WorkerImage"
              className="bg-gray-200 hover:bg-gray-500 text-black py-2 px-4 rounded mt-5"
              type = "file"
              accept="image/*"
              onChange={handleImageChange}
               />
            <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-5 ml-20 w-full">
                Save Image
            </button>
             </div>
             <div className="w-1/2 h-1/3 ">
             <div className="w-7/10 h-full bg-black border-2 border-white/50  ml-15">
             {governmentidPreview && (
                <img 
                src={governmentidPreview} 
                alt="Government ID Preview"
                className="w-full h-full object cover rounded-xs"
                />
             )}
             </div>
               <input 
              name = "WorkerGovermentImage"
              className="bg-gray-200 hover:bg-gray-500 text-black py-2 px-4 rounded mt-5 "
              type = "file"
              accept="image/*"
              onChange={handledocumentimageChange}
               />
             <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-5 ml-15 w-full">
                Save Government ID
            </button>
             </div>   
            </div>
        </>
    );
});


export interface AuthorityPersonalInfoFormRef{ saveData: ()=> void;}
export const AuthorityPersonalInfoForm= forwardRef<AuthorityPersonalInfoFormRef>((props, ref)=>{
     const{AuthorityformData, UpdateAuthorityformdata}= useAuthorityRegistration();
    const[stepData, setStepData] = useState({
          name: "", email: "", mobile: "", authorityid: "", username: "", password: "", department: ""
    });
     useEffect(() => {
    setStepData({
        name: AuthorityformData.fullName || "",
        email: AuthorityformData.email || "",
        mobile: AuthorityformData.mobilenumber || "",
        authorityid: AuthorityformData.authorityId || "",
        username: AuthorityformData.username || "",
        password: AuthorityformData.password || "",
        department: AuthorityformData.department || "",
    });
    }, []);

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
    ),[stepData]);
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
        const {AuthorityformData, UpdateAuthorityformdata} = useAuthorityRegistration();
    const [stepData, setStepData] = useState({
        houseno: "", landmark: "", country: "", city: "", district: "", state: "", pincode: ""

    })
     useEffect(() => {
    setStepData({
                houseno: AuthorityformData.houseno  || "",
                landmark: AuthorityformData.landmark || "",
                country: AuthorityformData.country || "",
                city: AuthorityformData.city || "",
                district: AuthorityformData.district || "",
                state: AuthorityformData.state || "",
                pincode: AuthorityformData.pincode || ""
    });
    }, []);

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
    }),[stepData])
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
                   value={stepData.houseno}
                 onChange={(e) => {setStepData({ ...stepData,houseno : e.target.value }) }}
                   />
               
                 <InputField
                 label="Land Mark"
                 labelclassName="text-white"
                  name="aulandmark"
                 placeholder="Enter nearby landmark"
                 className="text-white hover:text-black"
                  value={stepData.landmark}
                 onChange={(e) => {setStepData({ ...stepData, landmark: e.target.value }) }}
                  required />
               
                  <InputField
                 label="Country"
                 labelclassName="text-white"
                 name="aucountry"
                 placeholder="Enter House no"
                 className="text-white hover:text-black"
                  value={stepData.country}
                 onChange={(e) => {setStepData({ ...stepData, country: e.target.value }) }}
                 required />
            
              <InputField
                label="city"
                labelclassName="text-white"
                name="aucity"
                placeholder="Enter city"
                className="text-white hover:text-black"
                 value={stepData.city}
                 onChange={(e) => {setStepData({ ...stepData, city: e.target.value }) }}
                 required />
            
             <InputField
                 label="district"
                 labelclassName="text-white"
                 name="audistrict"
                 placeholder="district"
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
                 value={stepData.state}
                 onChange={(e) => {setStepData({ ...stepData, state: e.target.value }) }}
                 required />
            
             <InputField
                 label="pincode"
                 labelclassName="text-white"
                 name="aupincode"
                 placeholder="pincode"
                 className="text-white hover:text-black"
                  value={stepData.pincode}
                 onChange={(e) => {setStepData({ ...stepData, pincode: e.target.value }) }}
                  required />

            </div>
        </>
    );
});


export interface AuthorityBankFormRef{ saveData: ()=> void;}
export const AuthorityBankForm = forwardRef<AuthorityBankFormRef>((props, ref)=>{
    const{ AuthorityformData, UpdateAuthorityformdata}= useAuthorityRegistration();
    const[stepData, setStepData] = useState({
        bankAccount: "", IfscCode: "", Workingzone: ""
    })
    useEffect(() => {
    setStepData({
                bankAccount: AuthorityformData.bankaccount  || "",
                IfscCode: AuthorityformData.IFSCcode || "",
                Workingzone: AuthorityformData.workingZone || "",
                
    });
    }, []);
    useImperativeHandle(ref, ()=>({
        saveData: ()=>{
            UpdateAuthorityformdata({
                bankaccount: stepData.bankAccount,
                IFSCcode: stepData.IfscCode,
                workingZone: stepData.Workingzone
            })
        }
    }),[stepData])
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
                  value={stepData.bankAccount}
                 onChange={(e) => {setStepData({ ...stepData, bankAccount: e.target.value }) }}
                  required />
                            
             <InputField
                 label="Ifsc Code"
                 labelclassName="text-white"
                 name="WorkerIfscCode"
                 placeholder="Enter ifsc code"
                 className="text-white hover:text-black"
                  value={stepData.IfscCode}
                 onChange={(e) => {setStepData({ ...stepData, IfscCode: e.target.value }) }}
                  required />

            <InputField
                 label="workingZone"
                 labelclassName="text-white"
                 name="auworkingzone"
                 placeholder=" Enter working zone"
                 className="text-white hover:text-black"
                  value={stepData.Workingzone}
                 onChange={(e) => {setStepData({ ...stepData, Workingzone: e.target.value }) }}
                  required />
                            
            </div>
        </>
    );
});


export interface LandownerFormRef { saveData: () => void; }
export const LandownerForm = forwardRef<LandownerFormRef>((props, ref) => {
    const { LandownerformData, UpdateLandownerformdata } = useLandownerRegistration();
    const [stepData, setStepData] = useState({
        name: "",
        email: "",
        mobile: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        setStepData({
            name: LandownerformData.fullName || "",
            email: LandownerformData.email || "",
            mobile: LandownerformData.mobileNumber || "",
            username: LandownerformData.userName || "",
            password: LandownerformData.password || "",
        });
    }, [LandownerformData]);

    useImperativeHandle(ref, () => ({
        saveData: () => {
            UpdateLandownerformdata({
                fullName: stepData.name,
                email: stepData.email,
                mobileNumber: stepData.mobile,
                userName: stepData.username,
                password: stepData.password,
            });
        },
    }), [stepData, UpdateLandownerformdata]);

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
                    value={stepData.name}
                    onChange={(e) => setStepData({ ...stepData, name: e.target.value })}
                    required 
                />
                            
                <InputField
                    label="Email"
                    labelclassName="text-white"
                    name="landownerEmail"
                    placeholder="Enter Registered Email"
                    className="text-white hover:text-black"
                    value={stepData.email}
                    onChange={(e) => setStepData({ ...stepData, email: e.target.value })}
                    required 
                />
                            
                <InputField
                    label="Contact Number"
                    labelclassName="text-white"
                    name="landownerNumber"
                    placeholder="Enter Contact Number"
                    className="text-white hover:text-black"
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
                    value={stepData.password}
                    onChange={(e) => setStepData({ ...stepData, password: e.target.value })}
                    required 
                />
            </div>
        </>
    );
});