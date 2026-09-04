"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {LuArrowUp,LuChevronDown,LuChevronLeft,LuChevronRight,LuCircleAlert,LuCircleCheck,LuFilePlus,
  LuFilter,LuFolderOpen,LuMessageCircle,LuPlus,LuRefreshCw,LuSearch,LuUserRound,LuX,
} from "@/components/ui/icons";

type ComplaintTab = "All Complaints" | "Open Complaints" | "In Progress" | "Resolved" | "Escalated";
type ComplaintStatus = "Open" | "In Progress" | "Escalated" | "Pending Review" | "Resolved";
type ComplaintPriority = "High" | "Medium" | "Low";

type Complaint = {
  id: number;
  complaintId: string;
  subject: string;
  raisedBy: string;
  raisedByType: string;
  category: string;
  priority: ComplaintPriority;
  date: string;
  time: string;
  status: ComplaintStatus;
  description: string;
};

const initialComplaints: Complaint[] = [
  { id: 1, complaintId: "CMP-2025-0887", subject: "Dispute over land boundary", raisedBy: "Ramesh Kumar", raisedByType: "Landowner", category: "Land Dispute", priority: "High", date: "12 May 2025", time: "10:24 AM", status: "Open", description: "Boundary markers do not match the registered survey map." },
  { id: 2, complaintId: "CMP-2025-0886", subject: "Delayed verification process", raisedBy: "Sita Devi", raisedByType: "Landowner", category: "Verification", priority: "Medium", date: "12 May 2025", time: "09:45 AM", status: "In Progress", description: "Land verification has remained pending beyond the expected processing time." },
  { id: 3, complaintId: "CMP-2025-0885", subject: "Unauthorized occupation of government land", raisedBy: "Arjun Patel", raisedByType: "Landowner", category: "Illegal Occupation", priority: "High", date: "11 May 2025", time: "04:15 PM", status: "Escalated", description: "Government land appears to be occupied without authorization." },
  { id: 4, complaintId: "CMP-2025-0884", subject: "Worker wage payment issue", raisedBy: "Mohit Sharma", raisedByType: "Worker", category: "Labor Issue", priority: "Medium", date: "11 May 2025", time: "02:30 PM", status: "In Progress", description: "Payment for completed field work has not been received." },
  { id: 5, complaintId: "CMP-2025-0883", subject: "Soil testing report mismatch", raisedBy: "Kavita Joshi", raisedByType: "Landowner", category: "Documents", priority: "Low", date: "10 May 2025", time: "11:20 AM", status: "Open", description: "Values in the uploaded soil report do not match the physical copy." },
  { id: 6, complaintId: "CMP-2025-0882", subject: "Irrigation channel damage", raisedBy: "Village Panchayat", raisedByType: "Official", category: "Infrastructure", priority: "High", date: "10 May 2025", time: "10:05 AM", status: "Pending Review", description: "The main irrigation channel has been damaged and needs inspection." },
  { id: 7, complaintId: "CMP-2025-0881", subject: "Duplicate land record entry", raisedBy: "Neeraj Singh", raisedByType: "Landowner", category: "Land Records", priority: "Medium", date: "09 May 2025", time: "05:40 PM", status: "Resolved", description: "The same plot appears twice in the digital land registry." },
  { id: 8, complaintId: "CMP-2025-0880", subject: "Compensation claim not processed", raisedBy: "Sunita Devi", raisedByType: "Landowner", category: "Compensation", priority: "High", date: "09 May 2025", time: "03:15 PM", status: "Escalated", description: "Approved crop-loss compensation has not been processed." },
  { id: 9, complaintId: "CMP-2025-0879", subject: "Request for land mutation", raisedBy: "Vikram Yadav", raisedByType: "Landowner", category: "Land Mutation", priority: "Low", date: "08 May 2025", time: "09:25 AM", status: "Resolved", description: "Mutation request needs to be reflected in the latest records." },
  { id: 10, complaintId: "CMP-2025-0878", subject: "Field inspection delay", raisedBy: "Ravi Kumar", raisedByType: "Landowner", category: "Field Inspection", priority: "Medium", date: "08 May 2025", time: "08:40 AM", status: "In Progress", description: "Assigned inspection has not taken place on the scheduled date." },
];

const tabs: Array<{ label: ComplaintTab; count: number }> = [
  { label: "All Complaints", count: 324 },
  { label: "Open Complaints", count: 98 },
  { label: "In Progress", count: 76 },
  { label: "Resolved", count: 118 },
  { label: "Escalated", count: 32 },
];

const priorityStyles: Record<ComplaintPriority, string> = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<ComplaintStatus, string> = {
  Open: "bg-blue-100 text-blue-600",
  "In Progress": "bg-blue-100 text-blue-600",
  Escalated: "bg-red-100 text-red-500",
  "Pending Review": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const rowIconStyles = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-700",
];

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)] ${className}`}>{children}</section>;
}

function MetricCard({ value, label, trend, icon, cardClass, iconClass }: { value: string; label: string; trend: string; icon: ReactNode; cardClass: string; iconClass: string }) {
  return <article className={`flex min-h-[120px] items-center gap-4 rounded-xl border border-white/70 px-4 shadow-[0_5px_18px_rgba(15,46,34,0.025)] ${cardClass}`}><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[27px] ${iconClass}`}>{icon}</span><div className="min-w-0"><p className="text-[25px] font-extrabold leading-none text-slate-950">{value}</p><p className="mt-2 text-[10px] font-semibold text-slate-700">{label}</p><p className="mt-3 flex items-center gap-1 text-[8px] text-emerald-600"><LuArrowUp aria-hidden="true" /><strong>{trend}</strong><span className="text-slate-500">from last month</span></p></div></article>;
}

function SelectFilter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) {
  return <label className="relative block min-w-[132px]"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold text-slate-600 outline-none focus:border-emerald-600"><option>{label}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></label>;
}

export default function AuthorityComplaints() {
  const formRef = useRef<HTMLFormElement>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [activeTab, setActiveTab] = useState<ComplaintTab>("All Complaints");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Complaint Type");
  const [priorityFilter, setPriorityFilter] = useState("Priority");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const filteredComplaints = useMemo(() => complaints.filter((complaint) => {
    const matchesTab = activeTab === "All Complaints"
      || (activeTab === "Open Complaints" && complaint.status === "Open")
      || complaint.status === activeTab;
    const matchesSearch = `${complaint.complaintId} ${complaint.subject} ${complaint.raisedBy} ${complaint.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "Complaint Type" || complaint.raisedByType === typeFilter;
    const matchesPriority = priorityFilter === "Priority" || complaint.priority === priorityFilter;
    const matchesStatus = statusFilter === "Status" || complaint.status === statusFilter;
    return matchesTab && matchesSearch && matchesType && matchesPriority && matchesStatus;
  }), [activeTab, complaints, priorityFilter, search, statusFilter, typeFilter]);

  const selectedComplaint = complaints.find((complaint) => complaint.id === selectedId) ?? null;
  const defaultView = activeTab === "All Complaints" && !search && typeFilter === "Complaint Type" && priorityFilter === "Priority" && statusFilter === "Status";
  const displayTotal = defaultView ? 324 : filteredComplaints.length;
  const firstVisible = filteredComplaints.length ? (page - 1) * rowsPerPage + 1 : 0;
  const lastVisible = Math.min(page * rowsPerPage, filteredComplaints.length);

  function clearForm() {
    formRef.current?.reset();
    setDescription("");
  }

  function registerComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newComplaint: Complaint = {
      id: Math.max(...complaints.map((complaint) => complaint.id)) + 1,
      complaintId: `CMP-2025-${String(888 + complaints.length - initialComplaints.length).padStart(4, "0")}`,
      subject: String(form.get("title")),
      raisedBy: String(form.get("raisedBy")),
      raisedByType: String(form.get("raisedByType")),
      category: String(form.get("category")),
      priority: String(form.get("priority")) as ComplaintPriority,
      date: "12 May 2025",
      time: "Now",
      status: "Open",
      description,
    };
    setComplaints((current) => [newComplaint, ...current]);
    setActiveTab("All Complaints");
    setPage(1);
    clearForm();
    setNotice(`${newComplaint.complaintId} registered successfully.`);
  }

  function updateComplaint(status: ComplaintStatus) {
    if (!selectedComplaint) return;
    setComplaints((current) => current.map((complaint) => complaint.id === selectedComplaint.id ? { ...complaint, status } : complaint));
    setSelectedId(null);
    setNotice(`${selectedComplaint.complaintId} updated to ${status}.`);
  }

  function resetFilters() {
    setSearch(""); setTypeFilter("Complaint Type"); setPriorityFilter("Priority"); setStatusFilter("Status"); setPage(1);
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto min-w-[1120px] max-w-[1500px] px-3 py-3">
        <div className="grid grid-cols-[minmax(0,1fr)_355px] gap-5">
          <main className="min-w-0">
            <header className="flex items-start justify-between gap-6"><div><h1 className="text-[29px] font-extrabold tracking-[-0.04em] text-slate-950">Complaints Management</h1><p className="mt-1 text-[11px] text-slate-500">Track, review, and register complaints from landowners, workers, and field operations.</p></div><button type="button" onClick={() => formRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus()} className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[11px] font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800"><LuPlus className="text-lg" aria-hidden="true" />Register Complaint</button></header>

            <nav className="mt-6 grid grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Complaint sections">{tabs.map((tab) => <button key={tab.label} type="button" onClick={() => { setActiveTab(tab.label); setPage(1); }} className={`flex h-12 items-center justify-center gap-2 border-b-[3px] text-[10px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50"}`}>{tab.label}<span className={`flex h-6 min-w-7 items-center justify-center rounded-full px-1 text-[8px] ${activeTab === tab.label ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.count}</span></button>)}</nav>

            <section className="mt-5 grid grid-cols-4 gap-4" aria-label="Complaint summary"><MetricCard value="324" label="Total Complaints" trend="18%" icon={<LuMessageCircle aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-[#f1f9f4]" iconClass="bg-emerald-100 text-emerald-700" /><MetricCard value="98" label="Open Complaints" trend="12%" icon={<LuFolderOpen aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-[#fff8e9]" iconClass="bg-amber-100 text-amber-700" /><MetricCard value="24" label="Urgent / High Priority" trend="20%" icon={<LuCircleAlert aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-[#fff2f3]" iconClass="bg-red-100 text-red-600" /><MetricCard value="118" label="Resolved This Month" trend="22%" icon={<LuCircleCheck aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-[#eff8ff]" iconClass="bg-blue-100 text-blue-700" /></section>

            {notice && <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message"><LuX aria-hidden="true" /></button></div>}

            <Panel className="mt-5 overflow-visible p-3">
              <div className="flex items-center gap-3 pb-4"><label className="relative block min-w-[250px] flex-1"><span className="sr-only">Search complaints</span><LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search complaints..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[9px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><LuSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" /></label><button type="button" onClick={resetFilters} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[9px] font-semibold text-slate-600 hover:bg-slate-50"><LuFilter aria-hidden="true" />Filters</button><SelectFilter value={typeFilter} onChange={setTypeFilter} label="Complaint Type" options={["Landowner", "Worker", "Official"]} /><SelectFilter value={priorityFilter} onChange={setPriorityFilter} label="Priority" options={["High", "Medium", "Low"]} /><SelectFilter value={statusFilter} onChange={setStatusFilter} label="Status" options={["Open", "In Progress", "Escalated", "Pending Review", "Resolved"]} /><button type="button" onClick={resetFilters} aria-label="Refresh complaint filters" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><LuRefreshCw aria-hidden="true" /></button></div>

              <div className="overflow-x-auto"><table className="w-full min-w-[825px] text-left text-[8px]"><thead><tr className="bg-slate-50 text-slate-600"><th className="rounded-l-lg px-2 py-3 font-semibold">Complaint ID</th><th className="px-2 py-3 font-semibold">Subject</th><th className="px-2 py-3 font-semibold">Raised By</th><th className="px-2 py-3 font-semibold">Category</th><th className="px-2 py-3 font-semibold">Priority</th><th className="px-2 py-3 font-semibold">Date Raised</th><th className="px-2 py-3 font-semibold">Status</th><th className="rounded-r-lg px-2 py-3 text-center font-semibold">Action</th></tr></thead><tbody>{filteredComplaints.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((complaint, index) => <tr key={complaint.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50"><td className="px-2 py-2.5"><span className="flex min-w-[105px] items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${rowIconStyles[index % rowIconStyles.length]}`}><LuMessageCircle aria-hidden="true" /></span>{complaint.complaintId}</span></td><td className="max-w-[130px] px-2 py-2.5 font-medium text-slate-700"><span className="line-clamp-2">{complaint.subject}</span></td><td className="px-2 py-2.5"><span className="block">{complaint.raisedBy}</span><span className="mt-1 block">({complaint.raisedByType})</span></td><td className="px-2 py-2.5">{complaint.category}</td><td className="px-2 py-2.5"><span className={`inline-flex min-w-[50px] justify-center rounded-md px-2 py-1.5 font-semibold ${priorityStyles[complaint.priority]}`}>{complaint.priority}</span></td><td className="px-2 py-2.5"><span className="block">{complaint.date}</span><span className="mt-1 block">{complaint.time}</span></td><td className="px-2 py-2.5"><span className={`inline-flex min-w-[68px] justify-center rounded-md px-2 py-1.5 font-semibold ${statusStyles[complaint.status]}`}>{complaint.status}</span></td><td className="px-2 py-2.5"><button type="button" onClick={() => setSelectedId(complaint.id)} className="flex h-8 min-w-[75px] items-center justify-center gap-2 rounded-md border border-slate-200 px-3 font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700">{complaint.status === "In Progress" ? "Assign" : complaint.status === "Open" || complaint.status === "Resolved" ? "View" : "Review"}<LuChevronDown aria-hidden="true" /></button></td></tr>)}</tbody></table>{filteredComplaints.length === 0 && <div className="py-14 text-center text-[11px] text-slate-500">No complaints match the selected filters.</div>}</div>

              <div className="flex items-center justify-between gap-4 px-1 pb-1 pt-5 text-[9px] text-slate-500"><span>Showing {firstVisible} to {lastVisible} of {displayTotal} complaints</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3, 4, 5].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md border font-semibold ${page === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{pageNumber}</button>)}<span>•••</span><button type="button" onClick={() => setPage(33)} className="h-8 w-8 rounded-md border border-slate-200">33</button><button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"><LuChevronRight aria-hidden="true" /></button></div><label className="relative"><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold outline-none"><option value={10}>10 / page</option><option value={25}>25 / page</option><option value={50}>50 / page</option></select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" /></label></div>
            </Panel>
          </main>

          <aside className="space-y-4" aria-label="Complaint registration and summary">
            <Panel className="p-4"><div className="flex items-center gap-2"><LuFilePlus className="text-xl text-emerald-700" aria-hidden="true" /><h2 className="text-[14px] font-bold text-slate-900">Register New Complaint</h2></div><form ref={formRef} onSubmit={registerComplaint} className="mt-5 space-y-3"><FormInput label="Complaint Title" name="title" placeholder="Enter complaint title" required /><FormSelect label="Raised By" name="raisedByType" required options={["Landowner", "Worker", "Field Official"]} /><div className="grid grid-cols-2 gap-3"><FormSelect label="Category" name="category" required options={["Land Dispute", "Verification", "Labor Issue", "Documents", "Infrastructure", "Compensation"]} /><FormSelect label="Priority" name="priority" required options={["High", "Medium", "Low"]} /></div><FormInput label="Raised By Name" name="raisedBy" placeholder="Enter complainant name" required /><FormInput label="Related ID (Optional)" name="relatedId" placeholder="Enter related ID (e.g., Land ID, Worker ID)" /><label className="block"><span className="mb-1.5 block text-[9px] font-semibold text-slate-600">Description <span className="text-red-500">*</span></span><textarea required maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Provide detailed description of the complaint..." className="h-[72px] w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[9px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><span className="mt-1 block text-right text-[7px] text-slate-400">{description.length} / 1000</span></label><div className="grid grid-cols-2 gap-3"><button type="submit" className="h-9 rounded-md bg-emerald-700 text-[9px] font-semibold text-white hover:bg-emerald-800">Submit Complaint</button><button type="button" onClick={clearForm} className="h-9 rounded-md border border-slate-200 text-[9px] font-semibold text-slate-600 hover:bg-slate-50">Clear</button></div></form></Panel>

            <Panel className="p-4"><h2 className="text-[14px] font-bold text-slate-900">Complaint Summary</h2><div className="mt-4 grid grid-cols-[150px_1fr] items-center gap-3"><div className="relative mx-auto h-[135px] w-[135px]"><div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#5d91e8 0 30%, #94bdf1 30% 53%, #ffb31f 53% 63%, #43ae5a 63% 90%, #f2555b 90% 100%)" }} /><div className="absolute inset-[31px] flex flex-col items-center justify-center rounded-full bg-white"><strong className="text-[20px] text-slate-950">324</strong><span className="text-[8px] text-slate-500">Total</span></div></div><dl className="space-y-2 text-[8px]">{[["Open", "98 (30%)", "bg-blue-500"], ["In Progress", "76 (23%)", "bg-blue-300"], ["Pending Review", "32 (10%)", "bg-amber-400"], ["Resolved", "118 (36%)", "bg-green-500"], ["Escalated", "32 (10%)", "bg-red-500"]].map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} /><dt className="min-w-0 flex-1 font-semibold text-slate-600">{label}</dt><dd className="text-slate-500">{value}</dd></div>)}</dl></div></Panel>

            <Panel className="overflow-hidden pb-3"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-[14px] font-bold text-slate-900">Recent Updates</h2><button type="button" onClick={() => setNotice("Showing all recent complaint updates.")} className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button></div><div className="px-3">{[
              { icon: <LuMessageCircle aria-hidden="true" />, title: "Complaint CMP-2025-0886 status updated to In Progress", date: "12 May 2025, 10:30 AM", color: "bg-blue-100 text-blue-600" },
              { icon: <LuCircleCheck aria-hidden="true" />, title: "Complaint CMP-2025-0881 has been resolved", date: "11 May 2025, 05:20 PM", color: "bg-emerald-100 text-emerald-700" },
              { icon: <LuUserRound aria-hidden="true" />, title: "Complaint CMP-2025-0885 escalated to higher authority", date: "11 May 2025, 04:30 PM", color: "bg-red-100 text-red-500" },
              { icon: <LuMessageCircle aria-hidden="true" />, title: "New complaint CMP-2025-0887 registered", date: "12 May 2025, 10:24 AM", color: "bg-amber-100 text-amber-600" },
            ].map((update) => <div key={update.title} className="grid grid-cols-[32px_1fr] gap-2 py-2.5"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${update.color}`}>{update.icon}</span><div><p className="text-[8px] font-semibold leading-4 text-slate-700">{update.title}</p><p className="mt-0.5 text-[7px] text-slate-500">{update.date}</p></div></div>)}</div></Panel>
          </aside>
        </div>
      </div>

      {selectedComplaint && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="complaint-review-title"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="complaint-review-title" className="text-xl font-bold text-slate-900">{selectedComplaint.complaintId}</h2><p className="mt-1 text-[11px] text-slate-500">Review and update this complaint.</p></div><button type="button" onClick={() => setSelectedId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close complaint"><LuX aria-hidden="true" /></button></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold text-slate-800">{selectedComplaint.subject}</p><p className="mt-2 text-[11px] leading-5 text-slate-600">{selectedComplaint.description}</p></div><dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[10px]">{[["Raised By", `${selectedComplaint.raisedBy} (${selectedComplaint.raisedByType})`], ["Category", selectedComplaint.category], ["Priority", selectedComplaint.priority], ["Status", selectedComplaint.status], ["Date Raised", selectedComplaint.date], ["Time", selectedComplaint.time]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-700">{value}</dd></div>)}</dl><div className="mt-6 grid grid-cols-3 gap-3"><button type="button" onClick={() => updateComplaint("In Progress")} className="h-10 rounded-lg border border-blue-300 text-[10px] font-semibold text-blue-600 hover:bg-blue-50">In Progress</button><button type="button" onClick={() => updateComplaint("Escalated")} className="h-10 rounded-lg border border-red-300 text-[10px] font-semibold text-red-500 hover:bg-red-50">Escalate</button><button type="button" onClick={() => updateComplaint("Resolved")} className="h-10 rounded-lg bg-emerald-700 text-[10px] font-semibold text-white hover:bg-emerald-800">Resolve</button></div></div></div>}
    </div>
  );
}

function FormInput({ label, name, placeholder, required = false }: { label: string; name: string; placeholder: string; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-semibold text-slate-600">{label} {required && <span className="text-red-500">*</span>}</span><input name={name} required={required} placeholder={placeholder} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[9px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>;
}

function FormSelect({ label, name, required = false, options }: { label: string; name: string; required?: boolean; options: string[] }) {
  return <label className="block"><span className="mb-1.5 block text-[9px] font-semibold text-slate-600">{label} {required && <span className="text-red-500">*</span>}</span><span className="relative block"><select name={name} required={required} defaultValue="" className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[9px] text-slate-600 outline-none focus:border-emerald-600"><option value="" disabled>Select {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></span></label>;
}
