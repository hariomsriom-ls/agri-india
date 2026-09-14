"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesCombined,
  LuCheck,
  LuCoins,
  LuLeaf,
  LuMapPin,
  LuPackage,
  LuSearch,
  LuShieldCheck,
  LuSlidersHorizontal,
  LuSprout,
  LuStar,
  LuUsersRound,
  LuWallet,
  LuWarehouse,
  LuX,
} from "react-icons/lu";

const categories = [
  "All",
  "General Warehouse",
  "Cold Storage",
  "Grain Storage",
  "Agri Produce",
  "E-commerce",
  "Industrial",
] as const;

type Category = (typeof categories)[number];

// Example listings from the design reference, ready to replace with API data.
const warehouses = [
  {
    id: "greenfield",
    name: "GreenField Logistics",
    location: "Mohali, Punjab",
    category: "General Warehouse",
    image: "/images/warehouse-storage/warehouse.webp",
    imagePosition: "object-[75%_center]",
    imageAlt: "Modern agricultural warehouse with open loading bays",
    capacity: 1200,
    rent: 22,
    verified: true,
    features: ["24/7 Security", "Loading & Unloading Dock", "Fire Safety Systems"],
    description:
      "A versatile storage facility with spacious loading bays and easy vehicle access. Suitable for agricultural supplies, packaged goods, and general warehousing.",
  },
  {
    id: "punjab-cold-storage",
    name: "Punjab Cold Storage",
    location: "Kharar, Punjab",
    category: "Cold Storage",
    image: "/images/warehouse-storage/cold-storage.webp",
    imagePosition: "object-center",
    imageAlt: "White cold storage building with refrigeration equipment",
    capacity: 850,
    rent: 38,
    verified: true,
    features: ["Temperature Controlled", "Power Backup", "Hygienic & Insulated Storage"],
    description:
      "Insulated, temperature-controlled storage designed for perishable produce. Backup power helps maintain consistent storage conditions for fruits and vegetables.",
  },
  {
    id: "harvest-grain-hub",
    name: "Harvest Grain Hub",
    location: "Chandigarh",
    category: "Grain Storage",
    image: "/images/warehouse-storage/grain-storage.webp",
    imagePosition: "object-center",
    imageAlt: "Steel grain silos beside a covered agricultural storage depot",
    capacity: 1600,
    rent: 20,
    verified: true,
    features: ["Moisture Control", "Pest Management", "Bulk Handling Facilities"],
    description:
      "Purpose-built grain storage with bulk handling facilities. Moisture control and pest management help protect harvested grain throughout the storage season.",
  },
  {
    id: "kisan-storage",
    name: "Kisan Storage Solutions",
    location: "Kurali, Punjab",
    category: "Agri Produce",
    image: "/images/warehouse-storage/warehouse.webp",
    imagePosition: "object-right scale-110",
    imageAlt: "Covered warehouse loading area with agricultural goods on pallets",
    capacity: 950,
    rent: 18,
    verified: false,
    features: ["Sorting & Grading Area", "Vehicle Access", "Multi-Commodity Storage"],
    description:
      "Flexible agricultural produce storage with dedicated sorting and grading space. Accessible loading areas support the movement of seasonal crops and multiple commodities.",
  },
];

type Warehouse = (typeof warehouses)[number];
type PageDialog = { type: "warehouse"; warehouse: Warehouse } | { type: "contact" };

const benefits = [
  {
    title: "Earn Passive Income",
    description: "Long-term lease agreements with reliable operators.",
    icon: LuCoins,
  },
  {
    title: "Increase Land Value",
    description: "Purpose-built infrastructure boosts your property’s worth.",
    icon: LuChartNoAxesCombined,
  },
  {
    title: "Minimal Involvement",
    description: "Our partners handle construction and operations.",
    icon: LuUsersRound,
  },
  {
    title: "Contribute to Food Security",
    description: "Help strengthen the agricultural supply chain.",
    icon: LuLeaf,
  },
];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#226a47]";
const primaryButton = `inline-flex min-h-12 items-center justify-center gap-4 rounded-md bg-[#1d6846] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#124e33] ${focusRing}`;
const secondaryButton = `inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#2f7455] bg-white/70 px-8 py-3 text-sm font-semibold text-[#224e3a] transition-colors hover:bg-[#edf5ee] ${focusRing}`;

export default function WarehouseStoragePage() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [largeCapacityOnly, setLargeCapacityOnly] = useState(false);
  const [activeDialog, setActiveDialog] = useState<PageDialog | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
    const searchableText = [
      warehouse.name,
      warehouse.location,
      warehouse.category,
      ...warehouse.features,
    ].join(" ").toLowerCase();

    return (
      (category === "All" || warehouse.category === category) &&
      searchTerms.every((term) => searchableText.includes(term)) &&
      (!verifiedOnly || warehouse.verified) &&
      (!largeCapacityOnly || warehouse.capacity >= 1000)
    );
  });
  const activeFilterCount = Number(verifiedOnly) + Number(largeCapacityOnly);

  function resetFilters() {
    setCategory("All");
    setQuery("");
    setVerifiedOnly(false);
    setLargeCapacityOnly(false);
  }

  return (
    <>
      <title>Warehouse Storage for Landowners | AgriStore</title>
      <meta name="description" content="Explore warehouse storage opportunities for your land, from general warehousing and cold storage to grain and agricultural produce facilities." />

      <main className="overflow-x-clip bg-white font-sans text-[#15251f]">
        <section aria-labelledby="warehouse-heading" className="relative isolate overflow-hidden bg-[#eef3ee]">
          <Image
            src="/images/warehouse-storage/warehouse.webp"
            alt="Agricultural warehouse with open storage bays and a spacious loading area"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover object-[65%_center] lg:object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#fbfcf7]/95 via-[#fbfcf7]/80 to-[#fbfcf7]/15 sm:via-[#fbfcf7]/65 lg:from-[#fbfcf7]/95 lg:via-[#fbfcf7]/45 lg:to-transparent" />

          <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-12 sm:px-10 sm:pt-14 lg:min-h-[440px] lg:px-16 lg:pb-12 lg:pt-14 xl:min-h-[455px]">
            <div className="max-w-[620px]">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#357656] sm:text-sm">Warehouse Storage for Landowners</p>
              <h1 id="warehouse-heading" className="mt-3 text-[42px] font-extrabold leading-[1.03] tracking-[-0.035em] text-[#101e19] sm:text-[56px] lg:text-[64px]">
                Turn Your Land<br />Into Opportunity
              </h1>
              <p className="mt-5 max-w-[545px] text-base leading-[1.5] text-[#4f5951] lg:text-lg">
                Partner with us to host modern warehouse and storage facilities on your land. Earn steady income, support local farmers and businesses, and make better use of your property.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/registration" className={primaryButton}>List Your Land <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <button type="button" onClick={() => setActiveDialog({ type: "contact" })} className={secondaryButton}>Talk to Our Team</button>
              </div>
            </div>
          </div>

          <div className="relative bg-linear-to-r from-[#f7f8ef]/90 via-[#f7f8ef]/70 to-[#f7f8ef]/10">
            <div className="mx-auto flex min-h-28 max-w-[1440px] items-center justify-between gap-8 px-6 py-6 sm:px-10 lg:px-16">
              <div className="flex flex-wrap gap-x-8 gap-y-5 lg:gap-x-12">
                {[
                  { title: "Stable Rental Income", icon: LuWallet },
                  { title: "Trusted Operators & Brands", icon: LuShieldCheck },
                  { title: "Support Agricultural Growth", icon: LuSprout },
                ].map(({ title, icon: Icon }) => (
                  <div key={title} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#216c48] text-[#d0e4b0] shadow-[inset_0_0_0_4px_#ffffff12]">
                      <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <p className="max-w-32 text-sm font-semibold leading-[1.35]">{title}</p>
                  </div>
                ))}
              </div>
              <p className="hidden shrink-0 -rotate-6 font-serif text-xl italic leading-[0.95] text-white drop-shadow-md lg:block">Land.<br />Foods.<br />Possibilities.</p>
            </div>
          </div>
        </section>

        <section id="storage-options" aria-labelledby="options-heading" className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pb-11 pt-10 sm:px-10 lg:px-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="max-w-[800px]">
              <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[#428165] sm:text-sm">Explore Storage Solutions</p>
              <h2 id="options-heading" className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em] lg:text-[38px]">Warehouse Options for Your Land</h2>
              <p className="mt-2 max-w-[790px] text-base leading-6 text-[#65706a]">Choose from a range of storage facilities designed to meet market demand. We connect you with verified operators who build and manage warehouses on your land.</p>
            </div>
            <form role="search" onSubmit={(event) => event.preventDefault()} className="flex h-11 w-full shrink-0 overflow-hidden rounded-md border border-[#dce3df] bg-white focus-within:border-[#26704d] focus-within:ring-2 focus-within:ring-[#26704d]/15 lg:w-[330px] xl:w-[390px]">
              <label htmlFor="warehouse-search" className="sr-only">Search warehouses by location, storage type, or keyword</label>
              <LuSearch className="my-auto ml-3.5 h-4 w-4 shrink-0 text-[#66736d]" aria-hidden="true" />
              <input id="warehouse-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location, storage type or keyword..." className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#243e30] outline-none placeholder:text-[#929c96]" />
              <button type="submit" aria-label="Search warehouses" className="flex w-12 shrink-0 items-center justify-center bg-[#1a6542] text-white transition-colors hover:bg-[#114d31] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"><LuSearch className="h-4 w-4" aria-hidden="true" /></button>
            </form>
          </div>

          <div className="mb-7 mt-6 flex items-start justify-between gap-3">
            <div role="group" aria-label="Storage category" className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-10 rounded-full px-5 py-2 text-xs font-medium transition-colors sm:text-sm ${focusRing} ${category === item ? "bg-[#1d6846] text-white shadow-sm" : "bg-[#f2f5f3] text-[#4c5851] hover:bg-[#e3eee6]"}`}>
                  {item}
                </button>
              ))}
            </div>
            <button type="button" aria-expanded={filtersOpen} aria-controls="warehouse-filters" onClick={() => setFiltersOpen((open) => !open)} className={`flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors sm:px-5 ${focusRing} ${filtersOpen || activeFilterCount ? "border-[#347a54] bg-[#edf5ee] text-[#236241]" : "border-[#dce3df] bg-white text-[#36473c] hover:bg-[#f3f7f3]"}`}>
              <LuSlidersHorizontal className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Filters</span><span className="sr-only sm:hidden">Filters</span>{activeFilterCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d6846] text-xs text-white">{activeFilterCount}</span>}
            </button>
          </div>

          <div id="warehouse-filters" hidden={!filtersOpen} className="mb-6 rounded-lg border border-[#dce7de] bg-[#f5f9f5] p-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-[#3d5646]">
              <label className="flex cursor-pointer items-center gap-2.5"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="h-4 w-4 accent-[#226a47]" />Verified operators only</label>
              <label className="flex cursor-pointer items-center gap-2.5"><input type="checkbox" checked={largeCapacityOnly} onChange={(event) => setLargeCapacityOnly(event.target.checked)} className="h-4 w-4 accent-[#226a47]" />Capacity of 1,000 sq m or more</label>
              <button type="button" onClick={resetFilters} className={`font-semibold text-[#216742] underline underline-offset-4 sm:ml-auto ${focusRing}`}>Clear filters</button>
            </div>
          </div>

          <p role="status" className="sr-only">{filteredWarehouses.length} warehouse {filteredWarehouses.length === 1 ? "option" : "options"} found.</p>
          {filteredWarehouses.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredWarehouses.map((warehouse) => (
                <article key={warehouse.id} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#e0e6e1] bg-white shadow-[0_2px_7px_#173b2210] transition-shadow hover:shadow-[0_6px_22px_#173b221a]">
                  <div className="relative h-52 overflow-hidden bg-[#e8eeea] sm:h-56 lg:h-48 xl:h-56">
                    <Image src={warehouse.image} alt={warehouse.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" className={`object-cover ${warehouse.imagePosition}`} />
                    <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
                      <span className="rounded-sm bg-white/95 px-2 py-1.5 text-xs font-semibold text-[#2d4536] shadow-sm">{warehouse.category}</span>
                      <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-1.5 text-xs font-semibold shadow-sm ${warehouse.verified ? "bg-[#216a41] text-[#e1f5b1]" : "bg-[#f6c54e] text-[#745214]"}`}>
                        {warehouse.verified ? <LuBadgeCheck className="h-3 w-3" aria-hidden="true" /> : <LuStar className="h-3 w-3" aria-hidden="true" />}{warehouse.verified ? "Verified" : "Popular"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-base font-bold tracking-[-0.02em] xl:text-lg">{warehouse.name}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#65716a]"><LuMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{warehouse.location}</p>
                    <dl className="my-5 grid grid-cols-2 gap-2">
                      <div className="flex items-start gap-2">
                        <LuPackage className="mt-0.5 h-5 w-5 shrink-0 text-[#64716a]" strokeWidth={1.5} aria-hidden="true" />
                        <div className="flex flex-col"><dt className="order-2 text-xs leading-4 text-[#68746c]">Storage Capacity</dt><dd className="text-xs font-bold text-[#35483b]">{warehouse.capacity.toLocaleString("en-IN")} sq m</dd></div>
                      </div>
                      <div className="flex items-start gap-2 border-l border-[#e8ece9] pl-3">
                        <LuWallet className="mt-0.5 h-5 w-5 shrink-0 text-[#64716a]" strokeWidth={1.5} aria-hidden="true" />
                        <div className="flex flex-col"><dt className="order-2 text-xs leading-4 text-[#68746c]">Est. Monthly Rent</dt><dd className="text-xs font-bold text-[#35483b]">₹{warehouse.rent} / sq ft</dd></div>
                      </div>
                    </dl>
                    <ul className="mb-5 space-y-2.5">
                      {warehouse.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-xs leading-4 text-[#5b685f] xl:text-sm"><LuCheck className="h-4 w-4 shrink-0 text-[#2a8251]" strokeWidth={2.3} aria-hidden="true" />{feature}</li>)}
                    </ul>
                    <button type="button" onClick={() => setActiveDialog({ type: "warehouse", warehouse })} aria-label={`View details for ${warehouse.name}`} className={`mt-auto inline-flex min-h-10 w-full items-center justify-center gap-3 rounded-md border border-[#387b57] bg-[#fbfdfb] px-3 py-2 text-xs font-semibold text-[#2f6448] transition-colors hover:bg-[#eaf4ed] ${focusRing}`}>View Details <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cddbd1] bg-[#f6faf6] px-6 py-16 text-center">
              <LuWarehouse className="mx-auto h-10 w-10 text-[#739780]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">No matching warehouses</h3>
              <p className="mt-2 text-base text-[#65706a]">Try another location or storage type, or clear your filters to see all options.</p>
              <button type="button" onClick={resetFilters} className={`${primaryButton} mt-5`}>Show All Warehouses <LuArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          )}
        </section>

        <section id="landowner-benefits" aria-labelledby="benefits-heading" className="scroll-mt-6 bg-linear-to-br from-[#f0f6f0] via-[#edf5ee] to-[#f5f8f3]">
          <div className="mx-auto max-w-[1440px] px-6 py-9 sm:px-10 lg:px-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#548567]">Why Partner with Us</p>
              <h2 id="benefits-heading" className="mt-2 text-3xl font-extrabold tracking-[-0.025em]">Benefits for Landowners</h2>
            </div>
            <div className="mt-7 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ title, description, icon: Icon }) => (
                <article key={title} className="text-center">
                  <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#d8e8cc] text-[#2e6540]"><Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mx-auto mt-2 max-w-[240px] text-sm leading-6 text-[#627161]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="land-cta-heading" className="relative isolate overflow-hidden bg-[#194c31] text-white">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-[32%] opacity-15 [mask-image:linear-gradient(to_right,black,transparent)]">
            <Image src="/images/warehouse-storage/grain-storage.webp" alt="" fill sizes="32vw" className="object-cover mix-blend-luminosity" />
          </div>
          <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-16 xl:grid-cols-[1.2fr_1fr]">
            <div className="xl:pl-[250px]">
              <h2 id="land-cta-heading" className="text-3xl font-bold tracking-[-0.02em]">Your Land Can Do More</h2>
              <p className="mt-2 text-sm leading-6 text-[#c3d7c5]">Let’s build a stronger, more sustainable tomorrow together.</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link href="/registration" className="inline-flex min-h-11 items-center justify-center gap-4 rounded-md bg-[#f5faf3] px-7 py-2.5 text-sm font-semibold text-[#235e3c] transition-colors hover:bg-[#dcebd6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">List Your Land <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <button type="button" onClick={() => setActiveDialog({ type: "contact" })} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#a6c4ae] px-7 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Contact Us</button>
              </div>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-[#799e7d]/30 text-center">
              {[
                { value: "500+", label: "Acres Onboarded" },
                { value: "100+", label: "Warehouse Partners" },
                { value: "50,000+", label: "Farmers Supported" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-2 px-2 sm:px-5"><dt className="order-2 text-xs leading-5 text-[#d1dfce]">{label}</dt><dd className="text-2xl font-bold tracking-tight sm:text-[28px]">{value}</dd></div>
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

      <dialog ref={dialogRef} aria-labelledby="warehouse-dialog-heading" onCancel={() => setActiveDialog(null)} onClose={() => setActiveDialog(null)} onClick={(event) => { if (event.target === event.currentTarget) setActiveDialog(null); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 font-sans text-[#203b2b] shadow-2xl backdrop:bg-[#0e281b]/65 backdrop:backdrop-blur-sm">
        {activeDialog && <div className="relative" onClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label="Close dialog" onClick={() => setActiveDialog(null)} className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#dce5de] bg-white text-[#35523e] shadow-sm hover:bg-[#edf5ee] ${focusRing}`}><LuX className="h-5 w-5" aria-hidden="true" /></button>
          {activeDialog.type === "warehouse" ? (
            <>
              <div className="relative h-60 overflow-hidden bg-[#edf2ec]"><Image src={activeDialog.warehouse.image} alt={activeDialog.warehouse.imageAlt} fill sizes="(max-width: 639px) 100vw, 576px" className={`object-cover ${activeDialog.warehouse.imagePosition}`} /></div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#51815f]">{activeDialog.warehouse.category}</p>
                <h2 id="warehouse-dialog-heading" className="mt-2 text-2xl font-bold">{activeDialog.warehouse.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#66756a]"><LuMapPin aria-hidden="true" />{activeDialog.warehouse.location}</p>
                <p className="mt-5 text-base leading-7 text-[#5c6b61]">{activeDialog.warehouse.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-[#f0f6ee] p-4">
                  <div><dt className="text-xs text-[#61715f]">Storage capacity</dt><dd className="mt-1 font-semibold">{activeDialog.warehouse.capacity.toLocaleString("en-IN")} sq m</dd></div>
                  <div><dt className="text-xs text-[#61715f]">Est. monthly rent</dt><dd className="mt-1 font-semibold">₹{activeDialog.warehouse.rent} / sq ft</dd></div>
                </dl>
                <ul className="mt-5 space-y-3">{activeDialog.warehouse.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-[#536751]"><LuCheck className="text-[#2a8251]" aria-hidden="true" />{feature}</li>)}</ul>
                <Link href="/registration" className={`${primaryButton} mt-7 w-full`}>Explore a Partnership <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </>
          ) : (
            <div className="p-7 sm:p-10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4efdc] text-[#326942]"><LuUsersRound className="h-8 w-8" aria-hidden="true" /></span>
              <h2 id="warehouse-dialog-heading" className="mt-5 text-3xl font-bold tracking-tight">Let’s put your land to work.</h2>
              <p className="mt-4 text-base leading-7 text-[#657161]">Interested in a warehouse partnership? Start by creating a landowner account and sharing your land details.</p>
              <ol className="mt-6 space-y-4 text-sm text-[#536751]">
                {["Choose Landowner during registration.", "Add your contact and land details.", "Explore storage opportunities for your property."].map((step, index) => <li key={step} className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf4e9] font-semibold text-[#336a42]">{index + 1}</span>{step}</li>)}
              </ol>
              <Link href="/registration" className={`${primaryButton} mt-8 w-full`}>Create a Landowner Account <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <p className="mt-4 text-center text-sm text-[#677364]">Already registered? <Link href="/login" className={`font-semibold text-[#226a47] underline underline-offset-4 ${focusRing}`}>Log in</Link></p>
            </div>
          )}
        </div>}
      </dialog>
    </>
  );
}
