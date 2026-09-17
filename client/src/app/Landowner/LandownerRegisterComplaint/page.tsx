"use client";

import { FormEvent, useMemo, useState } from "react";
import {FiCheckCircle,FiChevronLeft,FiChevronRight,FiClock,FiEye,FiFile,FiFileText,FiInfo,FiList,
  FiMoreVertical,FiPaperclip,FiPlus,FiSearch,FiSend,FiSettings,FiTool,FiXCircle,
} from "@/components/ui/icons";
import { useFetchComplaint } from "@/services/fetchComplaints";
import type { Complaint, ComplaintCategory, ComplaintStatus } from "@/features/landowner-Worker/complaintsdata";
import api from "@/utils/services";
import axios from "axios";

const PAGE_SIZE = 5;

function complaintDate(complaint: Complaint) {
  return complaint.Date || complaint.date || complaint.createdAt || "";
}

function formatComplaintDate(complaint: Complaint) {
  const date = new Date(complaintDate(complaint));
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

const categoryStyles: Record<ComplaintCategory, string> = {
  "Payment Issues": "bg-emerald-50 text-emerald-700",
  "Document Issues": "bg-blue-50 text-blue-700",
  "Management Issues": "bg-violet-50 text-violet-700",
  "Technical Issues": "bg-orange-50 text-orange-700",
  "Other Issues": "bg-slate-100 text-slate-700",
};

const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-600",
};

export default function LandownerRegisterComplaints() {
  const { role, complaints, status, error, retry, totalComplaints, pendingComplaints, resolvedComplaints, rejectedComplaints } = useFetchComplaint("landowner");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [submitted, setSubmitted] = useState(false);
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);

  const visibleComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();
    return complaints.filter((complaint) =>
      (!term || [complaint._id, complaint.message, complaint.category].some((value) => String(value ?? "").toLowerCase().includes(term))) &&
      (categoryFilter === "All Categories" || complaint.category === categoryFilter) &&
      (statusFilter === "All Status" || complaint.status?.toLowerCase() === statusFilter.toLowerCase()),
    ).sort((a, b) => {
      const difference = (Date.parse(complaintDate(b)) || 0) - (Date.parse(complaintDate(a)) || 0);
      return sort === "Oldest First" ? -difference : difference;
    });
  }, [complaints, categoryFilter, search, statusFilter, sort]);

  const pages = Math.max(1, Math.ceil(visibleComplaints.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageComplaints = visibleComplaints.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function submitComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitted(false);
    setSubmitError(null);
    if (!category || !description.trim()) {
      setSubmitError("Please select a category and describe your complaint.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/landowner/post-complaints", {
        category,
        message: description.trim(),
      }, { withCredentials: true });
      setSubmitted(true);
      setCategory("");
      setDescription("");
      setSearch("");
      setCategoryFilter("All Categories");
      setStatusFilter("All Status");
      setSort("Newest First");
      setPage(1);
      retry();
    } catch (error) {
      setSubmitError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to submit complaint. Please try again."
          : "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!role) {
    return <p className="p-6 text-slate-600">User role not found. Please sign in to view your complaints.</p>;
  }
  if (role !== "landowner") {
    return <p role="alert" className="p-6 text-red-600">Only landowners can view this page.</p>;
  }
  if (status === "idle" || status === "loading") {
    return <p role="status" className="p-6 text-slate-600">Loading complaints...</p>;
  }
  if (status === "failed") {
    return <div className="p-6"><p role="alert" className="text-red-600">{error ?? "Failed to fetch complaints."}</p><button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button></div>;
  }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Land Complaints Register</h1>
          <p className="mt-1.5 text-sm text-slate-500">Register and track complaints related to land, payments and management issues</p>
        </header>

        {submitted && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <FiCheckCircle className="text-xl" /> Your complaint has been submitted successfully.
            <button type="button" aria-label="Dismiss message" onClick={() => setSubmitted(false)} className="ml-auto"><FiXCircle /></button>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
          <main className="min-w-0">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total Complaints" value={String(totalComplaints)} note="All time" icon={<FiFileText />} style="bg-emerald-50 text-emerald-700" />
              <SummaryCard label="Pending" value={String(pendingComplaints)} note="Awaiting response" icon={<FiClock />} style="bg-amber-50 text-amber-600" />
              <SummaryCard label="Resolved" value={String(resolvedComplaints)} note="Successfully resolved" icon={<FiCheckCircle />} style="bg-green-50 text-green-600" />
              <SummaryCard label="Rejected" value={String(rejectedComplaints)} note="Not accepted" icon={<FiXCircle />} style="bg-red-50 text-red-500" />
            </section>

            <form onSubmit={submitComplaint} aria-busy={isSubmitting} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">Register New Complaint</h2>
              <p className="mt-1 text-sm text-slate-500">Choose a category and describe your issue</p>
              <fieldset disabled={isSubmitting} className="min-w-0 disabled:opacity-60">
              <div className="mt-5 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
                <select value={category} onChange={(event) => setCategory(event.target.value)} required className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option value="">Select Complaint Category</option>
                  {Object.keys(categoryStyles).map((item) => <option key={item}>{item}</option>)}
                </select>
                <div>
                  <textarea value={description} onChange={(event) => setDescription(event.target.value.slice(0, 1000))} required rows={5} placeholder="Describe your complaint in detail..." className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                  <p className="mt-1 text-right text-xs text-slate-400">{description.length}/1000 characters</p>
                </div>
              </div>
              {submitError && <p role="alert" className="mt-3 text-sm text-red-600">{submitError}</p>}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-xs text-slate-400"><FiPaperclip />Attachments are not supported yet</span>
                <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><FiSend />{isSubmitting ? "Submitting..." : "Submit Complaint"}</button>
              </div>
              </fieldset>
            </form>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[minmax(220px,1fr)_180px_160px_160px]">
                <label className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search complaints..." className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500" /></label>
                <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>All Categories</option>{Object.keys(categoryStyles).map((item) => <option key={item}>{item}</option>)}</select>
                <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>All Status</option><option>Pending</option><option>Resolved</option><option>Rejected</option></select>
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort complaints" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Newest First</option><option>Oldest First</option></select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-5 py-4">Complaint ID</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Complaint</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageComplaints.map((complaint) => <tr key={complaint._id} className="hover:bg-slate-50/70"><td className="whitespace-nowrap px-5 py-4 text-xs font-semibold">{complaint._id}</td><td className="px-5 py-4"><span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${categoryStyles[complaint.category] ?? "bg-slate-100 text-slate-600"}`}>{complaint.category}</span></td><td className="px-5 py-4">{complaint.message}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatComplaintDate(complaint)}</td><td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[complaint.status] ?? "bg-slate-100 text-slate-600"}`}>{complaint.status || "Not provided"}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" aria-label={`View ${complaint._id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><FiEye /></button><button type="button" aria-label={`More actions for ${complaint._id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><FiMoreVertical /></button></div></td></tr>)}
                    {!visibleComplaints.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">{complaints.length ? "No complaints match your filters." : "You have not registered any complaints yet."}</td></tr>}
                  </tbody>
                </table>
              </div>
              <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Showing {visibleComplaints.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {Math.min(currentPage * PAGE_SIZE, visibleComplaints.length)} of {visibleComplaints.length} complaints</p><div className="flex items-center gap-2"><PageButton label="Previous" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><FiChevronLeft /></PageButton><span aria-live="polite">Page {currentPage} of {pages}</span><PageButton label="Next" disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}><FiChevronRight /></PageButton></div></footer>
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Quick Actions</h2>
              <div className="mt-4 space-y-4"><QuickAction icon={<FiPlus />} title="Register New Complaint" text="Create a new complaint" style="bg-emerald-50 text-emerald-600" /><QuickAction icon={<FiList />} title="View All Complaints" text="See all your complaints" style="bg-blue-50 text-blue-600" /><QuickAction icon={<FiFileText />} title="Guidelines" text="Complaint guidelines" style="bg-violet-50 text-violet-600" /></div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Complaint Categories</h2>
              <div className="mt-5 space-y-5"><Category icon={<FiInfo />} title="Payment Issues" text="Payment not received, delayed payments" /><Category icon={<FiFile />} title="Document Issues" text="Land documents not uploaded, missing documents" /><Category icon={<FiSettings />} title="Management Issues" text="Poor management, worker issues, service problems" /><Category icon={<FiTool />} title="Technical Issues" text="Portal errors, technical difficulties" /><Category icon={<FiInfo />} title="Other Issues" text="Any other land related issues" /></div>
              <button type="button" className="mt-6 h-10 w-full rounded-lg border border-emerald-300 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">View Guidelines</button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, note, icon, style }: { label: string; value: string; note: string; icon: React.ReactNode; style: string }) {
  return <article className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl ${style}`}>{icon}</div><div><p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-[11px] text-slate-500">{note}</p></div></article>;
}

function QuickAction({ icon, title, text, style }: { icon: React.ReactNode; title: string; text: string; style: string }) {
  return <button type="button" className="flex w-full items-center gap-3 text-left"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl ${style}`}>{icon}</span><span><strong className="block text-xs text-slate-800">{title}</strong><small className="mt-1 block text-[10px] text-slate-500">{text}</small></span></button>;
}

function Category({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-base text-violet-600">{icon}</span><div><h3 className="text-xs font-bold text-slate-800">{title}</h3><p className="mt-1 text-[10px] leading-4 text-slate-500">{text}</p></div></div>;
}

function PageButton({ children, label, disabled, onClick }: { children: React.ReactNode; label: string; disabled?: boolean; onClick: () => void }) {
  return <button type="button" aria-label={label} disabled={disabled} onClick={onClick} className="grid h-9 min-w-9 place-items-center rounded-lg border border-slate-200 bg-white px-2 font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}
