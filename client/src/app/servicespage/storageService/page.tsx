"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesColumnIncreasing,
  LuCheck,
  LuCoins,
  LuFileText,
  LuHandshake,
  LuHouse,
  LuIndianRupee,
  LuLeaf,
  LuMapPin,
  LuNavigation,
  LuPackage,
  LuSearch,
  LuShieldCheck,
  LuSlidersHorizontal,
  LuSprout,
  LuStar,
  LuTractor,
  LuUsersRound,
  LuWarehouse,
  LuX,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

const categories = [
  "All",
  "General Warehouse",
  "Cold Storage",
  "Grain Storage",
  "Fruits & Vegetables",
  "Organic Produce",
] as const;

type Category = (typeof categories)[number];

// Sample listings and distances from the reference, ready for live inventory data.
const warehouses = [
  {
    id: "greenfield",
    name: "GreenField Agro Warehouse",
    location: "Mohali, Punjab",
    image: "/images/warehouse-storage/warehouse.webp",
    imagePosition: "object-[75%_center]",
    imageAlt: "Agricultural warehouse with open loading bays and stacked produce",
    categories: ["General Warehouse", "Grain Storage"],
    tags: ["Grain Storage", "24/7 Security"],
    features: ["24/7 security", "Loading and unloading docks", "Fire safety systems"],
    capacity: 1200,
    rent: 22,
    distance: 8,
    verified: true,
    description: "Spacious, covered storage for grain and agricultural goods, with accessible loading bays and round-the-clock security.",
  },
  {
    id: "punjab-cold-storage",
    name: "Punjab Cold Storage",
    location: "Kharar, Punjab",
    image: "/images/warehouse-storage/cold-storage.webp",
    imagePosition: "object-center",
    imageAlt: "Insulated cold storage building with refrigeration units and loading doors",
    categories: ["Cold Storage", "Fruits & Vegetables"],
    tags: ["Cold Storage", "Temperature Control"],
    features: ["Temperature-controlled storage", "Backup power", "Insulated, hygienic interiors"],
    capacity: 850,
    rent: 38,
    distance: 14,
    verified: true,
    description: "Temperature-controlled storage for fruits, vegetables, and other perishable produce. Insulation and backup power help maintain consistent storage conditions.",
  },
  {
    id: "harvest-grain-hub",
    name: "Harvest Grain Hub",
    location: "Chandigarh",
    image: "/images/warehouse-storage/grain-storage.webp",
    imagePosition: "object-center",
    imageAlt: "Galvanized steel grain silos alongside a covered storage depot",
    categories: ["Grain Storage"],
    tags: ["Grain Storage", "Pest Management"],
    features: ["Moisture control", "Pest management", "Bulk grain handling"],
    capacity: 1600,
    rent: 20,
    distance: 19,
    verified: true,
    description: "A dedicated grain storage facility with bulk handling, moisture control, and pest management to help protect the quality of your harvest.",
  },
  {
    id: "kisan-storage",
    name: "Kisan Storage Solutions",
    location: "Kurali, Punjab",
    image: "/images/warehouse-storage/warehouse.webp",
    imagePosition: "object-right scale-110",
    imageAlt: "Warehouse loading area with agricultural goods stacked on pallets",
    categories: ["General Warehouse", "Fruits & Vegetables", "Organic Produce"],
    tags: ["General Warehouse", "Vehicle Access"],
    features: ["Sorting and grading area", "Easy vehicle access", "Multi-commodity storage"],
    capacity: 950,
    rent: 18,
    distance: 27,
    verified: false,
    description: "Flexible storage for seasonal crops and agricultural goods, with sorting and grading space and convenient vehicle access.",
  },
];

type Warehouse = (typeof warehouses)[number];
type StorageDialog = { type: "details"; warehouse: Warehouse } | { type: "contact" };

const highlights = [
  { label: "Reduce Post-Harvest Losses", icon: LuLeaf },
  { label: "Earn Steady Income", icon: LuCoins },
  { label: "Trusted Operators & Quality Infrastructure", icon: LuShieldCheck },
  { label: "Support Agricultural Growth", icon: LuChartNoAxesColumnIncreasing },
];

const steps = [
  { title: "Search or List", description: "Farmers find storage options or landowners list their space.", icon: LuSearch },
  { title: "Connect", description: "Get in touch, discuss requirements and finalize terms.", icon: LuFileText },
  { title: "Store Securely", description: "Move your produce to a verified warehouse with trusted operators.", icon: LuHandshake },
  { title: "Grow Together", description: "Reduce losses, earn income and build a stronger agricultural ecosystem.", icon: LuChartNoAxesColumnIncreasing },
];

const benefits = [
  { title: "Preserve Quality", description: "Keep your produce fresh for longer.", icon: LuLeaf },
  { title: "Better Market Prices", description: "Store and sell at the right time.", icon: LuIndianRupee },
  { title: "Trusted Network", description: "Verified warehouses and operators.", icon: LuUsersRound },
  { title: "Support Rural Growth", description: "Create income opportunities for landowners and farmers.", icon: LuSprout },
];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#267143]";
const primaryButton = `inline-flex min-h-11 items-center justify-center gap-4 rounded-md bg-linear-to-br from-[#267b46] to-[#13603b] px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-[#1b6638] hover:to-[#0e4e2e] ${focusRing}`;
const outlineButton = `inline-flex min-h-11 items-center justify-center gap-4 rounded-md border border-[#458455] bg-[#eef6e9] px-6 py-3 text-sm font-semibold text-[#254e33] transition-colors hover:bg-[#ddeed5] ${focusRing}`;

export default function StorageServicePage() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [nearbyOpen, setNearbyOpen] = useState(false);
  const [nearbyLocation, setNearbyLocation] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [largeCapacityOnly, setLargeCapacityOnly] = useState(false);
  const [activeDialog, setActiveDialog] = useState<StorageDialog | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nearbyOpen) locationInputRef.current?.focus();
  }, [nearbyOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!activeDialog || !dialog) return;

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [activeDialog]);

  const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const searchableText = [warehouse.name, warehouse.location, ...warehouse.categories, ...warehouse.tags, ...warehouse.features].join(" ").toLowerCase();

    return (
      (category === "All" || warehouse.categories.includes(category)) &&
      searchTerms.every((term) => searchableText.includes(term)) &&
      warehouse.location.toLowerCase().includes(nearbyLocation.trim().toLowerCase()) &&
      (!verifiedOnly || warehouse.verified) &&
      (!largeCapacityOnly || warehouse.capacity >= 1000)
    );
  });
  const activeFilterCount = Number(verifiedOnly) + Number(largeCapacityOnly);

  function resetFilters() {
    setCategory("All");
    setQuery("");
    setNearbyLocation("");
    setNearbyOpen(false);
    setVerifiedOnly(false);
    setLargeCapacityOnly(false);
  }

  return (
    <>
      <title>Warehouse Storage Services | AgriStore</title>
      <meta name="description" content="Find agricultural warehouses, cold storage, and grain storage, or list your warehouse. Connect with storage operators and protect the value of your harvest." />

      <main className="overflow-x-clip bg-white font-sans text-[#13211d]">
        <section aria-labelledby="storage-heading" className="relative isolate overflow-hidden bg-[#eef2e9]">
          <Image src="/images/warehouse-storage/warehouse.webp" alt="Modern agricultural warehouse with open loading bays and a forklift" fill preload sizes="100vw" className="-z-20 object-cover object-[65%_center] lg:object-center" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#fcfdf8]/95 via-[#fcfdf8]/80 to-[#fcfdf8]/30 sm:via-[#fcfdf8]/60 lg:from-[#fcfdf8]/95 lg:via-[#fcfdf8]/25 lg:to-transparent" />
          <div className="relative mx-auto max-w-[1440px] px-6 pb-11 pt-9 sm:px-10 lg:min-h-[520px] lg:px-12 lg:pb-12 lg:pt-10">
            <div className="max-w-[690px]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2a7042] sm:text-sm">Warehouse Storage Services</p>
              <h1 id="storage-heading" className="mt-3 text-[44px] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#0c1920] sm:text-[60px] lg:text-[70px]">Safe Storage.<br />Greater Value.</h1>
              <p className="mt-4 max-w-[625px] text-base leading-6 text-[#455049] lg:text-lg lg:leading-7">Connects landowners, warehouse operators and farmers for reliable, modern and affordable storage solutions.</p>

              <div className="mt-5 grid max-w-[680px] gap-4 sm:grid-cols-2">
                <article className="flex flex-col rounded-lg border border-[#e6eae1] bg-white/95 p-5 shadow-[0_4px_14px_#1433210a]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#d7e9c8] text-[#206536]"><LuHouse className="h-9 w-9" strokeWidth={2.3} aria-hidden="true" /></span>
                    <div className="pt-1"><h2 className="text-lg font-bold tracking-tight">I am a Landowner</h2><p className="mt-1 text-sm leading-5 text-[#66705f]">List your land or warehouse space and earn steady income.</p></div>
                  </div>
                  <Link href="/servicespage/warehouseStorage" className={`${primaryButton} mt-4 w-full`}>List Your Warehouse <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                </article>
                <article className="flex flex-col rounded-lg border border-[#e6eae1] bg-white/95 p-5 shadow-[0_4px_14px_#1433210a]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#d7e9c8] text-[#206536]"><LuTractor className="h-10 w-10" strokeWidth={2} aria-hidden="true" /></span>
                    <div className="pt-1"><h2 className="text-lg font-bold tracking-tight">I am a Farmer</h2><p className="mt-1 text-sm leading-5 text-[#66705f]">Store your produce in trusted warehouses and reduce post-harvest losses.</p></div>
                  </div>
                  <a href="#available-warehouses" className={`${outlineButton} mt-4 w-full`}>Find Storage <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                </article>
              </div>
            </div>
            <p className="absolute bottom-7 right-12 hidden -rotate-8 font-serif text-2xl italic leading-[1.05] text-[#f8ffe9] drop-shadow-lg xl:block">Storage for<br />Stronger<br />Harvests</p>
          </div>
        </section>

        <section aria-label="Benefits of agricultural storage" className="border-y border-[#edf2e9] bg-[#f6f9f3]">
          <div className="mx-auto grid max-w-[1440px] gap-x-8 gap-y-6 px-6 py-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-0 lg:px-12 lg:py-6">
            {highlights.map(({ label, icon: Icon }, index) => (
              <div key={label} className={`flex items-center gap-4 ${index > 0 ? "lg:border-l lg:border-[#dce8d5] lg:pl-9" : ""}`}>
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e6f1de] text-[#1d743a]"><Icon className="h-8 w-8" strokeWidth={2} aria-hidden="true" /></span>
                <p className="max-w-44 text-sm font-semibold leading-5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="available-warehouses" aria-labelledby="warehouses-heading" className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pt-8 sm:px-10 lg:px-12">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center lg:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#337e4c] sm:text-sm">Available Warehouses</p>
              <h2 id="warehouses-heading" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em] lg:text-[36px]">Find the Right Storage for Your Needs</h2>
              <p className="mt-2 text-base leading-6 text-[#68736b]">Browse verified warehouses with modern facilities. Filter by location, storage type or amenities.</p>
            </div>
            <form role="search" onSubmit={(event) => event.preventDefault()} className="flex h-12 w-full shrink-0 overflow-hidden rounded-md border border-[#dbe3dc] bg-white focus-within:border-[#438055] focus-within:ring-2 focus-within:ring-[#438055]/15 lg:w-[350px] xl:w-[465px]">
              <label htmlFor="storage-search" className="sr-only">Search by location, storage type or keyword</label>
              <LuMapPin className="my-auto ml-4 h-5 w-5 shrink-0 text-[#66766c]" aria-hidden="true" />
              <input id="storage-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location, storage type or keyword..." className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#2c4434] outline-none placeholder:text-[#929b94]" />
              <button type="submit" className="shrink-0 bg-[#207144] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#155b34] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">Search</button>
            </form>
          </div>

          <div className="my-5 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Storage type">
              {categories.map((item) => (
                <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-10 px-5 py-2 text-xs font-medium transition-colors xl:text-sm ${focusRing} ${category === item ? "rounded-md bg-[#1e7544] text-white" : "rounded-full bg-[#f1f4f2] text-[#35453d] hover:bg-[#e5eee4]"}`}>{item}</button>
              ))}
              <button type="button" aria-expanded={nearbyOpen} aria-controls="nearby-storage" onClick={() => { setNearbyOpen((open) => !open); setNearbyLocation(""); }} className={`min-h-10 rounded-full px-5 py-2 text-xs font-medium transition-colors xl:text-sm ${focusRing} ${nearbyOpen ? "bg-[#dfedda] text-[#23643b]" : "bg-[#f1f4f2] text-[#35453d] hover:bg-[#e5eee4]"}`}>Near Me</button>
            </div>
            <button type="button" aria-expanded={filtersOpen} aria-controls="storage-filters" onClick={() => setFiltersOpen((open) => !open)} className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium sm:px-5 ${focusRing} ${filtersOpen || activeFilterCount ? "border-[#538b5e] bg-[#edf5e9] text-[#28643c]" : "border-[#dce4de] bg-white text-[#34483c] hover:bg-[#f4f8f1]"}`}><LuSlidersHorizontal className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Filters</span><span className="sr-only sm:hidden">Filters</span>{activeFilterCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#247044] text-xs text-white">{activeFilterCount}</span>}</button>
          </div>

          <div id="nearby-storage" hidden={!nearbyOpen} className="mb-5 rounded-lg border border-[#dce8d5] bg-[#f5f9f1] p-4">
            <label htmlFor="nearby-location" className="block text-sm font-semibold text-[#3d5d42]">Your city or area</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input ref={locationInputRef} id="nearby-location" type="search" value={nearbyLocation} onChange={(event) => setNearbyLocation(event.target.value)} placeholder="e.g. Mohali, Kharar or Chandigarh" className={`h-11 w-full rounded-md border border-[#cbdcc5] bg-white px-3 text-sm sm:max-w-sm ${focusRing}`} />
              <p className="text-sm text-[#6b7865]">Enter your city or area to find local storage.</p>
            </div>
          </div>
          <div id="storage-filters" hidden={!filtersOpen} className="mb-5 rounded-lg border border-[#dce8d5] bg-[#f5f9f1] p-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-[#435d46]">
              <label className="flex cursor-pointer items-center gap-2.5"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="h-4 w-4 accent-[#267343]" />Verified warehouses only</label>
              <label className="flex cursor-pointer items-center gap-2.5"><input type="checkbox" checked={largeCapacityOnly} onChange={(event) => setLargeCapacityOnly(event.target.checked)} className="h-4 w-4 accent-[#267343]" />Capacity of 1,000 sq m or more</label>
              <button type="button" onClick={resetFilters} className={`font-semibold text-[#286d40] underline underline-offset-4 sm:ml-auto ${focusRing}`}>Clear all filters</button>
            </div>
          </div>

          <p role="status" className="sr-only">{filteredWarehouses.length} {filteredWarehouses.length === 1 ? "warehouse" : "warehouses"} found.</p>
          {filteredWarehouses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredWarehouses.map((warehouse) => (
                <article key={warehouse.id} className="flex min-w-0 flex-col overflow-hidden rounded-md border border-[#dde5dd] bg-white shadow-[0_2px_6px_#26432b05] transition-shadow hover:shadow-[0_6px_20px_#26432b18]">
                  <div className="relative h-52 overflow-hidden bg-[#e9eee8] sm:h-56 lg:h-48 xl:h-52">
                    <Image src={warehouse.image} alt={warehouse.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className={`object-cover ${warehouse.imagePosition}`} />
                    <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs font-semibold shadow-sm ${warehouse.verified ? "bg-[#247344] text-[#ecf4bd]" : "bg-[#f2c54d] text-[#5c481a]"}`}>{warehouse.verified ? <LuBadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <LuStar className="h-3.5 w-3.5" aria-hidden="true" />}{warehouse.verified ? "Verified" : "Popular"}</span>
                      <span aria-label={`Example distance: ${warehouse.distance} kilometres`} className="inline-flex items-center gap-1 rounded-sm bg-white/95 px-2 py-1.5 text-xs font-medium text-[#485951] shadow-sm"><LuNavigation className="h-3 w-3" aria-hidden="true" />{warehouse.distance} km</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 xl:p-4">
                    <h3 className="text-base font-bold tracking-[-0.025em] xl:text-lg">{warehouse.name}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#617068] xl:text-sm"><LuMapPin className="h-3.5 w-3.5 shrink-0 text-[#3b4d42]" aria-hidden="true" />{warehouse.location}</p>
                    <ul aria-label="Storage amenities" className="mt-3 flex flex-wrap gap-2">{warehouse.tags.map((tag) => <li key={tag} className="rounded-sm bg-[#f2f5f3] px-2 py-1 text-xs text-[#48594d]">{tag}</li>)}</ul>
                    <dl className="mb-4 mt-5 grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2"><LuPackage className="mt-0.5 h-5 w-5 shrink-0 text-[#364b3e]" strokeWidth={1.7} aria-hidden="true" /><div className="flex flex-col"><dt className="order-2 mt-0.5 text-xs text-[#7a847d]">Total Capacity</dt><dd className="text-xs font-bold text-[#35493c] xl:text-sm">{warehouse.capacity.toLocaleString("en-IN")} sq m</dd></div></div>
                      <div className="flex items-start gap-1.5"><LuIndianRupee className="mt-0.5 h-5 w-5 shrink-0 text-[#364b3e]" strokeWidth={1.7} aria-hidden="true" /><div className="flex flex-col"><dt className="order-2 mt-0.5 text-xs text-[#7a847d]">Monthly Rent</dt><dd className="text-xs font-bold text-[#35493c] xl:text-sm">₹{warehouse.rent} / sq ft</dd></div></div>
                    </dl>
                    <button type="button" aria-label={`View details for ${warehouse.name}`} onClick={() => setActiveDialog({ type: "details", warehouse })} className={`mt-auto inline-flex min-h-10 w-full items-center justify-center gap-3 rounded-sm border border-[#398551] bg-[#fcfefb] px-3 py-2 text-sm font-semibold text-[#2a7142] transition-colors hover:bg-[#edf6e8] ${focusRing}`}>View Details <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cadbc5] bg-[#f6faf3] px-6 py-14 text-center">
              <LuWarehouse className="mx-auto h-11 w-11 text-[#6d986c]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">No matching storage options</h3>
              <p className="mt-2 text-base text-[#6b7965]">Try another city, storage type or keyword, or clear your filters.</p>
              <button type="button" onClick={resetFilters} className={`${primaryButton} mt-5`}>Show All Warehouses <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          )}
        </section>

        <section id="how-it-works" aria-labelledby="process-heading" className="mx-auto grid max-w-[1440px] scroll-mt-6 gap-7 px-6 pb-6 pt-8 sm:px-10 lg:grid-cols-[2.6fr_1fr] lg:gap-8 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#337e4c] sm:text-sm">How It Works</p>
            <h2 id="process-heading" className="mt-2 text-3xl font-extrabold tracking-[-0.025em]">A Simple Process for Everyone</h2>
            <ol className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-6">
              {steps.map(({ title, description, icon: Icon }, index) => (
                <li key={title} className="relative text-center">
                  <div className="relative z-10 mx-auto flex w-fit items-center gap-3 bg-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#418b2d] to-[#206137] text-lg font-bold text-white">{index + 1}</span>
                    <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#e8f2e2] text-[#287342]"><Icon className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" /></span>
                  </div>
                  {index < steps.length - 1 && <div aria-hidden="true" className="absolute left-[calc(50%_+_62px)] right-[calc(-50%_+_68px)] top-[34px] hidden h-px bg-linear-to-r from-[#e6efe3] to-[#5d9b6a] sm:block"><LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#3c8850]" /></div>}
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mx-auto mt-1.5 max-w-48 text-sm leading-5 text-[#6b756d]">{description}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside aria-label="From fields to a better tomorrow" className="relative isolate flex min-h-[285px] items-end overflow-hidden rounded-tl-2xl bg-[#f0f3e9] px-7 py-7 sm:min-h-[260px]">
            <Image src="/images/warehouse-storage/grain-storage.webp" alt="Grain silos protecting the harvest in a modern storage facility" fill sizes="(max-width: 1023px) 100vw, 30vw" className="-z-20 object-cover object-[65%_center]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#f9faf2]/98 via-[#f9faf2]/80 to-[#f9faf2]/10" />
            <div><LuSprout className="mb-4 h-10 w-10 text-[#4a863a]" strokeWidth={1.5} aria-hidden="true" /><h3 className="text-3xl font-extrabold leading-[1.05] tracking-[-0.025em] text-[#142127]">From Fields<br />to a Better<br />Tomorrow</h3><span aria-hidden="true" className="my-4 block h-0.5 w-11 bg-[#4d8745]" /><p className="max-w-52 text-sm leading-5 text-[#3e5041]">Safe storage. Stronger farms. Healthier communities.</p></div>
          </aside>
        </section>

        <section aria-labelledby="storage-benefits-heading" className="bg-linear-to-r from-[#f0f7ec] via-[#edf5e9] to-[#f4f8ef]">
          <div className="mx-auto max-w-[1440px] px-6 py-6 sm:px-10 lg:px-12">
            <h2 id="storage-benefits-heading" className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#2b7642] sm:text-sm">Why Choose Our Storage Services</h2>
            <div className="mt-5 grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
              {benefits.map(({ title, description, icon: Icon }, index) => (
                <article key={title} className={`flex items-center gap-4 ${index > 0 ? "lg:border-l lg:border-[#d3e4cc] lg:pl-7" : ""} ${index < benefits.length - 1 ? "lg:pr-5" : ""}`}>
                  <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#d7eacb] text-[#206b36]"><Icon className="h-9 w-9" strokeWidth={2} aria-hidden="true" /></span>
                  <div><h3 className="text-base font-bold leading-5">{title}</h3><p className="mt-1 text-sm leading-5 text-[#60705c]">{description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="storage-cta-heading" className="relative isolate overflow-hidden bg-[#135232] text-white">
          <Image src="/images/warehouse-storage/warehouse.webp" alt="" fill sizes="100vw" className="-z-20 object-cover object-bottom" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#143e21]/90 via-[#124a2d]/90 to-[#0c5030]/98" />
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-9 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
            <div><h2 id="storage-cta-heading" className="text-3xl font-bold tracking-tight">Let’s Build a Stronger Agricultural Future</h2><p className="mt-2 max-w-[760px] text-base leading-6 text-[#e1ebda]">Whether you are a landowner with storage space or a farmer looking for reliable warehousing, we are here to help.</p></div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Link href="/servicespage/warehouseStorage" className="inline-flex min-h-12 items-center justify-center gap-5 rounded-md bg-[#f8fcf3] px-8 py-3 text-sm font-semibold text-[#245d36] transition-colors hover:bg-[#dfedcf] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">List Your Land <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href="#available-warehouses" className="inline-flex min-h-12 items-center justify-center gap-5 rounded-md border border-[#d1e4cf] px-8 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Find Storage <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#ebeee8] bg-white">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-7 px-6 py-7 sm:px-10 lg:flex-row lg:gap-6 lg:px-12">
            <Link href="/" aria-label="AgriStore home" className={`flex shrink-0 items-center gap-2.5 rounded-sm ${focusRing}`}><LuSprout className="h-12 w-10 text-[#287637]" strokeWidth={1.8} aria-hidden="true" /><span><span className="block text-xl font-bold tracking-tight">AgriStore</span><span className="mt-0.5 block text-xs text-[#687466]">Store Today. Stronger Tomorrow.</span></span></Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-[#526057]">
              <Link href="/#about" className={`hover:text-[#277443] ${focusRing}`}>About Us</Link>
              <a href="#available-warehouses" className={`hover:text-[#277443] ${focusRing}`}>Storage Services</a>
              <Link href="/servicespage/warehouseStorage" className={`hover:text-[#277443] ${focusRing}`}>For Landowners</Link>
              <a href="#how-it-works" className={`hover:text-[#277443] ${focusRing}`}>For Farmers</a>
              <button type="button" onClick={() => setActiveDialog({ type: "contact" })} className={`hover:text-[#277443] ${focusRing}`}>Contact</button>
            </nav>
            <div className="flex shrink-0 items-center gap-5">
              <div aria-hidden="true" className="flex items-center gap-4 text-[#37444b]"><FaLinkedin className="h-4 w-4" /><FaTwitter className="h-4 w-4" /><FaFacebookF className="h-4 w-4" /><FaInstagram className="h-4 w-4" /><FaYoutube className="h-4 w-4" /></div>
              <p className="flex items-center gap-3 border-l border-[#dce3db] pl-5 text-xs leading-4 text-[#5b685c]"><LuLeaf className="h-8 w-8 shrink-0 text-[#246f36]" aria-hidden="true" /><span>Agriculture today.<br />A better tomorrow.</span></p>
            </div>
          </div>
        </footer>
      </main>

      <dialog ref={dialogRef} aria-labelledby="storage-dialog-heading" onCancel={() => setActiveDialog(null)} onClose={() => setActiveDialog(null)} onClick={(event) => { if (event.target === event.currentTarget) setActiveDialog(null); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 font-sans text-[#223f2c] shadow-2xl backdrop:bg-[#10291b]/65 backdrop:backdrop-blur-sm">
        {activeDialog && <div className="relative" onClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label="Close dialog" onClick={() => setActiveDialog(null)} className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#dce5d8] bg-white text-[#335c3c] shadow-sm hover:bg-[#f1f7eb] ${focusRing}`}><LuX className="h-5 w-5" aria-hidden="true" /></button>
          {activeDialog.type === "details" ? (
            <>
              <div className="relative h-60 overflow-hidden bg-[#edf2e7]"><Image src={activeDialog.warehouse.image} alt={activeDialog.warehouse.imageAlt} fill sizes="(max-width: 639px) 100vw, 576px" className={`object-cover ${activeDialog.warehouse.imagePosition}`} /></div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#55824f]">{activeDialog.warehouse.categories[0]}</p>
                <h2 id="storage-dialog-heading" className="mt-2 text-2xl font-bold tracking-tight">{activeDialog.warehouse.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#657660]"><LuMapPin className="h-4 w-4" aria-hidden="true" />{activeDialog.warehouse.location}</p>
                <p className="mt-5 text-base leading-7 text-[#60705b]">{activeDialog.warehouse.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-[#f0f6e9] p-4"><div><dt className="text-xs text-[#66765d]">Total capacity</dt><dd className="mt-1 font-semibold">{activeDialog.warehouse.capacity.toLocaleString("en-IN")} sq m</dd></div><div><dt className="text-xs text-[#66765d]">Monthly rent</dt><dd className="mt-1 font-semibold">₹{activeDialog.warehouse.rent} / sq ft</dd></div></dl>
                <h3 className="mt-6 text-sm font-bold">Facilities & amenities</h3>
                <ul className="mt-3 space-y-3">{activeDialog.warehouse.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-[#566c4d]"><LuCheck className="h-4 w-4 shrink-0 text-[#348649]" aria-hidden="true" />{feature}</li>)}</ul>
                <Link href="/login" className={`${primaryButton} mt-7 w-full`}>Log In to Connect <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </>
          ) : (
            <div className="p-7 sm:p-10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f0d9] text-[#367439]"><LuHandshake className="h-8 w-8" aria-hidden="true" /></span>
              <h2 id="storage-dialog-heading" className="mt-5 text-3xl font-bold tracking-tight">Find your next storage connection.</h2>
              <p className="mt-4 text-base leading-7 text-[#68775f]">Explore storage facilities for your harvest or learn how your land can support a warehouse partnership.</p>
              <div className="mt-6 flex flex-col gap-3"><Link href="/servicespage/warehouseStorage" className={primaryButton}>Explore Landowner Partnerships <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link><button type="button" onClick={() => { setActiveDialog(null); document.getElementById("available-warehouses")?.scrollIntoView(); }} className={outlineButton}>Browse Storage Options <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>
              <p className="mt-5 text-center text-sm text-[#6c7864]">Already have an account? <Link href="/login" className={`font-semibold text-[#267143] underline underline-offset-4 ${focusRing}`}>Log in</Link></p>
            </div>
          )}
        </div>}
      </dialog>
    </>
  );
}
