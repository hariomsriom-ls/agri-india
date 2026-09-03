"use client";

import { useMemo, useState } from "react";
import { FiGrid, FiList, FiMapPin, FiMoreVertical, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { GiWheat } from "react-icons/gi";
import { LuLandPlot, LuLeaf } from "react-icons/lu";

type LandStatus = "Active" | "Pending" | "Inactive";
type Land = { id: string; name: string; location: string; area: number; crop: string; workers: number; status: LandStatus; image: string };

const lands: Land[] = [
  { id: "LAND123456", name: "Green Valley Farm", location: "Sehore, Madhya Pradesh", area: 10, crop: "Wheat", workers: 4, status: "Active", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85" },
  { id: "LAND456789", name: "Sunrise Farm", location: "Indore, Madhya Pradesh", area: 8, crop: "Soybean", workers: 2, status: "Pending", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85" },
  { id: "LAND789012", name: "Shiv Shakti Farm", location: "Raisen, Madhya Pradesh", area: 8, crop: "Gram", workers: 3, status: "Active", image: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=900&q=85" },
  { id: "LAND987654", name: "Old Heritage Land", location: "Vidisha, Madhya Pradesh", area: 6, crop: "Maize", workers: 3, status: "Inactive", image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=900&q=85" },
];

const statusStyles: Record<LandStatus, string> = {
  Active: "bg-emerald-600 text-white",
  Pending: "bg-amber-400 text-white",
  Inactive: "bg-red-500 text-white",
};

export default function LandownerMyLands() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("Newest First");
  const [view, setView] = useState<"grid" | "list">("grid");

  const locations = [...new Set(lands.map((land) => land.location))];
  const filteredLands = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = lands.filter((land) =>
      (!term || land.name.toLowerCase().includes(term) || land.id.toLowerCase().includes(term)) &&
      (status === "All Status" || land.status === status) &&
      (location === "All Locations" || land.location === location),
    );
    return [...result].sort((a, b) => {
      if (sort === "Name A-Z") return a.name.localeCompare(b.name);
      if (sort === "Largest Area") return b.area - a.area;
      return lands.indexOf(a) - lands.indexOf(b);
    });
  }, [location, search, sort, status]);

  const stats = [
    { label: "Total Lands", value: lands.length, note: "All registered lands", icon: LuLeaf },
    { label: "Total Land Area", value: `${lands.reduce((sum, land) => sum + land.area, 0)} Acres`, note: "Across all lands", icon: LuLandPlot },
    { label: "Active Lands", value: lands.filter((land) => land.status === "Active").length, note: "Currently active", icon: GiWheat },
    { label: "Workers Assigned", value: lands.reduce((sum, land) => sum + land.workers, 0), note: "Across all lands", icon: FiUsers },
  ];

  return (
    <div className="min-h-full bg-[#f6f8f6] px-5 py-7 text-slate-900 sm:px-7 lg:px-9">
      <section className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Lands</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your land properties in one place</p>
          </div>
          <button type="button" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17652f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104d23] focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
            <FiPlus className="text-lg" /> Add New Land
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <article key={label} className="flex min-h-32 items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-[#21733a]"><Icon className="text-3xl" /></div>
              <div><p className="text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by land name or ID..." className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-12 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>All Status</option><option>Active</option><option>Pending</option><option>Inactive</option>
          </select>
          <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-12 min-w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>All Locations</option>{locations.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>Newest First</option><option>Name A-Z</option><option>Largest Area</option>
          </select>
          <div className="flex h-12 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={`grid w-10 place-items-center rounded-lg transition ${view === "grid" ? "bg-white text-[#17652f] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}><FiGrid /></button>
            <button type="button" aria-label="List view" onClick={() => setView("list")} className={`grid w-10 place-items-center rounded-lg transition ${view === "list" ? "bg-white text-[#17652f] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}><FiList /></button>
          </div>
        </div>

        {filteredLands.length ? (
          <div className={view === "grid" ? "mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "mt-5 grid gap-4"}>
            {filteredLands.map((land) => (
              <article key={land.id} className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${view === "list" ? "sm:flex" : ""}`}>
                <div className={`relative bg-cover bg-center ${view === "list" ? "h-52 sm:h-auto sm:w-72" : "h-52"}`} style={{ backgroundImage: `url(${land.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${statusStyles[land.status]}`}>{land.status}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-slate-950">{land.name}</h2><p className="mt-1 text-xs font-medium text-slate-500">{land.id}</p>
                  <div className="mt-5 grid gap-3 text-sm text-slate-600">
                    <p className="flex items-center gap-3"><FiMapPin className="shrink-0 text-lg text-[#258044]" />{land.location}</p>
                    <p className="flex items-center gap-3"><LuLandPlot className="shrink-0 text-lg text-[#258044]" />{land.area} Acres</p>
                    <p className="flex items-center gap-3"><GiWheat className="shrink-0 text-lg text-[#258044]" />{land.crop}</p>
                    <p className="flex items-center gap-3"><FiUsers className="shrink-0 text-lg text-[#258044]" />{land.workers} Workers</p>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button type="button" className="h-11 flex-1 rounded-lg border border-slate-200 text-sm font-semibold text-[#17652f] transition hover:border-green-600 hover:bg-green-50">View Details</button>
                    <button type="button" aria-label={`More options for ${land.name}`} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><FiMoreVertical /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <LuLandPlot className="mx-auto text-4xl text-slate-300" /><h2 className="mt-4 text-lg font-semibold">No lands found</h2><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
