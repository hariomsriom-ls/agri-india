import UserNavbar from "@/components/navbar/UserNavbar";
import WorkersideBar from "@/components/sidebar/Workersidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps){
  return (
    <>
        
        <div className="grid h-screen grid-cols-[auto_1fr]">
       <aside className="h-dvh overflow-hidden ">
        <WorkersideBar />
      </aside>
        <main className=" bg-gray-200 overflow-y-auto ">
          <UserNavbar />
        {children}
        </main>
         </div>
        </>
  );
}