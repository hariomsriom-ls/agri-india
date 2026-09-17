"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  LuArrowRight,
  LuBoxes,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuCheck,
  LuChevronDown,
  LuClipboardList,
  LuCoins,
  LuCombine,
  LuFuel,
  LuGauge,
  LuHeadset,
  LuHeart,
  LuLeaf,
  LuMapPin,
  LuRows3,
  LuRuler,
  LuSearch,
  LuSettings,
  LuSettings2,
  LuShieldCheck,
  LuShovel,
  LuSprout,
  LuTractor,
  LuTruck,
  LuWaves,
  LuWheat,
  LuWrench,
  LuX,
} from "react-icons/lu";
import Dropdown from "@/components/ui/Dropdown";

const categories = [
  { label: "All", icon: null },
  { label: "Tractors", icon: LuTractor },
  { label: "Tillage & Land Prep", icon: LuShovel },
  { label: "Planting & Seeding", icon: LuSprout },
  { label: "Irrigation", icon: LuWaves },
  { label: "Crop Care", icon: LuLeaf },
  { label: "Harvesting", icon: LuCombine },
  { label: "Post-Harvest", icon: LuBoxes },
  { label: "Transport", icon: LuTruck },
] as const;

type Category = (typeof categories)[number]["label"];
type RentalDates = { start: string; end: string };
type Equipment = {
  id: string;
  name: string;
  category: Category;
  subtitle: string;
  location: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  price: number;
  description: string;
  features: string[];
  specs: { value: string; label: string; icon: IconType }[];
};

// Illustrative rental listings from the reference; connect to live inventory before taking bookings.
const equipment: Equipment[] = [
  {
    id: "john-deere-5310",
    name: "John Deere 5310",
    category: "Tractors",
    subtitle: "Tractor (50 HP)",
    location: "Mohali, Punjab",
    image: "/images/equipment-rental/tractor.webp",
    imageAlt: "Green John Deere tractor ready for agricultural work",
    imagePosition: "object-center",
    price: 1200,
    description: "A versatile tractor for everyday farm work, from land preparation and cultivation to pulling compatible agricultural implements.",
    features: ["Suitable for field preparation", "Compatible with farm implements", "Pickup and delivery options"],
    specs: [
      { value: "50 HP", label: "Power", icon: LuGauge },
      { value: "Diesel", label: "Fuel Type", icon: LuFuel },
      { value: "4WD", label: "Drive", icon: LuSettings2 },
    ],
  },
  {
    id: "mahindra-rotavator",
    name: "Mahindra Rotavator",
    category: "Tillage & Land Prep",
    subtitle: "Tillage Equipment",
    location: "Kharar, Punjab",
    image: "/images/equipment-rental/rotavator.webp",
    imageAlt: "Red Mahindra rotary tiller for preparing agricultural soil",
    imagePosition: "object-center",
    price: 800,
    description: "Prepare a fine seedbed with a tractor-mounted rotary tiller designed to break up soil and incorporate crop residue before planting.",
    features: ["Seedbed preparation", "Tractor-mounted operation", "Crop residue incorporation"],
    specs: [
      { value: "6 ft", label: "Working Width", icon: LuRuler },
      { value: "35–50 HP", label: "Compatible", icon: LuTractor },
      { value: "High", label: "Efficiency", icon: LuChartNoAxesColumnIncreasing },
    ],
  },
  {
    id: "seed-drill",
    name: "Seed Drill",
    category: "Planting & Seeding",
    subtitle: "Planting & Seeding",
    location: "Chandigarh",
    image: "/images/equipment-rental/seed-drill.webp",
    imageAlt: "Agricultural seed drill with multiple planting rows",
    imagePosition: "object-center",
    price: 1000,
    description: "Plant rows efficiently with a tractor-mounted seed drill that helps achieve even seed placement across your prepared field.",
    features: ["Consistent row spacing", "Tractor-mounted operation", "Efficient field coverage"],
    specs: [
      { value: "8 Rows", label: "Capacity", icon: LuRows3 },
      { value: "Tractor", label: "Mounted", icon: LuTractor },
      { value: "Uniform", label: "Seed Placement", icon: LuSprout },
    ],
  },
  {
    id: "claas-harvester",
    name: "CLAAS Harvester",
    category: "Harvesting",
    subtitle: "Combine Harvester",
    location: "Kurali, Punjab",
    image: "/images/equipment-rental/harvester.webp",
    imageAlt: "CLAAS combine harvester working in a field",
    imagePosition: "object-center",
    price: 3500,
    description: "Bring cutting, threshing and grain collection together with a combine harvester suited to larger harvesting operations.",
    features: ["Combined harvesting operations", "Grain collection system", "Suitable for larger fields"],
    specs: [
      { value: "180 HP", label: "Power", icon: LuGauge },
      { value: "Grain &", label: "Paddy", icon: LuWheat },
      { value: "High", label: "Efficiency", icon: LuChartNoAxesColumnIncreasing },
    ],
  },
];

const highlights = [
  { title: "Affordable Rental Plans", icon: LuClipboardList },
  { title: "Well-Maintained & Reliable", icon: LuShieldCheck },
  { title: "Wide Range of Equipment", icon: LuTractor },
  { title: "On-Ground Support", icon: LuHeadset },
];

const processSteps = [
  { title: "Browse", description: "Explore available equipment near you.", icon: LuSearch },
  { title: "Book", description: "Select dates and confirm your booking.", icon: LuCalendarDays },
  { title: "Get Delivered or Pick Up", description: "Receive the equipment at your location or pick it up from our partner.", icon: LuTruck },
  { title: "Use & Grow", description: "Use the equipment and increase your productivity.", icon: LuChartNoAxesColumnIncreasing },
];

const benefits = [
  { title: "Lower Cost", description: "Save money with flexible rental plans.", icon: LuCoins },
  { title: "No Maintenance Hassle", description: "We ensure all equipment is well-maintained.", icon: LuWrench },
  { title: "Access Latest Technology", description: "Use modern, high-performance equipment.", icon: LuSettings },
  { title: "Farm Smarter", description: "Improve productivity and profits.", icon: LuLeaf },
];

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];
const emptyDates: RentalDates = { start: "", end: "" };
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#28744a]";
const primaryButton = `inline-flex min-h-11 items-center justify-center gap-4 rounded-md bg-linear-to-br from-[#277c47] to-[#145d36] px-7 py-3 text-sm font-semibold text-white transition-colors hover:from-[#1d6438] hover:to-[#0e4b2b] ${focusRing}`;
const outlineButton = `inline-flex min-h-11 items-center justify-center gap-3 rounded-md border border-[#40825a] bg-white/85 px-7 py-3 text-sm font-semibold text-[#244d35] transition-colors hover:bg-[#eaf4e7] ${focusRing}`;

function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dateTimestamp(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null;
}

function validateDates(dates: RentalDates, today: string, required = false) {
  if (!required && !dates.start && !dates.end) return "";
  if (!dates.start || !dates.end) return "Select both a start date and an end date.";
  if (dateTimestamp(dates.start) === null || dateTimestamp(dates.end) === null) return "Enter valid rental dates.";
  if (dates.start < today) return "Your rental cannot start in the past.";
  if (dates.end < dates.start) return "The end date must be on or after the start date.";
  return "";
}

function rentalDayCount(dates: RentalDates) {
  const start = dateTimestamp(dates.start);
  const end = dateTimestamp(dates.end);
  if (start === null || end === null || end < start) return 0;
  return Math.round((end - start) / 86_400_000) + 1;
}

function shortDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function rupees(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

type EquipmentDialog = { type: "details" | "rent"; item: Equipment } | { type: "contact" };

export default function EquipmentRentingPage() {
  const router = useRouter();
  const [today] = useState(localToday);
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<RentalDates>(emptyDates);
  const [appliedSearch, setAppliedSearch] = useState({ query: "", location: "", dates: emptyDates });
  const [datesOpen, setDatesOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [sort, setSort] = useState("popular");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [activeDialog, setActiveDialog] = useState<EquipmentDialog | null>(null);
  const [rentalDates, setRentalDates] = useState<RentalDates>(emptyDates);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [rentalError, setRentalError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogOpen = activeDialog !== null;

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

  const searchTerms = appliedSearch.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visibleEquipment = equipment.filter((item) => {
    const searchable = [item.name, item.category, item.subtitle, ...item.features, ...item.specs.map((spec) => spec.value)].join(" ").toLowerCase();
    return (category === "All" || category === item.category)
      && searchTerms.every((term) => searchable.includes(term))
      && item.location.toLowerCase().includes(appliedSearch.location.trim().toLowerCase());
  }).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : 0);
  const searchDays = rentalDayCount(appliedSearch.dates);
  const rentalDays = rentalDayCount(rentalDates);
  const hasSearch = category !== "All" || appliedSearch.query || appliedSearch.location || searchDays > 0;

  function searchEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateDates(dates, localToday());
    setSearchError(error);
    if (error) { setDatesOpen(true); return; }
    setAppliedSearch({ query, location, dates: { ...dates } });
    setDatesOpen(false);
  }

  function clearSearch() {
    setCategory("All");
    setQuery("");
    setLocation("");
    setDates(emptyDates);
    setAppliedSearch({ query: "", location: "", dates: emptyDates });
    setSearchError("");
    setDatesOpen(false);
  }

  function toggleFavorite(item: Equipment) {
    const saved = favorites.includes(item.id);
    setFavorites((current) => saved ? current.filter((id) => id !== item.id) : [...current, item.id]);
    setFavoriteMessage(`${item.name} ${saved ? "removed from" : "added to"} favorites.`);
  }

  function openRental(item: Equipment) {
    setRentalDates({ ...appliedSearch.dates });
    setDeliveryMethod("pickup");
    setRentalError("");
    setActiveDialog({ type: "rent", item });
  }

  function continueRental(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateDates(rentalDates, localToday(), true);
    setRentalError(error);
    if (!error) router.push("/login");
  }

  return (
    <>
      <title>Agricultural Equipment Rental | AgriIndia</title>
      <meta name="description" content="Explore tractors, tillage equipment, seed drills and harvesters for rent. Find the right machinery for your farm and estimate your rental costs." />
      <main className="overflow-x-clip bg-white font-sans text-[#14201e]">
        <section aria-labelledby="equipment-heading" className="relative isolate overflow-hidden bg-[#f2f4e8]">
          <Image src="/images/equipment-rental/hero.webp" alt="Modern green tractor in a sunlit agricultural field" fill preload sizes="100vw" className="-z-20 object-cover object-[70%_center] lg:object-center" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#fffdf5]/98 via-[#fffdf5]/90 to-[#fffdf5]/35 sm:via-[#fffdf5]/65 lg:from-[#fffdf5]/98 lg:via-[#fffdf5]/70 lg:to-transparent" />
          <div className="relative mx-auto max-w-[1440px] px-6 pb-9 pt-12 sm:px-10 lg:min-h-[390px] lg:px-12 lg:pb-8 lg:pt-14">
            <div className="max-w-[745px]">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#286c41] sm:text-sm">Agricultural Equipment Rental</p>
              <h1 id="equipment-heading" className="mt-3 text-[43px] font-extrabold leading-[1.03] tracking-[-0.035em] text-[#101b22] sm:text-[58px] lg:text-[64px]">Right Equipment.<br /><span className="text-[#185233]">Higher Yields.</span></h1>
              <p className="mt-4 max-w-[680px] text-base leading-6 text-[#4e5751] lg:text-lg lg:leading-7">Access modern agricultural machinery without the high cost of ownership. Our equipment rental services help landowners increase productivity, reduce labor and make farming more efficient.</p>
              <div className="mt-5 flex flex-wrap gap-4"><a href="#explore-equipment" className={primaryButton}>Browse Equipments <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a><a href="#how-it-works" className={`${outlineButton} sm:min-w-52`}>How It Works</a></div>
            </div>
            <p className="absolute right-12 top-10 hidden -rotate-8 font-serif text-2xl italic leading-[1.1] text-[#234f35] xl:block">Modern<br />Farming<br />Accessible<br />to Everyone</p>
          </div>
          <div className="bg-linear-to-r from-[#fffef3]/95 via-[#fffef3]/90 to-transparent">
            <div className="mx-auto max-w-[1440px] px-6 py-5 sm:px-10 lg:px-12 lg:py-6">
              <div className="grid max-w-[940px] gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {highlights.map(({ title, icon: Icon }) => <div key={title} className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#247449] text-[#edf5d8]"><Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" /></span><p className="max-w-36 text-sm font-semibold leading-5">{title}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Find rental equipment" className="border-y border-[#edf1e9] bg-[#f6f9f4]">
          <form onSubmit={searchEquipment} className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10 lg:px-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2.2fr_1.15fr_0.95fr_0.55fr]">
              <div className="flex h-14 items-center gap-3 rounded-md border border-[#dbe3df] bg-white px-4 focus-within:border-[#438158] focus-within:ring-2 focus-within:ring-[#438158]/10"><LuSearch className="h-5 w-5 shrink-0 text-[#53645b]" aria-hidden="true" /><label htmlFor="equipment-search" className="sr-only">Search equipment</label><input id="equipment-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search equipment (e.g. tractor, harvester, planter...)" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8b9690]" /></div>
              <div className="flex h-14 items-center gap-3 rounded-md border border-[#dbe3df] bg-white px-4 focus-within:border-[#438158] focus-within:ring-2 focus-within:ring-[#438158]/10"><LuMapPin className="h-5 w-5 shrink-0 text-[#53645b]" aria-hidden="true" /><label htmlFor="equipment-location" className="sr-only">Your location</label><input id="equipment-location" type="search" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Enter your location" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8b9690]" /></div>
              <button type="button" aria-expanded={datesOpen} aria-controls="equipment-dates" onClick={() => setDatesOpen((open) => !open)} className={`flex min-h-14 items-center gap-3 rounded-md border border-[#dbe3df] bg-white px-4 text-left text-sm ${focusRing}`}><LuCalendarDays className="h-5 w-5 shrink-0 text-[#53645b]" aria-hidden="true" /><span className={dates.start ? "text-[#31513a]" : "text-[#8b9690]"}>{dates.start ? `${shortDate(dates.start)}${dates.end ? ` – ${shortDate(dates.end)}` : ""}` : "Select dates"}</span><LuChevronDown className="ml-auto h-4 w-4 shrink-0 text-[#748376]" aria-hidden="true" /></button>
              <button type="submit" className={`${primaryButton} min-h-14`}>Search</button>
            </div>
            <div id="equipment-dates" hidden={!datesOpen} className="mt-4 rounded-lg border border-[#dce6d7] bg-white p-5">
              <p className="text-sm font-semibold text-[#365b3e]">Choose your rental dates</p>
              <div className="mt-3 flex flex-wrap items-end gap-4">
                <label className="flex min-w-48 flex-1 flex-col gap-2 text-sm text-[#5c6f58]">Start date<input type="date" min={today} value={dates.start} onChange={(event) => { setDates((current) => ({ ...current, start: event.target.value })); setSearchError(""); }} className={`min-h-11 rounded-md border border-[#d4dfce] bg-white px-3 text-[#304d35] ${focusRing}`} /></label>
                <label className="flex min-w-48 flex-1 flex-col gap-2 text-sm text-[#5c6f58]">End date<input type="date" min={dates.start || today} value={dates.end} onChange={(event) => { setDates((current) => ({ ...current, end: event.target.value })); setSearchError(""); }} className={`min-h-11 rounded-md border border-[#d4dfce] bg-white px-3 text-[#304d35] ${focusRing}`} /></label>
                <button type="button" onClick={() => { setDates(emptyDates); setSearchError(""); }} className={`min-h-11 px-3 text-sm font-semibold text-[#2d7245] underline underline-offset-4 ${focusRing}`}>Clear dates</button>
              </div>
              <p className="mt-3 text-xs text-[#718068]">Dates are used to estimate your rental cost. Availability is confirmed by the owner.</p>
            </div>
            {searchError && <p role="alert" className="mt-3 text-sm text-[#a13e2e]">{searchError}</p>}
          </form>
        </section>

        <section id="explore-equipment" aria-labelledby="explore-heading" className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pb-8 pt-8 sm:px-10 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#337b4c] sm:text-sm">Explore Equipments</p><h2 id="explore-heading" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em] lg:text-[38px]">Equipments for Every Stage of Farming</h2><p className="mt-2 text-base leading-6 text-[#6a756e]">From land preparation to harvesting, find the right equipment for your agricultural needs.</p></div>
            <div className="w-60 shrink-0 [&>div]:flex-row [&>div]:items-center [&>div]:gap-3 [&_label]:shrink-0 [&_label]:border-0 [&_label]:p-0 [&_label]:text-xs [&_label]:font-normal [&_label]:text-[#6a756e]"><Dropdown label="Sort by" name="equipment-sort" value={sort} onChange={(event) => setSort(event.target.value)} options={sortOptions} className="h-10 rounded-md border-[#dce4df] py-2 pl-3 pr-5 text-xs focus:border-[#438158] focus:ring-[#438158]/15" /></div>
          </div>

          <div role="group" aria-label="Equipment categories" className="mb-6 mt-6 flex flex-wrap gap-2.5">
            {categories.map(({ label, icon: Icon }) => <button key={label} type="button" aria-pressed={category === label} onClick={() => setCategory(label)} className={`inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors xl:px-5 xl:text-sm ${focusRing} ${category === label ? "rounded-md bg-[#247445] text-white" : "rounded-full border border-[#edf0ec] bg-[#f4f6f4] text-[#48554d] hover:bg-[#e5eee3]"}`}>{Icon && <Icon className="h-4 w-4" aria-hidden="true" />}{label}</button>)}
          </div>
          {hasSearch && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#65725e]"><p>{visibleEquipment.length} equipment {visibleEquipment.length === 1 ? "option" : "options"}{appliedSearch.location && ` in ${appliedSearch.location}`}{searchDays > 0 && ` · ${searchDays}-day rental estimate`}</p><button type="button" onClick={clearSearch} className={`font-semibold text-[#2a7241] underline underline-offset-4 ${focusRing}`}>Clear search</button></div>}
          <p role="status" className="sr-only">{visibleEquipment.length} equipment options found. {favoriteMessage}</p>

          {visibleEquipment.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleEquipment.map((item) => <article key={item.id} className="flex min-w-0 flex-col overflow-hidden rounded-md border border-[#dde5de] bg-white shadow-[0_2px_6px_#1d3e2605] transition-shadow hover:shadow-[0_6px_20px_#1d3e2618]">
              <div className="relative h-56 overflow-hidden bg-[#eff3e9] lg:h-48 xl:h-56"><Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className={`object-cover ${item.imagePosition}`} /><span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-[#277444] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#c9df66]" aria-hidden="true" />Available</span><button type="button" aria-label={`${favorites.includes(item.id) ? "Remove" : "Save"} ${item.name} ${favorites.includes(item.id) ? "from" : "to"} favorites`} aria-pressed={favorites.includes(item.id)} onClick={() => toggleFavorite(item)} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-white/95 shadow-sm transition-colors hover:bg-[#eaf3e5] ${focusRing} ${favorites.includes(item.id) ? "text-[#277444]" : "text-[#657367]"}`}><LuHeart className={`h-5 w-5 ${favorites.includes(item.id) ? "fill-[#277444]" : ""}`} aria-hidden="true" /></button></div>
              <div className="flex flex-1 flex-col p-4"><h3 className="text-lg font-bold tracking-[-0.025em]">{item.name}</h3><p className="mt-1 text-sm text-[#69736c]">{item.subtitle}</p>
                <dl className="mb-6 mt-5 grid grid-cols-3 gap-2">{item.specs.map(({ value, label, icon: Icon }) => <div key={label} className="flex items-start gap-1.5"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#405047]" strokeWidth={1.8} aria-hidden="true" /><div className="flex min-w-0 flex-col"><dt className="order-2 mt-1 text-xs leading-4 text-[#778075]">{label}</dt><dd className="text-xs font-semibold leading-4 text-[#344c3b]">{value}</dd></div></div>)}</dl>
                <div className="mt-auto"><p className="text-sm text-[#25362a]"><span className="text-2xl font-bold tracking-tight text-[#17221d]">{rupees(item.price)}</span> / day</p>{searchDays > 0 && <p className="mt-1 text-xs text-[#5d7654]">{rupees(item.price * searchDays)} estimated for {searchDays} {searchDays === 1 ? "day" : "days"}</p>}<div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => openRental(item)} aria-label={`Rent ${item.name}`} className={`${primaryButton} px-3 py-2.5 text-xs`}>Rent Now</button><button type="button" onClick={() => setActiveDialog({ type: "details", item })} aria-label={`View details for ${item.name}`} className={`${outlineButton} px-3 py-2.5 text-xs`}>View Details</button></div></div>
              </div>
            </article>)}
          </div> : <div className="rounded-lg border border-dashed border-[#cbdcc4] bg-[#f6faf3] px-6 py-14 text-center"><LuTractor className="mx-auto h-12 w-12 text-[#6c9567]" aria-hidden="true" /><h3 className="mt-4 text-xl font-bold">No equipment found</h3><p className="mt-2 text-base text-[#697863]">Try a different category, location or equipment name.</p><button type="button" onClick={clearSearch} className={`${primaryButton} mt-5`}>Show All Equipment <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>}
        </section>

        <section id="how-it-works" aria-labelledby="process-heading" className="scroll-mt-6 bg-[#f3f7ef]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[0.95fr_2.8fr] lg:gap-12 lg:px-12">
            <div><p className="text-sm font-medium text-[#485845]">How It Works</p><h2 id="process-heading" className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-[-0.025em]">A Simple Process<br />to Get Started</h2><p className="mt-3 max-w-sm text-base leading-6 text-[#6e7968]">Renting agricultural equipment has never been easier.</p></div>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:gap-x-8">{processSteps.map(({ title, description, icon: Icon }, index) => <li key={title} className="relative text-center"><span className="relative z-10 mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#dcedd0] text-[#287440]"><Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" /></span>{index < processSteps.length - 1 && <div aria-hidden="true" className="absolute left-[calc(50%_+_50px)] right-[calc(-50%_+_50px)] top-[34px] hidden h-px bg-linear-to-r from-[#d6e6d1] to-[#488c5a] sm:block"><LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#337d4a]" /></div>}<h3 className="mx-auto mt-3 max-w-40 text-base font-bold leading-5">{index + 1}. {title}</h3><p className="mx-auto mt-2 max-w-40 text-sm leading-5 text-[#687763]">{description}</p></li>)}</ol>
          </div>
        </section>

        <section aria-labelledby="equipment-cta-heading" className="relative isolate overflow-hidden bg-[#e9edcb]">
          <Image src="/images/image1.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[center_20%]" /><div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#e8efd0]/95 via-[#edf2dc]/90 to-[#e8efd0]/55" />
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-9 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:px-12"><div className="flex items-center gap-5"><LuSprout className="hidden h-20 w-16 shrink-0 text-[#2d763c] sm:block" strokeWidth={1.4} aria-hidden="true" /><div><h2 id="equipment-cta-heading" className="text-3xl font-extrabold tracking-[-0.025em]">Modern Equipment. Stronger Harvests.</h2><p className="mt-2 text-base leading-6 text-[#455941]">Empowering landowners with the tools they need for a more productive future.</p></div></div><a href="#explore-equipment" className={`${primaryButton} shrink-0 lg:mr-24`}>Explore Equipments <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a></div>
        </section>

        <section aria-labelledby="rental-benefits-heading" className="mx-auto max-w-[1440px] px-6 pb-11 pt-7 sm:px-10 lg:px-12"><h2 id="rental-benefits-heading" className="text-2xl font-extrabold tracking-tight">Why Rent Instead of Buy?</h2><div className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(({ title, description, icon: Icon }) => <article key={title} className="flex items-start gap-5"><span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#e1eed8] text-[#296b3c]"><Icon className="h-9 w-9" strokeWidth={2} aria-hidden="true" /></span><div className="pt-2"><h3 className="text-base font-bold leading-5">{title}</h3><p className="mt-1.5 max-w-48 text-sm leading-5 text-[#6e7869]">{description}</p></div></article>)}</div></section>

        <footer className="bg-linear-to-br from-[#174a2e] to-[#0c3824] text-[#d5e4d5]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-7 px-6 pb-7 pt-5 sm:px-10 lg:flex-row lg:gap-6 lg:px-12">
            <Link href="/" aria-label="AgriEquip home" className={`flex shrink-0 items-center gap-2.5 rounded-sm ${focusRing}`}>
            <LuSprout className="h-12 w-10 text-[#2b773e]" strokeWidth={1.8} aria-hidden="true" />
            <span>
              <span className="block text-2xl font-bold tracking-tight">AgriIndia</span>
              <span className="mt-0.5 block text-xs text-white">Tools for a Better Tomorrow.</span>
              </span>
            </Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs text-[#606d62]">
              <Link href="/#about" className={`text-sm font-semibold text-white hover:text-[#277443] ${focusRing}`}>About Us</Link>
              <Link href="/servicespage/warehouseStorage" className={`text-sm font-semibold text-white hover:text-[#277443] ${focusRing}`}>For Landowners</Link>
              <a href="#explore-equipment" className={`text-sm font-semibold text-white hover:text-[#277443] ${focusRing}`}>Equipments</a>
              <a href="#how-it-works" className={`text-sm font-semibold text-white hover:text-[#277443] ${focusRing}`}>How It Works</a>
              <button type="button" onClick={() => setActiveDialog({ type: "contact" })} 
              className={`text-sm font-semibold text-white  hover:text-[#277443] ${focusRing}`}>Contact</button>
              </nav>
              <div className="flex shrink-0 items-center gap-6">
                <div aria-hidden="true" className="flex items-center gap-4 text-[#424e50]">
                  <FaLinkedin className="h-4 w-4 text-white" />
                  <FaTwitter className="h-4 w-4 text-white" />
                  <FaFacebookF className="h-4 w-4 text-white" />
                  <FaInstagram className="h-4 w-4 text-white" />
                  <FaYoutube className="h-4 w-4 text-white" />
                  </div>
                  <p className="flex items-center gap-4 border-l border-[#dce5d8] pl-6 text-xs leading-5 text-white">
                    <LuLeaf className="h-9 w-9 shrink-0 text-white" aria-hidden="true" />
                    <span>Farming Forward<br />Together.</span>
                    </p>
                    </div>
                    </div>
                    </footer>
      </main>

      <dialog ref={dialogRef} aria-labelledby="equipment-dialog-heading" onCancel={() => setActiveDialog(null)} onClose={() => setActiveDialog(null)} onClick={(event) => { if (event.target === event.currentTarget) setActiveDialog(null); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 font-sans text-[#263e2d] shadow-2xl backdrop:bg-[#102a1c]/65 backdrop:backdrop-blur-sm">
        {activeDialog && <div className="relative" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Close dialog" onClick={() => setActiveDialog(null)} className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#dce5d8] bg-white text-[#375c3e] shadow-sm hover:bg-[#f0f7e9] ${focusRing}`}><LuX className="h-5 w-5" aria-hidden="true" /></button>
          {activeDialog.type === "details" ? <><div className="relative h-64 overflow-hidden bg-[#edf3e7]"><Image src={activeDialog.item.image} alt={activeDialog.item.imageAlt} fill sizes="(max-width: 639px) 100vw, 576px" className={`object-cover ${activeDialog.item.imagePosition}`} /></div><div className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-wider text-[#51814b]">{activeDialog.item.category}</p><h2 id="equipment-dialog-heading" className="mt-2 text-3xl font-bold tracking-tight">{activeDialog.item.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-[#65765d]"><LuMapPin className="h-4 w-4" aria-hidden="true" />{activeDialog.item.location}</p><p className="mt-5 text-base leading-7 text-[#63735b]">{activeDialog.item.description}</p><dl className="mt-5 grid grid-cols-3 gap-4 rounded-lg bg-[#f0f6e9] p-4">{activeDialog.item.specs.map(({ value, label }) => <div key={label}><dt className="text-xs text-[#6b7b61]">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}</dl><ul className="mt-5 space-y-3">{activeDialog.item.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-[#5c7152]"><LuCheck className="h-4 w-4 text-[#328446]" aria-hidden="true" />{feature}</li>)}</ul><div className="mt-7 flex flex-wrap items-center justify-between gap-4"><p className="text-sm"><span className="text-2xl font-bold">{rupees(activeDialog.item.price)}</span> / day</p><button type="button" onClick={() => openRental(activeDialog.item)} className={primaryButton}>Rent This Equipment <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button></div></div></> : activeDialog.type === "rent" ? <form onSubmit={continueRental} className="p-6 sm:p-8"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5f0db] text-[#377340]"><LuCalendarDays className="h-7 w-7" aria-hidden="true" /></span><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#588250]">Plan Your Rental</p><h2 id="equipment-dialog-heading" className="mt-2 pr-4 text-2xl font-bold tracking-tight">{activeDialog.item.name}</h2><p className="mt-2 text-sm leading-6 text-[#6b7963]">Choose dates for an estimate, then log in to contact the owner and confirm availability.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Start date<input type="date" required min={today} value={rentalDates.start} onChange={(event) => { setRentalDates((current) => ({ ...current, start: event.target.value })); setRentalError(""); }} className={`min-h-12 min-w-0 rounded-md border border-[#d1dfc9] bg-white px-3 ${focusRing}`} /></label><label className="flex flex-col gap-2 text-sm font-medium">End date<input type="date" required min={rentalDates.start || today} value={rentalDates.end} onChange={(event) => { setRentalDates((current) => ({ ...current, end: event.target.value })); setRentalError(""); }} className={`min-h-12 min-w-0 rounded-md border border-[#d1dfc9] bg-white px-3 ${focusRing}`} /></label></div><fieldset className="mt-5"><legend className="text-sm font-medium">How would you like to receive it?</legend><div className="mt-3 flex flex-wrap gap-5">{[{ value: "pickup", label: "Pick up" }, { value: "delivery", label: "Request delivery" }].map((method) => <label key={method.value} className="flex cursor-pointer items-center gap-2 text-sm text-[#5c7153]"><input type="radio" name="delivery-method" value={method.value} checked={deliveryMethod === method.value} onChange={(event) => setDeliveryMethod(event.target.value)} className="h-4 w-4 accent-[#28744a]" />{method.label}</label>)}</div></fieldset><div className="mt-6 rounded-lg bg-[#f0f6e9] p-5"><div className="flex items-center justify-between gap-3 text-sm text-[#687a5c]"><span>{rupees(activeDialog.item.price)} per day{rentalDays > 0 && ` × ${rentalDays} ${rentalDays === 1 ? "day" : "days"}`}</span><span className="font-semibold">{rentalDays > 0 ? rupees(activeDialog.item.price * rentalDays) : "Select dates"}</span></div><p className="mt-3 text-xs leading-5 text-[#74816a]">Rental days include the start and end date. Delivery, fuel and operator costs are agreed separately.</p></div>{rentalError && <p role="alert" className="mt-3 text-sm text-[#a2402d]">{rentalError}</p>}<button type="submit" className={`${primaryButton} mt-6 w-full`}>Continue to Login <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button></form> : <div className="p-7 sm:p-10"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f0d9] text-[#367439]"><LuHeadset className="h-8 w-8" aria-hidden="true" /></span><h2 id="equipment-dialog-heading" className="mt-5 text-3xl font-bold tracking-tight">Get the right equipment for your farm.</h2><p className="mt-4 text-base leading-7 text-[#68775f]">Browse the equipment listings, review the specifications and rental estimate, then log in to connect with an equipment owner.</p><Link href="/login" className={`${primaryButton} mt-6 w-full`}>Log In to Connect <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link><p className="mt-4 text-center text-sm text-[#6c7864]">New here? <Link href="/registration" className={`font-semibold text-[#267143] underline underline-offset-4 ${focusRing}`}>Create an account</Link></p></div>}
        </div>}
      </dialog>
    </>
  );
}
