import LandOwnerSideBar from "@/components/LandOwnerSidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps){
  return (
    <>
        
        <div className="flex w-full h-full">
       <aside className="w-2/9">
        <LandOwnerSideBar />
      </aside>
        <main className="flex-1  h-screen overscroll-none justify-start items-centeroverflow-y-auto">
        {children}
        </main>
         </div>
        </>
  );
}