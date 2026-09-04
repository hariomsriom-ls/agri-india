"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuBan,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuCircleX,
  LuClock3,
  LuDownload,
  LuEllipsis,
  LuExpand,
  LuEye,
  LuFileSpreadsheet,
  LuFileText,
  LuFilter,
  LuSearch,
  LuShare2,
  LuUpload,
  LuUserRound,
  LuUsersRound,
} from "react-icons/lu";

type DocumentStatus = "Approved" | "Pending Review" | "Rejected";
type DocumentGroup = "Authority Documents" | "Landowner Documents" | "Worker Documents" | "Pending Worker Documents";

type DocumentRecord = {
  id: number;
  name: string;
  uploadedBy: string;
  category: string;
  uploadedOn: string;
  uploadedAt: string;
  status: DocumentStatus;
  group: DocumentGroup;
  size: string;
  version: string;
  approvedOn?: string;
  approvedBy?: string;
};

const initialDocuments: DocumentRecord[] = [
  {
    id: 1,
    name: "Land Use Policy 2025.pdf",
    uploadedBy: "Anita Sharma",
    category: "Policy",
    uploadedOn: "04 Sep 2026",
    uploadedAt: "10:30 AM",
    status: "Approved",
    group: "Authority Documents",
    size: "2.4 MB",
    version: "v1.0",
    approvedOn: "04 Sep 2026, 11:15 AM",
    approvedBy: "Arun Kumar",
  },
  {
    id: 2,
    name: "Soil Health Guidelines.pdf",
    uploadedBy: "Anita Sharma",
    category: "Guidelines",
    uploadedOn: "02 Sep 2026",
    uploadedAt: "2:10 PM",
    status: "Approved",
    group: "Authority Documents",
    size: "1.8 MB",
    version: "v1.1",
    approvedOn: "03 Sep 2026, 9:20 AM",
    approvedBy: "Arun Kumar",
  },
  {
    id: 3,
    name: "Irrigation Scheme Manual.docx",
    uploadedBy: "Ravi Kumar",
    category: "Manual",
    uploadedOn: "30 Aug 2026",
    uploadedAt: "4:45 PM",
    status: "Approved",
    group: "Authority Documents",
    size: "860 KB",
    version: "v2.0",
    approvedOn: "31 Aug 2026, 10:00 AM",
    approvedBy: "Anita Sharma",
  },
  {
    id: 4,
    name: "Compensation Framework.pdf",
    uploadedBy: "Anita Sharma",
    category: "Policy",
    uploadedOn: "28 Aug 2026",
    uploadedAt: "11:40 AM",
    status: "Pending Review",
    group: "Authority Documents",
    size: "3.1 MB",
    version: "v1.0",
  },
  {
    id: 5,
    name: "Land Classification Norms.pdf",
    uploadedBy: "Ravi Kumar",
    category: "Regulation",
    uploadedOn: "25 Aug 2026",
    uploadedAt: "3:20 PM",
    status: "Pending Review",
    group: "Authority Documents",
    size: "2.2 MB",
    version: "v1.0",
  },
  {
    id: 6,
    name: "Land Records Format.xlsx",
    uploadedBy: "Meena Yadav",
    category: "Template",
    uploadedOn: "20 Aug 2026",
    uploadedAt: "12:05 PM",
    status: "Approved",
    group: "Authority Documents",
    size: "540 KB",
    version: "v1.3",
    approvedOn: "20 Aug 2026, 4:15 PM",
    approvedBy: "Arun Kumar",
  },
  {
    id: 7,
    name: "Environmental Clearance Guide.pdf",
    uploadedBy: "Anita Sharma",
    category: "Guidelines",
    uploadedOn: "18 Aug 2026",
    uploadedAt: "9:15 AM",
    status: "Rejected",
    group: "Authority Documents",
    size: "4.6 MB",
    version: "v1.0",
  },
  {
    id: 8,
    name: "Public Notice Template.pdf",
    uploadedBy: "Ravi Kumar",
    category: "Template",
    uploadedOn: "15 Aug 2026",
    uploadedAt: "5:00 PM",
    status: "Approved",
    group: "Authority Documents",
    size: "720 KB",
    version: "v1.0",
    approvedOn: "16 Aug 2026, 10:10 AM",
    approvedBy: "Anita Sharma",
  },
  {
    id: 9,
    name: "Plot 45 Ownership Record.pdf",
    uploadedBy: "Ramesh Kumar",
    category: "Land Record",
    uploadedOn: "04 Sep 2026",
    uploadedAt: "9:20 AM",
    status: "Pending Review",
    group: "Landowner Documents",
    size: "1.9 MB",
    version: "v1.0",
  },
  {
    id: 10,
    name: "Identity Verification.pdf",
    uploadedBy: "Sita Devi",
    category: "Identity",
    uploadedOn: "03 Sep 2026",
    uploadedAt: "1:45 PM",
    status: "Approved",
    group: "Landowner Documents",
    size: "980 KB",
    version: "v1.0",
    approvedOn: "04 Sep 2026, 9:00 AM",
    approvedBy: "Anita Sharma",
  },
  {
    id: 11,
    name: "Worker Registration Form.pdf",
    uploadedBy: "Dinesh Kale",
    category: "Registration",
    uploadedOn: "02 Sep 2026",
    uploadedAt: "3:30 PM",
    status: "Approved",
    group: "Worker Documents",
    size: "1.1 MB",
    version: "v1.0",
    approvedOn: "03 Sep 2026, 10:25 AM",
    approvedBy: "Ravi Kumar",
  },
  {
    id: 12,
    name: "Pending Address Proof.pdf",
    uploadedBy: "Pooja Waghmare",
    category: "Address Proof",
    uploadedOn: "04 Sep 2026",
    uploadedAt: "8:50 AM",
    status: "Pending Review",
    group: "Pending Worker Documents",
    size: "760 KB",
    version: "v1.0",
  },
];

const tabs: Array<{ label: DocumentGroup; icon: ReactNode }> = [
  { label: "Authority Documents", icon: <LuFileText aria-hidden="true" /> },
  { label: "Landowner Documents", icon: <LuFileText aria-hidden="true" /> },
  { label: "Worker Documents", icon: <LuUsersRound aria-hidden="true" /> },
  { label: "Pending Worker Documents", icon: <LuUserRound aria-hidden="true" /> },
];

const statusStyles: Record<DocumentStatus, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  "Pending Review": "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-500",
};

function StatusBadge({ status }: { status: DocumentStatus }) {
  return <span className={`inline-flex rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${statusStyles[status]}`}>{status}</span>;
}

function DocumentTypeIcon({ name, large = false }: { name: string; large?: boolean }) {
  const extension = name.split(".").pop()?.toUpperCase() ?? "FILE";
  const isSpreadsheet = extension === "XLSX";
  const isWord = extension === "DOCX";

  return (
    <span className={`relative flex shrink-0 items-center justify-center rounded-md text-white ${large ? "h-10 w-9 text-lg" : "h-7 w-6 text-xs"} ${isSpreadsheet ? "bg-emerald-600" : isWord ? "bg-blue-600" : "bg-red-500"}`}>
      {isSpreadsheet ? <LuFileSpreadsheet aria-hidden="true" /> : <LuFileText aria-hidden="true" />}
      <span className="absolute bottom-0.5 text-[5px] font-bold leading-none">{extension}</span>
    </span>
  );
}

function StatCard({
  value,
  label,
  trend,
  trendDirection,
  icon,
  cardClass,
  iconClass,
}: {
  value: string;
  label: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: ReactNode;
  cardClass: string;
  iconClass: string;
}) {
  const positive = trendDirection === "up";

  return (
    <article className={`flex min-h-[122px] items-center gap-4 rounded-xl border border-white/70 px-4 shadow-[0_5px_18px_rgba(15,46,34,0.03)] ${cardClass}`}>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[28px] ${iconClass}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[27px] font-extrabold leading-none tracking-[-0.035em] text-slate-950">{value}</p>
        <p className="mt-2 text-[12px] font-semibold text-slate-700">{label}</p>
        <p className={`mt-2 flex items-center gap-1 text-[10px] ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {positive ? <LuArrowUp aria-hidden="true" /> : <LuArrowDown aria-hidden="true" />}
          <span className="font-semibold">{trend}</span>
          <span className="text-slate-500">from last month</span>
        </p>
      </div>
    </article>
  );
}

export default function AuthorityLeaseDocuments() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<DocumentGroup>("Authority Documents");
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"All" | DocumentStatus>("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notice, setNotice] = useState("");

  const filteredDocuments = useMemo(() => documents.filter((document) => {
    const matchesTab = document.group === activeTab;
    const matchesSearch = `${document.name} ${document.uploadedBy} ${document.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || document.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  }), [activeTab, documents, search, statusFilter]);

  const selectedDocument = documents.find((document) => document.id === selectedId) ?? documents[0];
  const firstVisible = filteredDocuments.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const lastVisible = Math.min(page * rowsPerPage, filteredDocuments.length);
  const displayedTotal = !search && statusFilter === "All" && activeTab === "Authority Documents" ? 42 : filteredDocuments.length;

  function chooseTab(tab: DocumentGroup) {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setStatusFilter("All");
    const firstMatch = documents.find((document) => document.group === tab);
    if (firstMatch) setSelectedId(firstMatch.id);
  }

  function updateStatus(status: DocumentStatus) {
    setDocuments((current) => current.map((document) => document.id === selectedDocument.id
      ? {
          ...document,
          status,
          approvedOn: status === "Approved" ? "04 Sep 2026, 11:15 AM" : undefined,
          approvedBy: status === "Approved" ? "Arun Kumar" : undefined,
        }
      : document));
    setNotice(status === "Approved" ? "Document approved successfully." : status === "Rejected" ? "Approval revoked." : "Document returned to review.");
  }

  function uploadDocument(file: File | undefined) {
    if (!file) return;
    const newDocument: DocumentRecord = {
      id: Math.max(...documents.map((document) => document.id)) + 1,
      name: file.name,
      uploadedBy: "Anita Sharma",
      category: "Uploaded",
      uploadedOn: "04 Sep 2026",
      uploadedAt: "Now",
      status: "Pending Review",
      group: activeTab,
      size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
      version: "v1.0",
    };
    setDocuments((current) => [newDocument, ...current]);
    setSelectedId(newDocument.id);
    setNotice(`${file.name} uploaded successfully.`);
  }

  function downloadDocument(documentToDownload: DocumentRecord = selectedDocument) {
    const content = `Document preview placeholder for ${documentToDownload.name}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = documentToDownload.name;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Document download started.");
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f6f9f8] text-slate-800">
      <div className="mx-auto min-w-[1030px] max-w-[1480px] px-4 py-5 lg:px-6">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[29px] font-extrabold tracking-[-0.04em] text-slate-950">Documents Management</h1>
            <p className="mt-1 text-[13px] text-slate-500">Manage, review, and verify all authority and submitted documents.</p>
          </div>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-emerald-700 bg-white px-5 text-[12px] font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50">
            <LuUpload className="text-lg" aria-hidden="true" />
            Upload Document
            <input type="file" className="sr-only" onChange={(event) => uploadDocument(event.target.files?.[0])} />
          </label>
        </header>

        <nav className="mt-6 grid max-w-[900px] grid-cols-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" aria-label="Document categories">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => chooseTab(tab.label)}
              className={`flex h-11 items-center justify-center gap-2.5 border-b-[3px] text-[11px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-emerald-50/40 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50"}`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="mt-5 grid grid-cols-4 gap-4" aria-label="Document summary">
          <StatCard value="1,284" label="Total Documents" trend="12%" trendDirection="up" icon={<LuFileText aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-[#f0f9f4]" iconClass="bg-emerald-100 text-emerald-700" />
          <StatCard value="156" label="Pending Review" trend="8%" trendDirection="up" icon={<LuClock3 aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-[#fff8e9]" iconClass="bg-amber-100 text-amber-700" />
          <StatCard value="982" label="Approved" trend="15%" trendDirection="up" icon={<LuCircleCheck aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-[#eff8ff]" iconClass="bg-blue-100 text-blue-700" />
          <StatCard value="46" label="Rejected" trend="4%" trendDirection="down" icon={<LuCircleX aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-[#fff2f3]" iconClass="bg-red-100 text-red-600" />
        </section>

        {notice && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-medium text-emerald-800">
            {notice}
            <button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message"><LuCircleX aria-hidden="true" /></button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] items-start gap-3">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)]">
            <div className="flex items-center justify-between gap-4 px-4 pb-4 pt-4">
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">{activeTab}</h2>
                <p className="mt-1 text-[10px] text-slate-500">Manage documents uploaded by the {activeTab === "Authority Documents" ? "authority" : activeTab.replace(" Documents", "").toLowerCase()}.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((current) => !current)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                  >
                    <LuFilter className="text-base" aria-hidden="true" />
                    Filters
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
                      {(["All", "Approved", "Pending Review", "Rejected"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => { setStatusFilter(status); setFilterOpen(false); setPage(1); }}
                          className={`w-full rounded-md px-3 py-2 text-left text-[10px] font-medium ${statusFilter === status ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <label className="relative block w-[285px]">
                  <span className="sr-only">Search documents</span>
                  <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                    placeholder="Search documents..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[11px] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <LuSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" />
                </label>
              </div>
            </div>

            <div className="overflow-x-auto px-3">
              <table className="w-full min-w-[760px] text-left text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="rounded-l-lg px-3 py-3 font-semibold">Document Name</th>
                    <th className="px-3 py-3 font-semibold">Uploaded By</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Date Uploaded <LuArrowDown className="ml-1 inline" aria-hidden="true" /></th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="rounded-r-lg px-3 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((document) => (
                    <tr key={document.id} className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${selectedDocument.id === document.id ? "bg-emerald-50/30" : ""}`}>
                      <td className="px-3 py-[9px]">
                        <button type="button" onClick={() => setSelectedId(document.id)} className="flex max-w-[220px] items-center gap-3 text-left font-medium text-slate-700 hover:text-emerald-800">
                          <DocumentTypeIcon name={document.name} />
                          <span className="truncate">{document.name}</span>
                        </button>
                      </td>
                      <td className="px-3 py-[9px] text-slate-600">{document.uploadedBy}</td>
                      <td className="px-3 py-[9px] text-slate-600">{document.category}</td>
                      <td className="px-3 py-[9px] text-slate-600">{document.uploadedOn}</td>
                      <td className="px-3 py-[9px]"><StatusBadge status={document.status} /></td>
                      <td className="px-3 py-[9px]">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setSelectedId(document.id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-600 hover:border-emerald-500 hover:text-emerald-700" aria-label={`Preview ${document.name}`}><LuEye aria-hidden="true" /></button>
                          <button type="button" onClick={() => { setSelectedId(document.id); downloadDocument(document); }} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-600 hover:border-emerald-500 hover:text-emerald-700" aria-label={`Download ${document.name}`}><LuDownload aria-hidden="true" /></button>
                          {document.status === "Pending Review" ? (
                            <button type="button" onClick={() => setSelectedId(document.id)} className="h-8 rounded-md border border-amber-300 px-3 font-semibold text-amber-700 hover:bg-amber-50">Review</button>
                          ) : document.status === "Rejected" ? (
                            <button type="button" onClick={() => setSelectedId(document.id)} className="h-8 rounded-md border border-red-300 px-3 font-semibold text-red-500 hover:bg-red-50">View Notes</button>
                          ) : (
                            <button type="button" onClick={() => setSelectedId(document.id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-sm text-slate-600 hover:border-emerald-500 hover:text-emerald-700" aria-label={`More actions for ${document.name}`}><LuEllipsis aria-hidden="true" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDocuments.length === 0 && <div className="py-14 text-center text-[11px] text-slate-500">No documents match the selected filters.</div>}
            </div>

            <div className="flex items-center justify-between gap-4 px-4 py-5 text-[10px] text-slate-500">
              <span>Showing {firstVisible} to {lastVisible} of {displayedTotal} documents</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>
                {[1, 2, 3, 4, 5].map((pageNumber) => (
                  <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md border text-[10px] font-semibold ${page === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{pageNumber}</button>
                ))}
                <span className="px-1">•••</span>
                <button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"><LuChevronRight aria-hidden="true" /></button>
              </div>
              <label className="relative">
                <select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-semibold text-slate-600 outline-none">
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              </label>
            </div>
          </section>

          <aside className="space-y-3" aria-label="Selected document details">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_7px_24px_rgba(15,46,34,0.04)]">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[12px] font-bold text-slate-900">Document Preview</h2>
                <button type="button" aria-label="Expand document preview" className="rounded p-1 text-slate-600 hover:bg-slate-100"><LuExpand aria-hidden="true" /></button>
              </div>
              <div className="flex h-[165px] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                <div className="relative h-[160px] w-[142px] overflow-hidden bg-white px-3 pt-3 text-center shadow-md">
                  <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-500"><LuCircleCheck aria-hidden="true" /></div>
                  <p className="mt-1 text-[5px] font-bold text-slate-700">Government of India</p>
                  <p className="text-[4px] text-slate-500">Ministry of Agriculture &amp; Farmers Welfare</p>
                  <p className="mx-auto mt-5 max-w-[110px] text-[12px] font-extrabold leading-4 text-emerald-700">{selectedDocument.name.replace(/\.[^.]+$/, "")}</p>
                  <span className="absolute bottom-0 left-0 h-[52px] w-full bg-emerald-900" style={{ clipPath: "polygon(0 20%, 55% 100%, 0 100%)" }} />
                  <span className="absolute bottom-0 right-0 h-[68px] w-full bg-emerald-200" style={{ clipPath: "polygon(100% 0, 100% 100%, 18% 100%)" }} />
                  <span className="absolute bottom-0 right-0 h-[45px] w-full bg-emerald-700" style={{ clipPath: "polygon(100% 25%, 100% 100%, 38% 100%)" }} />
                </div>
              </div>

              <dl className="mt-3 space-y-1.5 text-[9px]">
                {[
                  ["Document Name", selectedDocument.name],
                  ["Category", selectedDocument.category],
                  ["Uploaded By", selectedDocument.uploadedBy],
                  ["Date Uploaded", `${selectedDocument.uploadedOn}, ${selectedDocument.uploadedAt}`],
                  ["File Size", selectedDocument.size],
                  ["Version", selectedDocument.version],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[88px_minmax(0,1fr)] gap-2"><dt className="text-slate-500">{label}</dt><dd className="truncate text-right font-medium text-slate-700">{value}</dd></div>
                ))}
                <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2"><dt className="text-slate-500">Status</dt><dd className="text-right"><StatusBadge status={selectedDocument.status} /></dd></div>
                {selectedDocument.approvedOn && <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2"><dt className="text-slate-500">Approved On</dt><dd className="text-right font-medium text-slate-700">{selectedDocument.approvedOn}</dd></div>}
                {selectedDocument.approvedBy && <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2"><dt className="text-slate-500">Approved By</dt><dd className="text-right font-medium text-slate-700">{selectedDocument.approvedBy}</dd></div>}
              </dl>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <h3 className="mb-2 text-[11px] font-bold text-slate-900">Quick Actions</h3>
                <div className="space-y-1.5">
                  <button type="button" onClick={() => downloadDocument()} className="flex h-8 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-[9px] font-semibold text-white hover:bg-emerald-800"><LuDownload aria-hidden="true" /> Download Document</button>
                  <button type="button" onClick={() => setNotice("Share link copied to clipboard.")} className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-emerald-600 text-[9px] font-semibold text-emerald-700 hover:bg-emerald-50"><LuShare2 aria-hidden="true" /> Share Document</button>
                  {selectedDocument.status === "Pending Review" ? (
                    <button type="button" onClick={() => updateStatus("Approved")} className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-emerald-600 text-[9px] font-semibold text-emerald-700 hover:bg-emerald-50"><LuCircleCheck aria-hidden="true" /> Approve Document</button>
                  ) : (
                    <button type="button" onClick={() => updateStatus("Rejected")} className="flex h-8 w-full items-center justify-center gap-2 rounded-md border border-red-400 text-[9px] font-semibold text-red-500 hover:bg-red-50"><LuBan aria-hidden="true" /> Revoke Approval</button>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_7px_24px_rgba(15,46,34,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold text-slate-900">Recent Activity</h2>
                <button type="button" className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-[22px_1fr] gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white"><LuCircleCheck aria-hidden="true" /></span>
                  <div><p className="text-[9px] font-semibold text-slate-700">Approved by Arun Kumar</p><p className="mt-0.5 text-[8px] text-slate-500">04 Sep 2026, 11:15 AM</p></div>
                </div>
                <div className="grid grid-cols-[22px_1fr] gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm text-blue-600"><LuUpload aria-hidden="true" /></span>
                  <div><p className="text-[9px] font-semibold text-slate-700">Uploaded by Anita Sharma</p><p className="mt-0.5 text-[8px] text-slate-500">04 Sep 2026, 10:30 AM</p></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
