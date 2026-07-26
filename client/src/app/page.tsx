import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import Herosection from "@/components/Herosection"


export default function Home() {
  return (
    <>
    <header>
     <Navbar />
    </header>
    <main>
     <Herosection />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-5xl font-bold">
          Home Page
        </h1>
        </div>
      </main>
    <footer>
      
    </footer>
    </>
  );
}
