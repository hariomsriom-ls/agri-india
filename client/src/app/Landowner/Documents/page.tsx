"use client";

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiEye,
  FiFileText,
  FiInfo,
  FiMoreVertical,
  FiPhone,
  FiPlus,
  FiShield,
  FiUploadCloud,
  FiX,
  FiXCircle,
} from "react-icons/fi";

type DocumentTab = "submitted" | "authority";
type DocumentStatus = "Verified" | "Pending" | "Rejected";

interface SubmittedDocument {
  id: number;
  name: string;
  type: string;
  uploadedOn: string;
  status: DocumentStatus;
  color: string;
}

interface AuthorityDocument {
  id: number;
  title: string;
  uploadedBy: string;
  date: string;
  category: "Legal" | "Verification" | "Approval" | "Inspection" | "Notice";
  color: string;
}

const submittedDocuments: SubmittedDocument[] = [
  { id: 1, name: "Aadhaar Card", type: "Identity Proof", uploadedOn: "10 May 2024", status: "Verified", color: "text-red-500 bg-red-50" },
  { id: 2, name: "Land Ownership Proof", type: "Ownership Proof", uploadedOn: "05 May 2024", status: "Verified", color: "text-emerald-600 bg-emerald-50" },
  { id: 3, name: "Address Proof", type: "Address Proof", uploadedOn: "28 Apr 2024", status: "Pending", color: "text-blue-500 bg-blue-50" },
  { id: 4, name: "Tax Receipt", type: "Financial Document", uploadedOn: "15 Apr 2024", status: "Verified", color: "text-violet-500 bg-violet-50" },
  { id: 5, name: "Bank Passbook", type: "Bank Document", uploadedOn: "02 Apr 2024", status: "Rejected", color: "text-teal-600 bg-teal-50" },
];

const authorityDocuments: AuthorityDocument[] = [
  { id: 1, title: "Lease Agreement", uploadedBy: "District Agriculture Office", date: "15 May 2024", category: "Legal", color: "text-red-500 bg-red-50" },
  { id: 2, title: "Land Verification Certificate", uploadedBy: "Tehsildar Office", date: "12 May 2024", category: "Verification", color: "text-emerald-600 bg-emerald-50" },
  { id: 3, title: "Approval Letter", uploadedBy: "Agriculture Department", date: "08 May 2024", category: "Approval", color: "text-blue-500 bg-blue-50" },
  { id: 4, title: "Inspection Report", uploadedBy: "Field Inspection Team", date: "04 May 2024", category: "Inspection", color: "text-amber-600 bg-amber-50" },
  { id: 5, title: "Government Notice", uploadedBy: "District Administration", date: "01 May 2024", category: "Notice", color: "text-violet-500 bg-violet-50" },
];

const categoryStyles: Record<AuthorityDocument["category"], string> = {
  Legal: "bg-blue-50 text-blue-600",
  Verification: "bg-emerald-50 text-emerald-700",
  Approval: "bg-violet-50 text-violet-600",
  Inspection: "bg-amber-50 text-amber-700",
  Notice: "bg-red-50 text-red-600",
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocumentTab>("submitted");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function chooseFile(file?: File) {
    if (file) {
      setSelectedFile(file);
      setShowUpload(true);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1450px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Documents</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your submitted and received documents</p>
          </div>
          {activeTab === "submitted" && (
            <button type="button" onClick={() => setShowUpload(true)} className="inline-flex h-12 w-fit items-center gap-2 rounded-xl bg-[#087a3e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#056532] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              <FiPlus className="text-lg" /> Add Document
            </button>
          )}
        </header>

        <DocumentsTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "submitted" ? (
          <div>
            <section className="grid gap-4 sm:grid-cols-3">
              <SummaryCard title="Total Submitted" value="28" description="All documents uploaded" icon={<FiFileText />} iconStyle="bg-emerald-50 text-emerald-700" />
              <SummaryCard title="Verified" value="18" description="Documents verified" icon={<FiShield />} iconStyle="bg-green-50 text-green-600" />
              <SummaryCard title="Pending Review" value="7" description="Awaiting verification" icon={<FiClock />} iconStyle="bg-amber-50 text-amber-600" />
            </section>

            <section className="mt-5">
              <UploadArea
                isDragging={isDragging}
                selectedFile={selectedFile}
                inputRef={fileInputRef}
                onBrowse={() => fileInputRef.current?.click()}
                onChange={handleFileChange}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              />
            </section>

            <SubmittedDocumentsTable documents={submittedDocuments} />
          </div>
        ) : (
          <div>
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-blue-800">
              <FiInfo className="mt-0.5 shrink-0 text-2xl text-blue-500" />
              <div><p className="font-semibold">These documents are shared by authorities for your reference.</p><p className="mt-1 text-sm text-blue-700/80">View-only access. Contact the issuing authority for any changes.</p></div>
              <FiShield className="ml-auto hidden shrink-0 text-3xl text-blue-300 sm:block" />
            </div>
            <AuthorityDocumentsTable documents={authorityDocuments} />
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3"><FiShield className="mt-0.5 shrink-0 text-xl text-emerald-600" /><div><p className="text-sm font-semibold text-emerald-800">Documents in this section are official records provided by authorities.</p><p className="mt-1 text-xs text-slate-600">For any queries, please contact the respective issuing authority.</p></div></div>
              <button type="button" className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><FiPhone /> Contact Authority</button>
            </div>
          </div>
        )}
      </div>

      {showUpload && (
        <div role="dialog" aria-modal="true" aria-labelledby="upload-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={() => setShowUpload(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><div><h2 id="upload-title" className="text-xl font-bold text-slate-950">Add Document</h2><p className="mt-1 text-sm text-slate-500">Select a document to submit for review.</p></div><button type="button" aria-label="Close upload dialog" onClick={() => setShowUpload(false)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"><FiX /></button></div>
            <div className="mt-5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-7 text-center"><FiUploadCloud className="mx-auto text-4xl text-emerald-600" /><p className="mt-3 font-semibold">{selectedFile?.name ?? "Choose a document to upload"}</p><p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG up to 10MB</p><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 rounded-lg border border-emerald-400 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">Browse Files</button></div>
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setShowUpload(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="button" disabled={!selectedFile} onClick={() => setShowUpload(false)} className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Upload Document</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DocumentsTabsProps { activeTab: DocumentTab; onChange: (tab: DocumentTab) => void }

function DocumentsTabs({ activeTab, onChange }: DocumentsTabsProps) {
  const tabs: { id: DocumentTab; label: string }[] = [{ id: "submitted", label: "My Submitted Documents" }, { id: "authority", label: "Authority Documents" }];
  return <div className="mb-6 mt-7 flex border-b border-slate-200" role="tablist">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => onChange(tab.id)} className={`relative px-4 py-4 text-sm font-semibold transition sm:px-6 ${activeTab === tab.id ? "text-emerald-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-emerald-600" : "text-slate-500 hover:text-slate-800"}`}>{tab.label}</button>)}</div>;
}

interface SummaryCardProps { title: string; value: string; description: string; icon: ReactNode; iconStyle: string }

function SummaryCard({ title, value, description, icon, iconStyle }: SummaryCardProps) {
  return <article className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${iconStyle}`}>{icon}</div><div><p className="text-sm font-semibold text-slate-600">{title}</p><p className="mt-0.5 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div></article>;
}

interface UploadAreaProps {
  isDragging: boolean; selectedFile: File | null; inputRef: React.RefObject<HTMLInputElement | null>;
  onBrowse: () => void; onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: () => void; onDragLeave: () => void; onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

function UploadArea({ isDragging, selectedFile, inputRef, onBrowse, onChange, onDragEnter, onDragLeave, onDrop }: UploadAreaProps) {
  return <div onDragOver={(event) => event.preventDefault()} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} className={`flex flex-col gap-4 rounded-2xl border-2 border-dashed p-6 transition sm:flex-row sm:items-center ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-emerald-300 bg-white"}`}><FiUploadCloud className="shrink-0 text-5xl text-emerald-600" /><div className="flex-1"><h2 className="font-bold text-slate-900">{selectedFile ? selectedFile.name : "Upload a new document"}</h2><p className="mt-1 text-sm text-slate-500">Drag & drop files here, or click to browse</p><p className="mt-1 text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p></div><input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onChange} className="hidden" /><button type="button" onClick={onBrowse} className="h-11 rounded-lg border border-emerald-400 bg-white px-5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">Browse Files</button></div>;
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const styles: Record<DocumentStatus, string> = { Verified: "bg-emerald-50 text-emerald-700", Pending: "bg-amber-50 text-amber-700", Rejected: "bg-red-50 text-red-600" };
  const icons: Record<DocumentStatus, ReactNode> = { Verified: <FiCheckCircle />, Pending: <FiClock />, Rejected: <FiXCircle /> };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{icons[status]}{status}</span>;
}

function DocumentIcon({ color }: { color: string }) {
  return <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg ${color}`}><FiFileText /></span>;
}

function ActionButtons({ fullLabel = false }: { fullLabel?: boolean }) {
  return <div className="flex items-center gap-2"><button type="button" onClick={() => {}} className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-emerald-300 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"><FiEye />{fullLabel ? "View Document" : "View"}</button><button type="button" aria-label="Download document" onClick={() => {}} className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"><FiDownload /></button>{!fullLabel && <button type="button" aria-label="More document actions" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><FiMoreVertical /></button>}</div>;
}

function SubmittedDocumentsTable({ documents }: { documents: SubmittedDocument[] }) {
  return <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-5 py-4">Document Name</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Uploaded On</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{documents.map((document) => <tr key={document.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><span className="flex items-center gap-3 font-semibold"><DocumentIcon color={document.color} />{document.name}</span></td><td className="px-5 py-4 text-slate-600">{document.type}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{document.uploadedOn}</td><td className="px-5 py-4"><StatusBadge status={document.status} /></td><td className="px-5 py-4"><ActionButtons /></td></tr>)}</tbody></table></div><Pagination total="28" pages={6} /></div>;
}

function AuthorityDocumentsTable({ documents }: { documents: AuthorityDocument[] }) {
  return <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-5 py-4">Document Title</th><th className="px-5 py-4">Uploaded By</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{documents.map((document) => <tr key={document.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><span className="flex items-center gap-3 font-semibold"><DocumentIcon color={document.color} />{document.title}</span></td><td className="px-5 py-4"><span className="flex items-center gap-2 whitespace-nowrap">{document.uploadedBy}<FiCheckCircle className="text-emerald-600" /></span></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{document.date}</td><td className="px-5 py-4"><span className={`rounded-md px-3 py-1 text-xs font-semibold ${categoryStyles[document.category]}`}>{document.category}</span></td><td className="px-5 py-4"><ActionButtons fullLabel /></td></tr>)}</tbody></table></div><Pagination total="16" pages={4} /></div>;
}

function Pagination({ total, pages }: { total: string; pages: number }) {
  return <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Showing 1 to 5 of {total} documents</p><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200"><FiChevronLeft /></button>{Array.from({ length: pages }, (_, index) => index + 1).map((page) => <button key={page} type="button" className={`grid h-9 w-9 place-items-center rounded-lg border font-semibold ${page === 1 ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{page}</button>)}<button type="button" aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200"><FiChevronRight /></button></div></footer>;
}
