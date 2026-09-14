"use client";
import { useEffect, useRef, useState } from "react";
import {Menu, MenuItem} from "../ui/navbar-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";

const services = [
    { label: "Agricultural Loans", href: "/servicespage/agriculturalLoan" },
    { label: "Land Leasing", href: "/servicespage/landLeasing" },
    { label: "Warehouse Business", href: "/servicespage/warehouseStorage" },
    { label: "Equipment Renting", href: "/services/equipmentRenting" },
    { label: "Storage Products", href: "/services/storageServices" },
    { label: "Agricultural Product Selling", href: "/services/agriculturalProductSelling" },
    { label: "Rent a Service", href: "/services/servicesRenting" },
];

export function Navbar() {
    const [active, setActive] = useState("");
    const [servicesOpen, setServicesOpen] = useState(false);
    const servicesRef = useRef<HTMLDivElement>(null);
    const servicesButtonRef = useRef<HTMLButtonElement>(null);
    const router= useRouter();

    useEffect(() => {
        if (!servicesOpen) return;

        const handleOutsideClick = (event: PointerEvent) => {
            if (event.target instanceof Node && !servicesRef.current?.contains(event.target)) {
                setServicesOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        return () => document.removeEventListener("pointerdown", handleOutsideClick);
    }, [servicesOpen]);

    return(
        <nav className = "relative z-50 bg-gray-100">
            <div className = "max-w-7xl mx-auto flex rounded-lg justify-between bg-white">
                <div className="flex-1 flex items-center justify-center bg-gray-150 hover:bg-black hover:text-white rounded-md">
                    Myapp</div>
                <Menu>
                    <MenuItem
                    item ="Home"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="About Us"
                    active={active}
                    setActive={setActive}/>

                    <div
                        ref={servicesRef}
                        className="relative flex w-full items-center justify-center"
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                setServicesOpen(false);
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Escape" && servicesOpen) {
                                event.preventDefault();
                                setServicesOpen(false);
                                servicesButtonRef.current?.focus();
                            }
                        }}
                    >
                        <button
                            ref={servicesButtonRef}
                            id="services-button"
                            type="button"
                            aria-expanded={servicesOpen}
                            aria-controls="services-list"
                            onClick={() => {
                                setServicesOpen((open) => !open);
                                setActive("Services");
                            }}
                            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-1 text-black transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${servicesOpen ? "bg-green-50 text-green-700" : ""}`}
                        >
                            Services
                            <LuChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                        </button>

                        <ul
                            id="services-list"
                            aria-labelledby="services-button"
                            hidden={!servicesOpen}
                            className="absolute left-1/2 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 text-gray-700 shadow-xl"
                        >
                            {services.map((service) => (
                                <li key={service.href}>
                                    <Link
                                        href={service.href}
                                        prefetch={false}
                                        onClick={() => setServicesOpen(false)}
                                        className="flex items-start gap-3 px-5 py-3 text-sm leading-5 transition-colors hover:bg-green-50 hover:text-green-700 focus-visible:bg-green-50 focus-visible:text-green-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-600"
                                    >
                                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                     <MenuItem
                    item ="Contact"
                    active={active}
                    setActive={setActive}/>

                     <MenuItem
                    item ="apply"
                    active={active}
                    setActive={setActive}/>
                </Menu>

                <div className ="flex-2 flex justify-center py-2 gap-8">
                    <button onClick={() => router.push("/login")}
                    className=" rounded-lg px-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        login
                    </button>
    
                    <button onClick={() => router.push("/registration")} 
                    className=" rounded-lg px-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        sign up
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
