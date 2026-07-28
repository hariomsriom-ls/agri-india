import AuthoritySideBar from "@/components/sidebar/AuthoritySidebar";
import { ReactNode } from "react";
import UserNavbar from "@/components/navbar/UserNavbar"

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps){
  return (
    <>
        
       <div className="grid h-screen grid-cols-[auto_1fr]">
       <aside className="h-dvh overflow-hidden ">
        <AuthoritySideBar />
      </aside>
        <main className=" bg-gray-200 overflow-y-auto ">
          <UserNavbar />
        {children}
        </main>
         </div>
        </>
  );
}