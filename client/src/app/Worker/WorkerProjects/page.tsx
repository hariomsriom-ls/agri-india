"use client";

import { useState, type ReactNode } from "react";
import { LuBriefcaseBusiness, LuCalendarDays, LuChevronLeft, LuChevronRight, LuCircleCheck, LuClock3, LuDownload, LuFileText, LuSearch } from "@/components/ui/icons";
import type { UserProject } from "@/features/landowner-Worker/projectsdata";
import { useFetchProjects } from "@/services/fetchProjects";

const tabs = ["All Projects", "Current Projects", "Completed Projects", "Upcoming Assignments", "Pending Projects"] as const;
type ProjectTab = typeof tabs[number];

function projectSection(project: UserProject): ProjectTab {
  const status = project.projectStatus.trim().toLowerCase().replace(/[_-]/g, " ");
  if (["completed", "complete", "finished"].includes(status)) return "Completed Projects";
  if (["upcoming", "scheduled", "not started"].includes(status)) return "Upcoming Assignments";
  if (status.startsWith("pending") || ["on hold", "paused"].includes(status)) return "Pending Projects";
  return "Current Projects";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

export default function WorkerProjects() {
  const { role, projects, status, error, retry } = useFetchProjects("worker");
  const [activeTab, setActiveTab] = useState<ProjectTab>("All Projects");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) =>
    (activeTab === "All Projects" || projectSection(project) === activeTab)
    && `${project._id} ${project.projectLocation} ${project.projectOutput} ${project.projectStatus}`.toLowerCase().includes(search.trim().toLowerCase())
    && (!locationFilter || project.projectLocation === locationFilter)
    && (!statusFilter || project.projectStatus === statusFilter),
  );
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * rowsPerPage;
  const visibleProjects = filteredProjects.slice(firstIndex, firstIndex + rowsPerPage);
  const locations = [...new Set(projects.map((project) => project.projectLocation))].sort();
  const statuses = [...new Set(projects.map((project) => project.projectStatus))].sort();
  const selectedProject = projects.find((project) => project._id === selectedId);
  const upcomingProjects = projects.filter((project) => projectSection(project) === "Upcoming Assignments")
    .sort((left, right) => new Date(left.projectStartDate).getTime() - new Date(right.projectStartDate).getTime());
  const summary = [
    { label: "All Projects", count: projects.length, icon: LuBriefcaseBusiness, color: "bg-emerald-50 text-emerald-700" },
    { label: "Current Projects", count: projects.filter((project) => projectSection(project) === "Current Projects").length, icon: LuCalendarDays, color: "bg-blue-50 text-blue-700" },
    { label: "Completed Projects", count: projects.filter((project) => projectSection(project) === "Completed Projects").length, icon: LuCircleCheck, color: "bg-emerald-50 text-emerald-700" },
    { label: "Upcoming Assignments", count: upcomingProjects.length, icon: LuCalendarDays, color: "bg-amber-50 text-amber-700" },
    { label: "Pending Projects", count: projects.filter((project) => projectSection(project) === "Pending Projects").length, icon: LuClock3, color: "bg-violet-50 text-violet-700" },
  ];

  function resetFilters() {
    setSearch("");
    setLocationFilter("");
    setStatusFilter("");
    setPage(1);
  }

  function exportProjects() {
    // Quote embedded commas/newlines and keep spreadsheet formulas as plain text.
    const csvCell = (value: string | number) => {
      const text = String(value);
      const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = [
      ["Project ID", "Location", "Start Date", "Duration (days)", "Workers", "Land Records", "Status", "Output"],
      ...filteredProjects.map((project) => [project._id, project.projectLocation, formatDate(project.projectStartDate),
        project.projectDays, project.projectWorkers.length, project.projectLand.length, project.projectStatus, project.projectOutput]),
    ];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "worker-projects.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-full bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto max-w-[1540px] space-y-6 px-5 py-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Projects &amp; Assignments</h1>
            <p className="mt-1 text-sm text-slate-500">View your assigned projects, schedules, and project status.</p>
          </div>
          <button type="button" onClick={retry} disabled={role !== "worker" || status === "loading" || status === "idle"}
            className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
            {status === "loading" ? "Refreshing..." : "Refresh Projects"}
          </button>
        </header>

        {role !== "worker" ? (
          <Panel className="p-8 text-center text-sm text-slate-500">Sign in as a worker to view your assigned projects.</Panel>
        ) : status === "idle" || status === "loading" ? (
          <Panel className="p-8 text-center text-sm text-slate-500"><p role="status">Loading your projects...</p></Panel>
        ) : status === "failed" ? (
          <Panel className="p-8 text-center">
            <p role="alert" className="text-sm text-red-600">{error || "Unable to load projects."}</p>
            <button type="button" onClick={retry} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Try again</button>
          </Panel>
        ) : (
          <>
            <nav className="flex flex-wrap overflow-hidden rounded-xl border border-slate-200 bg-white" aria-label="Project sections">
              {tabs.map((tab) => (
                <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => { setActiveTab(tab); resetFilters(); }}
                  className={`min-h-14 flex-1 whitespace-nowrap border-b-4 px-4 text-xs font-semibold ${activeTab === tab ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50"}`}>
                  {tab}
                </button>
              ))}
            </nav>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Project summary">
              {summary.map(({ label, count, icon: Icon, color }) => (
                <article key={label} className={`flex min-h-28 items-center gap-4 rounded-xl border border-white p-4 ${color}`}>
                  <Icon className="text-3xl" aria-hidden="true" />
                  <div><p className="text-3xl font-extrabold text-slate-950">{count}</p><p className="mt-2 text-xs font-semibold">{label}</p></div>
                </article>
              ))}
            </section>
            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <Panel className="min-w-0 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <h2 className="font-bold text-slate-900">{activeTab}</h2>
                  <button type="button" onClick={exportProjects} disabled={!filteredProjects.length} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"><LuDownload aria-hidden="true" /> Export</button>
                </div>
                <div className="flex flex-wrap gap-3 border-y border-slate-100 p-4">
                  <label className="relative min-w-48 flex-1">
                    <LuSearch aria-hidden="true" className="absolute left-3 top-3 text-slate-400" />
                    <input aria-label="Search projects" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search projects..." className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs" />
                  </label>
                  <select aria-label="Filter by location" value={locationFilter} onChange={(event) => { setLocationFilter(event.target.value); setPage(1); }} className="h-10 max-w-full rounded-lg border border-slate-200 px-3 text-xs">
                    <option value="">All Locations</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}
                  </select>
                  <select aria-label="Filter by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="h-10 max-w-full rounded-lg border border-slate-200 px-3 text-xs">
                    <option value="">All Statuses</option>{statuses.map((projectStatus) => <option key={projectStatus} value={projectStatus}>{projectStatus}</option>)}
                  </select>
                  <button type="button" onClick={resetFilters} className="text-xs font-semibold text-emerald-700">Reset</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600"><tr>{["Project ID", "Location", "Start Date", "Duration", "Workers", "Status", "Details"].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
                    <tbody>
                      {visibleProjects.map((project) => (
                        <tr key={project._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-4 font-semibold text-slate-800">{project._id}</td><td className="px-4 py-4">{project.projectLocation}</td>
                          <td className="whitespace-nowrap px-4 py-4">{formatDate(project.projectStartDate)}</td><td className="whitespace-nowrap px-4 py-4">{project.projectDays} days</td>
                          <td className="px-4 py-4">{project.projectWorkers.length}</td>
                          <td className="px-4 py-4"><span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{project.projectStatus}</span></td>
                          <td className="px-4 py-4"><button type="button" onClick={() => setSelectedId(project._id)} aria-label={`View project ${project._id}`} className="rounded border border-slate-200 p-2 text-emerald-700"><LuFileText aria-hidden="true" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filteredProjects.length && <p className="px-4 py-14 text-center text-sm text-slate-500">{projects.length ? "No projects match the selected filters." : "No projects have been assigned to you yet."}</p>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 text-xs text-slate-500">
                  <span>Showing {filteredProjects.length ? firstIndex + 1 : 0} to {Math.min(firstIndex + rowsPerPage, filteredProjects.length)} of {filteredProjects.length} projects</span>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Previous page" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded border border-slate-200 p-2 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>
                    <span>Page {currentPage} of {pageCount}</span>
                    <button type="button" aria-label="Next page" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} className="rounded border border-slate-200 p-2 disabled:opacity-40"><LuChevronRight aria-hidden="true" /></button>
                  </div>
                  <select aria-label="Projects per page" value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-slate-200 p-2"><option value={10}>10 / page</option><option value={20}>20 / page</option></select>
                </div>
              </Panel>
              <aside className="space-y-4" aria-label="Project summaries">
                <Panel className="p-4">
                  <h2 className="font-bold text-slate-900">Project Status Overview</h2>
                  <dl className="mt-4 space-y-3 text-xs">{statuses.map((projectStatus) => <div key={projectStatus} className="flex justify-between gap-3"><dt>{projectStatus}</dt><dd className="font-bold text-emerald-700">{projects.filter((project) => project.projectStatus === projectStatus).length}</dd></div>)}</dl>
                  {!projects.length && <p className="mt-3 text-xs text-slate-500">No project statuses to display.</p>}
                </Panel>
                <Panel className="p-4">
                  <h2 className="font-bold text-slate-900">Upcoming Assignments</h2>
                  {upcomingProjects.slice(0, 3).map((project) => <button key={project._id} type="button" onClick={() => setSelectedId(project._id)} className="mt-3 block w-full rounded-lg bg-slate-50 p-3 text-left text-xs hover:bg-emerald-50"><span className="block font-semibold">{project.projectLocation}</span><span className="mt-1 block text-slate-500">{project._id} / {formatDate(project.projectStartDate)}</span></button>)}
                  {!upcomingProjects.length && <p className="mt-3 text-xs text-slate-500">No upcoming assignments.</p>}
                </Panel>
                <Panel className="p-4">
                  <h2 className="font-bold text-slate-900">Project Details</h2>
                  {selectedProject ? <dl className="mt-4 space-y-3 break-words text-xs">
                    {[
                      ["Project ID", selectedProject._id], ["Location", selectedProject.projectLocation],
                      ["Start Date", formatDate(selectedProject.projectStartDate)], ["Duration", `${selectedProject.projectDays} days`],
                      ["Status", selectedProject.projectStatus], ["Output", selectedProject.projectOutput || "Not provided"],
                      ["Assigned Workers", selectedProject.projectWorkers.length], ["Land Records", selectedProject.projectLand.length],
                      ["Authority", selectedProject.projectAuthority || "Not assigned"],
                    ].map(([label, value]) => <div key={label}><dt className="font-semibold text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-slate-800">{value}</dd></div>)}
                  </dl> : <p className="mt-3 text-xs text-slate-500">Select a project to view its details.</p>}
                </Panel>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
