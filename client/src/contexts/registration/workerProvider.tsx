"use client";

import { createContext, useContext, useState, ReactNode } from "react";
interface WorkerRegistrationData {
  role: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  userName: string; 
  password:  string;
  workingZone:  string;
  bankaccount: string;
  IFSCcode: string;
  DOB: string;
  houseno:  string;
  street:  string;
  landmark:  string;
  city:  string;
  district:  string;
  state:  string; 
  country: string;
  pincode: string;
  image: File | null;
  governmentid: File | null;
}

interface WorkerRegistrationContextType {
  WorkerformData: WorkerRegistrationData;
  UpdateWorkerformdata: (data: Partial<WorkerRegistrationData>) => void;
  ResetWorkerformdata: () => void;
}

export const WorkerRegistrationContext = createContext<WorkerRegistrationContextType | undefined>(undefined);

export const WorkerRegistrationProvider = ({ children } : {children: ReactNode; }) => {
  const [WorkerformData, setWorkerformData] = useState<WorkerRegistrationData>({
    role: "worker",
    fullName: "",
    email: "",
    mobileNumber: "",
    userName: "",
    password: "",
    workingZone: "",
   bankaccount: "" ,
    IFSCcode:  "",
     DOB: "" ,
    houseno: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    image: null,
    governmentid: null,
  });

  const UpdateWorkerformdata = (data: Partial<WorkerRegistrationData>) => {
    setWorkerformData((prev) => ({ ...prev, ...data, })
  );
};


 const ResetWorkerformdata = () => {
    setWorkerformData({
      role: "",
   fullName: "",
    email: "",
    mobileNumber: "",
    userName: "",
    password: "",
    workingZone: "",
   bankaccount: "",
    IFSCcode: "",
     DOB: "",
     houseno: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    image: null,
    governmentid: null,
    })
  };

  return (
    <WorkerRegistrationContext.Provider
     value={{WorkerformData,
  UpdateWorkerformdata,
  ResetWorkerformdata,
 }}
    >
      {children}
    </WorkerRegistrationContext.Provider>
  )
}

export const useworkerRegistration = () => {
const context = useContext(WorkerRegistrationContext);
  if (!context) {
    throw new Error(
      "useworkerRegistration must be used inside WorkerRegistrationProvider"
    );
  }

  return context;
}


/*interface WorkerRegistrationData {
  role: string;
  fullName: string;
  email: string;
  mobilenumber: string;
  username: string; 
  password:  string;
  workingZone:  string;
  bankaccount: string;
  IFSCcode: string;
  DOB: string;
  addressType:  string;
  street:  string;
  landmark:  string;
  city:  string;
  district:  string;
  state:  string; 
  country: string;
  pincode: string;
  isDefault: string;
}

export const WorkerRegistrationContext = createContext ({
  Worker: [
    {  role: "",
    fullName: "",
    email: "",
    mobilenumber: "",
    username: "",
    password: "",
    workingZone: "",
   bankaccount: "" ,
    IFSCcode:  "",
     DOB: "" ,
     addressType: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    isDefault: ""}
  ],
  UpdateWorkerformdata: (data: Partial<WorkerRegistrationData>) => {},
   ResetWorkerformdata: () => {}
})

export const useworkerRegistration = () => {
  return useContext(WorkerRegistrationContext)
}

export  const WorkerRegistrationProvider = WorkerRegistrationContext.Provider*/