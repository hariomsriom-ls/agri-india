"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  LuChevronDown, LuChevronLeft, LuChevronRight, LuCircleAlert, LuCircleCheck,
  LuFolderOpen, LuMessageCircle, LuRefreshCw, LuSearch, LuX,
} from "@/components/ui/icons";
import type { Complaint, ComplaintCategory, ComplaintStatus } from "@/features/landowner-Worker-authority/complaintsdata";
import { useFetchComplaint } from "@/services/fetchComplaints";

type ComplaintTab = "All Complaints" | ComplaintStatus;
const categories: ComplaintCategory[] = ["Payment Issues", "Document Issues", "Management Issues", "Technical Issues", "Other Issues"];
const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-600",
};

function complaintTimestamp(complaint: Complaint) {
  return Date.parse(complaint.Date || complaint.date || complaint.createdAt || "");
}

function formatComplaintDate(complaint: Complaint) {
  const timestamp = complaintTimestamp(complaint);
  if (Number.isNaN(timestamp)) return "Not provided";
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
  });
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={"rounded-lg border border-slate-200 bg-white shadow-sm " + className}>{children}</section>;
}

function MetricCard({ value, label, icon, cardClass, iconClass }: {
  value: number; label: string; icon: ReactNode; cardClass: string; iconClass: string;
}) {
  return (
    <article className={"flex min-h-[112px] items-center gap-3 rounded-lg border border-slate-100 px-4 " + cardClass}>
      <span className={"flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl " + iconClass}>{icon}</span>
      <div className="min-w-0"><p className="break-words text-2xl font-extrabold leading-none text-slate-950">{value}</p><p className="mt-2 text-xs font-semibold text-slate-700">{label}</p></div>
    </article>
  );
}

export default function AuthorityComplaints() {
  const {
    role, complaints, status, error, retry,
    totalComplaints, pendingComplaints, resolvedComplaints, rejectedComplaints,
  } = useFetchComplaint("authority");
  const [activeTab, setActiveTab] = useState<ComplaintTab>("All Complaints");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDialogElement>(null);

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();
    return complaints.filter((complaint) => {
      const matchesTab = activeTab === "All Complaints" || complaint.status?.toLowerCase() === activeTab.toLowerCase();
      const matchesCategory = categoryFilter === "All Categories" || complaint.category === categoryFilter;
      const matchesSearch = [complaint._id, complaint.message, complaint.category, complaint.status]
        .some((value) => String(value ?? "").toLowerCase().includes(term));
      return matchesTab && matchesCategory && matchesSearch;
    }).sort((first, second) => {
      const firstTime = complaintTimestamp(first);
      const secondTime = complaintTimestamp(second);
      if (Number.isNaN(firstTime)) return Number.isNaN(secondTime) ? 0 : 1;
      if (Number.isNaN(secondTime)) return -1;
      return sort === "Oldest First" ? firstTime - secondTime : secondTime - firstTime;
    });
  }, [activeTab, categoryFilter, complaints, search, sort]);

  const tabs: { label: ComplaintTab; count: number }[] = [
    { label: "All Complaints", count: totalComplaints },
    { label: "Pending", count: pendingComplaints },
    { label: "Resolved", count: resolvedComplaints },
    { label: "Rejected", count: rejectedComplaints },
  ];
  const pageCount = Math.max(1, Math.ceil(filteredComplaints.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const pageComplaints = filteredComplaints.slice(pageStart, pageStart + rowsPerPage);
  const selectedComplaint = complaints.find((complaint) => complaint._id === selectedId);
  const breakdown = [
    { label: "Pending", count: pendingComplaints, color: "#f59e0b" },
    { label: "Resolved", count: resolvedComplaints, color: "#10b981" },
    { label: "Rejected", count: rejectedComplaints, color: "#ef4444" },
    { label: "Other", count: totalComplaints - pendingComplaints - resolvedComplaints - rejectedComplaints, color: "#cbd5e1" },
  ];
  let percentage = 0;
  const chartSegments = breakdown.map((item) => {
    const start = percentage;
    percentage += totalComplaints ? item.count / totalComplaints * 100 : 0;
    return item.color + " " + start + "% " + percentage + "%";
  });

  function resetFilters() {
    setSearch("");
    setCategoryFilter("All Categories");
    setActiveTab("All Complaints");
    setSort("Newest First");
    setPage(1);
  }

  if (!role) return <p className="p-6 text-slate-600">Please sign in to view your complaints.</p>;
  if (role !== "authority") return <p role="alert" className="p-6 text-red-600">Only authorities can view this page.</p>;
  if (status === "idle" || status === "loading") return <p role="status" className="p-6 text-slate-600">Loading complaints...</p>;
  if (status === "failed") return (
    <div className="p-6">
      <p role="alert" className="text-red-600">{error || "Unable to load complaints."}</p>
      <button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button>
    </div>
  );

  return (
    <div className="min-h-full bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto max-w-[1500px] px-4 py-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-extrabold text-slate-950">Complaints Management</h1>
          <button type="button" onClick={retry} aria-label="Refresh complaints" title="Refresh complaints" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"><LuRefreshCw aria-hidden="true" /></button>
        </header>

        <nav className="mt-6 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-4" aria-label="Complaint sections">
          {tabs.map((tab) => <button key={tab.label} type="button" aria-pressed={activeTab === tab.label} onClick={() => { setActiveTab(tab.label); setPage(1); }} className={"flex min-h-12 items-center justify-center gap-2 border-b-[3px] px-2 py-2 text-xs font-semibold " + (activeTab === tab.label ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50")}>{tab.label}<span className={"flex h-6 min-w-7 shrink-0 items-center justify-center rounded-full px-1 text-[10px] " + (activeTab === tab.label ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600")}>{tab.count}</span></button>)}
        </nav>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Complaint summary">
          <MetricCard value={totalComplaints} label="Total Complaints" icon={<LuMessageCircle />} cardClass="bg-emerald-50" iconClass="bg-emerald-100 text-emerald-700" />
          <MetricCard value={pendingComplaints} label="Pending" icon={<LuFolderOpen />} cardClass="bg-amber-50" iconClass="bg-amber-100 text-amber-700" />
          <MetricCard value={resolvedComplaints} label="Resolved" icon={<LuCircleCheck />} cardClass="bg-blue-50" iconClass="bg-blue-100 text-blue-700" />
          <MetricCard value={rejectedComplaints} label="Rejected" icon={<LuCircleAlert />} cardClass="bg-red-50" iconClass="bg-red-100 text-red-600" />
        </section>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <Panel className="min-w-0 p-3">
            <div className="flex flex-wrap items-center gap-3 pb-4">
              <label className="relative block min-w-[180px] flex-1"><span className="sr-only">Search complaints</span><LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" /><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search complaints..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-emerald-600" /></label>
              <label className="relative block"><span className="sr-only">Complaint category</span><select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs text-slate-600"><option>All Categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></label>
              <label><span className="sr-only">Sort complaints</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600"><option>Newest First</option><option>Oldest First</option></select></label>
              <button type="button" onClick={resetFilters} className="h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">Clear filters</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead><tr className="bg-slate-50 text-slate-600">{["Complaint ID", "Category", "Complaint", "Date Raised", "Status", "Action"].map((label) => <th key={label} className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
                <tbody>
                  {pageComplaints.map((complaint) => <tr key={complaint._id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50">
                    <td className="max-w-[160px] break-all px-3 py-3 font-medium">{complaint._id}</td>
                    <td className="px-3 py-3">{complaint.category || "Not provided"}</td>
                    <td className="max-w-[280px] px-3 py-3"><span className="line-clamp-2 break-words">{complaint.message || "Not provided"}</span></td>
                    <td className="whitespace-nowrap px-3 py-3">{formatComplaintDate(complaint)}</td>
                    <td className="px-3 py-3"><span className={"inline-flex rounded-md px-2 py-1.5 font-semibold " + (statusStyles[complaint.status] ?? "bg-slate-100 text-slate-600")}>{complaint.status || "Not provided"}</span></td>
                    <td className="px-3 py-3"><button type="button" onClick={() => { setSelectedId(complaint._id); detailRef.current?.showModal(); }} aria-label={"View complaint " + complaint._id} className="h-8 rounded-md border border-slate-200 px-3 font-semibold hover:border-emerald-500 hover:text-emerald-700">View</button></td>
                  </tr>)}
                  {!filteredComplaints.length && <tr><td colSpan={6} className="px-3 py-14 text-center text-slate-500">{complaints.length ? "No complaints match the selected filters." : "No complaints have been assigned to you yet."}</td></tr>}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 px-1 pb-1 pt-5 text-xs text-slate-500">
              <span>Showing {filteredComplaints.length ? pageStart + 1 : 0} to {pageStart + pageComplaints.length} of {filteredComplaints.length} complaints</span>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous page" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>
                <span aria-live="polite">Page {currentPage} of {pageCount}</span>
                <button type="button" aria-label="Next page" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronRight aria-hidden="true" /></button>
              </div>
              <label><span className="sr-only">Complaints per page</span><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"><option value={10}>10 / page</option><option value={25}>25 / page</option><option value={50}>50 / page</option></select></label>
            </footer>
          </Panel>

          <aside aria-label="Complaint breakdown">
            <Panel className="p-4">
              <h2 className="text-sm font-bold text-slate-900">Complaint Summary</h2>
              <div className="relative mx-auto my-5 h-[145px] w-[145px]">
                <div aria-hidden="true" className="absolute inset-0 rounded-full" style={{ background: totalComplaints ? "conic-gradient(" + chartSegments.join(", ") + ")" : "#e2e8f0" }} />
                <div className="absolute inset-[34px] flex flex-col items-center justify-center rounded-full bg-white"><strong className="text-xl text-slate-950">{totalComplaints}</strong><span className="text-xs text-slate-500">Total</span></div>
              </div>
              <dl className="space-y-3 text-xs">{breakdown.filter((item) => item.label !== "Other" || item.count > 0).map(({ label, count, color }) => <div key={label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} /><dt className="flex-1 font-semibold text-slate-600">{label}</dt><dd className="text-slate-500">{count} ({totalComplaints ? Math.round(count / totalComplaints * 100) : 0}%)</dd></div>)}</dl>
            </Panel>
          </aside>
        </div>
      </div>

      <dialog ref={detailRef} onClose={() => setSelectedId(null)} aria-labelledby="complaint-review-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-slate-800 shadow-2xl backdrop:bg-slate-950/35">
        <div className="flex items-start justify-between gap-4">
          <h2 id="complaint-review-title" className="min-w-0 break-all text-lg font-bold">Complaint {selectedComplaint?._id}</h2>
          <button type="button" onClick={() => detailRef.current?.close()} className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close complaint"><LuX aria-hidden="true" /></button>
        </div>
        {selectedComplaint && <>
          <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{selectedComplaint.message || "Not provided"}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
            {[["Category", selectedComplaint.category], ["Status", selectedComplaint.status], ["Date Raised", formatComplaintDate(selectedComplaint)]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 font-semibold">{value || "Not provided"}</dd></div>)}
          </dl>
        </>}
      </dialog>
    </div>
  );
}
