"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {LuArrowUpDown,LuChevronDown,LuChevronLeft,LuChevronRight,LuDownload,LuEllipsisVertical,LuEye,
  LuFileText,LuImage,LuPlus,LuSearch,LuShield,LuUpload,LuUserRound,LuX,
} from "@/components/ui/icons";
import { clearDocumentUploadError, uploadUserDocument, type UserDocument } from "@/features/landowner-Worker/documentsdata";
import { useFetchDocuments } from "@/services/fetchDocuments";
import { useAppDispatch } from "@/store/hooks";

type FileType = "PDF" | "JPG" | "PNG" | "Unknown";
type DocumentItem = UserDocument & { fileType: FileType };
const PAGE_SIZE = 5;

function getFileType(document: UserDocument): FileType {
  let format = document.format?.toUpperCase();
  if (!format) {
    try { format = new URL(document.fileUrl).pathname.split(".").pop()?.toUpperCase(); } catch { /* Missing or invalid URL. */ }
  }
  if (format === "JPEG") return "JPG";
  return format === "PDF" || format === "JPG" || format === "PNG" ? format : "Unknown";
}

function getFileUrl(document: UserDocument) {
  try {
    const url = new URL(document.fileUrl);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

function formatUploadDate(document: UserDocument) {
  const date = new Date(document.uploadDate || document.createdAt);
  return Number.isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
  });
}

const categoryStyle: Record<string, string> = {
  Identity: "bg-emerald-100 text-emerald-700",
  "Land / Plot": "bg-blue-100 text-blue-600",
  Financial: "bg-amber-100 text-amber-600",
  Certificate: "bg-violet-100 text-violet-700",
  Other: "bg-slate-200 text-slate-600",
};

const fileIconStyle: Record<FileType, string> = {
  PDF: "bg-red-100 text-red-500",
  JPG: "bg-blue-100 text-blue-600",
  PNG: "bg-emerald-100 text-emerald-600",
  Unknown: "bg-slate-100 text-slate-600",
};

function MetricCard({ icon, label, value, cardClass, iconClass }: {
  icon: ReactNode;
  label: string;
  value: number;
  cardClass: string;
  iconClass: string;
}) {
  return (
    <section className={`flex min-h-24 items-center gap-5 rounded-xl border p-4 shadow-sm ${cardClass}`}>
      <div className={`grid size-16 shrink-0 place-items-center rounded-xl text-[32px] ${iconClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
      </div>
    </section>
  );
}

function FilterSelect({ value, onChange, label, children, icon }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="relative min-w-44 flex-1">
      {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${icon ? "pl-11" : "pl-4"}`}
      >
        {children}
      </select>
      <LuChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

function Modal({ children, onClose, width = "max-w-lg" }: { children: ReactNode; onClose: () => void; width?: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[2px]" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${width}`} onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default function WorkerDocuments() {
  const { role, documents, status, error, retry, isUploading, uploadError } = useFetchDocuments("worker");
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [fileType, setFileType] = useState("All File Types");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Identity");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visibleDocuments = useMemo(() => {
  const normalizedQuery = query.trim().toLowerCase();
    return documents
      .map((document) => ({ ...document, fileType: getFileType(document) }))
      .filter((document) => {
        const matchesSearch = !normalizedQuery || document.name.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === "All Categories" || document.category === category;
        const matchesType = fileType === "All File Types" || document.fileType === fileType;
        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((first, second) => {
        if (sortOrder === "Name A-Z") return first.name.localeCompare(second.name);
        const firstDate = Date.parse(first.createdAt || first.uploadDate) || 0;
        const secondDate = Date.parse(second.createdAt || second.uploadDate) || 0;
        return sortOrder === "Oldest First" ? firstDate - secondDate : secondDate - firstDate;
      });
  }, [category, documents, fileType, query, sortOrder]);

  const identityCount = documents.filter((document) => document.category === "Identity").length;
  const landCount = documents.filter((document) => ["Land / Plot", "LandDocuments"].includes(document.category)).length;
  const certificateCount = documents.filter((document) => document.category === "Certificate").length;
  const categoryOptions = [...new Set([...Object.keys(categoryStyle), ...documents.map(document => document.category)])];
  const totalPages = Math.max(1, Math.ceil(visibleDocuments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageDocuments = visibleDocuments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function showNotice(message: string) {
    setNotice(message);
  }

  function openUploadDialog() {
    dispatch(clearDocumentUploadError());
    setDocumentName("");
    setUploadCategory("Identity");
    setSelectedFile(null);
    setUploadSuccess(false);
    setNotice("");
    setShowUpload(true);
  }

  function selectUploadFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(file: File | undefined) {
    if (!file || isUploading) return;
    setSelectedFile(file);
    setDocumentName(file.name.replace(/\.[^.]+$/, ""));
    dispatch(clearDocumentUploadError());
  }

  async function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUploading || role !== "worker") return;
    const data = new FormData();
    data.append("name", documentName);
    data.append("category", uploadCategory);
    if (selectedFile) data.append("document", selectedFile);
    const result = await dispatch(uploadUserDocument({ role, data }));
    if (uploadUserDocument.fulfilled.match(result)) {
      setShowUpload(false);
      setSelectedFile(null);
      setUploadSuccess(true);
      setQuery("");
      setCategory("All Categories");
      setFileType("All File Types");
      setSortOrder("Newest First");
      setPage(1);
    }
  }

  function downloadDocument(document: DocumentItem) {
    const url = getFileUrl(document);
    if (!url) { showNotice("This document does not have a valid file link."); return; }
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = document.name;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  if (!role) return <p className="p-6 text-slate-600">Please sign in to view your documents.</p>;
  if (role !== "worker") return <p role="alert" className="p-6 text-red-600">Only workers can view this page.</p>;
  if (status === "idle" || status === "loading") return <p role="status" className="p-6 text-slate-600">Loading documents...</p>;
  if (status === "failed") return <div className="p-6"><p role="alert" className="text-red-600">{error ?? "Failed to fetch documents."}</p><button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Try again</button></div>;

  return (
    <div className="min-h-full bg-[#f6f9fb] px-4 py-5 text-slate-700 sm:px-6 lg:px-7" onClick={() => setOpenMenuId(null)}>
      {notice && <div role="alert" className="fixed right-6 top-20 z-[60] rounded-lg bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}<button type="button" onClick={() => setNotice("")} className="ml-4" aria-label="Dismiss message"><LuX /></button></div>}

      <div className="mx-auto max-w-[1480px]">
        <header className="flex items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">Documents</h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">Upload and manage your important documents in one place.</p>
          </div>
          <button type="button" onClick={openUploadDialog} className="flex h-12 shrink-0 items-center gap-3 rounded-lg bg-emerald-800 px-7 font-semibold text-white shadow-sm transition hover:bg-emerald-900">
            <LuPlus className="text-xl" /> Add Document
          </button>
        </header>
        {uploadSuccess && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Document uploaded successfully.</p>}

        <div className="mt-6 border-b border-slate-200">
          <button type="button" className="flex min-w-52 items-center justify-center gap-3 border-b-[3px] border-emerald-700 bg-white px-6 py-4 font-semibold text-emerald-800 shadow-sm">
            <LuFileText className="text-2xl" /> My Documents
          </button>
        </div>

        <section className="rounded-b-xl bg-white/70 px-2 pb-7 pt-5 sm:px-3">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={<LuFileText />} label="Total Documents" value={documents.length} cardClass="border-emerald-100 bg-gradient-to-r from-emerald-50 to-white" iconClass="bg-emerald-100 text-emerald-600" />
            <MetricCard icon={<LuUserRound />} label="Identity Documents" value={identityCount} cardClass="border-blue-100 bg-gradient-to-r from-blue-50 to-white" iconClass="bg-blue-100 text-blue-600" />
            <MetricCard icon={<LuFileText />} label="Land / Plot Documents" value={landCount} cardClass="border-violet-100 bg-gradient-to-r from-violet-50 to-white" iconClass="bg-violet-100 text-violet-600" />
            <MetricCard icon={<LuShield />} label="Certificates" value={certificateCount} cardClass="border-orange-100 bg-gradient-to-r from-orange-50 to-white" iconClass="bg-orange-100 text-orange-600" />
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <label className="relative min-w-72 flex-[2]">
              <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500" />
              <input aria-label="Search documents" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by document name..." className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </label>
            <FilterSelect value={category} onChange={value => { setCategory(value); setPage(1); }} label="Document category"><option>All Categories</option>{categoryOptions.map(item => <option key={item}>{item}</option>)}</FilterSelect>
            <FilterSelect value={fileType} onChange={value => { setFileType(value); setPage(1); }} label="File type"><option>All File Types</option><option>PDF</option><option>JPG</option><option>PNG</option><option>Unknown</option></FilterSelect>
            <FilterSelect value={sortOrder} onChange={value => { setSortOrder(value); setPage(1); }} label="Sort documents" icon={<LuArrowUpDown />}><option>Newest First</option><option>Oldest First</option><option>Name A-Z</option></FilterSelect>
          </div>

          <div className="mt-5 overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600"><tr>{["#", "Document Name", "Category", "File Type", "Upload Date", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead>
                <tbody>
                  {pageDocuments.map((document, index) => (
                    <tr key={document._id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-medium">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-4">
                          <div className={`grid size-9 shrink-0 place-items-center rounded-lg text-xl ${fileIconStyle[document.fileType]}`}>{document.fileType === "PDF" ? <LuFileText /> : <LuImage />}</div>
                          <span className="font-medium text-slate-800">{document.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><span className={`rounded-md px-3 py-1.5 text-xs font-semibold ${categoryStyle[document.category] ?? categoryStyle.Other}`}>{document.category}</span></td>
                      <td className="px-5 py-3.5">{document.fileType}</td>
                      <td className="px-5 py-3.5">{formatUploadDate(document)}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative flex items-center gap-6 text-xl text-slate-600">
                          <button type="button" onClick={() => setSelectedDocument(document)} className="transition hover:text-emerald-700" aria-label={`View ${document.name}`}><LuEye /></button>
                          <button type="button" onClick={() => downloadDocument(document)} className="transition hover:text-emerald-700" aria-label={`Download ${document.name}`}><LuDownload /></button>
                          <button type="button" onClick={(event) => { event.stopPropagation(); setOpenMenuId((current) => current === document._id ? null : document._id); }} className="transition hover:text-slate-900" aria-label={`More actions for ${document.name}`}><LuEllipsisVertical /></button>
                          {openMenuId === document._id && (
                            <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-xl" onClick={(event) => event.stopPropagation()}>
                              <button type="button" onClick={() => { setSelectedDocument(document); setOpenMenuId(null); }} className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-50">View details</button>
                              <button type="button" onClick={() => { downloadDocument(document); setOpenMenuId(null); }} className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-50">Download copy</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleDocuments.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-500">{documents.length ? "No documents match the selected filters." : "You have no documents yet."}</td></tr>}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-4 py-9 text-sm text-slate-600">
              <p>Showing {visibleDocuments.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {Math.min(currentPage * PAGE_SIZE, visibleDocuments.length)} of {visibleDocuments.length} documents</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="grid size-10 place-items-center rounded-lg border border-slate-200 disabled:opacity-40" aria-label="Previous page"><LuChevronLeft /></button>
                <span aria-live="polite">Page {currentPage} of {totalPages}</span>
                <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="grid size-10 place-items-center rounded-lg border border-slate-200 disabled:opacity-40" aria-label="Next page"><LuChevronRight /></button>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {showUpload && (
        <Modal onClose={() => { if (!isUploading) setShowUpload(false); }} width="max-w-xl">
          <form onSubmit={submitUpload} aria-busy={isUploading}>
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div><h2 className="text-xl font-bold text-slate-950">Add Document</h2><p className="mt-1 text-sm text-slate-500">Upload a document and add its details.</p></div>
              <button type="button" disabled={isUploading} onClick={() => setShowUpload(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50" aria-label="Close upload dialog"><LuX className="text-xl" /></button>
            </div>
            <fieldset disabled={isUploading} className="space-y-4 p-6 disabled:opacity-60">
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => handleFileChange(event.target.files?.[0])} />
              <button type="button" onClick={selectUploadFile} className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-7 text-emerald-700 hover:border-emerald-400">
                <LuUpload className="text-3xl" /><span className="mt-2 break-all text-sm font-semibold">{selectedFile?.name ?? "Choose PDF, JPG or PNG"}</span><span className="mt-1 text-xs text-slate-500">Maximum file size: 10 MB</span>
              </button>
              <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>Document Name <span className="text-red-500">*</span></span><input required value={documentName} onChange={(event) => setDocumentName(event.target.value)} placeholder="Enter document name" className="h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>Category</span><select value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-emerald-500">{Object.keys(categoryStyle).map(item => <option key={item}>{item}</option>)}</select></label>
              {selectedFile && <p className="text-xs text-slate-500">Selected file: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>}
            </fieldset>
            {uploadError && <p role="alert" className="px-6 pb-4 text-sm text-red-600">{uploadError}</p>}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"><button type="button" disabled={isUploading} onClick={() => setShowUpload(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={isUploading || !selectedFile} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">{isUploading ? "Uploading..." : "Add Document"}</button></div>
          </form>
        </Modal>
      )}

      {selectedDocument && (
        <Modal onClose={() => setSelectedDocument(null)}>
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Document preview</p><h2 className="mt-1 text-xl font-bold text-slate-950">{selectedDocument.name}</h2></div><button type="button" onClick={() => setSelectedDocument(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview"><LuX className="text-xl" /></button></div>
          <div className="p-6">
            <div className={`mx-auto grid h-48 max-w-sm place-items-center rounded-xl ${fileIconStyle[selectedDocument.fileType]}`}><div className="text-center"><span className="block text-6xl">{selectedDocument.fileType === "PDF" ? <LuFileText className="mx-auto" /> : <LuImage className="mx-auto" />}</span><p className="mt-3 font-bold">{selectedDocument.fileType} document</p></div></div>
            <dl className="mt-5 divide-y divide-slate-100 text-sm">{[["Category", selectedDocument.category], ["Uploaded", formatUploadDate(selectedDocument)], ["Document ID", selectedDocument._id]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-3"><dt className="text-slate-500">{label}</dt><dd className="break-all font-semibold text-slate-800">{value}</dd></div>)}</dl>
            {getFileUrl(selectedDocument) && <a href={getFileUrl(selectedDocument)} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-300 py-3 text-sm font-semibold text-emerald-700"><LuEye /> Open document</a>}
            <button type="button" onClick={() => downloadDocument(selectedDocument)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800"><LuDownload /> Download Document</button>
          </div>
        </Modal>
      )}

    </div>
  );
}
