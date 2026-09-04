"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuCircleCheck, LuCircleX, LuFilter, LuHardHat, 
  LuSearch, LuUserRound, LuUserRoundCheck, LuUserRoundPlus, LuUserRoundX, LuUsersRound, LuX,
} from "@/components/ui/icons";

type WorkerTab = "Pending Verification" | "Verified Workers" | "Rejected Requests" | "All Workers";
type WorkerStatus = "Pending" | "Verified" | "Rejected";

type Worker = {
  id: number;
  name: string;
  workerId: string;
  skill: string;
  district: string;
  submittedOn: string;
  documents: string;
  status: WorkerStatus;
  phone: string;
  village: string;
};

const initialWorkers: Worker[] = [
  { id: 1, name: "Rajesh Kumar", workerId: "WKR-2026-1042", skill: "Construction", district: "Bhopal", submittedOn: "04 Sep 2026", documents: "3/3", status: "Pending", phone: "+91 98765 43101", village: "Berasia" },
  { id: 2, name: "Pooja Singh", workerId: "WKR-2026-1041", skill: "Surveying", district: "Sehore", submittedOn: "04 Sep 2026", documents: "2/3", status: "Pending", phone: "+91 98765 43102", village: "Ashta" },
  { id: 3, name: "Imran Ali", workerId: "WKR-2026-1040", skill: "Machine Operator", district: "Raisen", submittedOn: "03 Sep 2026", documents: "3/3", status: "Pending", phone: "+91 98765 43103", village: "Begumganj" },
  { id: 4, name: "Sunita Verma", workerId: "WKR-2026-1039", skill: "Electrician", district: "Vidisha", submittedOn: "03 Sep 2026", documents: "1/3", status: "Pending", phone: "+91 98765 43104", village: "Ganj Basoda" },
  { id: 5, name: "Deepak Yadav", workerId: "WKR-2026-1038", skill: "Supervisor", district: "Bhopal", submittedOn: "02 Sep 2026", documents: "3/3", status: "Pending", phone: "+91 98765 43105", village: "Phanda" },
  { id: 6, name: "Kavita Patidar", workerId: "WKR-2026-1037", skill: "Labor", district: "Sehore", submittedOn: "02 Sep 2026", documents: "2/3", status: "Pending", phone: "+91 98765 43106", village: "Ichhawar" },
  { id: 7, name: "Mohan Sharma", workerId: "WKR-2026-1036", skill: "Surveying", district: "Bhopal", submittedOn: "01 Sep 2026", documents: "3/3", status: "Verified", phone: "+91 98765 43107", village: "Huzur" },
  { id: 8, name: "Farida Khan", workerId: "WKR-2026-1035", skill: "Supervisor", district: "Raisen", submittedOn: "31 Aug 2026", documents: "3/3", status: "Verified", phone: "+91 98765 43108", village: "Sanchi" },
  { id: 9, name: "Rohan Patel", workerId: "WKR-2026-1034", skill: "Construction", district: "Vidisha", submittedOn: "30 Aug 2026", documents: "2/3", status: "Rejected", phone: "+91 98765 43109", village: "Sironj" },
];

const tabs: Array<{ label: WorkerTab; icon?: ReactNode }> = [
  { label: "Pending Verification" },
  { label: "Verified Workers" },
  { label: "Rejected Requests" },
  { label: "All Workers" },
];

const statusStyles: Record<WorkerStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Verified: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-500",
};

function SummaryCard({ value, label, icon, cardClass, iconClass }: { value: string; label: string; icon: ReactNode; cardClass: string; iconClass: string }) {
  return (
    <article className={`flex min-h-[88px] items-center gap-4 rounded-xl border border-white/70 px-4 shadow-[0_5px_18px_rgba(15,46,34,0.025)] ${cardClass}`}>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[28px] ${iconClass}`}>{icon}</span>
      <div><p className="text-[25px] font-extrabold leading-none tracking-[-0.035em] text-slate-950">{value}</p><p className="mt-2 text-[11px] font-semibold text-slate-700">{label}</p></div>
    </article>
  );
}

function SelectFilter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) {
  return (
    <label className="relative block min-w-[160px]"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-[11px] font-semibold text-slate-600 outline-none focus:border-emerald-600"><option>{label}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" /></label>
  );
}

export default function AuthorityVerifiedWorkers() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [activeTab, setActiveTab] = useState<WorkerTab>("Pending Verification");
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [skill, setSkill] = useState("All Skills");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredWorkers = useMemo(() => workers.filter((worker) => {
    const matchesTab = activeTab === "All Workers"
      || (activeTab === "Pending Verification" && worker.status === "Pending")
      || (activeTab === "Verified Workers" && worker.status === "Verified")
      || (activeTab === "Rejected Requests" && worker.status === "Rejected");
    const matchesSearch = `${worker.name} ${worker.workerId} ${worker.skill}`.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = district === "All Districts" || worker.district === district;
    const matchesSkill = skill === "All Skills" || worker.skill === skill;
    return matchesTab && matchesSearch && matchesDistrict && matchesSkill;
  }), [activeTab, district, search, skill, workers]);

  const selectedWorker = workers.find((worker) => worker.id === selectedId) ?? null;
  const defaultPendingView = activeTab === "Pending Verification" && !search && district === "All Districts" && skill === "All Skills";
  const totalForDisplay = defaultPendingView ? 42 : filteredWorkers.length;

  function approveWorker() {
    if (!selectedWorker) return;
    setWorkers((current) => current.map((worker) => worker.id === selectedWorker.id ? { ...worker, status: "Verified" } : worker));
    setSelectedId(null);
    setNotice(`${selectedWorker.name} was approved successfully.`);
  }

  function rejectWorker() {
    if (!selectedWorker) return;
    setWorkers((current) => current.map((worker) => worker.id === selectedWorker.id ? { ...worker, status: "Rejected" } : worker));
    setSelectedId(null);
    setNotice(`${selectedWorker.name}'s request was rejected.`);
  }

  function addWorker(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newWorker: Worker = {
      id: Math.max(...workers.map((worker) => worker.id)) + 1,
      name: String(form.get("name") || "New Worker"),
      workerId: `WKR-2026-${1042 + workers.length}`,
      skill: String(form.get("skill") || "Labor"),
      district: String(form.get("district") || "Bhopal"),
      submittedOn: "04 Sep 2026",
      documents: "0/3",
      status: "Pending",
      phone: String(form.get("phone") || "—"),
      village: String(form.get("village") || "—"),
    };
    setWorkers((current) => [newWorker, ...current]);
    setActiveTab("Pending Verification");
    setPage(1);
    setAddOpen(false);
    setNotice(`${newWorker.name} was added for verification.`);
  }

  return (
    <div className="min-h-full bg-[#f5f8f7] px-3 py-4 text-slate-800 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1320px]">
        <header className="flex items-start justify-between gap-6">
          <div><h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-slate-950">Worker Verification</h1><p className="mt-1 text-[13px] text-slate-500">Review and verify worker registrations for approval.</p></div>
          <button type="button" onClick={() => setAddOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[12px] font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800"><LuUserRoundPlus className="text-lg" aria-hidden="true" />Add Worker</button>
        </header>

        <nav className="mt-6 flex border-b border-slate-100" aria-label="Worker verification sections">
          {tabs.map((tab) => <button key={tab.label} type="button" onClick={() => { setActiveTab(tab.label); setPage(1); }} className={`min-w-[155px] border-b-[3px] px-4 py-3 text-[11px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-white text-emerald-800 shadow-[0_-2px_10px_rgba(15,46,34,0.02)]" : "border-transparent bg-white/70 text-slate-600 hover:bg-white"}`}>{tab.label}</button>)}
        </nav>

        <section className="mt-4 grid grid-cols-4 gap-4" aria-label="Worker summary">
          <SummaryCard value="42" label="Pending Verifications" icon={<LuUserRound aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-[#fff8e9]" iconClass="bg-amber-100 text-amber-700" />
          <SummaryCard value="316" label="Verified Workers" icon={<LuUserRoundCheck aria-hidden="true" />} cardClass="bg-gradient-to-br from-cyan-50 to-[#effbfa]" iconClass="bg-teal-100 text-teal-700" />
          <SummaryCard value="18" label="Rejected Requests" icon={<LuUserRoundX aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-[#fff2f3]" iconClass="bg-red-100 text-red-600" />
          <SummaryCard value="376" label="Total Workers" icon={<LuUsersRound aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-[#eff8ff]" iconClass="bg-blue-100 text-blue-700" />
        </section>

        {notice && <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message"><LuX aria-hidden="true" /></button></div>}

        <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_7px_24px_rgba(15,46,34,0.04)]">
          <div className="flex items-center gap-4 pb-4">
            <label className="relative block min-w-[320px] flex-1"><span className="sr-only">Search workers</span><LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by name, ID, skill..." className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/40 pl-10 pr-3 text-[11px] outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></label>
            <SelectFilter value={district} onChange={(value) => { setDistrict(value); setPage(1); }} label="All Districts" options={["Bhopal", "Sehore", "Raisen", "Vidisha"]} />
            <SelectFilter value={skill} onChange={(value) => { setSkill(value); setPage(1); }} label="All Skills" options={["Construction", "Surveying", "Machine Operator", "Electrician", "Supervisor", "Labor"]} />
            <button type="button" onClick={() => setNotice(`Filters applied: ${district}, ${skill}.`)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-600 bg-white px-5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"><LuFilter className="text-base" aria-hidden="true" />Filter</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-[10px]">
              <thead><tr className="bg-slate-50 text-slate-600"><th className="rounded-l-lg px-3 py-3 text-center font-semibold">#</th><th className="px-3 py-3 font-semibold">Name</th><th className="px-3 py-3 font-semibold">Worker ID</th><th className="px-3 py-3 font-semibold">Skill Category</th><th className="px-3 py-3 font-semibold">District</th><th className="px-3 py-3 font-semibold">Submitted On</th><th className="px-3 py-3 text-center font-semibold">Documents</th><th className="px-3 py-3 text-center font-semibold">Status</th><th className="rounded-r-lg px-3 py-3 text-center font-semibold">Action</th></tr></thead>
              <tbody>
                {filteredWorkers.slice((page - 1) * 10, page * 10).map((worker, index) => (
                  <tr key={worker.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50">
                    <td className="px-3 py-3 text-center font-semibold">{(page - 1) * 10 + index + 1}</td><td className="px-3 py-3 font-semibold text-slate-800">{worker.name}</td><td className="px-3 py-3">{worker.workerId}</td><td className="px-3 py-3">{worker.skill}</td><td className="px-3 py-3">{worker.district}</td><td className="px-3 py-3">{worker.submittedOn}</td><td className="px-3 py-3 text-center font-semibold">{worker.documents}</td><td className="px-3 py-3 text-center"><span className={`inline-flex min-w-[70px] justify-center rounded-md px-2.5 py-1.5 font-semibold ${statusStyles[worker.status]}`}>{worker.status}</span></td><td className="px-3 py-3 text-center"><button type="button" onClick={() => setSelectedId(worker.id)} className="h-8 min-w-[66px] rounded-md border border-emerald-600 px-4 font-semibold text-emerald-700 hover:bg-emerald-50">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredWorkers.length === 0 && <div className="py-14 text-center text-[11px] text-slate-500">No workers match the selected filters.</div>}
          </div>

          <div className="flex items-center justify-between gap-4 px-1 pb-1 pt-5 text-[10px] text-slate-500"><span>Showing {filteredWorkers.length ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, filteredWorkers.length)} of {totalForDisplay} requests</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md font-semibold ${page === pageNumber ? "bg-emerald-800 text-white" : "bg-slate-50 text-slate-600"}`}>{pageNumber}</button>)}<span>•••</span><button type="button" onClick={() => setPage(7)} className="h-8 w-8 rounded-md bg-slate-50 font-semibold text-slate-600">7</button><button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50"><LuChevronRight aria-hidden="true" /></button></div></div>
        </section>
      </div>

      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="worker-review-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><h2 id="worker-review-title" className="text-xl font-bold text-slate-900">Worker Verification</h2><p className="mt-1 text-[11px] text-slate-500">Review registration and submitted documents.</p></div><button type="button" onClick={() => setSelectedId(null)} aria-label="Close worker review" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><LuX aria-hidden="true" /></button></div>
            <div className="mt-5 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"><LuHardHat aria-hidden="true" /></span><div><p className="text-sm font-bold text-slate-800">{selectedWorker.name}</p><p className="mt-1 text-[10px] text-slate-500">{selectedWorker.workerId}</p></div></div>
            <dl className="mt-5 divide-y divide-slate-100 text-[11px]">{[["Skill Category", selectedWorker.skill], ["District", selectedWorker.district], ["Village", selectedWorker.village], ["Phone", selectedWorker.phone], ["Submitted On", selectedWorker.submittedOn], ["Documents", selectedWorker.documents], ["Status", selectedWorker.status]].map(([label, value]) => <div key={label} className="flex items-center justify-between py-2.5"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-700">{value}</dd></div>)}</dl>
            {selectedWorker.status === "Pending" ? <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={rejectWorker} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-300 px-5 text-[11px] font-semibold text-red-500 hover:bg-red-50"><LuCircleX aria-hidden="true" />Reject</button><button type="button" onClick={approveWorker} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[11px] font-semibold text-white hover:bg-emerald-800"><LuCircleCheck aria-hidden="true" />Approve Worker</button></div> : <button type="button" onClick={() => setSelectedId(null)} className="mt-6 h-10 w-full rounded-lg bg-emerald-700 text-[11px] font-semibold text-white hover:bg-emerald-800">Close</button>}
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="add-worker-title">
          <form onSubmit={addWorker} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><h2 id="add-worker-title" className="text-xl font-bold text-slate-900">Add Worker</h2><p className="mt-1 text-[11px] text-slate-500">Create a new worker registration for verification.</p></div><button type="button" onClick={() => setAddOpen(false)} aria-label="Close add worker" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><LuX aria-hidden="true" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><ModalInput name="name" label="Full Name" placeholder="Enter full name" /><ModalInput name="phone" label="Phone Number" placeholder="+91 98765 43210" /><ModalSelect name="skill" label="Skill Category" options={["Construction", "Surveying", "Machine Operator", "Electrician", "Supervisor", "Labor"]} /><ModalSelect name="district" label="District" options={["Bhopal", "Sehore", "Raisen", "Vidisha"]} /><div className="sm:col-span-2"><ModalInput name="village" label="Village" placeholder="Enter village" /></div></div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setAddOpen(false)} className="h-10 rounded-lg border border-slate-200 px-5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[11px] font-semibold text-white hover:bg-emerald-800"><LuUserRoundPlus aria-hidden="true" />Add Worker</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function ModalInput({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-slate-600">{label}</span><input name={name} required placeholder={placeholder} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-[12px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>;
}

function ModalSelect({ name, label, options }: { name: string; label: string; options: string[] }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-slate-600">{label}</span><select name={name} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
