import AuthoritySideBar from "@/components/AuthoritySidebar";
import { ReactNode } from "react";
import UserNavbar from "@/components/UserNavbar"

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps){
  return (
    <>
        
        <div className="flex w-full h-full overscroll-none">
       <aside className="w-11/50  h-dvh overflow-hidden">
        <AuthoritySideBar />
      </aside>
        <main className="flex-1  overscroll-none bg-gray-200 justify-start items-center overflow-hidden overflow-y-auto">
          <UserNavbar />
        {children}
        </main>
         </div>
        </>
  );
}