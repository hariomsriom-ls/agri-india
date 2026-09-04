"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  LuCalendarDays,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuFileText,
  LuIndianRupee,
  LuLayers,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSprout,
  LuUserRound,
  LuX,
} from "react-icons/lu";

type PlotStatus = "Used" | "Unused";

type Plot = {
  id: string;
  landowner: string;
  location: string;
  area: string;
  status: PlotStatus;
  leasePeriod: string;
  payment: string;
};

type PlotForm = Omit<Plot, "leasePeriod"> & {
  leaseStart: string;
  leaseEnd: string;
};

const initialPlots: Plot[] = [
  { id: "PLT-001", landowner: "Rajesh Kumar", location: "Rampur, Block A", area: "2.5", status: "Used", leasePeriod: "01 Jan 2024 – 31 Dec 2026", payment: "1,20,000" },
  { id: "PLT-002", landowner: "Sita Devi", location: "Kalyanpur, Block B", area: "1.0", status: "Unused", leasePeriod: "–", payment: "–" },
  { id: "PLT-003", landowner: "Mohan Singh", location: "Bhawanipur, Block A", area: "3.0", status: "Used", leasePeriod: "01 Jul 2023 – 30 Jun 2025", payment: "1,50,000" },
  { id: "PLT-004", landowner: "Sunita Patel", location: "Rampur, Block C", area: "1.5", status: "Used", leasePeriod: "01 Jan 2025 – 31 Dec 2028", payment: "90,000" },
  { id: "PLT-005", landowner: "Vikram Yadav", location: "Kalyanpur, Block A", area: "2.0", status: "Unused", leasePeriod: "–", payment: "–" },
  { id: "PLT-006", landowner: "Anita Sharma", location: "Devganj, Block B", area: "4.0", status: "Used", leasePeriod: "01 Apr 2024 – 31 Mar 2027", payment: "2,00,000" },
  { id: "PLT-007", landowner: "Ramesh Patel", location: "Bhawanipur, Block C", area: "1.8", status: "Unused", leasePeriod: "–", payment: "–" },
  { id: "PLT-008", landowner: "Kavita Singh", location: "Rampur, Block A", area: "2.2", status: "Used", leasePeriod: "01 Oct 2023 – 30 Sep 2026", payment: "1,10,000" },
];

const emptyForm: PlotForm = {
  id: "",
  landowner: "",
  location: "",
  area: "",
  status: "Used",
  leaseStart: "",
  leaseEnd: "",
  payment: "",
};

const payments = [
  ["12 Aug 2025", "PLT-006", "Anita Sharma", "2,00,000"],
  ["05 Aug 2025", "PLT-003", "Mohan Singh", "1,50,000"],
  ["28 Jul 2025", "PLT-001", "Rajesh Kumar", "1,20,000"],
  ["15 Jul 2025", "PLT-008", "Kavita Singh", "1,10,000"],
  ["02 Jul 2025", "PLT-004", "Sunita Patel", "90,000"],
];

const expiringLeases = [
  ["PLT-003", "Mohan Singh", "30 Jun 2025", "18", "warning"],
  ["PLT-008", "Kavita Singh", "30 Sep 2025", "110", "warning"],
  ["PLT-001", "Rajesh Kumar", "31 Dec 2026", "500", "safe"],
  ["PLT-006", "Anita Sharma", "31 Mar 2027", "590", "safe"],
];

function MetricCard({
  icon,
  iconClass,
  cardClass,
  label,
  value,
  trend,
  trendDown = false,
}: {
  icon: ReactNode;
  iconClass: string;
  cardClass: string;
  label: string;
  value: string;
  trend: string;
  trendDown?: boolean;
}) {
  return (
    <section className={`flex min-h-28 items-center gap-5 rounded-xl border p-5 ${cardClass}`}>
      <div className={`grid size-16 shrink-0 place-items-center rounded-xl text-[34px] ${iconClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        <p className={`mt-2 text-xs font-semibold ${trendDown ? "text-red-500" : "text-emerald-600"}`}>
          {trendDown ? "↓" : "↑"} {trend} <span className="font-normal text-slate-500">from last month</span>
        </p>
      </div>
    </section>
  );
}

function SelectBox({ value, onChange, children, ariaLabel }: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-28 appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-9 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {children}
      </select>
      <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function Modal({ children, onClose, width = "max-w-lg" }: {
  children: ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${width}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function AuthorityActiveRentals() {
  const [plots, setPlots] = useState(initialPlots);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [district, setDistrict] = useState("All Districts");
  const [page, setPage] = useState(1);
  const [viewingPlot, setViewingPlot] = useState<Plot | null>(null);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [form, setForm] = useState<PlotForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredPlots = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return plots.filter((plot) => {
      const matchesQuery = !normalizedQuery || [plot.id, plot.landowner, plot.location]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "All Status" || plot.status === status;
      const matchesDistrict = district === "All Districts" || plot.location.startsWith(district);
      return matchesQuery && matchesStatus && matchesDistrict;
    });
  }, [district, plots, query, status]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function openNewPlot() {
    const nextNumber = Math.max(...plots.map((plot) => Number(plot.id.split("-")[1])), 0) + 1;
    setEditingPlot(null);
    setForm({ ...emptyForm, id: `PLT-${String(nextNumber).padStart(3, "0")}` });
    setFormOpen(true);
  }

  function openEditPlot(plot: Plot) {
    const [leaseStart = "", leaseEnd = ""] = plot.leasePeriod === "–" ? ["", ""] : plot.leasePeriod.split(" – ");
    setEditingPlot(plot);
    setForm({ ...plot, leaseStart, leaseEnd });
    setFormOpen(true);
  }

  function submitPlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const plot: Plot = {
      id: form.id,
      landowner: form.landowner,
      location: form.location,
      area: form.area,
      status: form.status,
      leasePeriod: form.status === "Used" && form.leaseStart && form.leaseEnd ? `${form.leaseStart} – ${form.leaseEnd}` : "–",
      payment: form.status === "Used" && form.payment ? form.payment : "–",
    };

    if (editingPlot) {
      setPlots((current) => current.map((item) => item.id === editingPlot.id ? plot : item));
      showNotice(`${plot.id} was updated successfully.`);
    } else {
      setPlots((current) => [plot, ...current]);
      showNotice(`${plot.id} was added successfully.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="min-h-full bg-[#f6f9fb] px-3 py-4 text-slate-800 sm:px-5 lg:px-6">
      {notice && (
        <div className="fixed right-6 top-20 z-[60] rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>
      )}

      <div className="mx-auto max-w-[1480px]">
        <header className="mb-5 flex items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">Plots Management</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">View and manage all plots under your authority. Track usage, payments and lease details.</p>
          </div>
          <button type="button" onClick={openNewPlot} className="flex h-12 shrink-0 items-center gap-3 rounded-lg bg-emerald-800 px-6 font-semibold text-white shadow-sm transition hover:bg-emerald-900">
            <LuPlus className="text-xl" /> Add Plot
          </button>
        </header>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<LuLayers />} iconClass="bg-emerald-100 text-emerald-600" cardClass="border-emerald-100 bg-gradient-to-r from-emerald-50 to-white" label="Total Plots" value="128" trend="12%" />
          <MetricCard icon={<LuSprout />} iconClass="bg-blue-100 text-blue-600" cardClass="border-blue-100 bg-gradient-to-r from-blue-50 to-white" label="Used Plots" value="96" trend="8%" />
          <MetricCard icon={<LuSprout />} iconClass="bg-orange-100 text-orange-600" cardClass="border-orange-100 bg-gradient-to-r from-orange-50 to-white" label="Unused Plots" value="32" trend="5%" trendDown />
          <MetricCard icon={<LuIndianRupee />} iconClass="bg-emerald-100 text-emerald-600" cardClass="border-emerald-100 bg-gradient-to-r from-emerald-50 to-white" label="Total Payments" value="₹ 24.8 Lakhs" trend="18%" />
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[0.9fr_1.05fr_0.95fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Plot Usage Overview</h2>
            <div className="mt-4 flex items-center justify-around gap-5">
              <div className="grid size-40 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#078145 0 75%, #86d6a3 75% 100%)" }}>
                <div className="grid size-24 place-items-center rounded-full bg-white text-center shadow-inner">
                  <div><p className="text-2xl font-bold text-slate-950">128</p><p className="text-xs font-medium text-slate-500">Total Plots</p></div>
                </div>
              </div>
              <div className="space-y-5 text-sm">
                <div className="flex gap-3"><span className="mt-1 size-4 rounded-full bg-emerald-700" /><div><p className="font-medium">Used Plots</p><p className="mt-1 text-slate-600">96 (75%)</p></div></div>
                <div className="flex gap-3"><span className="mt-1 size-4 rounded-full bg-emerald-400" /><div><p className="font-medium">Unused Plots</p><p className="mt-1 text-slate-600">32 (25%)</p></div></div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Lease Period Status</h2>
            <div className="relative mt-5 h-40 border-b border-slate-200 pl-8">
              {[0, 10, 20, 30, 40].map((tick, index) => (
                <div key={tick} className="absolute inset-x-8 border-t border-slate-100" style={{ bottom: `${index * 25}%` }}>
                  <span className="absolute -left-8 -top-2 text-[11px] text-slate-500">{tick}</span>
                </div>
              ))}
              <div className="absolute inset-x-9 bottom-0 top-0 flex items-end justify-around gap-4">
                {[
                  ["< 1 Year", 18, "bg-gradient-to-t from-emerald-700 to-emerald-500"],
                  ["1 – 3 Years", 35, "bg-gradient-to-t from-emerald-600 to-emerald-400"],
                  ["3 – 5 Years", 28, "bg-gradient-to-t from-emerald-600 to-emerald-400"],
                  ["> 5 Years", 15, "bg-gradient-to-t from-emerald-400 to-emerald-300"],
                ].map(([label, amount, color]) => (
                  <div key={String(label)} className="relative flex h-full flex-1 items-end justify-center">
                    <div className={`relative w-full max-w-16 rounded-t-md ${color}`} style={{ height: `${Number(amount) * 2.5}%` }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700">{amount}</span>
                    </div>
                    <span className="absolute -bottom-7 whitespace-nowrap text-[11px] font-medium text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-7" />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Plots by Location</h2>
              <SelectBox value={district} onChange={setDistrict} ariaLabel="Map district">
                <option>All Districts</option><option>Rampur</option><option>Kalyanpur</option><option>Bhawanipur</option><option>Devganj</option>
              </SelectBox>
            </div>
            <div className="relative h-40 overflow-hidden rounded-lg bg-[#eef3ef]">
              <svg viewBox="0 0 500 200" className="absolute inset-0 size-full" aria-hidden="true">
                <defs><linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c7f0d2" /><stop offset="1" stopColor="#92d9a9" /></linearGradient></defs>
                <g fill="none" stroke="#ffffff" strokeWidth="2" opacity=".7"><path d="M-20 40 L130 95 L255 55 L520 88" /><path d="M15 180 L150 100 L260 150 L390 32 L510 155" /><path d="M80 -10 L145 205 M300 -10 L270 205 M425 -10 L365 205" /></g>
                <path d="M64 101 101 58 144 65 169 30 222 43 251 17 286 47 329 39 349 71 407 69 422 105 461 124 435 169 376 162 332 190 274 168 224 185 186 156 122 164 96 136Z" fill="url(#mapFill)" stroke="#7dcc99" strokeWidth="1.5" />
                <g fill="none" stroke="#a7deb8" strokeWidth="1.2"><path d="M109 65 145 101 96 136 M169 31 181 98 122 164 M222 43 224 185 M286 47 274 168 M349 71 332 190 M407 69 376 162" /><path d="M96 136 181 98 274 168 M145 101 224 43 286 47 349 71 422 105 M181 98 349 71 M224 185 332 190" /></g>
              </svg>
              {[["34%", "17%"], ["51%", "37%"], ["40%", "58%"], ["65%", "68%"], ["25%", "43%"]].map(([left, top], index) => (
                <LuMapPin key={`${left}-${top}`} className="absolute -translate-x-1/2 -translate-y-full text-3xl text-emerald-800 drop-shadow" style={{ left, top }} aria-label={`Plot location ${index + 1}`} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-3 grid items-start gap-3 xl:grid-cols-[minmax(0,2.2fr)_minmax(330px,0.95fr)]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">List of Plots</h2>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative block">
                  <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by plot ID, landowner, location..." className="h-10 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
                <SelectBox value={status} onChange={(value) => { setStatus(value); setPage(1); }} ariaLabel="Filter plot status">
                  <option>All Status</option><option>Used</option><option>Unused</option>
                </SelectBox>
                <SelectBox value={district} onChange={(value) => { setDistrict(value); setPage(1); }} ariaLabel="Filter district">
                  <option>All Districts</option><option>Rampur</option><option>Kalyanpur</option><option>Bhawanipur</option><option>Devganj</option>
                </SelectBox>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[870px] border-collapse text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600"><tr>{["#", "Plot ID", "Landowner", "Location", "Area (Acre)", "Status", "Lease Period", "Payment (₹)", "Actions"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead>
                <tbody>
                  {filteredPlots.map((plot, index) => (
                    <tr key={plot.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                      <td className="px-3 py-3 font-medium">{index + 1}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{plot.id}</td>
                      <td className="px-3 py-3">{plot.landowner}</td>
                      <td className="px-3 py-3">{plot.location}</td>
                      <td className="px-3 py-3">{plot.area}</td>
                      <td className="px-3 py-3"><span className={`rounded-md px-3 py-1 font-semibold ${plot.status === "Used" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{plot.status}</span></td>
                      <td className="whitespace-nowrap px-3 py-3">{plot.leasePeriod}</td>
                      <td className="px-3 py-3">{plot.payment}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3 text-lg text-slate-600">
                          <button type="button" onClick={() => setViewingPlot(plot)} className="transition hover:text-emerald-700" aria-label={`View ${plot.id}`}><LuEye /></button>
                          <button type="button" onClick={() => openEditPlot(plot)} className="transition hover:text-emerald-700" aria-label={`Edit ${plot.id}`}><LuPencil /></button>
                          <button type="button" onClick={() => showNotice(`Lease document opened for ${plot.id}.`)} className="transition hover:text-emerald-700" aria-label={`Open documents for ${plot.id}`}><LuFileText /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPlots.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">No plots match your filters.</td></tr>}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 text-xs text-slate-600">
              <p>Showing {filteredPlots.length ? 1 : 0} to {filteredPlots.length} of {query || status !== "All Status" || district !== "All Districts" ? filteredPlots.length : 128} plots</p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50" aria-label="Previous page"><LuChevronLeft /></button>
                {[1, 2, 3, 4, 5].map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`size-9 rounded-lg border font-semibold ${page === number ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{number}</button>)}
                <span className="px-2">…</span>
                <button type="button" onClick={() => setPage(16)} className={`size-9 rounded-lg border font-semibold ${page === 16 ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>16</button>
                <button type="button" onClick={() => setPage((value) => Math.min(16, value + 1))} className="grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50" aria-label="Next page"><LuChevronRight /></button>
              </div>
            </footer>
          </section>

          <aside className="space-y-3">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Recent Payments</h2><button type="button" onClick={() => showNotice("Showing all recent payments.")} className="text-xs font-semibold text-emerald-700 underline underline-offset-2">View All</button></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[350px] text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600"><tr>{["Date", "Plot ID", "Landowner", "Amount (₹)"].map((item) => <th key={item} className="px-2 py-2 font-semibold last:text-right">{item}</th>)}</tr></thead>
                  <tbody>{payments.map((payment) => <tr key={`${payment[0]}-${payment[1]}`} className="border-t border-slate-100">{payment.map((value, index) => <td key={`${value}-${index}`} className={`px-2 py-2.5 ${index === 3 ? "text-right font-semibold" : ""}`}>{value}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Plots with Expiring Lease</h2><button type="button" onClick={() => showNotice("Showing all expiring leases.")} className="text-xs font-semibold text-emerald-700 underline underline-offset-2">View All</button></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[350px] text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600"><tr>{["Plot ID", "Landowner", "Lease End Date", "Days Left"].map((item) => <th key={item} className="px-2 py-2 font-semibold last:text-right">{item}</th>)}</tr></thead>
                  <tbody>{expiringLeases.map((lease) => <tr key={lease[0]} className="border-t border-slate-100"><td className="px-2 py-2.5 font-semibold">{lease[0]}</td><td className="px-2 py-2.5">{lease[1]}</td><td className="whitespace-nowrap px-2 py-2.5">{lease[2]}</td><td className="px-2 py-2.5 text-right"><span className={`inline-block min-w-10 rounded-md px-2 py-1 text-center font-semibold ${lease[4] === "warning" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-700"}`}>{lease[3]}</span></td></tr>)}</tbody>
                </table>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {formOpen && (
        <Modal onClose={() => setFormOpen(false)} width="max-w-2xl">
          <form onSubmit={submitPlot}>
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div><h2 className="text-xl font-bold text-slate-950">{editingPlot ? "Edit Plot" : "Add New Plot"}</h2><p className="mt-1 text-sm text-slate-500">Enter the plot, lease and payment information.</p></div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close form"><LuX className="text-xl" /></button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {[["Plot ID", "id", "PLT-009"], ["Landowner", "landowner", "Enter landowner name"], ["Location", "location", "Village, Block"], ["Area (Acre)", "area", "e.g. 2.5"]].map(([label, key, placeholder]) => (
                <label key={key} className="space-y-1.5 text-sm font-semibold text-slate-700">
                  <span>{label} <span className="text-red-500">*</span></span>
                  <input required value={form[key as keyof PlotForm]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} className="h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
              ))}
              <label className="space-y-1.5 text-sm font-semibold text-slate-700"><span>Status <span className="text-red-500">*</span></span><select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PlotStatus }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-emerald-500"><option>Used</option><option>Unused</option></select></label>
              <label className="space-y-1.5 text-sm font-semibold text-slate-700"><span>Payment (₹)</span><input value={form.payment === "–" ? "" : form.payment} onChange={(event) => setForm((current) => ({ ...current, payment: event.target.value }))} placeholder="e.g. 1,20,000" disabled={form.status === "Unused"} className="h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none disabled:bg-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-slate-700"><span>Lease Start</span><div className="relative"><LuCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.leaseStart} onChange={(event) => setForm((current) => ({ ...current, leaseStart: event.target.value }))} placeholder="dd mmm yyyy" disabled={form.status === "Unused"} className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 font-normal outline-none disabled:bg-slate-100 focus:border-emerald-500" /></div></label>
              <label className="space-y-1.5 text-sm font-semibold text-slate-700"><span>Lease End</span><div className="relative"><LuCalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.leaseEnd} onChange={(event) => setForm((current) => ({ ...current, leaseEnd: event.target.value }))} placeholder="dd mmm yyyy" disabled={form.status === "Unused"} className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 font-normal outline-none disabled:bg-slate-100 focus:border-emerald-500" /></div></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"><button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">{editingPlot ? "Save Changes" : "Add Plot"}</button></div>
          </form>
        </Modal>
      )}

      {viewingPlot && (
        <Modal onClose={() => setViewingPlot(null)}>
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Plot details</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{viewingPlot.id}</h2></div><button type="button" onClick={() => setViewingPlot(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close details"><LuX className="text-xl" /></button></div>
          <div className="p-6">
            <div className="mb-5 flex items-center gap-4 rounded-xl bg-emerald-50 p-4"><div className="grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-700"><LuUserRound /></div><div><p className="font-bold text-slate-900">{viewingPlot.landowner}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><LuMapPin /> {viewingPlot.location}</p></div></div>
            <dl className="divide-y divide-slate-100 text-sm">
              {[["Area", `${viewingPlot.area} acres`], ["Usage Status", viewingPlot.status], ["Lease Period", viewingPlot.leasePeriod], ["Payment", viewingPlot.payment === "–" ? "Not applicable" : `₹ ${viewingPlot.payment}`]].map(([label, value]) => <div key={label} className="flex justify-between gap-6 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-800">{value}</dd></div>)}
            </dl>
            <button type="button" onClick={() => { setViewingPlot(null); openEditPlot(viewingPlot); }} className="mt-6 w-full rounded-lg bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Edit Plot Details</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
