"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import { FiGrid, FiList, FiMapPin, FiPlus, FiSearch, FiUsers,GiWheat, LuLandPlot, LuLeaf  } from "@/components/ui/icons";
import { useFetchLands } from "@/services/fetchLands";
import api from "@/utils/services";
import axios from "axios";
import type { LandRecord } from "@/features/landowner-Worker-authority/landsdata";


const statusStyles: Record<string, string> = {
  active: "bg-emerald-600 text-white",
  "in-use": "bg-emerald-600 text-white",
  verified: "bg-green-700 text-white",
  pending: "bg-amber-400 text-slate-900",
  inactive: "bg-red-500 text-white",
  rejected: "bg-red-500 text-white",
};

export default function LandownerMyLands() {
  const { role, lands, status: fetchStatus, error, retry } = useFetchLands();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("Newest First");
  const [view, setView] = useState<"grid" | "list">("grid");
  const addLandDialog = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const deleteLandDialog = useRef<HTMLDialogElement>(null);
  const [landToDelete, setLandToDelete] = useState<LandRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  async function handleDeleteLand() {
    if (!landToDelete || isDeleting) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await api.delete(`/landowner/delete-land-details/${landToDelete._id}`, { withCredentials: true });
      deleteLandDialog.current?.close();
      setLandToDelete(null);
      setDeleteSuccess(true);
      setStatus("All Status");
      setLocation("All Locations");
      retry();
    } catch (error) {
      setDeleteError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to delete land. Please try again."
          : "Failed to delete land. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleAddLand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);
    setDeleteSuccess(false);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const area = Number(formData.get("landArea"));
    const city = String(formData.get("landCity") ?? "").trim();
    const landLocation = String(formData.get("landLocation") ?? "").trim();
    const document = formData.get("landDocuments");

    if (!Number.isFinite(area) || area <= 0 || !city || !landLocation) {
      setSubmitError("Enter a positive land area, city, and location.");
      return;
    }
    if (!(document instanceof File) || !document.size) {
      setSubmitError("Please select a land document.");
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(document.type)) {
      setSubmitError("Choose a PDF, JPG, or PNG document.");
      return;
    }
    if (document.size > 10 * 1024 * 1024) {
      setSubmitError("Land document must be 10 MB or smaller.");
      return;
    }
    formData.set("landCity", city);
    formData.set("landLocation", landLocation);

    setIsSubmitting(true);
    try {
      await api.post("/landowner/add-land-details", formData, { withCredentials: true });
      form.reset();
      addLandDialog.current?.close();
      setSearch("");
      setStatus("All Status");
      setLocation("All Locations");
      setSort("Newest First");
      setSubmitSuccess(true);
      retry();
    } catch (error) {
      setSubmitError(
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || "Failed to add land. Please try again."
          : "Failed to add land. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const locations = [...new Set(lands.map((land) => land.landCity).filter(Boolean))];
  const statuses = [...new Set(lands.map((land) => land.landStatus || "Pending"))];
  const filteredLands = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = lands.filter((land) =>
      (!term || [land.landCity, land.landLocation, land._id].some((value) => value?.toLowerCase().includes(term))) &&
      (status === "All Status" || (land.landStatus || "Pending") === status) &&
      (location === "All Locations" || land.landCity === location),
    );
    return [...result].sort((a, b) => {
      if (sort === "City A-Z") return a.landCity.localeCompare(b.landCity);
      if (sort === "Largest Area") return b.landArea - a.landArea;
      return (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0);
    });
  }, [lands, location, search, sort, status]);

  const stats = [
    { label: "Total Lands", value: lands.length, note: "All registered lands", icon: LuLeaf },
    { label: "Total Land Area", value: `${lands.reduce((sum, land) => sum + land.landArea, 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Acres`, note: "Across all lands", icon: LuLandPlot },
    { label: "Lands In Use", value: lands.filter((land) => ["active", "in-use"].includes(land.landStatus?.toLowerCase())).length, note: "Currently active", icon: GiWheat },
    { label: "Verified Lands", value: lands.filter((land) => land.landStatus?.toLowerCase() === "verified").length, note: "Verified by an authority", icon: FiUsers },
  ];

  if (!role) {
    return <p className="p-6 text-slate-600">User role not found. Please sign in to view your lands.</p>;
  }

  if (role !== "landowner") {
    return <p role="alert" className="p-6 text-red-600">Only landowners can view this page.</p>;
  }

  if (fetchStatus === "idle" || fetchStatus === "loading") {
    return <p role="status" className="p-6 text-slate-600">Loading land records...</p>;
  }

  if (fetchStatus === "failed") {
    return (
      <div className="p-6">
        <p role="alert" className="text-red-600">{error ?? "Failed to fetch land records."}</p>
        <button type="button" onClick={retry} className="mt-3 rounded-lg bg-[#17652f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104d23]">Try again</button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f6f8f6] px-5 py-7 text-slate-900 sm:px-7 lg:px-9">
      <section className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Lands</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your land properties in one place</p>
          </div>
          <button type="button" onClick={() => { setSubmitError(null); setSubmitSuccess(false); addLandDialog.current?.showModal(); }} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#17652f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104d23] focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
            <FiPlus className="text-lg" /> Add New Land
          </button>
        </div>

        {submitSuccess && <p role="status" className="mb-5 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">Land added successfully and is pending verification.</p>}
        {deleteSuccess && <p role="status" className="mb-5 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">Land deleted successfully.</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <article key={label} className="flex min-h-32 items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-[#21733a]"><Icon className="text-3xl" /></div>
              <div><p className="text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by city, location or ID..." aria-label="Search lands" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-12 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>All Status</option>{statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-12 min-w-52 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>All Locations</option>{locations.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 min-w-44 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-green-600">
            <option>Newest First</option><option>City A-Z</option><option>Largest Area</option>
          </select>
          <div className="flex h-12 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={`grid w-10 place-items-center rounded-lg transition ${view === "grid" ? "bg-white text-[#17652f] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}><FiGrid /></button>
            <button type="button" aria-label="List view" onClick={() => setView("list")} className={`grid w-10 place-items-center rounded-lg transition ${view === "list" ? "bg-white text-[#17652f] shadow-sm" : "text-slate-500 hover:text-slate-800"}`}><FiList /></button>
          </div>
        </div>

        {filteredLands.length ? (
          <div className={view === "grid" ? "mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "mt-5 grid gap-4"}>
            {filteredLands.map((land) => (
              <article key={land._id} className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${view === "list" ? "sm:flex" : ""}`}>
                <div className={`relative grid shrink-0 place-items-center bg-gradient-to-br from-green-50 to-emerald-100 ${view === "list" ? "h-52 sm:h-auto sm:w-72" : "h-52"}`}>
                  <LuLandPlot aria-hidden="true" className="text-7xl text-emerald-700/30" />
                  <span className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${statusStyles[(land.landStatus || "Pending").toLowerCase()] ?? "bg-slate-600 text-white"}`}>{land.landStatus || "Pending"}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-slate-950">Land in {land.landCity}</h2><p className="mt-1 break-all text-xs font-medium text-slate-500">{land._id}</p>
                  <div className="mt-5 grid gap-3 text-sm text-slate-600">
                    <p className="flex items-center gap-3"><FiMapPin className="shrink-0 text-lg text-[#258044]" />{[land.landLocation, land.landCity].filter(Boolean).join(", ")}</p>
                    <p className="flex items-center gap-3"><LuLandPlot className="shrink-0 text-lg text-[#258044]" />{land.landArea} Acres</p>
                    <p className="flex items-center gap-3"><GiWheat className="shrink-0 text-lg text-[#258044]" />{land.landquality || "Land quality not provided"}</p>
                    <p className="flex items-center gap-3"><FiUsers className="shrink-0 text-lg text-[#258044]" />{land.authorityAssigned ? "Authority assigned" : "Awaiting authority assignment"}</p>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button type="button" className="h-11 flex-1 rounded-lg border border-slate-200 text-sm font-semibold text-[#17652f] transition hover:border-green-600 hover:bg-green-50">View Details</button>
                    <button type="button" aria-label={`Delete land in ${land.landCity}, ${land._id}`}
                      disabled={isDeleting || ["active", "in-use"].includes(land.landStatus?.toLowerCase())}
                      title={["active", "in-use"].includes(land.landStatus?.toLowerCase()) ? "Land currently in use cannot be deleted" : "Delete land"}
                      onClick={() => {
                        setLandToDelete(land);
                        setDeleteError(null);
                        setDeleteSuccess(false);
                        setSubmitSuccess(false);
                        deleteLandDialog.current?.showModal();
                      }}
                      className="h-11 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <LuLandPlot className="mx-auto text-4xl text-slate-300" /><h2 className="mt-4 text-lg font-semibold">No lands found</h2><p className="mt-1 text-sm text-slate-500">{lands.length ? "Try changing your search or filters." : "You have no registered land records yet."}</p>
          </div>
        )}
      </section>
      <dialog ref={deleteLandDialog} aria-labelledby="delete-land-title" aria-describedby="delete-land-description"
        onCancel={(event) => { if (isDeleting) event.preventDefault(); }}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/45">
        <h2 id="delete-land-title" className="text-xl font-bold">Delete land?</h2>
        <p id="delete-land-description" className="mt-3 text-sm text-slate-600">
          Delete the {landToDelete?.landArea} acre land at {landToDelete?.landLocation}, {landToDelete?.landCity}? This cannot be undone.
        </p>
        <p className="mt-2 break-all text-xs text-slate-500">Land ID: {landToDelete?._id}</p>
        {deleteError && <p role="alert" className="mt-4 text-sm text-red-600">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" disabled={isDeleting} onClick={() => deleteLandDialog.current?.close()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Cancel</button>
          <button type="button" disabled={!landToDelete || isDeleting} onClick={handleDeleteLand}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
            {isDeleting ? "Deleting..." : "Delete Land"}
          </button>
        </div>
      </dialog>
      <dialog ref={addLandDialog} aria-labelledby="add-land-title"
        onCancel={(event) => { if (isSubmitting) event.preventDefault(); }}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/45">
        <h2 id="add-land-title" className="text-xl font-bold">Add New Land</h2>
        <p className="mt-1 text-sm text-slate-500">Enter your land details and upload a supporting document.</p>
        <form onSubmit={handleAddLand} className="mt-5" aria-busy={isSubmitting}>
          <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-60">
            <div>
              <label htmlFor="land-area" className="block text-sm font-semibold">Land area (acres)</label>
              <input id="land-area" name="landArea" type="number" min="0" step="any" required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="land-city" className="block text-sm font-semibold">City</label>
              <input id="land-city" name="landCity" type="text" required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="land-location" className="block text-sm font-semibold">Location / address</label>
              <textarea id="land-location" name="landLocation" rows={3} required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="land-document" className="block text-sm font-semibold">Land document</label>
              <input id="land-document" name="landDocuments" type="file" accept=".pdf,.jpg,.jpeg,.png" required aria-describedby="land-document-help"
                className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:font-semibold file:text-green-800" />
              <p id="land-document-help" className="mt-1 text-xs text-slate-500">PDF, JPG, or PNG up to 10 MB.</p>
            </div>
          </fieldset>
          {submitError && <p role="alert" className="mt-4 text-sm text-red-600">{submitError}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" disabled={isSubmitting} onClick={() => addLandDialog.current?.close()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-lg bg-[#17652f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104d23] disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? "Adding land..." : "Add Land"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
