"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {FiCheckCircle,FiChevronLeft,FiChevronRight,FiClock,FiEye,FiFile,FiFileText,FiInfo,FiList,
  FiMoreVertical, FiPaperclip,FiPlus,FiSearch,FiSend,FiSettings,FiTool,FiXCircle,
} from "@/components/ui/icons";

type ComplaintStatus = "Pending" | "Resolved" | "Rejected";
type ComplaintCategory = "Payment Issues" | "Document Issues" | "Management Issues" | "Technical Issues" | "Other Issues";

interface Complaint {
  id: string;
  category: ComplaintCategory;
  subject: string;
  date: string;
  status: ComplaintStatus;
}

const complaints: Complaint[] = [
  { id: "COMP-2024-0012", category: "Payment Issues", subject: "Payment not received for harvest work", date: "02 May 2024", status: "Pending" },
  { id: "COMP-2024-0011", category: "Document Issues", subject: "Land lease document not uploaded", date: "30 Apr 2024", status: "Pending" },
  { id: "COMP-2024-0010", category: "Management Issues", subject: "Worker not assigned for field work", date: "28 Apr 2024", status: "Resolved" },
  { id: "COMP-2024-0009", category: "Payment Issues", subject: "Partial payment received", date: "25 Apr 2024", status: "Resolved" },
  { id: "COMP-2024-0008", category: "Technical Issues", subject: "Unable to upload documents", date: "20 Apr 2024", status: "Rejected" },
];

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
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const visibleComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();
    return complaints.filter((complaint) =>
      (!term || [complaint.id, complaint.subject, complaint.category].some((value) => value.toLowerCase().includes(term))) &&
      (categoryFilter === "All Categories" || complaint.category === categoryFilter) &&
      (statusFilter === "All Status" || complaint.status === statusFilter),
    );
  }, [categoryFilter, search, statusFilter]);

  function submitComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category || !description.trim()) return;
    setSubmitted(true);
    setCategory("");
    setDescription("");
    setAttachment(null);
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
              <SummaryCard label="Total Complaints" value="12" note="All time" icon={<FiFileText />} style="bg-emerald-50 text-emerald-700" />
              <SummaryCard label="Pending" value="5" note="Awaiting response" icon={<FiClock />} style="bg-amber-50 text-amber-600" />
              <SummaryCard label="Resolved" value="6" note="Successfully resolved" icon={<FiCheckCircle />} style="bg-green-50 text-green-600" />
              <SummaryCard label="Rejected" value="1" note="Not accepted" icon={<FiXCircle />} style="bg-red-50 text-red-500" />
            </section>

            <form onSubmit={submitComplaint} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">Register New Complaint</h2>
              <p className="mt-1 text-sm text-slate-500">Choose a category and describe your issue</p>
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
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <input ref={fileRef} type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} />
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold hover:bg-slate-50"><FiPaperclip />{attachment?.name ?? "Attach Documents (Optional)"}</button>
                </div>
                <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"><FiSend /> Submit Complaint</button>
              </div>
            </form>

            <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-[minmax(220px,1fr)_180px_160px_160px]">
                <label className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search complaints..." className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500" /></label>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>All Categories</option>{Object.keys(categoryStyles).map((item) => <option key={item}>{item}</option>)}</select>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>All Status</option><option>Pending</option><option>Resolved</option><option>Rejected</option></select>
                <select aria-label="Sort complaints" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Newest First</option><option>Oldest First</option></select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-5 py-4">Complaint ID</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Subject</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleComplaints.map((complaint) => <tr key={complaint.id} className="hover:bg-slate-50/70"><td className="whitespace-nowrap px-5 py-4 text-xs font-semibold">{complaint.id}</td><td className="px-5 py-4"><span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${categoryStyles[complaint.category]}`}>{complaint.category}</span></td><td className="px-5 py-4">{complaint.subject}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{complaint.date}</td><td className="px-5 py-4"><span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[complaint.status]}`}>{complaint.status}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" aria-label={`View ${complaint.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><FiEye /></button><button type="button" aria-label={`More actions for ${complaint.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><FiMoreVertical /></button></div></td></tr>)}
                    {!visibleComplaints.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No complaints match your filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Showing {visibleComplaints.length ? `1 to ${visibleComplaints.length}` : "0"} of 12 complaints</p><div className="flex gap-2"><PageButton label="Previous"><FiChevronLeft /></PageButton><PageButton active label="Page 1">1</PageButton><PageButton label="Page 2">2</PageButton><PageButton label="Page 3">3</PageButton><PageButton label="Next"><FiChevronRight /></PageButton></div></footer>
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

function PageButton({ children, label, active = false }: { children: React.ReactNode; label: string; active?: boolean }) {
  return <button type="button" aria-label={label} className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 font-semibold ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>{children}</button>;
}

