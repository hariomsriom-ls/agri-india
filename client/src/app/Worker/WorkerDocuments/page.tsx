"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {LuArrowUpDown,LuChevronDown,LuChevronLeft,LuChevronRight,LuDownload,LuEllipsisVertical,LuEye,
  LuFileText,LuImage,LuPlus,LuSearch,LuShield,LuTrash2,LuUpload,LuUserRound,LuX,
} from "@/components/ui/icons";

type Category = "Identity" | "Land / Plot" | "Financial" | "Certificate" | "Other";
type FileType = "PDF" | "JPG" | "PNG";

type DocumentItem = {
  id: number;
  name: string;
  category: Category;
  fileType: FileType;
  uploadDate: string;
  size: string;
};

const initialDocuments: DocumentItem[] = [
  { id: 1, name: "Aadhaar Card", category: "Identity", fileType: "PDF", uploadDate: "12 Aug 2025", size: "1.2 MB" },
  { id: 2, name: "PAN Card", category: "Identity", fileType: "JPG", uploadDate: "05 Aug 2025", size: "856 KB" },
  { id: 3, name: "Land Lease Agreement", category: "Land / Plot", fileType: "PDF", uploadDate: "28 Jul 2025", size: "2.4 MB" },
  { id: 4, name: "Plot Map", category: "Land / Plot", fileType: "PNG", uploadDate: "20 Jul 2025", size: "1.1 MB" },
  { id: 5, name: "Bank Passbook", category: "Financial", fileType: "PDF", uploadDate: "15 Jul 2025", size: "1.8 MB" },
  { id: 6, name: "Training Certificate", category: "Certificate", fileType: "PDF", uploadDate: "02 Jul 2025", size: "950 KB" },
  { id: 7, name: "Soil Test Report", category: "Certificate", fileType: "PDF", uploadDate: "18 Jun 2025", size: "1.3 MB" },
  { id: 8, name: "Photo", category: "Other", fileType: "JPG", uploadDate: "10 Jun 2025", size: "620 KB" },
];

const categoryStyle: Record<Category, string> = {
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
  const [documents, setDocuments] = useState(initialDocuments);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [fileType, setFileType] = useState("All File Types");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadForm, setUploadForm] = useState<{ name: string; category: Category; fileType: FileType; size: string }>({
    name: "",
    category: "Identity",
    fileType: "PDF",
    size: "",
  });

  const visibleDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return documents
      .filter((document) => {
        const matchesSearch = !normalizedQuery || document.name.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === "All Categories" || document.category === category;
        const matchesType = fileType === "All File Types" || document.fileType === fileType;
        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((first, second) => {
        if (sortOrder === "Name A-Z") return first.name.localeCompare(second.name);
        const firstDate = new Date(first.uploadDate).getTime();
        const secondDate = new Date(second.uploadDate).getTime();
        return sortOrder === "Oldest First" ? firstDate - secondDate : secondDate - firstDate;
      });
  }, [category, documents, fileType, query, sortOrder]);

  const identityCount = documents.filter((document) => document.category === "Identity" || document.category === "Other").length;
  const landCount = documents.filter((document) => document.category === "Land / Plot").length;
  const certificateCount = documents.filter((document) => document.category === "Certificate" || document.category === "Financial").length;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function openUploadDialog() {
    setUploadForm({ name: "", category: "Identity", fileType: "PDF", size: "" });
    setUploadOpen(true);
  }

  function selectUploadFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(file: File | undefined) {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toUpperCase();
    const inferredType: FileType = extension === "PNG" ? "PNG" : extension === "JPG" || extension === "JPEG" ? "JPG" : "PDF";
    const size = file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    setUploadForm((current) => ({ ...current, name: file.name.replace(/\.[^.]+$/, ""), fileType: inferredType, size }));
  }

  function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newDocument: DocumentItem = {
      id: Math.max(...documents.map((document) => document.id), 0) + 1,
      name: uploadForm.name,
      category: uploadForm.category,
      fileType: uploadForm.fileType,
      uploadDate: "04 Sep 2026",
      size: uploadForm.size || "1.0 MB",
    };
    setDocuments((current) => [newDocument, ...current]);
    setUploadOpen(false);
    showNotice(`${newDocument.name} was added successfully.`);
  }

  function downloadDocument(document: DocumentItem) {
    const file = new Blob([`Document: ${document.name}\nCategory: ${document.category}\nUploaded: ${document.uploadDate}`], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${document.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    showNotice(`${document.name} download started.`);
  }

  function deleteDocument() {
    if (!documentToDelete) return;
    setDocuments((current) => current.filter((document) => document.id !== documentToDelete.id));
    showNotice(`${documentToDelete.name} was deleted.`);
    setDocumentToDelete(null);
  }

  return (
    <div className="min-h-full bg-[#f6f9fb] px-4 py-5 text-slate-700 sm:px-6 lg:px-7" onClick={() => setOpenMenuId(null)}>
      {notice && <div className="fixed right-6 top-20 z-[60] rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}

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
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by document name..." className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </label>
            <FilterSelect value={category} onChange={setCategory} label="Document category"><option>All Categories</option><option>Identity</option><option>Land / Plot</option><option>Financial</option><option>Certificate</option><option>Other</option></FilterSelect>
            <FilterSelect value={fileType} onChange={setFileType} label="File type"><option>All File Types</option><option>PDF</option><option>JPG</option><option>PNG</option></FilterSelect>
            <FilterSelect value={sortOrder} onChange={setSortOrder} label="Sort documents" icon={<LuArrowUpDown />}><option>Newest First</option><option>Oldest First</option><option>Name A-Z</option></FilterSelect>
          </div>

          <div className="mt-5 overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-slate-600"><tr>{["#", "Document Name", "Category", "File Type", "Upload Date", "Size", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead>
                <tbody>
                  {visibleDocuments.map((document, index) => (
                    <tr key={document.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-medium">{index + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-4">
                          <div className={`grid size-9 shrink-0 place-items-center rounded-lg text-xl ${fileIconStyle[document.fileType]}`}>{document.fileType === "PDF" ? <LuFileText /> : <LuImage />}</div>
                          <span className="font-medium text-slate-800">{document.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><span className={`rounded-md px-3 py-1.5 text-xs font-semibold ${categoryStyle[document.category]}`}>{document.category}</span></td>
                      <td className="px-5 py-3.5">{document.fileType}</td>
                      <td className="px-5 py-3.5">{document.uploadDate}</td>
                      <td className="px-5 py-3.5">{document.size}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative flex items-center gap-6 text-xl text-slate-600">
                          <button type="button" onClick={() => setSelectedDocument(document)} className="transition hover:text-emerald-700" aria-label={`View ${document.name}`}><LuEye /></button>
                          <button type="button" onClick={() => downloadDocument(document)} className="transition hover:text-emerald-700" aria-label={`Download ${document.name}`}><LuDownload /></button>
                          <button type="button" onClick={() => setDocumentToDelete(document)} className="text-red-500 transition hover:text-red-700" aria-label={`Delete ${document.name}`}><LuTrash2 /></button>
                          <button type="button" onClick={(event) => { event.stopPropagation(); setOpenMenuId((current) => current === document.id ? null : document.id); }} className="transition hover:text-slate-900" aria-label={`More actions for ${document.name}`}><LuEllipsisVertical /></button>
                          {openMenuId === document.id && (
                            <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-xl" onClick={(event) => event.stopPropagation()}>
                              <button type="button" onClick={() => { setSelectedDocument(document); setOpenMenuId(null); }} className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-50">View details</button>
                              <button type="button" onClick={() => { downloadDocument(document); setOpenMenuId(null); }} className="w-full rounded-md px-3 py-2 text-left hover:bg-slate-50">Download copy</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleDocuments.length === 0 && <tr><td colSpan={7} className="px-5 py-14 text-center text-slate-500">No documents match the selected filters.</td></tr>}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-4 py-9 text-sm text-slate-600">
              <p>Showing {visibleDocuments.length ? 1 : 0} to {visibleDocuments.length} of {visibleDocuments.length} documents</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-400 disabled:bg-slate-50" aria-label="Previous page"><LuChevronLeft /></button>
                <button type="button" className="size-10 rounded-lg bg-emerald-700 font-semibold text-white shadow-sm">1</button>
                <button type="button" disabled className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-400 disabled:bg-slate-50" aria-label="Next page"><LuChevronRight /></button>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {uploadOpen && (
        <Modal onClose={() => setUploadOpen(false)} width="max-w-xl">
          <form onSubmit={submitUpload}>
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div><h2 className="text-xl font-bold text-slate-950">Add Document</h2><p className="mt-1 text-sm text-slate-500">Upload a document and add its details.</p></div>
              <button type="button" onClick={() => setUploadOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close upload dialog"><LuX className="text-xl" /></button>
            </div>
            <div className="space-y-4 p-6">
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => handleFileChange(event.target.files?.[0])} />
              <button type="button" onClick={selectUploadFile} className="flex w-full flex-col items-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-7 text-emerald-700 hover:border-emerald-400">
                <LuUpload className="text-3xl" /><span className="mt-2 text-sm font-semibold">Choose PDF, JPG or PNG</span><span className="mt-1 text-xs text-slate-500">Maximum file size: 10 MB</span>
              </button>
              <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>Document Name <span className="text-red-500">*</span></span><input required value={uploadForm.name} onChange={(event) => setUploadForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter document name" className="h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>Category</span><select value={uploadForm.category} onChange={(event) => setUploadForm((current) => ({ ...current, category: event.target.value as Category }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-emerald-500"><option>Identity</option><option>Land / Plot</option><option>Financial</option><option>Certificate</option><option>Other</option></select></label>
                <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>File Type</span><select value={uploadForm.fileType} onChange={(event) => setUploadForm((current) => ({ ...current, fileType: event.target.value as FileType }))} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-emerald-500"><option>PDF</option><option>JPG</option><option>PNG</option></select></label>
              </div>
              <label className="block space-y-1.5 text-sm font-semibold text-slate-700"><span>File Size</span><input value={uploadForm.size} onChange={(event) => setUploadForm((current) => ({ ...current, size: event.target.value }))} placeholder="e.g. 1.2 MB" className="h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"><button type="button" onClick={() => setUploadOpen(false)} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Add Document</button></div>
          </form>
        </Modal>
      )}

      {selectedDocument && (
        <Modal onClose={() => setSelectedDocument(null)}>
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Document preview</p><h2 className="mt-1 text-xl font-bold text-slate-950">{selectedDocument.name}</h2></div><button type="button" onClick={() => setSelectedDocument(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview"><LuX className="text-xl" /></button></div>
          <div className="p-6">
            <div className={`mx-auto grid h-48 max-w-sm place-items-center rounded-xl ${fileIconStyle[selectedDocument.fileType]}`}><div className="text-center"><span className="block text-6xl">{selectedDocument.fileType === "PDF" ? <LuFileText className="mx-auto" /> : <LuImage className="mx-auto" />}</span><p className="mt-3 font-bold">{selectedDocument.fileType} document</p></div></div>
            <dl className="mt-5 divide-y divide-slate-100 text-sm">{[["Category", selectedDocument.category], ["Uploaded", selectedDocument.uploadDate], ["Size", selectedDocument.size]].map(([label, value]) => <div key={label} className="flex justify-between py-3"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-800">{value}</dd></div>)}</dl>
            <button type="button" onClick={() => downloadDocument(selectedDocument)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800"><LuDownload /> Download Document</button>
          </div>
        </Modal>
      )}

      {documentToDelete && (
        <Modal onClose={() => setDocumentToDelete(null)} width="max-w-sm">
          <div className="p-6 text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-red-100 text-2xl text-red-500"><LuTrash2 /></div><h2 className="mt-4 text-xl font-bold text-slate-950">Delete document?</h2><p className="mt-2 text-sm leading-6 text-slate-500">This will remove <span className="font-semibold text-slate-700">{documentToDelete.name}</span> from your documents.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setDocumentToDelete(null)} className="rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="button" onClick={deleteDocument} className="rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Delete</button></div></div>
        </Modal>
      )}
    </div>
  );
}
