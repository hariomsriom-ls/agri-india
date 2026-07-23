import UserNavbar from "@/components/UserNavbar";
import WorkersideBar from "@/components/Workersidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps){
  return (
    <>
        
        <div className="flex w-full h-full">
       <aside className="w-1/5">
        <WorkersideBar />
      </aside>
        <main className="flex-1  h-screen overscroll-none bg-gray-200 justify-start items-centeroverflow-y-auto">
          <UserNavbar />
        {children}
        </main>
         </div>
        </>
  );
}