import Image from "next/image";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <>
     <Navbar />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-5xl font-bold">
          Home Page
        </h1>
        </div>
    </>
  );
}
