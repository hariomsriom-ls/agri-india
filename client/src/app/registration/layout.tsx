import { ReactNode } from "react";
import { WorkerRegistrationProvider } from "@/contexts/registration/workerProvider";
import { AuthorityRegistrationProvider } from "@/contexts/registration/authorityProvider";
import { LandownerRegistrationProvider } from "@/contexts/registration/landownerProvider";


interface LayoutProps {
  children: ReactNode;
}


export default function Registration({children}: LayoutProps){
  return (
    <>
    <AuthorityRegistrationProvider>
    <WorkerRegistrationProvider>
    <LandownerRegistrationProvider>
      <main className="overscroll-none bg-[url('/images/registration.png')] bg-cover bg-center">
            <div className="h-screen flex items-center justify-center ">
        {children}
       </div>
         </main>
    </LandownerRegistrationProvider>
    </WorkerRegistrationProvider>
    </AuthorityRegistrationProvider>
     </>
  );
}