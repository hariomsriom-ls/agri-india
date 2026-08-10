import { ReactNode } from "react";
import { WorkerRegistrationProvider } from "@/contexts/registration/workerProvider";
import { AuthorityRegistrationProvider } from "@/contexts/registration/authorityProvider";

interface LayoutProps {
  children: ReactNode;
}

export default function Registration({children}: LayoutProps){
  return (
    <>
    <AuthorityRegistrationProvider>
    <WorkerRegistrationProvider>
        {children}
    </WorkerRegistrationProvider>
    </AuthorityRegistrationProvider>
     </>
  );
}