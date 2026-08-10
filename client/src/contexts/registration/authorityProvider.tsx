"use client";

import { createContext, useContext, useState, ReactNode } from "react";
interface AuthorityRegistrationData {
  role: string;
  fullName: string;
  email: string;
  mobilenumber: string;
  username: string; 
  password:  string;
  workingZone:  string;
  bankaccount: string;
  IFSCcode: string;
  houseno:  string;
  street:  string;
  landmark:  string;
  city:  string;
  district:  string;
  state:  string; 
  country: string;
  pincode: string;
  isDefault: string;
  authorityId: string;
  department: string;
}

interface AuthorityRegistrationContextType {
  AuthorityformData: AuthorityRegistrationData;
  UpdateAuthorityformdata: (data: Partial<AuthorityRegistrationData>) => void;
  ResetAuthorityformdata: () => void;
}

export const AuthorityRegistrationContext = createContext<AuthorityRegistrationContextType | undefined>(undefined);

export const AuthorityRegistrationProvider = ({ children } : {children: ReactNode; }) => {
  const [AuthorityformData, setAuthorityformData] = useState<AuthorityRegistrationData>({
    role: "",
    fullName: "",
    email: "",
    mobilenumber: "",
    username: "",
    password: "",
    workingZone: "",
   bankaccount: "" ,
    IFSCcode:  "",
    houseno: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    authorityId: "",
    isDefault: "",
    department: "",
  });

  const UpdateAuthorityformdata = (data: Partial<AuthorityRegistrationData>) => {
    setAuthorityformData((prev) => ({ ...prev, ...data, })
  );
};

 const ResetAuthorityformdata = () => {
    setAuthorityformData({
      role: "",
   fullName: "",
    email: "",
    mobilenumber: "",
    username: "",
    password: "",
    workingZone: "",
   bankaccount: "",
    IFSCcode: "",
     houseno: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    authorityId: "",
    isDefault: "",
    department: "",
    })
  };

  return (
    <AuthorityRegistrationContext.Provider
     value={{AuthorityformData,
  UpdateAuthorityformdata,
  ResetAuthorityformdata,
 }}
    >
      {children}
    </AuthorityRegistrationContext.Provider>
  )
}

export const useAuthorityRegistration = () => {
const context = useContext(AuthorityRegistrationContext);
  if (!context) {
    throw new Error(
      "useauthorityRegistration must be used inside WorkerRegistrationProvider"
    );
  }

  return context;
}