"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  LuCalendarDays,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuClock3,
  LuEye,
  LuLayers,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuX,
} from "react-icons/lu";

type SchemeStatus = "Active" | "Upcoming" | "Inactive";

type Scheme = {
  id: number;
  name: string;
  department: string;
  category: string;
  status: SchemeStatus;
  startDate: string;
  endDate: string;
  website: string;
  eligibility: string;
  description: string;
};

type SchemeForm = Omit<Scheme, "id">;

const blankForm: SchemeForm = {
  name: "",
  department: "",
  category: "",
  status: "Active",
  startDate: "",
  endDate: "",
  website: "",
  eligibility: "",
  description: "",
};

const initialSchemes: Scheme[] = [
  {
    id: 1,
    name: "PM-KISAN Samman Nidhi",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Financial Support",
    status: "Active",
    startDate: "01 Jan 2024",
    endDate: "31 Dec 2025",
    website: "https://pmkisan.gov.in",
    eligibility: "Small and marginal farmers with valid land ownership records.",
    description: "Direct income support for eligible farmer families across India.",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Crop Insurance",
    status: "Active",
    startDate: "01 Jul 2024",
    endDate: "30 Jun 2025",
    website: "https://pmfby.gov.in",
    eligibility: "Farmers growing notified crops in notified areas.",
    description: "Affordable crop insurance coverage against natural risks and yield loss.",
  },
  {
    id: 3,
    name: "Subsidy on Agricultural Equipment",
    department: "State Agriculture Department",
    category: "Subsidy",
    status: "Upcoming",
    startDate: "01 Oct 2024",
    endDate: "31 Mar 2025",
    website: "https://agri.mp.gov.in",
    eligibility: "Registered farmers purchasing approved agricultural machinery.",
    description: "Financial support for modern equipment that improves farm productivity.",
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Soil Health",
    status: "Active",
    startDate: "01 Jan 2024",
    endDate: "31 Dec 2025",
    website: "https://soilhealth.dac.gov.in",
    eligibility: "All registered landowners and tenant farmers.",
    description: "Soil testing and crop-specific nutrient recommendations for farmers.",
  },
  {
    id: 5,
    name: "Micro Irrigation Scheme",
    department: "State Agriculture Department",
    category: "Irrigation",
    status: "Inactive",
    startDate: "01 Apr 2023",
    endDate: "31 Mar 2024",
    website: "https://agri.mp.gov.in/irrigation",
    eligibility: "Farmers with cultivable land and an approved water source.",
    description: "Support for drip and sprinkler irrigation systems.",
  },
];

const statusStyles: Record<SchemeStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Upcoming: "bg-blue-100 text-blue-600",
  Inactive: "bg-slate-200 text-slate-600",
};

const departments = [
  "Ministry of Agriculture & Farmers Welfare",
  "State Agriculture Department",
  "Department of Rural Development",
  "Department of Land Resources",
];

const categories = ["Financial Support", "Crop Insurance", "Subsidy", "Soil Health", "Irrigation", "Training"];

function SummaryCard({ value, label, icon, iconClass }: { value: string; label: string; icon: ReactNode; iconClass: string }) {
  return (
    <article className="flex min-h-[88px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 shadow-[0_5px_18px_rgba(15,46,34,0.025)]">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[25px] ${iconClass}`}>{icon}</span>
      <div><p className="text-[9px] font-medium text-slate-500">{label}</p><p className="mt-1 text-[23px] font-extrabold leading-none text-slate-950">{value}</p></div>
    </article>
  );
}

function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return <span className="mb-2 block text-[10px] font-semibold text-slate-600">{children}{required && <span className="ml-1 text-red-500">*</span>}</span>;
}

export default function AuthorityGovernmentSchemes() {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  const [form, setForm] = useState<SchemeForm>(blankForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

  const filteredSchemes = useMemo(() => schemes.filter((scheme) => {
    const matchesSearch = `${scheme.name} ${scheme.department} ${scheme.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || scheme.category === categoryFilter;
    const matchesStatus = statusFilter === "All Status" || scheme.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [categoryFilter, schemes, search, statusFilter]);

  const viewingScheme = schemes.find((scheme) => scheme.id === viewingId) ?? null;
  const deletingScheme = schemes.find((scheme) => scheme.id === deletingId) ?? null;
  const displayTotal = !search && categoryFilter === "All Categories" && statusFilter === "All Status" ? 24 : filteredSchemes.length;

  function updateForm(field: keyof SchemeForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(blankForm);
    setEditingId(null);
  }

  function beginAdd() {
    resetForm();
    requestAnimationFrame(() => nameInputRef.current?.focus());
  }

  function beginEdit(scheme: Scheme) {
    setEditingId(scheme.id);
    setForm({
      name: scheme.name,
      department: scheme.department,
      category: scheme.category,
      status: scheme.status,
      startDate: scheme.startDate,
      endDate: scheme.endDate,
      website: scheme.website,
      eligibility: scheme.eligibility,
      description: scheme.description,
    });
    requestAnimationFrame(() => nameInputRef.current?.focus());
  }

  function publishScheme(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId) {
      setSchemes((current) => current.map((scheme) => scheme.id === editingId ? { ...scheme, ...form } : scheme));
      setNotice(`${form.name} updated successfully.`);
    } else {
      const newScheme: Scheme = { id: Math.max(...schemes.map((scheme) => scheme.id)) + 1, ...form };
      setSchemes((current) => [newScheme, ...current]);
      setNotice(`${form.name} published successfully.`);
    }
    resetForm();
    setPage(1);
  }

  function deleteScheme() {
    if (!deletingScheme) return;
    setSchemes((current) => current.filter((scheme) => scheme.id !== deletingScheme.id));
    setNotice(`${deletingScheme.name} was deleted.`);
    setDeletingId(null);
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f4f8f7] text-slate-800">
      <div className="mx-auto min-w-[1080px] max-w-[1480px] px-5 py-5">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[31px] font-extrabold tracking-[-0.04em] text-slate-950">Government Schemes</h1>
            <p className="mt-1 text-[13px] text-slate-500">Manage and publish government schemes for farmers and workers</p>
            <p className="mt-3 flex items-center gap-2 text-[10px] text-slate-500"><span>Dashboard</span><LuChevronRight aria-hidden="true" /><span>Government Schemes</span></p>
          </div>
          <button type="button" onClick={beginAdd} className="inline-flex h-11 items-center gap-3 rounded-lg bg-emerald-700 px-6 text-[12px] font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800"><LuPlus className="text-xl" aria-hidden="true" />Add Government Scheme</button>
        </header>

        {notice && <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message" className="rounded p-1 hover:bg-emerald-100"><LuX aria-hidden="true" /></button></div>}

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_405px] items-start gap-4">
          <main className="min-w-0 space-y-6">
            <section className="grid grid-cols-4 gap-3" aria-label="Scheme summary">
              <SummaryCard value="24" label="Total Schemes" icon={<LuLayers aria-hidden="true" />} iconClass="bg-emerald-100 text-emerald-700" />
              <SummaryCard value="18" label="Active Schemes" icon={<LuCircleCheck aria-hidden="true" />} iconClass="bg-emerald-100 text-emerald-700" />
              <SummaryCard value="4" label="Upcoming Schemes" icon={<LuClock3 aria-hidden="true" />} iconClass="bg-orange-100 text-orange-600" />
              <SummaryCard value="2" label="Inactive Schemes" icon={<LuCircleX aria-hidden="true" />} iconClass="bg-red-100 text-red-500" />
            </section>

            <div className="flex items-center gap-3">
              <label className="relative block min-w-[340px] flex-1"><span className="sr-only">Search schemes</span><LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search schemes by name, department or category..." className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
              <FilterSelect value={categoryFilter} onChange={(value) => { setCategoryFilter(value); setPage(1); }} options={["All Categories", ...categories]} />
              <FilterSelect value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={["All Status", "Active", "Upcoming", "Inactive"]} />
              <button type="button" onClick={() => setNotice(`${filteredSchemes.length} matching schemes found.`)} className="h-11 rounded-lg bg-emerald-700 px-6 text-[10px] font-semibold text-white hover:bg-emerald-800">Search</button>
            </div>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-[9px]">
                  <thead><tr className="bg-slate-50 text-slate-600"><th className="px-4 py-4 font-semibold">#</th><th className="px-3 py-4 font-semibold">Scheme Name</th><th className="px-3 py-4 font-semibold">Department</th><th className="px-3 py-4 font-semibold">Category</th><th className="px-3 py-4 font-semibold">Status</th><th className="px-3 py-4 font-semibold">Start Date</th><th className="px-3 py-4 font-semibold">End Date</th><th className="px-3 py-4 text-center font-semibold">Actions</th></tr></thead>
                  <tbody>{filteredSchemes.slice((page - 1) * 5, page * 5).map((scheme, index) => (
                    <tr key={scheme.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold">{(page - 1) * 5 + index + 1}</td><td className="max-w-[175px] px-3 py-4 text-[10px] font-bold text-slate-800">{scheme.name}</td><td className="max-w-[180px] px-3 py-4 leading-4">{scheme.department}</td><td className="px-3 py-4">{scheme.category}</td><td className="px-3 py-4"><span className={`rounded-md px-3 py-1.5 font-semibold ${statusStyles[scheme.status]}`}>{scheme.status}</span></td><td className="whitespace-nowrap px-3 py-4">{scheme.startDate}</td><td className="whitespace-nowrap px-3 py-4">{scheme.endDate}</td><td className="px-3 py-4"><div className="flex items-center justify-center gap-3"><button type="button" onClick={() => setViewingId(scheme.id)} aria-label={`View ${scheme.name}`} className="text-base text-slate-600 hover:text-emerald-700"><LuEye aria-hidden="true" /></button><button type="button" onClick={() => beginEdit(scheme)} aria-label={`Edit ${scheme.name}`} className="text-sm text-slate-600 hover:text-blue-600"><LuPencil aria-hidden="true" /></button><button type="button" onClick={() => setDeletingId(scheme.id)} aria-label={`Delete ${scheme.name}`} className="text-sm text-red-500 hover:text-red-700"><LuTrash2 aria-hidden="true" /></button></div></td>
                    </tr>
                  ))}</tbody>
                </table>
                {filteredSchemes.length === 0 && <div className="py-16 text-center text-[11px] text-slate-500">No government schemes match the selected filters.</div>}
              </div>
              <div className="flex items-center justify-between px-5 py-5 text-[9px] text-slate-500"><span>Showing {filteredSchemes.length ? (page - 1) * 5 + 1 : 0} to {Math.min(page * 5, filteredSchemes.length)} of {displayTotal} schemes</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3, 4, 5].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md border font-semibold ${page === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{pageNumber}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"><LuChevronRight aria-hidden="true" /></button></div></div>
            </section>
          </main>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_7px_24px_rgba(15,46,34,0.04)]" aria-label="Scheme editor">
            <div className="flex items-start justify-between"><div><h2 className="text-[19px] font-bold text-slate-900">{editingId ? "Edit Government Scheme" : "Add Government Scheme"}</h2><p className="mt-1 text-[11px] text-slate-500">{editingId ? "Update the details of this government scheme" : "Enter the details of the new government scheme"}</p></div><button type="button" onClick={resetForm} aria-label="Clear scheme form" className="rounded-lg p-2 text-lg text-slate-500 hover:bg-slate-100"><LuX aria-hidden="true" /></button></div>

            <form onSubmit={publishScheme} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label><FieldLabel required>Scheme Name</FieldLabel><input ref={nameInputRef} required value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Enter scheme name" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
                <label><FieldLabel required>Department</FieldLabel><FormSelect value={form.department} onChange={(value) => updateForm("department", value)} placeholder="Select department" options={departments} /></label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label><FieldLabel required>Category</FieldLabel><FormSelect value={form.category} onChange={(value) => updateForm("category", value)} placeholder="Select category" options={categories} /></label>
                <label><FieldLabel required>Status</FieldLabel><FormSelect value={form.status} onChange={(value) => updateForm("status", value as SchemeStatus)} options={["Active", "Upcoming", "Inactive"]} /></label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label><FieldLabel required>Start Date</FieldLabel><div className="relative"><input required value={form.startDate} onChange={(event) => updateForm("startDate", event.target.value)} placeholder="dd/mm/yyyy" className="h-10 w-full rounded-lg border border-slate-200 px-3 pr-9 text-[10px] outline-none focus:border-emerald-600" /><LuCalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600" aria-hidden="true" /></div></label>
                <label><FieldLabel required>End Date</FieldLabel><div className="relative"><input required value={form.endDate} onChange={(event) => updateForm("endDate", event.target.value)} placeholder="dd/mm/yyyy" className="h-10 w-full rounded-lg border border-slate-200 px-3 pr-9 text-[10px] outline-none focus:border-emerald-600" /><LuCalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600" aria-hidden="true" /></div></label>
              </div>
              <label className="block"><FieldLabel>Official Website Link</FieldLabel><input type="url" value={form.website} onChange={(event) => updateForm("website", event.target.value)} placeholder="https://example.gov.in" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="block"><FieldLabel required>Eligibility</FieldLabel><textarea required value={form.eligibility} onChange={(event) => updateForm("eligibility", event.target.value)} placeholder="Enter eligibility criteria" className="h-[72px] w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="block"><FieldLabel required>Scheme Description</FieldLabel><textarea required value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Enter detailed description about the scheme" className="h-[88px] w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
              <div className="flex justify-end gap-3 pt-1"><button type="button" onClick={resetForm} className="h-10 rounded-lg border border-slate-200 px-5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="h-10 rounded-lg bg-emerald-700 px-6 text-[10px] font-semibold text-white hover:bg-emerald-800">{editingId ? "Save Changes" : "Publish Scheme"}</button></div>
            </form>
          </aside>
        </div>
      </div>

      {viewingScheme && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="scheme-details-title"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><span className={`rounded-md px-3 py-1 text-[9px] font-semibold ${statusStyles[viewingScheme.status]}`}>{viewingScheme.status}</span><h2 id="scheme-details-title" className="mt-3 text-xl font-bold text-slate-900">{viewingScheme.name}</h2><p className="mt-1 text-[11px] text-slate-500">{viewingScheme.department}</p></div><button type="button" onClick={() => setViewingId(null)} aria-label="Close scheme details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><LuX aria-hidden="true" /></button></div><p className="mt-5 rounded-xl bg-slate-50 p-4 text-[11px] leading-5 text-slate-600">{viewingScheme.description}</p><dl className="mt-4 grid grid-cols-2 gap-4 text-[10px]">{[["Category", viewingScheme.category], ["Duration", `${viewingScheme.startDate} – ${viewingScheme.endDate}`], ["Eligibility", viewingScheme.eligibility], ["Website", viewingScheme.website || "Not provided"]].map(([label, value]) => <div key={label}><dt className="text-slate-400">{label}</dt><dd className="mt-1 font-semibold leading-4 text-slate-700">{value}</dd></div>)}</dl><button type="button" onClick={() => setViewingId(null)} className="mt-6 h-10 w-full rounded-lg bg-emerald-700 text-[10px] font-semibold text-white hover:bg-emerald-800">Close</button></div></div>}

      {deletingScheme && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-scheme-title"><div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-500"><LuTrash2 aria-hidden="true" /></span><h2 id="delete-scheme-title" className="mt-4 text-lg font-bold text-slate-900">Delete Government Scheme?</h2><p className="mt-2 text-[11px] leading-5 text-slate-500">This will remove “{deletingScheme.name}” from the scheme list.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setDeletingId(null)} className="h-10 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600">Cancel</button><button type="button" onClick={deleteScheme} className="h-10 rounded-lg bg-red-500 text-[10px] font-semibold text-white hover:bg-red-600">Delete Scheme</button></div></div></div>}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="relative block w-[145px]"><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold text-slate-600 outline-none focus:border-emerald-600">{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></label>;
}

function FormSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder?: string }) {
  return <span className="relative block"><select required value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] text-slate-600 outline-none focus:border-emerald-600"><option value="" disabled>{placeholder ?? "Select option"}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></span>;
}