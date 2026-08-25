"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface LandownerRegistrationData {
  role: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  userName: string;
  password: string;
}

interface LandownerRegistrationContextType {
  LandownerformData: LandownerRegistrationData;
  UpdateLandownerformdata: (data: Partial<LandownerRegistrationData>) => void;
  ResetLandownerformdata: () => void;
}

export const LandownerRegistrationContext = createContext<LandownerRegistrationContextType | undefined>(undefined);

export const LandownerRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [LandownerformData, setLandownerformData] = useState<LandownerRegistrationData>({
    role: "landowner",
    fullName: "",
    email: "",
    mobileNumber: "",
    userName: "",
    password: "",
  });

  const UpdateLandownerformdata = (data: Partial<LandownerRegistrationData>) => {
    setLandownerformData((prev) => ({ ...prev, ...data }));
  };

  const ResetLandownerformdata = () => {
    setLandownerformData({
      role: "landowner",
      fullName: "",
      email: "",
      mobileNumber: "",
      userName: "",
      password: "",
    });
  };

  return (
    <LandownerRegistrationContext.Provider
      value={{
        LandownerformData,
        UpdateLandownerformdata,
        ResetLandownerformdata,
      }}
    >
      {children}
    </LandownerRegistrationContext.Provider>
  );
};

export const useLandownerRegistration = () => {
  const context = useContext(LandownerRegistrationContext);
  if (!context) {
    throw new Error("useLandownerRegistration must be used inside LandownerRegistrationProvider");
  }
  return context;
};
