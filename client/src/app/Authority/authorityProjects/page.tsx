"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {LuArrowDown,LuArrowUp,LuBriefcaseBusiness,LuCalendarDays,LuChevronDown,LuChevronLeft,LuChevronRight,
   LuCircleCheck, LuClock3, LuDownload,LuEllipsisVertical,LuFileText, LuFilter, LuHourglass, LuPlus, LuSearch, 
   LuTriangleAlert, LuUserRound, LuX,
} from "@/components/ui/icons";

type ProjectTab = "Current Projects" | "Completed Projects" | "Upcoming Assignments" | "Pending Projects";
type ProjectStatus = "On Track" | "Delayed" | "Review" | "Pending" | "Completed" | "Upcoming";
type ProjectPriority = "High" | "Medium" | "Low";

type Project = {
  id: number;
  name: string;
  type: string;
  district: string;
  startDate: string;
  deadline: string;
  progress: number;
  priority: ProjectPriority;
  status: ProjectStatus;
  tab: ProjectTab;
};

const initialProjects: Project[] = [
  { id: 1, name: "Land Survey & Mapping", type: "Survey", district: "Gwalior", startDate: "12 Jun 2026", deadline: "30 Sep 2026", progress: 72, priority: "High", status: "On Track", tab: "Current Projects" },
  { id: 2, name: "Irrigation Canal Expansion", type: "Irrigation", district: "Bhind", startDate: "05 May 2026", deadline: "15 Oct 2026", progress: 58, priority: "High", status: "On Track", tab: "Current Projects" },
  { id: 3, name: "Rural Road Access Project", type: "Infrastructure", district: "Morena", startDate: "18 Apr 2026", deadline: "10 Aug 2026", progress: 41, priority: "Medium", status: "Delayed", tab: "Current Projects" },
  { id: 4, name: "Land Record Digitization", type: "Digitization", district: "Datia", startDate: "01 Apr 2026", deadline: "31 Aug 2026", progress: 83, priority: "High", status: "On Track", tab: "Current Projects" },
  { id: 5, name: "Farmer Support Center Setup", type: "Community", district: "Shivpuri", startDate: "20 Jun 2026", deadline: "20 Sep 2026", progress: 26, priority: "Medium", status: "Delayed", tab: "Current Projects" },
  { id: 6, name: "Boundary Verification Drive", type: "Verification", district: "Gwalior", startDate: "10 Jul 2026", deadline: "25 Oct 2026", progress: 64, priority: "Medium", status: "Review", tab: "Current Projects" },
  { id: 7, name: "Soil Health Assessment", type: "Assessment", district: "Bhind", startDate: "15 Jun 2026", deadline: "15 Sep 2026", progress: 78, priority: "Low", status: "On Track", tab: "Current Projects" },
  { id: 8, name: "Watershed Development", type: "Environmental", district: "Morena", startDate: "22 May 2026", deadline: "30 Nov 2026", progress: 19, priority: "High", status: "Pending", tab: "Current Projects" },
  { id: 9, name: "Village Parcel Survey", type: "Survey", district: "Datia", startDate: "05 Jan 2026", deadline: "18 Jul 2026", progress: 100, priority: "Medium", status: "Completed", tab: "Completed Projects" },
  { id: 10, name: "Digital Registry Migration", type: "Digitization", district: "Gwalior", startDate: "12 Feb 2026", deadline: "01 Aug 2026", progress: 100, priority: "High", status: "Completed", tab: "Completed Projects" },
  { id: 11, name: "Crop Mapping Assignment", type: "Survey", district: "Shivpuri", startDate: "12 Sep 2026", deadline: "10 Dec 2026", progress: 0, priority: "Medium", status: "Upcoming", tab: "Upcoming Assignments" },
  { id: 12, name: "Pending Irrigation Audit", type: "Assessment", district: "Bhind", startDate: "20 Sep 2026", deadline: "15 Nov 2026", progress: 0, priority: "High", status: "Pending", tab: "Pending Projects" },
];

const tabs: Array<{ label: ProjectTab; icon: ReactNode }> = [
  { label: "Current Projects", icon: <LuCalendarDays aria-hidden="true" /> },
  { label: "Completed Projects", icon: <LuCircleCheck aria-hidden="true" /> },
  { label: "Upcoming Assignments", icon: <LuCalendarDays aria-hidden="true" /> },
  { label: "Pending Projects", icon: <LuCalendarDays aria-hidden="true" /> },
];

const chartData = [
  { month: "Mar 2026", started: 18, completed: 10 },
  { month: "Apr 2026", started: 22, completed: 12 },
  { month: "May 2026", started: 26, completed: 16 },
  { month: "Jun 2026", started: 30, completed: 20 },
  { month: "Jul 2026", started: 28, completed: 21 },
  { month: "Aug 2026", started: 35, completed: 27 },
];

const priorityStyles: Record<ProjectPriority, string> = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<ProjectStatus, string> = {
  "On Track": "bg-emerald-100 text-emerald-700",
  Delayed: "bg-red-100 text-red-500",
  Review: "bg-blue-100 text-blue-600",
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Upcoming: "bg-violet-100 text-violet-600",
};

function MetricCard({
  value,
  label,
  trend,
  direction,
  positive,
  icon,
  cardClass,
  iconClass,
}: {
  value: string;
  label: string;
  trend: string;
  direction: "up" | "down";
  positive: boolean;
  icon: ReactNode;
  cardClass: string;
  iconClass: string;
}) {
  return (
    <article className={`flex min-h-[140px] items-center gap-4 rounded-xl border border-white/70 px-4 shadow-[0_5px_18px_rgba(15,46,34,0.03)] ${cardClass}`}>
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[29px] ${iconClass}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[29px] font-extrabold leading-none tracking-[-0.04em] text-slate-950">{value}</p>
        <p className="mt-2 text-[12px] font-semibold text-slate-700">{label}</p>
        <p className={`mt-2 flex items-center gap-1 text-[10px] ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {direction === "up" ? <LuArrowUp aria-hidden="true" /> : <LuArrowDown aria-hidden="true" />}
          <span className="font-bold">{trend}</span>
          <span className="text-slate-500">from last month</span>
        </p>
      </div>
    </article>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)] ${className}`}>{children}</section>;
}

function PanelTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
      <h2 className="text-[15px] font-bold text-slate-900">{children}</h2>
      {action}
    </div>
  );
}

export default function AuthorityProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<ProjectTab>("Current Projects");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesTab = project.tab === activeTab;
    const matchesSearch = `${project.name} ${project.type} ${project.district}`.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All Types" || project.type === typeFilter;
    const matchesDistrict = districtFilter === "All Districts" || project.district === districtFilter;
    const matchesPriority = priorityFilter === "All Priorities" || project.priority === priorityFilter;
    const matchesStatus = statusFilter === "All Statuses" || project.status === statusFilter;
    return matchesTab && matchesSearch && matchesType && matchesDistrict && matchesPriority && matchesStatus;
  }), [activeTab, districtFilter, priorityFilter, projects, search, statusFilter, typeFilter]);

  const totalForDisplay = activeTab === "Current Projects" && !search && typeFilter === "All Types" && districtFilter === "All Districts" && priorityFilter === "All Priorities" && statusFilter === "All Statuses" ? 42 : filteredProjects.length;
  const firstVisible = filteredProjects.length ? (page - 1) * rowsPerPage + 1 : 0;
  const lastVisible = Math.min(page * rowsPerPage, filteredProjects.length);

  function resetFilters() {
    setSearch("");
    setTypeFilter("All Types");
    setDistrictFilter("All Districts");
    setPriorityFilter("All Priorities");
    setStatusFilter("All Statuses");
    setPage(1);
  }

  function exportProjects() {
    const header = "Project Name,Type,District,Start Date,Deadline,Progress,Priority,Status";
    const rows = filteredProjects.map((project) => [project.name, project.type, project.district, project.startDate, project.deadline, `${project.progress}%`, project.priority, project.status].join(","));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "authority-projects.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Project list exported successfully.");
  }

  function createAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const projectName = String(form.get("projectName") || "New Assignment");
    const newProject: Project = {
      id: Math.max(...projects.map((project) => project.id)) + 1,
      name: projectName,
      type: String(form.get("type") || "Survey"),
      district: String(form.get("district") || "Gwalior"),
      startDate: "04 Sep 2026",
      deadline: String(form.get("deadline") || "30 Sep 2026"),
      progress: 0,
      priority: String(form.get("priority") || "Medium") as ProjectPriority,
      status: "On Track",
      tab: "Current Projects",
    };
    setProjects((current) => [newProject, ...current]);
    setActiveTab("Current Projects");
    setCreateOpen(false);
    setNotice(`${projectName} was created successfully.`);
  }

  function markComplete(projectId: number) {
    setProjects((current) => current.map((project) => project.id === projectId ? { ...project, progress: 100, status: "Completed", tab: "Completed Projects" } : project));
    setMenuId(null);
    setNotice("Project marked as completed.");
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto min-w-[1180px] max-w-[1540px] px-5 py-5">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[31px] font-extrabold tracking-[-0.04em] text-slate-950">Projects &amp; Assignments</h1>
            <p className="mt-1 text-[13px] text-slate-500">Manage ongoing and upcoming land-development and survey projects efficiently.</p>
          </div>
          <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex h-12 items-center gap-3 rounded-lg bg-emerald-700 px-6 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800">
            <LuPlus className="text-xl" aria-hidden="true" />
            Create Assignment
          </button>
        </header>

        <nav className="mt-6 grid max-w-[1090px] grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Project sections">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => { setActiveTab(tab.label); setPage(1); resetFilters(); }}
              className={`flex h-14 items-center justify-center gap-3 border-b-[4px] text-[12px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-emerald-50/40 text-emerald-800" : "border-transparent text-slate-600 hover:bg-slate-50"}`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="mt-6 grid grid-cols-5 gap-4" aria-label="Project summary">
          <MetricCard value="42" label="Current Projects" trend="18%" direction="up" positive icon={<LuBriefcaseBusiness aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-[#f0f9f4]" iconClass="bg-emerald-100 text-emerald-700" />
          <MetricCard value="12" label="Completed This Month" trend="9%" direction="up" positive icon={<LuCircleCheck aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-[#eff8ff]" iconClass="bg-blue-100 text-blue-700" />
          <MetricCard value="18" label="Upcoming Assignments" trend="15%" direction="up" positive icon={<LuCalendarDays aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-[#fff8e9]" iconClass="bg-amber-100 text-amber-700" />
          <MetricCard value="8" label="Pending Projects" trend="11%" direction="down" positive={false} icon={<LuClock3 aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-[#fff2f3]" iconClass="bg-red-100 text-red-600" />
          <MetricCard value="46" label="Avg Completion Time" trend="6 days" direction="down" positive icon={<LuHourglass aria-hidden="true" />} cardClass="bg-gradient-to-br from-violet-50 to-[#f7f2ff]" iconClass="bg-violet-100 text-violet-600" />
        </section>

        {notice && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-medium text-emerald-800">
            {notice}
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message" className="rounded p-1 hover:bg-emerald-100"><LuX aria-hidden="true" /></button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_335px] items-start gap-3">
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[minmax(0,2fr)_300px] gap-3">
              <Panel className="min-h-[292px] overflow-hidden">
                <PanelTitle
                  action={
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 text-[10px] text-slate-600">
                        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />Started</span>
                        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />Completed</span>
                      </div>
                      <label className="relative">
                        <select className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-semibold text-slate-600 outline-none"><option>Last 6 Months</option><option>Last 12 Months</option></select>
                        <LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                      </label>
                    </div>
                  }
                >
                  Monthly Project Activity
                </PanelTitle>
                <div className="grid grid-cols-[28px_1fr] gap-2 px-4 pb-4 pt-3">
                  <div className="flex h-[190px] flex-col justify-between text-right text-[9px] text-slate-500"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
                  <div>
                    <div
                      className="flex h-[190px] items-end border-b border-slate-200 px-3"
                      style={{ backgroundImage: "linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)", backgroundSize: "100% 25%" }}
                      role="img"
                      aria-label="Monthly project activity from March through August 2026"
                    >
                      {chartData.map((item) => (
                        <div key={item.month} className="flex h-full flex-1 items-end justify-center gap-1.5">
                          <div className="w-6 rounded-t-sm bg-emerald-700" style={{ height: `${item.started * 2.5}%` }} title={`${item.started} started`} />
                          <div className="w-6 rounded-t-sm bg-emerald-300" style={{ height: `${item.completed * 2.5}%` }} title={`${item.completed} completed`} />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-6 pt-2 text-center text-[9px] text-slate-500">{chartData.map((item) => <span key={item.month}>{item.month}</span>)}</div>
                  </div>
                </div>
              </Panel>

              <Panel className="min-h-[292px] overflow-hidden">
                <PanelTitle>Project Status Overview</PanelTitle>
                <div className="grid grid-cols-[150px_1fr] items-center gap-4 px-4 pb-5 pt-3">
                  <div className="relative mx-auto h-[145px] w-[145px]">
                    <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#08754f 0 52%, #f9b83e 52% 69%, #5597ef 69% 93%, #8a4de8 93% 100%)" }} />
                    <div className="absolute inset-[32px] flex flex-col items-center justify-center rounded-full bg-white"><span className="text-[26px] font-extrabold text-slate-950">42</span><span className="text-[9px] text-slate-500">Total Projects</span></div>
                  </div>
                  <dl className="space-y-3 text-[9px]">
                    {[
                      ["On Track", "22 (52%)", "bg-emerald-700"],
                      ["Delayed", "7 (17%)", "bg-amber-400"],
                      ["Completed", "10 (24%)", "bg-blue-500"],
                      ["Pending Approval", "3 (7%)", "bg-violet-500"],
                    ].map(([label, value, color]) => (
                      <div key={label} className="grid grid-cols-[10px_1fr] gap-2"><span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${color}`} /><div><dt className="font-semibold text-slate-700">{label}</dt><dd className="mt-0.5 text-slate-500">{value}</dd></div></div>
                    ))}
                  </dl>
                </div>
              </Panel>
            </div>

            <Panel className="overflow-visible">
              <div className="flex items-center gap-3 px-4 py-4">
                <label className="relative block min-w-[240px] flex-1">
                  <span className="sr-only">Search projects</span>
                  <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
                  <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search projects..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[10px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                </label>
                <FilterSelect value={typeFilter} onChange={setTypeFilter} options={["All Types", "Survey", "Irrigation", "Infrastructure", "Digitization", "Community", "Verification", "Assessment", "Environmental"]} />
                <FilterSelect value={districtFilter} onChange={setDistrictFilter} options={["All Districts", "Gwalior", "Bhind", "Morena", "Datia", "Shivpuri"]} />
                <FilterSelect value={priorityFilter} onChange={setPriorityFilter} options={["All Priorities", "High", "Medium", "Low"]} />
                <FilterSelect value={statusFilter} onChange={setStatusFilter} options={["All Statuses", "On Track", "Delayed", "Review", "Pending", "Completed", "Upcoming"]} />
                <button type="button" onClick={resetFilters} className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"><LuFilter aria-hidden="true" /> Filters</button>
                <button type="button" onClick={exportProjects} aria-label="Export projects" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><LuDownload aria-hidden="true" /></button>
              </div>

              <div className="overflow-x-auto px-3">
                <table className="w-full min-w-[870px] text-left text-[9px]">
                  <thead><tr className="bg-slate-50 text-slate-600"><th className="rounded-l-lg px-3 py-3 font-semibold">Project Name</th><th className="px-3 py-3 font-semibold">Type</th><th className="px-3 py-3 font-semibold">Area / District</th><th className="px-3 py-3 font-semibold">Start Date</th><th className="px-3 py-3 font-semibold">Deadline</th><th className="px-3 py-3 font-semibold">Progress</th><th className="px-3 py-3 font-semibold">Priority</th><th className="px-3 py-3 font-semibold">Status</th><th className="rounded-r-lg px-3 py-3 text-center font-semibold">Action</th></tr></thead>
                  <tbody>
                    {filteredProjects.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((project) => (
                      <tr key={project.id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50">
                        <td className="px-3 py-2.5"><span className="flex min-w-[145px] items-center gap-2 font-semibold text-slate-700"><LuFileText className="text-base text-emerald-600" aria-hidden="true" />{project.name}</span></td>
                        <td className="px-3 py-2.5">{project.type}</td><td className="px-3 py-2.5">{project.district}</td><td className="px-3 py-2.5">{project.startDate}</td><td className="px-3 py-2.5">{project.deadline}</td>
                        <td className="px-3 py-2.5"><div className="flex min-w-[125px] items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-700" style={{ width: `${project.progress}%` }} /></div><span className="font-semibold text-slate-600">{project.progress}%</span></div></td>
                        <td className="px-3 py-2.5"><span className={`inline-flex min-w-[52px] justify-center rounded-md px-2 py-1.5 font-semibold ${priorityStyles[project.priority]}`}>{project.priority}</span></td>
                        <td className="px-3 py-2.5"><span className={`inline-flex min-w-[68px] justify-center rounded-md px-2 py-1.5 font-semibold ${statusStyles[project.status]}`}>{project.status}</span></td>
                        <td className="relative px-3 py-2.5 text-center">
                          <button type="button" onClick={() => setMenuId((current) => current === project.id ? null : project.id)} aria-label={`Actions for ${project.name}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-sm hover:bg-white"><LuEllipsisVertical aria-hidden="true" /></button>
                          {menuId === project.id && <div className="absolute right-10 top-8 z-20 w-32 rounded-lg border border-slate-200 bg-white p-1.5 text-left shadow-xl"><button type="button" onClick={() => { setMenuId(null); setNotice(`${project.name} selected.`); }} className="w-full rounded-md px-2 py-2 hover:bg-slate-50">View Details</button>{project.status !== "Completed" && <button type="button" onClick={() => markComplete(project.id)} className="w-full rounded-md px-2 py-2 text-emerald-700 hover:bg-emerald-50">Mark Complete</button>}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProjects.length === 0 && <div className="py-14 text-center text-[11px] text-slate-500">No projects match the selected filters.</div>}
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-5 text-[10px] text-slate-500">
                <span>Showing {firstVisible} to {lastVisible} of {totalForDisplay} projects</span>
                <div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3, 4, 5].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md border font-semibold ${page === pageNumber ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-200 bg-white text-slate-600"}`}>{pageNumber}</button>)}<span>•••</span><button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200"><LuChevronRight aria-hidden="true" /></button></div>
                <label className="relative"><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[10px] font-semibold outline-none"><option value={10}>10 / page</option><option value={20}>20 / page</option></select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" /></label>
              </div>
            </Panel>
          </div>

          <aside className="space-y-3" aria-label="Project summaries">
            <Panel className="overflow-hidden pb-2">
              <PanelTitle action={<button type="button" onClick={() => setActiveTab("Upcoming Assignments")} className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button>}>Upcoming Deadlines</PanelTitle>
              <div className="px-3">
                {[
                  ["30", "SEP", "Land Survey & Mapping", "Gwalior", "15 days left"],
                  ["15", "OCT", "Irrigation Canal Expansion", "Bhind", "30 days left"],
                  ["25", "OCT", "Boundary Verification Drive", "Gwalior", "40 days left"],
                ].map(([day, month, title, district, left]) => (
                  <div key={title} className="grid grid-cols-[44px_minmax(0,1fr)_62px] items-center gap-3 border-b border-slate-100 py-3 last:border-b-0"><span className="flex h-11 flex-col items-center justify-center rounded-lg bg-red-50"><strong className="text-[15px] leading-none text-red-500">{day}</strong><span className="mt-1 text-[7px] font-bold text-slate-500">{month}</span></span><span className="min-w-0"><span className="block truncate text-[10px] font-bold text-slate-800">{title}</span><span className="mt-1 block text-[9px] text-slate-500">{district}</span></span><span className="text-right text-[9px] text-slate-600">{left}</span></div>
                ))}
              </div>
            </Panel>

            <Panel className="overflow-hidden pb-2">
              <PanelTitle action={<button type="button" onClick={() => setActiveTab("Pending Projects")} className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button>}>Pending Project Timelines</PanelTitle>
              <div className="px-3">
                {[
                  ["Rural Road Access Project", "Deadline passed by 5 days"],
                  ["Farmer Support Center Setup", "Deadline passed by 3 days"],
                  ["Watershed Development", "Behind schedule by 12 days"],
                ].map(([title, delay]) => (
                  <div key={title} className="grid grid-cols-[28px_minmax(0,1fr)_72px] items-center gap-2 border-b border-slate-100 py-3 last:border-b-0"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-500"><LuTriangleAlert aria-hidden="true" /></span><span className="min-w-0"><span className="block truncate text-[9px] font-semibold text-slate-700">{title}</span><span className="mt-1 block truncate text-[8px] font-medium text-red-500">{delay}</span></span><button type="button" onClick={() => setNotice(`Follow-up created for ${title}.`)} className="h-8 rounded-md border border-slate-200 text-[8px] font-semibold text-slate-600 hover:bg-slate-50">Follow Up</button></div>
                ))}
              </div>
            </Panel>

            <Panel className="overflow-hidden pb-3">
              <PanelTitle action={<button type="button" onClick={() => setNotice("Showing all team assignments.")} className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button>}>Team Assignments</PanelTitle>
              <div className="px-3">
                {[
                  ["RK", "Ravi Kumar", "Field Officer", "6 Projects", "bg-slate-600"],
                  ["MP", "Meena Patel", "Survey Officer", "5 Projects", "bg-emerald-800"],
                  ["AS", "Arjun Singh", "Project Coordinator", "4 Projects", "bg-emerald-700"],
                  ["SY", "Sita Yadav", "Verification Officer", "3 Projects", "bg-teal-600"],
                ].map(([initials, name, role, count, color]) => (
                  <div key={name} className="grid grid-cols-[36px_minmax(0,1fr)_72px] items-center gap-2 border-b border-slate-100 py-2.5 last:border-b-0"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold text-white ${color}`}>{initials}</span><span className="min-w-0"><span className="block truncate text-[9px] font-bold text-slate-800">{name}</span><span className="mt-0.5 block truncate text-[8px] text-slate-500">{role}</span></span><span className="inline-flex items-center justify-end gap-1 text-[8px] text-slate-600"><LuUserRound aria-hidden="true" />{count}</span></div>
                ))}
              </div>
              <button type="button" onClick={() => setNotice("Team management panel opened.")} className="mx-3 mt-3 h-9 w-[calc(100%-1.5rem)] rounded-md border border-emerald-600 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50">Manage Team</button>
            </Panel>
          </aside>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" role="dialog" aria-modal="true" aria-labelledby="create-assignment-title">
          <form onSubmit={createAssignment} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between"><div><h2 id="create-assignment-title" className="text-xl font-bold text-slate-900">Create Assignment</h2><p className="mt-1 text-[11px] text-slate-500">Add a new authority project or field assignment.</p></div><button type="button" onClick={() => setCreateOpen(false)} aria-label="Close create assignment" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><LuX aria-hidden="true" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Project name</span><input name="projectName" required placeholder="Enter project name" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-[12px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
              <ModalSelect label="Type" name="type" options={["Survey", "Irrigation", "Infrastructure", "Digitization", "Community", "Verification", "Assessment"]} />
              <ModalSelect label="District" name="district" options={["Gwalior", "Bhind", "Morena", "Datia", "Shivpuri"]} />
              <ModalSelect label="Priority" name="priority" options={["High", "Medium", "Low"]} />
              <label><span className="mb-1.5 block text-[11px] font-semibold text-slate-600">Deadline</span><input name="deadline" required placeholder="30 Sep 2026" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-[12px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setCreateOpen(false)} className="h-10 rounded-lg border border-slate-200 px-5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[11px] font-semibold text-white hover:bg-emerald-800"><LuPlus aria-hidden="true" /> Create Assignment</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative block w-[128px]"><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[9px] font-semibold text-slate-600 outline-none focus:border-emerald-600">{options.map((option) => <option key={option}>{option}</option>)}</select><LuChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs" aria-hidden="true" /></label>
  );
}

function ModalSelect({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label><span className="mb-1.5 block text-[11px] font-semibold text-slate-600">{label}</span><select name={name} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
