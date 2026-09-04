"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  LuArrowUp,
  LuBell,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuCheck,
  LuCheckCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuExternalLink,
  LuFileText,
  LuFilter,
  LuFlag,
  LuMail,
  LuMapPinned,
  LuSearch,
  LuSettings,
  LuTriangleAlert,
  LuUserRound,
  LuUserRoundPlus,
} from "react-icons/lu";

type NotificationCategory = "Verification" | "Complaints" | "Documents" | "System Alerts" | "Reports" | "Field Inspections";
type NotificationTab = "All Notifications" | "Unread" | "Verification" | "Complaints" | "Documents" | "System Alerts";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  detail?: string;
  category: NotificationCategory;
  time: string;
  date: string;
  read: boolean;
  highPriority: boolean;
  icon: ReactNode;
  iconClass: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New landowner verification request",
    description: "Ramesh Kumar from Bhainsa Village has submitted a new landowner verification request for 5.20 acres.",
    category: "Verification",
    time: "10:24 AM",
    date: "May 12, 2025",
    read: false,
    highPriority: false,
    icon: <LuUserRoundPlus aria-hidden="true" />,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    title: "Worker document uploaded",
    description: "Arjun Patel has uploaded a new identity document for review.",
    detail: "Document: Aadhaar Card",
    category: "Documents",
    time: "9:45 AM",
    date: "May 12, 2025",
    read: false,
    highPriority: false,
    icon: <LuFileText aria-hidden="true" />,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    title: "Complaint escalated",
    description: "Complaint #CMP-2025-078 has been escalated to you for priority review. Village: Mothi.",
    category: "Complaints",
    time: "8:30 AM",
    date: "May 12, 2025",
    read: false,
    highPriority: true,
    icon: <LuTriangleAlert aria-hidden="true" />,
    iconClass: "bg-red-100 text-red-500",
  },
  {
    id: 4,
    title: "Project deadline reminder",
    description: "The “Land Records Digitization – Phase 2” project deadline is in 5 days (May 17, 2025).",
    category: "System Alerts",
    time: "Yesterday",
    date: "May 11, 2025",
    read: false,
    highPriority: true,
    icon: <LuCalendarDays aria-hidden="true" />,
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    id: 5,
    title: "Land record approved",
    description: "You approved the land record for Gopal Naik (LN-2026-1008) from Banswada Village.",
    category: "Verification",
    time: "Yesterday",
    date: "May 11, 2025",
    read: true,
    highPriority: false,
    icon: <LuCircleCheck aria-hidden="true" />,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 6,
    title: "System maintenance scheduled",
    description: "Scheduled maintenance on May 15, 2025 from 11:00 PM to 1:00 AM. Some services may be temporarily unavailable.",
    category: "System Alerts",
    time: "May 10, 2025",
    date: "6:15 PM",
    read: true,
    highPriority: false,
    icon: <LuSettings aria-hidden="true" />,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    id: 7,
    title: "Report generated",
    description: "Monthly Land Verification Summary Report – April 2025 is ready.",
    detail: "View Report",
    category: "Reports",
    time: "May 10, 2025",
    date: "4:20 PM",
    read: true,
    highPriority: false,
    icon: <LuChartNoAxesColumnIncreasing aria-hidden="true" />,
    iconClass: "bg-teal-50 text-teal-700",
  },
  {
    id: 8,
    title: "Field inspection update",
    description: "Field inspection for Village Wazeed is completed by Ravi Kumar.",
    detail: "Status: Completed",
    category: "Field Inspections",
    time: "May 9, 2025",
    date: "2:05 PM",
    read: true,
    highPriority: false,
    icon: <LuMapPinned aria-hidden="true" />,
    iconClass: "bg-orange-50 text-orange-600",
  },
];

const tabs: Array<{ label: NotificationTab; count: number }> = [
  { label: "All Notifications", count: 152 },
  { label: "Unread", count: 8 },
  { label: "Verification", count: 39 },
  { label: "Complaints", count: 14 },
  { label: "Documents", count: 21 },
  { label: "System Alerts", count: 12 },
];

const categoryStyles: Record<NotificationCategory, string> = {
  Verification: "bg-emerald-100 text-emerald-700",
  Complaints: "bg-red-100 text-red-500",
  Documents: "bg-blue-100 text-blue-600",
  "System Alerts": "bg-violet-100 text-violet-600",
  Reports: "bg-teal-50 text-teal-700",
  "Field Inspections": "bg-orange-50 text-orange-600",
};

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)] ${className}`}>{children}</section>;
}

function SummaryCard({ value, label, trend, icon, cardClass, iconClass, trendClass = "text-emerald-600" }: { value: string; label: string; trend: string; icon: ReactNode; cardClass: string; iconClass: string; trendClass?: string }) {
  return (
    <article className={`flex min-h-[112px] items-center gap-3 rounded-xl border border-slate-100 px-3 shadow-[0_3px_12px_rgba(15,46,34,0.025)] ${cardClass}`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[24px] ${iconClass}`}>{icon}</span>
      <div className="min-w-0"><p className="text-[22px] font-extrabold leading-none text-slate-950">{value}</p><p className="mt-2 text-[9px] font-semibold text-slate-700">{label}</p><p className={`mt-3 flex items-center gap-1 text-[8px] ${trendClass}`}><LuArrowUp aria-hidden="true" /><strong>{trend}</strong><span className="text-slate-500">from last 7 days</span></p></div>
    </article>
  );
}

export default function AuthorityNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationTab>("All Notifications");
  const [search, setSearch] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notice, setNotice] = useState("");

  const filteredNotifications = useMemo(() => notifications.filter((notification) => {
    const matchesTab = activeTab === "All Notifications"
      || (activeTab === "Unread" && !notification.read)
      || notification.category === activeTab;
    const matchesSearch = `${notification.title} ${notification.description} ${notification.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = !priorityOnly || notification.highPriority;
    return matchesTab && matchesSearch && matchesPriority;
  }), [activeTab, notifications, priorityOnly, search]);

  const defaultView = activeTab === "All Notifications" && !search && !priorityOnly;
  const displayTotal = defaultView ? 152 : filteredNotifications.length;
  const firstVisible = filteredNotifications.length ? (page - 1) * rowsPerPage + 1 : 0;
  const lastVisible = Math.min(page * rowsPerPage, filteredNotifications.length);

  function toggleRead(notificationId: number) {
    setNotifications((current) => current.map((notification) => notification.id === notificationId ? { ...notification, read: !notification.read } : notification));
  }

  function markAllRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    setNotice("All notifications marked as read.");
  }

  return (
    <div className="min-h-full overflow-x-auto bg-[#f5f8f7] text-slate-800">
      <div className="mx-auto min-w-[1080px] max-w-[1460px] px-4 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_370px] gap-5">
          <main className="min-w-0">
            <header className="flex items-start justify-between gap-5">
              <div><h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-slate-950">Notifications</h1><p className="mt-1 text-[11px] text-slate-500">Track system alerts, verification updates, complaints, messages, and reminders.</p></div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={markAllRead} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><LuCheck aria-hidden="true" />Mark all as read</button>
                <div className="relative">
                  <button type="button" onClick={() => setFilterOpen((current) => !current)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><LuFilter aria-hidden="true" />Filters</button>
                  {filterOpen && <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-xl"><button type="button" onClick={() => { setPriorityOnly(false); setFilterOpen(false); setPage(1); }} className={`w-full rounded-md px-3 py-2 text-left text-[10px] font-medium ${!priorityOnly ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}>All priorities</button><button type="button" onClick={() => { setPriorityOnly(true); setFilterOpen(false); setPage(1); }} className={`w-full rounded-md px-3 py-2 text-left text-[10px] font-medium ${priorityOnly ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}>High priority only</button></div>}
                </div>
              </div>
            </header>

            <nav className="mt-6 grid grid-cols-6 gap-2" aria-label="Notification categories">
              {tabs.map((tab) => <button key={tab.label} type="button" onClick={() => { setActiveTab(tab.label); setPage(1); }} className={`flex h-12 items-center justify-center gap-2 rounded-lg border-b-[3px] px-2 text-[9px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-white text-emerald-800 shadow-sm" : "border-transparent bg-white/70 text-slate-600 hover:bg-white"}`}>{tab.label === "All Notifications" && <LuCheckCheck className="text-sm" aria-hidden="true" />}{tab.label}<span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[8px] ${activeTab === tab.label && tab.label === "All Notifications" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.count}</span></button>)}
            </nav>

            {notice && <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message">×</button></div>}

            <section className="mt-4 space-y-1.5" aria-label="Notification list">
              {filteredNotifications.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((notification) => (
                <article key={notification.id} className={`grid min-h-[103px] grid-cols-[12px_62px_minmax(0,1fr)_95px_24px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-[0_3px_13px_rgba(15,46,34,0.025)] transition-colors ${notification.read ? "opacity-90" : "hover:border-emerald-200"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${notification.read ? "bg-slate-300" : "bg-emerald-700"}`} />
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full text-[27px] ${notification.iconClass}`}>{notification.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3"><h2 className="truncate text-[12px] font-bold text-slate-900">{notification.title}</h2><span className={`shrink-0 rounded-md px-2.5 py-1 text-[8px] font-semibold ${categoryStyles[notification.category]}`}>{notification.category}</span></div>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-600">{notification.description}</p>
                    {notification.detail && <button type="button" onClick={() => setNotice(`${notification.detail} opened.`)} className={`mt-1 inline-flex items-center gap-1 text-[9px] font-semibold ${notification.category === "Reports" ? "text-emerald-700" : notification.category === "Field Inspections" ? "text-slate-600" : "text-slate-700"}`}>{notification.detail}{notification.category === "Reports" && <LuExternalLink aria-hidden="true" />}</button>}
                  </div>
                  <div className="text-right text-[9px] leading-5 text-slate-500"><p>{notification.time}</p><p>{notification.date}</p></div>
                  <button type="button" onClick={() => toggleRead(notification.id)} aria-label={notification.read ? `Mark ${notification.title} unread` : `Mark ${notification.title} read`} className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] ${notification.read ? "border-slate-400 text-slate-400" : "border-emerald-700 text-emerald-700"}`}>{notification.read && <LuCheck aria-hidden="true" />}</button>
                </article>
              ))}
              {filteredNotifications.length === 0 && <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-[11px] text-slate-500">No notifications match the selected filters.</div>}
            </section>

            <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-[9px] text-slate-500"><span>Showing {firstVisible} to {lastVisible} of {displayTotal} notifications</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>{[1, 2, 3, 4, 5].map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-md font-semibold ${page === pageNumber ? "bg-emerald-800 text-white" : "bg-slate-50 text-slate-600"}`}>{pageNumber}</button>)}<span>•••</span><button type="button" onClick={() => setPage(19)} className="h-8 w-8 rounded-md bg-slate-50 font-semibold">19</button><button type="button" onClick={() => setPage((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50"><LuChevronRight aria-hidden="true" /></button></div><label className="relative"><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold outline-none"><option value={10}>10 / page</option><option value={20}>20 / page</option><option value={50}>50 / page</option></select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" /></label></div>
          </main>

          <aside className="border-l border-slate-200 pl-5" aria-label="Notification summary">
            <label className="relative block"><span className="sr-only">Search notifications</span><LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search notifications..." className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-[11px] outline-none shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><LuSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" aria-hidden="true" /></label>

            <Panel className="mt-5 p-4"><h2 className="text-[14px] font-bold text-slate-900">Notification Summary</h2><div className="mt-4 grid grid-cols-2 gap-3"><SummaryCard value="152" label="Total Notifications" trend="18%" icon={<LuBell aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-white" iconClass="bg-emerald-100 text-emerald-700" /><SummaryCard value="8" label="Unread" trend="33%" icon={<LuMail aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-white" iconClass="bg-blue-100 text-blue-600" /><SummaryCard value="5" label="High Priority" trend="25%" icon={<LuFlag aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-white" iconClass="bg-red-100 text-red-500" trendClass="text-red-500" /><SummaryCard value="24" label="Today" trend="9%" icon={<LuCalendarDays aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-white" iconClass="bg-amber-100 text-amber-600" /></div></Panel>

            <Panel className="mt-4 p-4"><h2 className="text-[14px] font-bold text-slate-900">Notification Breakdown</h2><div className="mt-4 grid grid-cols-[160px_1fr] items-center gap-3"><div className="relative mx-auto h-[145px] w-[145px]"><div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#35a949 0 26%, #ff5d4d 26% 35%, #577ad7 35% 49%, #ff8065 49% 57%, #ffb10e 57% 69%, #667fd7 69% 80%, #acd5d0 80% 88%, #c9cdd2 88% 100%)" }} /><div className="absolute inset-[34px] flex flex-col items-center justify-center rounded-full bg-white"><strong className="text-[21px] text-slate-950">152</strong><span className="text-[8px] text-slate-500">Total</span></div></div><dl className="space-y-2 text-[8px]">{[["Verification", "39 (26%)", "bg-green-600"], ["Complaints", "14 (9%)", "bg-red-500"], ["Documents", "21 (14%)", "bg-blue-500"], ["System Alerts", "12 (8%)", "bg-orange-400"], ["Field Inspections", "18 (12%)", "bg-amber-400"], ["Reports", "16 (11%)", "bg-indigo-500"], ["Communications", "12 (8%)", "bg-teal-200"], ["Others", "20 (13%)", "bg-slate-300"]].map(([label, value, color]) => <div key={label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} /><dt className="min-w-0 flex-1 font-semibold text-slate-600">{label}</dt><dd className="text-slate-500">{value}</dd></div>)}</dl></div></Panel>

            <Panel className="mt-4 overflow-hidden pb-3"><div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-[14px] font-bold text-slate-900">Recent Activity</h2><button type="button" onClick={() => setNotice("Showing all recent activity.")} className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">View All <LuChevronRight aria-hidden="true" /></button></div><div className="px-3">{[
              { icon: <LuBell aria-hidden="true" />, title: "You approved a land record", detail: "Gopal Naik (LN-2026-1008)", date: "Yesterday", time: "11:15 AM", color: "bg-emerald-100 text-emerald-700" },
              { icon: <LuUserRound aria-hidden="true" />, title: "Reviewed complaint", detail: "CMP-2025-076", date: "May 11, 2025", time: "4:35 PM", color: "bg-red-100 text-red-500" },
              { icon: <LuMapPinned aria-hidden="true" />, title: "Assigned field inspection", detail: "Wazeed Village", date: "May 10, 2025", time: "3:20 PM", color: "bg-violet-100 text-violet-600" },
              { icon: <LuFileText aria-hidden="true" />, title: "Generated report", detail: "Monthly Verification Report", date: "May 10, 2025", time: "2:10 PM", color: "bg-cyan-100 text-cyan-700" },
              { icon: <LuCircleCheck aria-hidden="true" />, title: "System login", detail: "", date: "May 9, 2025", time: "9:05 AM", color: "bg-emerald-100 text-emerald-700" },
            ].map((activity) => <div key={activity.title} className="grid grid-cols-[34px_minmax(0,1fr)_72px] items-start gap-2 py-2.5"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${activity.color}`}>{activity.icon}</span><span className="min-w-0"><span className="block truncate text-[9px] font-semibold text-slate-700">{activity.title}</span>{activity.detail && <span className="mt-1 block truncate text-[8px] text-slate-500">{activity.detail}</span>}</span><span className="text-right text-[8px] leading-4 text-slate-500"><span className="block">{activity.date}</span><span className="block">{activity.time}</span></span></div>)}</div></Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}
