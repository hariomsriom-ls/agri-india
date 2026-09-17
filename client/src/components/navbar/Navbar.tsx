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
    { label: "Equipment Renting", href: "/servicespage/equipmentRenting" },
    { label: "Storage Products", href: "/servicespage/storageService" },
    { label: "Agricultural Product Selling", href: "/servicespage/AgricultureProductSelling" },
    { label: "Rent a Service", href: "/servicespage/serviceRenting" },
];

export function Navbar() {
    const [active, setActive] = useState("Home");
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
        <nav aria-label="Main navigation" className="relative z-50 border-y border-[#e5eeeb] bg-gradient-to-r from-white via-[#f8fcfd] to-[#e6f4ff] text-[#26352d] shadow-[0_2px_10px_rgba(29,70,45,0.04)]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 px-4 py-3 sm:px-6 lg:min-h-20 lg:flex-nowrap lg:gap-x-8 lg:px-8 lg:py-0">
                <Link href="/" aria-label="AgriEquip home" className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">
                    <svg aria-hidden="true" viewBox="0 0 40 52" className="h-11 w-9 sm:h-12 sm:w-10" fill="none">
                        <path d="M20 33C9 21 16 10 34 3C35 20 31 29 20 33Z" fill="#73ab41" />
                        <path d="M20 33C18 23 24 13 34 3C32 19 28 28 20 33Z" fill="#428838" />
                        <path d="M19 47C7 47 2 39 4 29C16 31 21 37 19 47Z" fill="#26743b" />
                        <path d="M19 47C19 34 28 28 37 28C36 42 29 49 19 47Z" fill="#1c6435" />
                        <path d="M19 47C18 36 22 25 28 15M19 46L10 36M20 45L30 35" stroke="#e5efd9" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <span className="flex flex-col">
                        <span className="text-[23px] leading-7 font-bold tracking-[-1px] text-[#111c16] sm:text-[26px]">Agri<span className="text-[#23773d]">India</span></span>
                        <span className="mt-0.5 text-[9px] leading-3 tracking-[-0.1px] text-[#6b746f] sm:text-[10px]">Tools for a Better Tomorrow.</span>
                    </span>
                </Link>
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
                        className="relative flex shrink-0 items-center justify-center self-stretch"
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
                            className={`relative flex items-center justify-center gap-1 rounded-sm px-1 py-4 text-[11px] font-medium whitespace-nowrap transition-colors hover:text-[#23773d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-2 sm:text-xs lg:py-7 ${active === "Services" ? "text-[#23773d] after:absolute after:inset-x-1 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[#4b8b5e] lg:after:bottom-4" : "text-[#34413a]"}`}
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

                <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:order-3">
                    <button onClick={() => router.push("/login")}
                    className="h-9 rounded-[5px] border border-[#55966a] bg-white/80 px-3 text-xs font-semibold text-[#267340] capitalize shadow-[0_0_0_1px_rgba(54,125,75,0.08)] transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:h-10 sm:px-6">
                        login
                    </button>
    
                    <button onClick={() => router.push("/registration")} 
                    className="h-9 rounded-[5px] border border-[#218244] bg-[#218244] px-3 text-xs font-semibold text-white capitalize shadow-sm transition-colors hover:border-[#196934] hover:bg-[#196934] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:h-10 sm:px-6">
                        sign up
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
