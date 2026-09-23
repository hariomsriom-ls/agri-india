"use client";

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from "react";
import {FiCheckCircle,FiChevronLeft,FiChevronRight,FiClock,FiDownload,FiEye,FiFileText,FiInfo,
  FiPhone,FiPlus,FiShield,FiUploadCloud,FiX,FiXCircle,
} from "@/components/ui/icons";
import { useFetchDocuments } from "@/services/fetchDocuments";
import type { UserDocument } from "@/features/landowner-Worker-authority/documentsdata";
import api from "@/utils/services";
import axios from "axios";

type DocumentTab = "submitted" | "authority";
const PAGE_SIZE = 5;
const categoryStyles: Record<string, string> = {
  Legal: "bg-blue-50 text-blue-600",
  Verification: "bg-emerald-50 text-emerald-700",
  Approval: "bg-violet-50 text-violet-600",
  Inspection: "bg-amber-50 text-amber-700",
  Notice: "bg-red-50 text-red-600",
};

export default function DocumentsPage() {
  const { role, documents, status, error, retry } = useFetchDocuments("landowner");
  const [activeTab, setActiveTab] = useState<DocumentTab>("submitted");
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAuthorityDocument = (document: UserDocument) =>
    document.documentFromModel === "authority" || document.documentFromModel === "organizationauthority";
  const submittedDocuments = documents.filter((document) => !isAuthorityDocument(document));
  const authorityDocuments = documents.filter(isAuthorityDocument);
  const tabDocuments = activeTab === "submitted" ? submittedDocuments : authorityDocuments;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(tabDocuments.length / PAGE_SIZE)));
  const visibleDocuments = tabDocuments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeTab(tab: DocumentTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function chooseFile(file?: File) {
    if (file && !isUploading) {
      setSelectedFile(file);
      setDocumentName(file.name);
      setUploadError(null);
      setUploadSuccess(false);
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

 async function handleUpload() {
    if (isUploading) return;
    setUploadError(null);
    setUploadSuccess(false);

    if (!selectedFile) {
      setUploadError("Please select a document.");
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)) {
      setUploadError("Choose a PDF, JPG, or PNG document.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError("Document must be 10 MB or smaller.");
      return;
    }
    if (!documentName.trim() || !category.trim()) {
      setUploadError("Document name and category are required.");
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("name", documentName.trim());
    formData.append("category", category.trim());

    setIsUploading(true);
    try {
      await api.post("/landowner/upload-document", formData, { withCredentials: true });
      setShowUpload(false);
      setSelectedFile(null);
      setDocumentName("");
      setCategory("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setActiveTab("submitted");
      setPage(1);
      setUploadSuccess(true);
      retry();
    } catch (error) {
      setUploadError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to upload document. Please try again."
          : "Failed to upload document. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  if (!role) {
    return <p className="p-6 text-slate-600">User role not found. Please sign in to view your documents.</p>;
  }
  if (role !== "landowner") {
    return <p role="alert" className="p-6 text-red-600">Only landowners can view this page.</p>;
  }
  if (status === "idle" || status === "loading") {
    return <p role="status" className="p-6 text-slate-600">Loading documents...</p>;
  }
  if (status === "failed") {
    return (
    <div className="p-6">
      <p role="alert" className="text-red-600">{error ?? "Failed to fetch documents."}</p>
      <button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button>
      </div>
    );
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
            <button type="button" 
            onClick={() => { setUploadError(null); setUploadSuccess(false); setShowUpload(true); }} 
            className="inline-flex h-12 w-fit items-center gap-2 rounded-xl bg-[#087a3e] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#056532] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              <FiPlus className="text-lg" /> 
              Add Document
            </button>
          )}
        </header>
          {uploadSuccess && <p role="status" className="mt-4 text-sm font-medium text-emerald-700">Document uploaded successfully.</p>}
        <DocumentsTabs activeTab={activeTab} onChange={changeTab} />

        {activeTab === "submitted" ? (
          <div>
            <section className="grid gap-4 sm:grid-cols-3">
              <SummaryCard 
              title="Total Submitted" 
              value={String(submittedDocuments.length)} 
              description="Your submitted documents" 
              icon={<FiFileText />} 
              iconStyle="bg-emerald-50 text-emerald-700" />

              <SummaryCard title="Authority Documents" 
              value={String(authorityDocuments.length)} 
              description="Shared by authorities" 
              icon={<FiShield />} 
              iconStyle="bg-green-50 text-green-600" />

              <SummaryCard 
              title="Total Documents" 
              value={String(documents.length)} 
              description="Submitted and received" 
              icon={<FiFileText />} 
              iconStyle="bg-amber-50 text-amber-600" />

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

            <SubmittedDocumentsTable 
            documents={visibleDocuments} 
            total={submittedDocuments.length}
             page={currentPage} 
             onPageChange={setPage} />
          </div>
        ) : (
          <div>
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-blue-800">
              <FiInfo className="mt-0.5 shrink-0 text-2xl text-blue-500" />
              <div>
                <p className="font-semibold">These documents are shared by authorities for your reference.</p><p className="mt-1 text-sm text-blue-700/80">View-only access. Contact the issuing authority for any changes.</p></div>
              <FiShield className="ml-auto hidden shrink-0 text-3xl text-blue-300 sm:block" />
            </div>
            <AuthorityDocumentsTable documents={visibleDocuments} total={authorityDocuments.length} page={currentPage} onPageChange={setPage} />
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3"><FiShield className="mt-0.5 shrink-0 text-xl text-emerald-600" /><div><p className="text-sm font-semibold text-emerald-800">Documents in this section are official records provided by authorities.</p><p className="mt-1 text-xs text-slate-600">For any queries, please contact the respective issuing authority.</p></div></div>
              <button type="button" className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><FiPhone /> Contact Authority</button>
            </div>
          </div>
        )}
      </div>

      {showUpload && (
        <div role="dialog" 
        aria-modal="true" 
        aria-labelledby="upload-title" 
        className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" 
         onMouseDown={() => { if (!isUploading) setShowUpload(false); }}>
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
           onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between">
          <div>
            <h2 id="upload-title" className="text-xl font-bold text-slate-950">Add Document</h2>
            <p className="mt-1 text-sm text-slate-500">Select a document to submit for review.</p>
          </div>
          <button type="button" aria-label="Close upload dialog"
          disabled={isUploading} 
          onClick={() => setShowUpload(false)} 
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
            <FiX />
          </button>
          </div>
            <div className="mt-5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-7 text-center">
            <FiUploadCloud className="mx-auto text-4xl text-emerald-600" />
            <p className="mt-3 font-semibold">{selectedFile?.name ?? "Choose a document to upload"}</p>
            <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG up to 10MB</p>
          <button type="button" 
          disabled={isUploading}
            onClick={() => fileInputRef.current?.click()} 
            className="mt-4 rounded-lg border border-emerald-400 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
              Browse Files
           </button>
           </div>
           <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="document-name" className="block text-sm font-semibold text-slate-700">Document name</label>
              <input id="document-name" type="text" value={documentName}
                onChange={(event) => setDocumentName(event.target.value)} disabled={isUploading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="document-category" className="block text-sm font-semibold text-slate-700">Category</label>
              <input id="document-category" type="text" value={category} placeholder="e.g. Legal or Verification"
                onChange={(event) => setCategory(event.target.value)} disabled={isUploading}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>
          {uploadError && <p role="alert" className="mt-3 text-sm text-red-600">{uploadError}</p>}
          <div className="mt-5 flex justify-end gap-3">
          <button type="button"
          disabled={isUploading}
           onClick={() => setShowUpload(false)} 
           className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button type="button" 
          disabled={!selectedFile || isUploading} 
          onClick={handleUpload} 
          className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
            Upload Document
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
          </div>
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
  return (
  <div 
  onDragOver={(event) => event.preventDefault()} 
  onDragEnter={onDragEnter} 
  onDragLeave={onDragLeave} 
  onDrop={onDrop} 
  className={`flex flex-col gap-4 rounded-2xl border-2 border-dashed p-6 transition sm:flex-row sm:items-center ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-emerald-300 bg-white"}`}>
  <FiUploadCloud className="shrink-0 text-5xl text-emerald-600" />
  <div className="flex-1">
    <h2 className="font-bold text-slate-900">{selectedFile ? selectedFile.name : "Upload a new document"}</h2>
    <p className="mt-1 text-sm text-slate-500">Drag & drop files here, or click to browse</p>
    <p className="mt-1 text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
    </div>
    <input ref={inputRef} 
    type="file" 
    accept=".pdf,.jpg,.jpeg,.png" 
    onChange={onChange} 
    className="hidden" />
    <button type="button" 
    onClick={onBrowse} 
    className="h-11 rounded-lg border border-emerald-400 bg-white px-5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">
      Browse Files
    </button>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = { verified: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", rejected: "bg-red-50 text-red-600" };
  const icons: Record<string, ReactNode> = { verified: <FiCheckCircle />, pending: <FiClock />, rejected: <FiXCircle /> };
  const key = status?.toLowerCase() ?? "";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[key] ?? "bg-slate-100 text-slate-600"}`}>{icons[key]}{status || "Not provided"}</span>;
}

function DocumentIcon({ color }: { color: string }) {
  return (
  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg ${color}`}>
    <FiFileText />
    </span>
  );
}

function ActionButtons({ document, fullLabel = false }: { document: UserDocument; fullLabel?: boolean }) {
  let fileUrl: string | undefined;
  try {
    const url = new URL(document.fileUrl);
    if (url.protocol === "https:" || url.protocol === "http:") fileUrl = url.href;
  } catch { /* Documents without a valid URL cannot be opened. */ }
  if (!fileUrl) return <span className="text-xs text-slate-500">File unavailable</span>;
  return (
  <div className="flex items-center gap-2">
    <a href={fileUrl} target="_blank" rel="noopener noreferrer" 
    aria-label={`View ${document.name}`} 
    className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-emerald-300 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
      <FiEye />
    {fullLabel ? "View Document" : "View"}
    </a>
    <a href={fileUrl} 
    target="_blank" rel="noopener noreferrer" 
    download aria-label={`Download ${document.name}`} 
    className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50">
      <FiDownload />
    </a>
    </div>
    );
}

function formatUploadDate(document: UserDocument) {
  const value = document.uploadDate || document.createdAt;
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

interface DocumentsTableProps {
  documents: UserDocument[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

function SubmittedDocumentsTable({ documents, total, page, onPageChange }: DocumentsTableProps) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              <th className="px-5 py-4">Document Name</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Uploaded On</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr key={document._id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3 font-semibold">
                    <DocumentIcon color="bg-emerald-50 text-emerald-600" />
                    {document.name}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{document.category}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatUploadDate(document)}</td>
                <td className="px-5 py-4"><StatusBadge status={document.status} /></td>
                <td className="px-5 py-4"><ActionButtons document={document} /></td>
              </tr>
            ))}
            {!documents.length && <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-slate-500">No submitted documents found.</td>
              </tr>}
          </tbody>
        </table>
      </div>
      <Pagination total={total} page={page} onPageChange={onPageChange} />
    </div>
  );
}

function AuthorityDocumentsTable({ documents, total, page, onPageChange }: DocumentsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              <th className="px-5 py-4">Document Title</th>
              <th className="px-5 py-4">Uploaded By</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((document) => (
              <tr key={document._id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3 font-semibold">
                    <DocumentIcon color="bg-blue-50 text-blue-600" />{document.name}
                  </span>
                </td>
                <td className="px-5 py-4">{typeof document.documentFrom === "object" && document.documentFrom ? document.documentFrom.fullName || document.documentFrom.userName || document.documentFrom._id : document.documentFrom || "Authority"}</td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatUploadDate(document)}</td>
                <td className="px-5 py-4"><span className={`rounded-md px-3 py-1 text-xs font-semibold ${categoryStyles[document.category] ?? "bg-slate-100 text-slate-600"}`}>{document.category}</span></td>
                <td className="px-5 py-4"><ActionButtons document={document} fullLabel /></td>
              </tr>
            ))}
            {!documents.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No authority documents found.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination total={total} page={page} onPageChange={onPageChange} />
    </div>
  );
}

function Pagination({ total, page, onPageChange }: Omit<DocumentsTableProps, "documents">) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const end = Math.min(page * PAGE_SIZE, total);
  return (
    <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>Showing {start} to {end} of {total} documents</p>
      <div className="flex items-center gap-2">
        <button
         type="button" 
         aria-label="Previous page" 
         disabled={page <= 1} 
         onClick={() => onPageChange(page - 1)} 
         className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40">
          <FiChevronLeft />
        </button>
        <span aria-live="polite" className="px-2">Page {page} of {pages}</span>
        <button type="button" 
        aria-label="Next page" 
        disabled={page >= pages} 
        onClick={() => onPageChange(page + 1)} 
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 disabled:cursor-not-allowed disabled:opacity-40">
          <FiChevronRight />
        </button>
      </div>
    </footer>
  );
}
