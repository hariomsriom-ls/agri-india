"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuCheck,
  LuCircleCheck,
  LuClock3,
  LuCylinder,
  LuDroplets,
  LuHandshake,
  LuHeadset,
  LuIndianRupee,
  LuLeaf,
  LuMapPin,
  LuSearch,
  LuSettings,
  LuShieldCheck,
  LuSprayCan,
  LuSprout,
  LuTractor,
  LuTruck,
  LuUserRound,
  LuUsersRound,
  LuWheat,
  LuX,
} from "react-icons/lu";

const services = [
  {
    id: "ploughing",
    title: "Ploughing & Tilling",
    description: "Prepare your land with modern tractors and implements.",
    image: "/images/equipment-rental/hero.webp",
    imageAlt: "Tractor pulling a tillage implement across a farm",
    imagePosition: "object-right",
    icon: LuTractor,
  },
  {
    id: "irrigation",
    title: "Irrigation Services",
    description: "Get efficient irrigation solutions (drip, sprinkler, etc.).",
    image: "/images/farm-services/irrigation.webp",
    imageAlt: "Irrigation watering agricultural crops",
    imagePosition: "object-center",
    icon: LuDroplets,
  },
  {
    id: "sowing",
    title: "Sowing & Planting",
    description: "Precision seeding for better yield and crop health.",
    image: "/images/equipment-rental/seed-drill.webp",
    imageAlt: "Tractor and seed drill preparing to sow a field",
    imagePosition: "object-center",
    icon: LuSprout,
  },
  {
    id: "harvesting",
    title: "Harvesting Services",
    description: "Timely and efficient harvesting with modern machinery.",
    image: "/images/image1.png",
    imageAlt: "Farm workers harvesting a crop with agricultural machinery",
    imagePosition: "object-center",
    icon: LuWheat,
  },
  {
    id: "spraying",
    title: "Fertilizer & Pesticide Spraying",
    description: "Protect your crops with professional spraying services.",
    image: "/images/farm-services/spraying.webp",
    imageAlt: "Farmer using a backpack sprayer in a crop field",
    imagePosition: "object-center",
    icon: LuSprayCan,
  },
  {
    id: "baling",
    title: "Baling & Crop Handling",
    description: "Save time and labor with modern handling equipment.",
    image: "/images/farm-services/baling.webp",
    imageAlt: "Tractor lifting a hay bale in a harvested field",
    imagePosition: "object-center",
    icon: LuCylinder,
  },
  {
    id: "transportation",
    title: "Transportation",
    description: "Move your produce safely from farm to market.",
    image: "/images/farm-services/transport.webp",
    imageAlt: "Tractor and trailer carrying crates of harvested pumpkins",
    imagePosition: "object-center",
    icon: LuTruck,
  },
  {
    id: "soil-testing",
    title: "Soil Testing & Advisory",
    description: "Know your soil, grow better with expert advice.",
    image: "/images/farm-services/soil.webp",
    imageAlt: "Hands checking soil to support healthy plant growth",
    imagePosition: "object-[50%_68%]",
    icon: LuSprout,
  },
] as const;

type FarmService = (typeof services)[number];

const highlights = [
  { title: "Verified Service Providers", icon: LuShieldCheck },
  { title: "Affordable Rates", icon: LuIndianRupee },
  { title: "On-Time Service", icon: LuClock3 },
  { title: "Support in Your Language", icon: LuHeadset },
];

const steps = [
  { title: "Choose a Service", description: "Browse and select the service you need.", icon: LuSearch },
  { title: "Set Your Location", description: "Enter your farm location and preferred date.", icon: LuMapPin },
  { title: "Confirm & Book", description: "Review details and confirm your booking.", icon: LuCalendarDays },
  { title: "Get It Done", description: "Our verified partner will complete the service at your farm.", icon: LuCircleCheck },
];

const benefits = [
  { title: "Trusted & Verified Operators", icon: LuShieldCheck },
  { title: "Quality Equipment & Modern Technology", icon: LuSettings },
  { title: "Fair & Transparent Pricing", icon: LuIndianRupee },
  { title: "Dedicated Farmer Support", icon: LuUserRound },
];

const impact = [
  { value: "10,000+", label: "Farmers Supported", icon: LuUsersRound },
  { value: "500+", label: "Service Providers", icon: LuTractor },
  { value: "20+", label: "Types of Services", icon: LuLeaf },
  { value: "Better Farms", label: "Brighter Tomorrow.", icon: LuHandshake },
];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287845]";
const primaryButton = `inline-flex min-h-12 items-center justify-center gap-4 rounded-md bg-linear-to-br from-[#287c46] to-[#155e36] px-8 py-3 text-sm font-semibold text-white transition-colors hover:from-[#1f6538] hover:to-[#0e4b2a] ${focusRing}`;
const outlineButton = `inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#3b7f53] bg-white/95 px-8 py-3 text-sm font-semibold text-[#285239] transition-colors hover:bg-[#edf6e8] ${focusRing}`;
const fieldClass = `min-h-12 w-full rounded-md border border-[#cfdccb] bg-white px-3 py-3 text-sm text-[#304d36] placeholder:text-[#8b9986] ${focusRing}`;

function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function validServiceDate(value: string, today: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < today) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
type Services = (typeof services)[number];
type PageDialog = { type: "services"; service: Services } | { type: "contact" };
export default function ServiceRentingPage() {
  const [selectedService, setSelectedService] = useState<FarmService | null>(null);
  const [farmLocation, setFarmLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");
  const [today] = useState(todayString);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bookingHeadingRef = useRef<HTMLHeadingElement>(null);
  const dialogOpen = selectedService !== null;
  const [activeDialog, setActiveDialog] = useState<PageDialog | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialogOpen || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogOpen]);

  useEffect(() => {
    if (reviewing) bookingHeadingRef.current?.focus();
  }, [reviewing]);

  function openBooking(service: FarmService) {
    setFarmLocation("");
    setPreferredDate("");
    setNotes("");
    setReviewing(false);
    setError("");
    setSelectedService(service);
  }

  function reviewRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (farmLocation.trim().length < 3) {
      setError("Enter your farm’s village, town or address.");
      return;
    }
    if (!validServiceDate(preferredDate, todayString())) {
      setError("Choose a valid service date on or after today.");
      return;
    }
    setError("");
    setReviewing(true);
    dialogRef.current?.scrollTo({ top: 0 });
  }

  return (
    <>
      <title>Farm Services on Your Terms | AgriSeva</title>
      <meta name="description" content="Explore farm services from ploughing and irrigation to harvesting, transportation and soil testing. Find support for every stage of your farming season." />

      <main className="overflow-x-clip bg-white font-sans text-[#15241f]">
        <section aria-labelledby="service-heading" className="relative isolate overflow-hidden bg-[#f3f4e8]">
          <Image src="/images/farm-services/hero.webp" alt="Farmer standing in an agricultural field" fill preload sizes="100vw" className="-z-20 object-cover object-[70%_25%] lg:object-[center_25%]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#fffdf3]/98 via-[#fffdf3]/85 to-[#fffdf3]/30 sm:via-[#fffdf3]/65 lg:from-[#fffdf3]/98 lg:via-[#fffdf3]/60 lg:to-transparent" />
          <div className="relative mx-auto max-w-[1440px] px-6 pb-7 pt-11 sm:px-10 lg:min-h-[365px] lg:px-11 lg:pt-12">
            <div className="max-w-[660px]">
              <h1 id="service-heading" className="text-[43px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#11211f] sm:text-[57px] lg:text-[64px]">
                Farm Services<br /><span className="text-[#145a32]">On Your Terms</span>
              </h1>
              <p className="mt-4 max-w-[610px] text-base leading-6 text-[#455448] lg:text-xl lg:leading-7">
                Get trusted machinery, equipment and expert support for all your farming needs. From ploughing to harvesting, we connect you with verified service providers in your area.
              </p>
              <div className="mt-5 flex flex-wrap gap-5">
                <a href="#farm-services" className={primaryButton}>Book a Service <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                <a href="#how-it-works" className={`${outlineButton} sm:min-w-52`}>How It Works</a>
              </div>
            </div>
            <p className="absolute right-12 top-10 hidden -rotate-7 font-serif text-3xl italic leading-[1.12] text-[#214f34] drop-shadow-[0_1px_3px_#ffffff] xl:block">
              Less Worry.<br />More Farming.<br /><span className="ml-6">Together.</span>
              <span aria-hidden="true" className="ml-12 mt-3 block h-0.5 w-24 bg-[#377d43]" />
            </p>
          </div>
          <div className="bg-linear-to-r from-[#f9fbea]/95 via-[#f9fbea]/85 to-transparent">
            <div className="mx-auto max-w-[1440px] px-6 py-5 sm:px-10 lg:px-11">
              <div className="grid max-w-[840px] gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                {highlights.map(({ title, icon: Icon }, index) => (
                  <div key={title} className={`flex items-center gap-3 ${index > 0 ? "lg:border-l lg:border-[#c3d5b5]/80 lg:pl-5" : ""}`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#246e42] text-[#e5f1cb]"><Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" /></span>
                    <p className="max-w-32 text-sm font-semibold leading-5">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="farm-services" aria-labelledby="services-heading" className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pb-8 pt-7 sm:px-10 lg:px-11">
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#47804d] sm:text-sm">Our Services</p>
          <h2 id="services-heading" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em] lg:text-[38px]">Complete Farm Support, All in One Place</h2>
          <p className="mt-2 max-w-[1110px] text-base leading-6 text-[#667265] lg:text-lg">Choose from a wide range of agricultural services on contract. Skilled operators, modern equipment and reliable service – so you can focus on what matters most, your harvest.</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.id} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#dde7dd] bg-white shadow-[0_2px_5px_#23412a06] transition-shadow hover:shadow-[0_6px_20px_#23412a16]">
                  <div className="relative h-44 xl:h-48">
                    <div className="absolute inset-0 overflow-hidden bg-[#e9eee2]">
                      <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className={`object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 ${service.imagePosition}`} />
                    </div>
                    <span className="absolute -bottom-6 left-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f3f9ec] text-[#2d7f43] shadow-sm"><Icon className="h-8 w-8" strokeWidth={1.9} aria-hidden="true" /></span>
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
                    <h3 className="text-lg font-bold leading-6 tracking-[-0.025em]">{service.title}</h3>
                    <p className="mb-4 mt-2 text-sm leading-5 text-[#697565]">{service.description}</p>
                    <button type="button" onClick={() => openBooking(service)} aria-label={`Book ${service.title}`} className={`mt-auto inline-flex min-h-10 w-full items-center justify-center rounded-sm border border-[#55976a] bg-[#fcfef9] px-4 py-2 text-sm font-semibold text-[#2f7143] transition-colors hover:bg-[#ebf5e6] ${focusRing}`}>Book Now</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="process-heading" className="scroll-mt-6 bg-linear-to-r from-[#f1f7ed] to-[#f6f9f2]">
          <div className="mx-auto grid max-w-[1440px] gap-7 px-6 py-7 sm:px-10 lg:grid-cols-[2.6fr_1fr] lg:gap-8 lg:px-11">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#518252] sm:text-sm">How It Works</p>
              <h2 id="process-heading" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em]">Get Farm Services in 4 Simple Steps</h2>
              <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
                {steps.map(({ title, description, icon: Icon }, index) => (
                  <li key={title} className="relative text-center">
                    <div className="relative z-10 mx-auto flex w-fit items-center gap-3 bg-[#f2f7ee]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#2f8245] to-[#146137] text-lg font-bold text-white">{index + 1}</span>
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfedd4] text-[#2c7a40]"><Icon className="h-9 w-9" strokeWidth={2} aria-hidden="true" /></span>
                    </div>
                    {index < steps.length - 1 && <div aria-hidden="true" className="absolute left-[calc(50%_+_65px)] right-[calc(-50%_+_65px)] top-8 hidden h-px bg-linear-to-r from-[#bfdcc1] to-[#559767] sm:block"><LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#5e9e70]" /></div>}
                    <h3 className="mt-3 text-sm font-bold leading-5 lg:text-base">{title}</h3>
                    <p className="mx-auto mt-1.5 max-w-44 text-sm leading-5 text-[#6b7965]">{description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <aside aria-label="Modern services for traditional strength" className="relative isolate flex min-h-[260px] items-center overflow-hidden rounded-xl bg-[#eeeede] p-7 lg:-my-4">
              <Image src="/images/farm-services/hero.webp" alt="Farmer in a green agricultural landscape" fill sizes="(max-width: 1023px) 100vw, 30vw" className="-z-20 object-cover object-right" />
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#f6f4e8]/98 via-[#f6f4e8]/85 to-[#f6f4e8]/10" />
              <div className="max-w-[215px]"><h3 className="text-2xl font-extrabold leading-[1.08] tracking-[-0.025em]">Modern<br />Services for<br />Traditional Strength</h3><span aria-hidden="true" className="my-5 block h-0.5 w-11 bg-[#49854b]" /><p className="max-w-44 text-sm leading-5 text-[#5f705a]">Empowering farmers with technology and trusted support.</p></div>
            </aside>
          </div>
        </section>

        <section aria-labelledby="benefits-heading" className="border-t-4 border-white bg-[#f1f7ee]">
          <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-10 lg:px-11">
            <h2 id="benefits-heading" className="text-xs font-semibold uppercase tracking-[0.11em] text-[#518253] sm:text-sm">Why Choose AgriSeva</h2>
            <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
              {benefits.map(({ title, icon: Icon }, index) => (
                <article key={title} className={`flex items-center gap-4 ${index > 0 ? "lg:border-l lg:border-[#d2e1cb] lg:pl-8" : ""} ${index < benefits.length - 1 ? "lg:pr-5" : ""}`}>
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#dcebcf] text-[#2e7541]"><Icon className="h-8 w-8" strokeWidth={2} aria-hidden="true" /></span>
                  <h3 className="max-w-48 text-sm font-semibold leading-5 lg:text-base">{title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="service-cta-heading" className="relative isolate overflow-hidden bg-[#164a2b] text-white">
          <Image src="/images/image3.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[center_65%]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#154c25]/95 via-[#154622]/90 to-[#104025]/90" />
          <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-6 py-9 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-11">
            <div>
              <h2 id="service-cta-heading" className="text-3xl font-bold leading-tight tracking-[-0.025em]">Let’s Build a Stronger Agriculture Together</h2>
              <p className="mt-2 max-w-[650px] text-base leading-6 text-[#e0e9d7]">Book farm services easily and get the support you need, when you need it.</p>
              <a href="#farm-services" className="mt-5 inline-flex min-h-12 items-center justify-center gap-5 rounded-md bg-[#f8fcf2] px-7 py-3 text-sm font-semibold text-[#2a663a] transition-colors hover:bg-[#e0eed3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Book a Service <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <dl className="grid grid-cols-2 gap-y-7 sm:grid-cols-4 sm:divide-x sm:divide-[#b7d4a8]/25">
              {impact.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center px-3 text-center">
                  <Icon className="mb-3 h-10 w-10 text-[#e8f1dc]" strokeWidth={1.8} aria-hidden="true" />
                  <dt className="order-2 mt-1 text-xs leading-5 text-[#e0ead4]">{label}</dt>
                  <dd className={`font-bold tracking-tight ${value === "Better Farms" ? "pt-1 text-base" : "text-2xl"}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
          <footer className="bg-[#15261e] text-[#b6c5bb]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-7 px-6 py-9 sm:px-10 lg:flex-row lg:gap-8 lg:px-16">
            <Link href="/" aria-label="AgriStore home" className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <LuSprout className="h-10 w-10 text-[#e6eee0]" strokeWidth={1.5} aria-hidden="true" />
              <span><span className="block text-xl font-semibold tracking-tight text-white">AgriStore</span><span className="mt-0.5 block text-xs">Your Land. Greater Value.</span></span>
            </Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-7 gap-y-4 text-xs">
              <Link href="/#about" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">About Us</Link>
              <a href="#storage-options" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Storage Services</a>
              <a href="#landowner-benefits" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">For Landowners</a>
              <button type="button" onClick={() => setActiveDialog({ type: "contact" })} className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Help</button>
              <button type="button" onClick={() => setActiveDialog({ type: "contact" })} className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Contact</button>
            </nav>
            <p className="flex items-center gap-4 text-xs leading-5 lg:border-l lg:border-white/20 lg:pl-7"><LuLeaf className="h-7 w-7 shrink-0 text-[#d6e4d0]" strokeWidth={1.5} aria-hidden="true" /><span>A stronger tomorrow,<br />starts with your land.</span></p>
          </div>
        </footer>
      </main>

      <dialog ref={dialogRef} aria-labelledby="booking-heading" onCancel={() => setSelectedService(null)} onClose={() => setSelectedService(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedService(null); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 font-sans text-[#263f2d] shadow-2xl backdrop:bg-[#102a1c]/65 backdrop:backdrop-blur-sm">
        {selectedService && (
          <div className="relative p-6 sm:p-8" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedService(null)} aria-label="Close booking dialog" className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe5d4] bg-white text-[#3b6340] hover:bg-[#eff6e8] ${focusRing}`}><LuX className="h-5 w-5" aria-hidden="true" /></button>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5f0da] text-[#34783f]"><selectedService.icon className="h-8 w-8" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#618456]">AgriSeva Farm Services</p>
            <h2 ref={bookingHeadingRef} id="booking-heading" tabIndex={-1} className="mt-2 text-2xl font-bold leading-tight tracking-tight focus:outline-none">{reviewing ? "Review Your Request" : selectedService.title}</h2>

            {reviewing ? (
              <div>
                <p className="mt-3 text-sm leading-6 text-[#6b7a62]">Check your details before connecting with a service provider.</p>
                <dl className="mt-6 space-y-5 rounded-xl bg-[#f1f7e9] p-5">
                  <div><dt className="text-xs font-medium text-[#75856a]">Service</dt><dd className="mt-1 text-base font-semibold">{selectedService.title}</dd></div>
                  <div><dt className="text-xs font-medium text-[#75856a]">Farm location</dt><dd className="mt-1 break-words text-sm leading-6">{farmLocation.trim()}</dd></div>
                  <div><dt className="text-xs font-medium text-[#75856a]">Preferred date</dt><dd className="mt-1 text-sm">{new Date(`${preferredDate}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                  {notes.trim() && <div><dt className="text-xs font-medium text-[#75856a]">Additional details</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{notes.trim()}</dd></div>}
                </dl>
                <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#697c5e]"><LuCheck className="mt-1 h-4 w-4 shrink-0 text-[#368247]" aria-hidden="true" />Log in to contact a provider. Availability, pricing and booking are confirmed with the provider.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => setReviewing(false)} className={`${outlineButton} px-5`}><LuArrowLeft className="h-4 w-4" aria-hidden="true" />Edit Details</button>
                  <Link href="/login" className={`${primaryButton} flex-1 px-5`}>Log In to Continue <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </div>
            ) : (
              <form onSubmit={reviewRequest} className="mt-3">
                <p className="text-sm leading-6 text-[#6b7b62]">Tell us where and when you need support.</p>
                <div className="mt-6 space-y-5">
                  <div><label htmlFor="farm-location" className="mb-2 block text-sm font-semibold">Farm location</label><input id="farm-location" type="text" autoComplete="street-address" required minLength={3} maxLength={250} value={farmLocation} onChange={(event) => { setFarmLocation(event.target.value); setError(""); }} placeholder="Village or town, district and state" className={fieldClass} /></div>
                  <div><label htmlFor="service-date" className="mb-2 block text-sm font-semibold">Preferred date</label><input id="service-date" type="date" required min={today} value={preferredDate} onChange={(event) => { setPreferredDate(event.target.value); setError(""); }} className={fieldClass} /></div>
                  <div><label htmlFor="service-notes" className="mb-2 block text-sm font-semibold">Additional details <span className="font-normal text-[#839077]">(optional)</span></label><textarea id="service-notes" rows={3} maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Crop, field size or anything the provider should know" className={`${fieldClass} resize-y leading-6`} /></div>
                </div>
                {error && <p role="alert" className="mt-4 text-sm text-[#a1402c]">{error}</p>}
                <button type="submit" className={`${primaryButton} mt-6 w-full`}>Review Request <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                <p className="mt-3 text-center text-xs leading-5 text-[#7e8b71]">Reviewing your details does not confirm a booking.</p>
              </form>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
