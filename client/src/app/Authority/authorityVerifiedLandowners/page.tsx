"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  LuArrowUp,
  LuBriefcaseBusiness,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuClock3,
  LuDownload,
  LuEllipsisVertical,
  LuFilter,
  LuFlag,
  LuSearch,
  LuShieldCheck,
  LuUsersRound,
  LuX,
} from "react-icons/lu";

type LandownerTab = "All Landowners" | "Pending Requests" | "Verified Landowners" | "Flagged / Inactive";
type LandownerStatus = "Verified" | "Pending" | "Under Review" | "Flagged";
type LandType = "Agricultural" | "Residential";

type Landowner = {
  id: number;
  initials: string;
  name: string;
  landownerId: string;
  village: string;
  district: string;
  landSize: string;
  landType: LandType;
  requestType: string;
  worker: string;
  workerInitials: string;
  status: LandownerStatus;
};

const initialLandowners: Landowner[] = [
  { id: 1, initials: "RK", name: "Ramesh Kumar", landownerId: "LN-2026-1001", village: "Bhainsa Village", district: "Nirmal District", landSize: "5.20 ac", landType: "Agricultural", requestType: "Verification", worker: "Ravi Kumar", workerInitials: "RK", status: "Verified" },
  { id: 2, initials: "SD", name: "Sita Devi", landownerId: "LN-2026-1002", village: "Mothi Village", district: "Nirmal District", landSize: "3.10 ac", landType: "Agricultural", requestType: "Registration", worker: "Arjun Patel", workerInitials: "AP", status: "Pending" },
  { id: 3, initials: "AP", name: "Arjun Patel", landownerId: "LN-2026-1003", village: "Bheemgal Village", district: "Nirmal District", landSize: "2.75 ac", landType: "Residential", requestType: "Verification", worker: "Meena Yadav", workerInitials: "MY", status: "Pending" },
  { id: 4, initials: "MY", name: "Meena Yadav", landownerId: "LN-2026-1004", village: "Khadgaon Village", district: "Nirmal District", landSize: "6.00 ac", landType: "Agricultural", requestType: "Update", worker: "Vikram Singh", workerInitials: "VS", status: "Under Review" },
  { id: 5, initials: "VS", name: "Vikram Singh", landownerId: "LN-2026-1005", village: "Wazeed Village", district: "Nirmal District", landSize: "1.25 ac", landType: "Residential", requestType: "Verification", worker: "Ravi Kumar", workerInitials: "RK", status: "Verified" },
  { id: 6, initials: "PK", name: "Prem Kumar", landownerId: "LN-2026-1006", village: "Dharmapur Village", district: "Nirmal District", landSize: "4.80 ac", landType: "Agricultural", requestType: "Registration", worker: "Arjun Patel", workerInitials: "AP", status: "Pending" },
  { id: 7, initials: "LS", name: "Lakshmi Sai", landownerId: "LN-2026-1007", village: "Ichoda Village", district: "Nirmal District", landSize: "2.00 ac", landType: "Residential", requestType: "Update", worker: "Meena Yadav", workerInitials: "MY", status: "Under Review" },
  { id: 8, initials: "GN", name: "Gopal Naik", landownerId: "LN-2026-1008", village: "Banswada Village", district: "Nirmal District", landSize: "3.60 ac", landType: "Agricultural", requestType: "Registration", worker: "—", workerInitials: "", status: "Pending" },
  { id: 9, initials: "SH", name: "Shankar Hegde", landownerId: "LN-2026-1009", village: "Utnoor Village", district: "Nirmal District", landSize: "7.15 ac", landType: "Agricultural", requestType: "Verification", worker: "Vikram Singh", workerInitials: "VS", status: "Verified" },
  { id: 10, initials: "NB", name: "Nasreen Begum", landownerId: "LN-2026-1010", village: "Kuntala Village", district: "Nirmal District", landSize: "1.80 ac", landType: "Residential", requestType: "Complaint", worker: "—", workerInitials: "", status: "Flagged" },
];

const tabs: Array<{ label: LandownerTab; icon: ReactNode }> = [
  { label: "All Landowners", icon: <LuUsersRound aria-hidden="true" /> },
  { label: "Pending Requests", icon: <LuClock3 aria-hidden="true" /> },
  { label: "Verified Landowners", icon: <LuCircleCheck aria-hidden="true" /> },
  { label: "Flagged / Inactive", icon: <LuFlag aria-hidden="true" /> },
];

const pendingRequests = [
  { initials: "SD", name: "Sita Devi", id: "LN-2026-1002", time: "2 hours ago", avatarClass: "bg-emerald-100 text-emerald-800" },
  { initials: "AP", name: "Arjun Patel", id: "LN-2026-1003", time: "5 hours ago", avatarClass: "bg-emerald-50 text-emerald-700" },
  { initials: "PK", name: "Prem Kumar", id: "LN-2026-1006", time: "1 day ago", avatarClass: "bg-amber-100 text-amber-800" },
  { initials: "GN", name: "Gopal Naik", id: "LN-2026-1008", time: "1 day ago", avatarClass: "bg-amber-50 text-amber-700" },
  { initials: "SA", name: "Rafiq Ahmed", id: "LN-2026-1012", time: "2 days ago", avatarClass: "bg-amber-100 text-amber-800" },
];

const currentWorkers = [
  { initials: "RK", name: "Ravi Kumar", cases: 8, width: "72%", avatarClass: "bg-sky-100 text-sky-700" },
  { initials: "AP", name: "Arjun Patel", cases: 6, width: "55%", avatarClass: "bg-emerald-100 text-emerald-700" },
  { initials: "MY", name: "Meena Yadav", cases: 5, width: "45%", avatarClass: "bg-blue-100 text-blue-700" },
  { initials: "VS", name: "Vikram Singh", cases: 5, width: "45%", avatarClass: "bg-red-100 text-red-600" },
  { initials: "AV", name: "Anil Verma", cases: 4, width: "36%", avatarClass: "bg-amber-100 text-amber-700" },
];

const statusStyles: Record<LandownerStatus, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-600",
  Flagged: "bg-red-100 text-red-500",
};

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)] ${className}`}>{children}</section>;
}

function MetricCard({ value, label, trend, icon, cardClass, iconClass, trendClass = "text-emerald-600" }: { value: string; label: string; trend: string; icon: ReactNode; cardClass: string; iconClass: string; trendClass?: string }) {
  return (
    <article className={`flex min-h-[118px] items-center gap-4 rounded-xl border border-white/70 px-4 shadow-[0_5px_18px_rgba(15,46,34,0.03)] ${cardClass}`}>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[28px] ${iconClass}`}>{icon}</span>
      <div className="min-w-0"><p className="text-[25px] font-extrabold leading-none tracking-[-0.035em] text-slate-950">{value}</p><p className="mt-2 text-[11px] font-semibold text-slate-700">{label}</p><p className={`mt-2 flex items-center gap-1 text-[9px] ${trendClass}`}><LuArrowUp aria-hidden="true" /><span className="font-bold">{trend}</span><span className="text-slate-500">from last month</span></p></div>
    </article>
  );
}

function Avatar({ initials, className = "bg-slate-100 text-slate-600" }: { initials: string; className?: string }) {
  return <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${className}`}>{initials}</span>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block min-w-[112px]"><span className="mb-1.5 block text-[9px] font-semibold text-slate-500">{label}</span><span className="relative block"><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[9px] font-semibold text-slate-600 outline-none focus:border-emerald-600"><option>{`All ${label === "Status" ? "Status" : label === "District" ? "Districts" : "Types"}`}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></span></label>
  );
}

export default function AuthorityVerifiedLandowners() {
  const [landowners, setLandowners] = useState<Landowner[]>(initialLandowners);
  const [activeTab, setActiveTab] = useState<LandownerTab>("All Landowners");
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [landTypeFilter, setLandTypeFilter] = useState("All Types");
  const [requestTypeFilter, setRequestTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const filteredLandowners = useMemo(() => landowners.filter((landowner) => {
    const matchesTab = activeTab === "All Landowners"
      || (activeTab === "Pending Requests" && landowner.status === "Pending")
      || (activeTab === "Verified Landowners" && landowner.status === "Verified")
      || (activeTab === "Flagged / Inactive" && landowner.status === "Flagged");
    const matchesSearch = `${landowner.name} ${landowner.landownerId} ${landowner.village} ${landowner.worker}`.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === "All Districts" || landowner.district === districtFilter;
    const matchesLandType = landTypeFilter === "All Types" || landowner.landType === landTypeFilter;
    const matchesRequestType = requestTypeFilter === "All Types" || landowner.requestType === requestTypeFilter;
    const matchesStatus = statusFilter === "All Status" || landowner.status === statusFilter;
    return matchesTab && matchesSearch && matchesDistrict && matchesLandType && matchesRequestType && matchesStatus;
  }), [activeTab, districtFilter, landTypeFilter, landowners, requestTypeFilter, search, statusFilter]);

  const selectedLandowner = landowners.find((landowner) => landowner.id === selectedId) ?? null;
  const assigningLandowner = landowners.find((landowner) => landowner.id === assigningId) ?? null;
  const defaultView = activeTab === "All Landowners" && !search && districtFilter === "All Districts" && landTypeFilter === "All Types" && requestTypeFilter === "All Types" && statusFilter === "All Status";
  const displayTotal = defaultView ? 3248 : filteredLandowners.length;
  const firstVisible = filteredLandowners.length ? (page - 1) * rowsPerPage + 1 : 0;
  const lastVisible = Math.min(page * rowsPerPage, filteredLandowners.length);

  function resetFilters() {
    setSearch(""); setDistrictFilter("All Districts"); setLandTypeFilter("All Types"); setRequestTypeFilter("All Types"); setStatusFilter("All Status"); setPage(1);
  }

  function exportReport() {
    const header = "Name,Landowner ID,Village,District,Land Size,Type,Assigned Worker,Status";
    const rows = filteredLandowners.map((landowner) => [landowner.name, landowner.landownerId, landowner.village, landowner.district, landowner.landSize, landowner.landType, landowner.worker, landowner.status].join(","));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "landowners-report.csv"; anchor.click(); URL.revokeObjectURL(url);
    setNotice("Landowners report exported successfully.");
  }

  function approveLandowner() {
    if (!selectedLandowner) return;
    setLandowners((current) => current.map((landowner) => landowner.id === selectedLandowner.id ? { ...landowner, status: "Verified" } : landowner));
    setSelectedId(null); setNotice(`${selectedLandowner.name} has been verified.`);
  }

  function flagLandowner() {
    if (!selectedLandowner) return;
    setLandowners((current) => current.map((landowner) => landowner.id === selectedLandowner.id ? { ...landowner, status: "Flagged" } : landowner));
    setSelectedId(null); setNotice(`${selectedLandowner.name} has been flagged for follow-up.`);
  }

  function assignWorker(worker: string) {
    if (!assigningLandowner) return;
    const initials = worker.split(" ").map((part) => part[0]).join("");
    setLandowners((current) => current.map((landowner) => landowner.id === assigningLandowner.id ? { ...landowner, worker, workerInitials: initials, status: "Under Review" } : landowner));
    setAssigningId(null); setNotice(`${worker} assigned to ${assigningLandowner.name}.`);
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto min-w-[1120px] max-w-[1500px] px-5 py-5">
        <header className="flex items-start justify-between gap-6"><div><h1 className="text-[29px] font-extrabold tracking-[-0.04em] text-slate-950">Landowners &amp; Requests</h1><p className="mt-1 text-[12px] text-slate-500">Manage landowners, their requests, and assigned field workers.</p></div><button type="button" onClick={exportReport} className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-700 bg-white px-5 text-[11px] font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50"><LuDownload className="text-base" aria-hidden="true" />Export Report</button></header>

        <nav className="mt-6 grid max-w-[720px] grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Landowner sections">
          {tabs.map((tab) => <button key={tab.label} type="button" onClick={() => { setActiveTab(tab.label); setPage(1); }} className={`flex h-12 items-center justify-center gap-2 border-b-[4px] text-[10px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-emerald-50/40 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50"}`}><span className="text-base">{tab.icon}</span>{tab.label}</button>)}
        </nav>

        {notice && <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message"><LuX aria-hidden="true" /></button></div>}

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_315px] items-start gap-4">
          <main className="min-w-0 space-y-4">
            <section className="grid grid-cols-4 gap-4" aria-label="Landowner summary">
              <MetricCard value="3,248" label="Total Landowners" trend="8%" icon={<LuUsersRound aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-[#f1f9f4]" iconClass="bg-emerald-100 text-emerald-700" />
              <MetricCard value="412" label="Pending Requests" trend="12%" icon={<LuClock3 aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-[#fff8e9]" iconClass="bg-amber-100 text-amber-700" trendClass="text-amber-500" />
              <MetricCard value="2,518" label="Verified Landowners" trend="10%" icon={<LuShieldCheck aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-[#eef9f3]" iconClass="bg-emerald-100 text-emerald-700" />
              <MetricCard value="376" label="Active Cases" trend="6%" icon={<LuBriefcaseBusiness aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-[#eff8ff]" iconClass="bg-blue-100 text-blue-700" />
            </section>

            <Panel className="overflow-visible">
              <div className="flex items-end gap-3 px-3 pb-4 pt-4">
                <FilterSelect label="District" value={districtFilter} onChange={(value) => { setDistrictFilter(value); setPage(1); }} options={["Nirmal District", "Adilabad District", "Kamareddy District"]} />
                <FilterSelect label="Land Type" value={landTypeFilter} onChange={(value) => { setLandTypeFilter(value); setPage(1); }} options={["Agricultural", "Residential"]} />
                <FilterSelect label="Request Type" value={requestTypeFilter} onChange={(value) => { setRequestTypeFilter(value); setPage(1); }} options={["Verification", "Registration", "Update", "Complaint"]} />
                <FilterSelect label="Status" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={["Verified", "Pending", "Under Review", "Flagged"]} />
                <button type="button" onClick={resetFilters} className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[9px] font-semibold text-slate-600 hover:bg-slate-50"><LuFilter aria-hidden="true" />Filters</button>
                <label className="relative block min-w-[215px] flex-1"><span className="sr-only">Search landowners</span><LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search landowners..." className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-[9px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><LuSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" /></label>
              </div>

              <div className="overflow-x-auto px-3">
                <table className="w-full min-w-[800px] text-left text-[8px]">
                  <thead><tr className="bg-slate-50 text-slate-600"><th className="rounded-l-lg px-2.5 py-3 font-semibold">Name</th><th className="px-2.5 py-3 font-semibold">Landowner ID</th><th className="px-2.5 py-3 font-semibold">Village / District</th><th className="px-2.5 py-3 font-semibold">Land Size</th><th className="px-2.5 py-3 font-semibold">Type</th><th className="px-2.5 py-3 font-semibold">Assigned Worker</th><th className="px-2.5 py-3 font-semibold">Status</th><th className="rounded-r-lg px-2.5 py-3 text-center font-semibold">Action</th></tr></thead>
                  <tbody>
                    {filteredLandowners.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((landowner) => (
                      <tr key={landowner.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50">
                        <td className="px-2.5 py-2.5"><span className="flex min-w-[100px] items-center gap-2 font-bold text-slate-800"><Avatar initials={landowner.initials} />{landowner.name}</span></td>
                        <td className="px-2.5 py-2.5">{landowner.landownerId}</td><td className="px-2.5 py-2.5"><span className="block">{landowner.village}</span><span className="mt-0.5 block">{landowner.district}</span></td><td className="px-2.5 py-2.5">{landowner.landSize}</td>
                        <td className="px-2.5 py-2.5"><span className={`rounded-md px-2 py-1.5 font-semibold ${landowner.landType === "Agricultural" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-600"}`}>{landowner.landType}</span></td>
                        <td className="px-2.5 py-2.5">{landowner.workerInitials ? <span className="flex min-w-[92px] items-center gap-2"><Avatar initials={landowner.workerInitials} />{landowner.worker}</span> : "—"}</td>
                        <td className="px-2.5 py-2.5"><span className={`inline-flex min-w-[68px] justify-center rounded-md px-2 py-1.5 font-semibold ${statusStyles[landowner.status]}`}>{landowner.status}</span></td>
                        <td className="relative px-2.5 py-2.5"><div className="flex items-center justify-center gap-2"><button type="button" onClick={() => landowner.worker === "—" ? setAssigningId(landowner.id) : setSelectedId(landowner.id)} className="h-8 min-w-[58px] rounded-md border border-emerald-600 px-3 font-semibold text-emerald-700 hover:bg-emerald-50">{landowner.worker === "—" ? "Assign" : landowner.status === "Verified" ? "View" : "Review"}</button><button type="button" onClick={() => setMenuId((current) => current === landowner.id ? null : landowner.id)} aria-label={`More actions for ${landowner.name}`} className="rounded p-1.5 text-sm text-slate-600 hover:bg-slate-100"><LuEllipsisVertical aria-hidden="true" /></button></div>{menuId === landowner.id && <div className="absolute right-4 top-9 z-20 w-32 rounded-lg border border-slate-200 bg-white p-1.5 text-left shadow-xl"><button type="button" onClick={() => { setSelectedId(landowner.id); setMenuId(null); }} className="w-full rounded px-2 py-2 hover:bg-slate-50">View Details</button><button type="button" onClick={() => { setAssigningId(landowner.id); setMenuId(null); }} className="w-full rounded px-2 py-2 text-emerald-700 hover:bg-emerald-50">Assign Worker</button></div>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLandowners.length === 0 && <div className="py-14 text-center text-[11px] text-slate-500">No landowners match the selected filters.</div>}
              </div>

              <div className="flex items-center justify-between gap-4 px-3 py-4 text-[9px] text-slate-500"><span>Showing {firstVisible} to {lastVisible} of {displayTotal.toLocaleString()} landowners</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3, 4, 5].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md border font-semibold ${page === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{pageNumber}</button>)}<span>•••</span><button type="button" onClick={() => setPage(325)} className="h-8 min-w-10 rounded-md border border-slate-200 px-2">325</button><button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"><LuChevronRight aria-hidden="true" /></button></div><label className="relative"><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold outline-none"><option value={10}>10 / page</option><option value={25}>25 / page</option><option value={50}>50 / page</option></select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" /></label></div>
            </Panel>
          </main>

          <aside className="space-y-4" aria-label="Landowner request summaries">
            <Panel className="overflow-hidden"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-[12px] font-bold text-slate-900">Pending Landowner Requests</h2><button type="button" onClick={() => setActiveTab("Pending Requests")} className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button></div><div className="px-3">{pendingRequests.map((request) => <div key={request.id} className="grid grid-cols-[30px_minmax(0,1fr)_66px_58px] items-center gap-2 border-b border-slate-100 py-2.5 last:border-b-0"><Avatar initials={request.initials} className={request.avatarClass} /><span className="min-w-0"><span className="block truncate text-[9px] font-bold text-slate-800">{request.name}</span><span className="mt-1 block text-[8px] text-slate-500">{request.id}</span></span><span className="text-right text-[8px] text-slate-500">{request.time}</span><button type="button" onClick={() => { const match = landowners.find((landowner) => landowner.landownerId === request.id); if (match) setSelectedId(match.id); }} className="h-7 rounded-md bg-amber-50 text-[8px] font-semibold text-amber-700 hover:bg-amber-100">Review</button></div>)}</div><div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[9px]"><span className="font-medium text-slate-500">Total Pending</span><strong className="text-emerald-700">412</strong></div></Panel>

            <Panel className="overflow-hidden"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-[12px] font-bold text-slate-900">Current Workers</h2><button type="button" onClick={() => setNotice("Showing all currently assigned workers.")} className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button></div><div className="px-3">{currentWorkers.map((worker) => <div key={worker.name} className="grid grid-cols-[30px_minmax(0,1fr)_48px_74px] items-center gap-2 py-2"><Avatar initials={worker.initials} className={worker.avatarClass} /><span className="truncate text-[9px] font-semibold text-slate-700">{worker.name}</span><span className="text-right text-[8px] text-slate-500">{worker.cases} cases</span><span className="h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-emerald-700" style={{ width: worker.width }} /></span></div>)}</div><div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[9px]"><span className="font-medium text-slate-500">Total Workers Assigned</span><strong className="text-emerald-700">28</strong></div></Panel>

            <Panel className="overflow-hidden pb-3"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-[12px] font-bold text-slate-900">Request Status Overview</h2><label className="relative"><select className="h-8 appearance-none rounded-md border border-slate-200 bg-white pl-2 pr-7 text-[8px] font-semibold text-slate-600"><option>Last 30 Days</option><option>Last 90 Days</option></select><LuChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]" aria-hidden="true" /></label></div><div className="grid grid-cols-[150px_1fr] items-center gap-3 px-4 py-3"><div className="relative mx-auto h-[135px] w-[135px]"><div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#ffa91e 0 42%, #9eddb0 42% 67%, #48a0ac 67% 89%, #ef8b78 89% 95%, #f04452 95% 100%)" }} /><div className="absolute inset-[30px] flex flex-col items-center justify-center rounded-full bg-white"><strong className="text-[22px] text-slate-950">412</strong><span className="text-[8px] text-slate-500">Total Requests</span></div></div><dl className="space-y-2 text-[8px]">{[["Pending", "42% (173)", "bg-amber-400"], ["Under Review", "25% (103)", "bg-emerald-300"], ["Verified", "22% (91)", "bg-cyan-600"], ["Flagged", "6% (25)", "bg-red-300"], ["Rejected", "5% (20)", "bg-red-500"]].map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} /><dt className="min-w-0 flex-1 font-semibold text-slate-600">{label}</dt><dd className="text-slate-500">{value}</dd></div>)}</dl></div><div className="mx-4 flex items-center gap-1 border-t border-slate-100 pt-3 text-[8px] text-slate-500"><LuArrowUp className="text-emerald-600" aria-hidden="true" /><strong className="text-emerald-600">9%</strong> more requests than previous 30 days</div></Panel>
          </aside>
        </div>
      </div>

      {selectedLandowner && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="review-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><h2 id="review-title" className="text-xl font-bold text-slate-900">Landowner Request</h2><p className="mt-1 text-[11px] text-slate-500">Review identity and land registration details.</p></div><button type="button" onClick={() => setSelectedId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close review"><LuX aria-hidden="true" /></button></div><div className="mt-5 flex items-center gap-3"><Avatar initials={selectedLandowner.initials} className="h-11 w-11 bg-emerald-100 text-emerald-800 text-sm" /><div><p className="text-sm font-bold text-slate-800">{selectedLandowner.name}</p><p className="mt-1 text-[10px] text-slate-500">{selectedLandowner.landownerId}</p></div></div><dl className="mt-5 divide-y divide-slate-100 text-[11px]">{[["Village", selectedLandowner.village], ["District", selectedLandowner.district], ["Land Size", selectedLandowner.landSize], ["Land Type", selectedLandowner.landType], ["Assigned Worker", selectedLandowner.worker], ["Status", selectedLandowner.status]].map(([label, value]) => <div key={label} className="flex justify-between py-2.5"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-700">{value}</dd></div>)}</dl><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={flagLandowner} className="h-10 rounded-lg border border-red-300 px-5 text-[11px] font-semibold text-red-500 hover:bg-red-50">Flag Request</button><button type="button" onClick={approveLandowner} className="h-10 rounded-lg bg-emerald-700 px-5 text-[11px] font-semibold text-white hover:bg-emerald-800">Approve &amp; Verify</button></div></div></div>}

      {assigningLandowner && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="assign-title"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><h2 id="assign-title" className="text-lg font-bold text-slate-900">Assign Field Worker</h2><p className="mt-1 text-[10px] text-slate-500">Choose a worker for {assigningLandowner.name}.</p></div><button type="button" onClick={() => setAssigningId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close assignment"><LuX aria-hidden="true" /></button></div><div className="mt-5 space-y-2">{currentWorkers.map((worker) => <button key={worker.name} type="button" onClick={() => assignWorker(worker.name)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-emerald-500 hover:bg-emerald-50"><Avatar initials={worker.initials} className={worker.avatarClass} /><span className="flex-1"><span className="block text-[11px] font-semibold text-slate-800">{worker.name}</span><span className="mt-0.5 block text-[9px] text-slate-500">{worker.cases} active cases</span></span><span className="text-[9px] font-semibold text-emerald-700">Assign</span></button>)}</div></div></div>}
    </div>
  );
}
