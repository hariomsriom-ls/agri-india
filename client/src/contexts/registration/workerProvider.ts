"use client";

import { createContext, useContext, useState } from "react";

export const workerRegistrationContext = createContext({});

/*export const workerRegistrationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    workingZone: "",
   bankaccount: "",
    IFSCcode: "",
     DOB: "",
     addressType: "",
     street: "",
    landmark: "",
    city: "",
    district: "",
    state: "", 
    country: "",
    pincode: "", 
    isDefault: ""
  });

  return (
    <workerRegistrationContext.Provider value={{ formData, setFormData }}>
      {children}
    </workerRegistrationContext.Provider>
  );
};*/

export const workerRegistrationProvider = workerRegistrationContext.Provider

export const useworkerRegistration = () => useContext(workerRegistrationContext);