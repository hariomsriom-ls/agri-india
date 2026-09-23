"use client";

import { useState, type ReactNode } from "react";
import {
  LuBell, LuCalendarDays, LuCheck, LuCheckCheck, LuChevronDown,
  LuChevronLeft, LuChevronRight, LuFileText, LuFilter, LuFlag, LuMail, LuSearch,
} from "@/components/ui/icons";

import { markAllNotificationsRead, updateNotification, type Filter, type Notification, type NotificationType } from "@/features/landowner-Worker-authority/notificationdata";
import { useFetchNotifications } from "@/services/fetchNotification";
import { useVisibleNotifications } from "@/services/visiblenotification";
import { useAppDispatch } from "@/store/hooks";

const categories: NotificationType[] = ["Announcements", "Land Updates", "Payment Updates", "Documents", "System Alerts"];
const tabLabels: Filter[] = ["All Notifications", "Unread", ...categories];
const categoryStyles: Record<NotificationType | "Others", string> = {
  Announcements: "bg-amber-100 text-amber-700",
  "Land Updates": "bg-emerald-100 text-emerald-700",
  "Payment Updates": "bg-red-100 text-red-500",
  Documents: "bg-blue-100 text-blue-600",
  "System Alerts": "bg-violet-100 text-violet-600",
  Others: "bg-slate-100 text-slate-600",
};
const categoryColors = ["#f59e0b", "#059669", "#ef4444", "#3b82f6", "#8b5cf6", "#cbd5e1"];

function notificationDate(notification: Notification) {
  const value = notification.Date ?? notification.createdAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.04)] ${className}`}>{children}</section>;
}

function SummaryCard({ value, label, icon, cardClass, iconClass }: { value: string; label: string; icon: ReactNode; cardClass: string; iconClass: string }) {
  return (
    <article className={`flex min-h-[112px] items-center gap-3 rounded-xl border border-slate-100 px-3 shadow-[0_3px_12px_rgba(15,46,34,0.025)] ${cardClass}`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[24px] ${iconClass}`}>{icon}</span>
      <div className="min-w-0"><p className="text-[22px] font-extrabold leading-none text-slate-950">{value}</p><p className="mt-2 text-[9px] font-semibold text-slate-700">{label}</p></div>
    </article>
  );
}

export default function AuthorityNotifications() {
  const dispatch = useAppDispatch();
  const { role, notifications, status, error, retry } = useFetchNotifications();
  const [search, setSearch] = useState("");
  const { visibleNotifications, filter: activeTab, setFilter: setActiveTab } = useVisibleNotifications(notifications, search);
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notice, setNotice] = useState("");

  function notificationCount(category: Filter) {
    return notifications.filter((item) => category === "All Notifications"
      || (category === "Unread" ? item.unread : item.type === category)).length;
  }

  const tabs = tabLabels.map((label) => ({ label, count: notificationCount(label) }));
  const filteredNotifications = visibleNotifications
    .filter((item) => !alertsOnly || item.type === "System Alerts")
    .map((item) => {
      const category = item.type && categories.includes(item.type) ? item.type : "Others";
      const date = notificationDate(item);
      return {
        id: item._id,
        title: item.title,
        description: item.message,
        category,
        read: !item.unread,
        time: item.time || date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "",
        date: date?.toLocaleDateString() || "",
        icon: category === "Documents" ? <LuFileText aria-hidden="true" /> : <LuBell aria-hidden="true" />,
        iconClass: categoryStyles[category],
      };
    });

  const displayTotal = filteredNotifications.length;
  const pageCount = Math.max(1, Math.ceil(displayTotal / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * rowsPerPage;
  const firstVisible = displayTotal ? pageStart + 1 : 0;
  const lastVisible = Math.min(currentPage * rowsPerPage, displayTotal);
  const today = new Date().toDateString();
  const todayCount = notifications.filter((item) => notificationDate(item)?.toDateString() === today).length;
  const breakdown = [
    ...categories.map((label, index) => ({ label, count: notificationCount(label), color: categoryColors[index] })),
    { label: "Others", count: notifications.filter((item) => !item.type || !categories.includes(item.type)).length, color: categoryColors[5] },
  ];
  let percentage = 0;
  const chartSegments = breakdown.map((item) => {
    const start = percentage;
    percentage += notifications.length ? item.count / notifications.length * 100 : 0;
    return `${item.color} ${start}% ${percentage}%`;
  });

  function toggleRead(notificationId: Notification["_id"]) {
    const notification = notifications.find((item) => item._id === notificationId);
    if (notification) dispatch(updateNotification({ _id: notificationId, unread: !notification.unread }));
  }

  function markAllRead() {
    dispatch(markAllNotificationsRead());
    setNotice("All notifications marked as read.");
  }

  if (!role) return <p className="p-6">Please sign in to view your notifications.</p>;
  if (role !== "authority") return <p className="p-6" role="alert">Only authorities can view this page.</p>;
  if (status === "idle" || status === "loading") return <p className="p-6" role="status">Loading notifications...</p>;
  if (status === "failed") return (
    <div className="p-6">
      <p role="alert">{error || "Unable to load notifications."}</p>
      <button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-white">Try again</button>
    </div>
  );

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
                  {filterOpen && <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-xl"><button type="button" onClick={() => { setAlertsOnly(false); setFilterOpen(false); setPage(1); }} className={`w-full rounded-md px-3 py-2 text-left text-[10px] font-medium ${!alertsOnly ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}>All notifications</button><button type="button" onClick={() => { setAlertsOnly(true); setFilterOpen(false); setPage(1); }} className={`w-full rounded-md px-3 py-2 text-left text-[10px] font-medium ${alertsOnly ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}>System alerts only</button></div>}
                </div>
              </div>
            </header>

            <nav className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Notification categories">
              {tabs.map((tab) => <button key={tab.label} type="button" onClick={() => { setActiveTab(tab.label); setPage(1); }} className={`flex h-12 items-center justify-center gap-2 rounded-lg border-b-[3px] px-2 text-[9px] font-semibold transition-colors ${activeTab === tab.label ? "border-emerald-700 bg-white text-emerald-800 shadow-sm" : "border-transparent bg-white/70 text-slate-600 hover:bg-white"}`}>{tab.label === "All Notifications" && <LuCheckCheck className="text-sm" aria-hidden="true" />}{tab.label}<span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[8px] ${activeTab === tab.label && tab.label === "All Notifications" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>{tab.count}</span></button>)}
            </nav>

            {notice && <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-medium text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} className="rounded p-1 hover:bg-emerald-100" aria-label="Dismiss message">×</button></div>}

            <section className="mt-4 space-y-1.5" aria-label="Notification list">
              {filteredNotifications.slice(pageStart, pageStart + rowsPerPage).map((notification) => (
                <article key={notification.id} className={`grid min-h-[103px] grid-cols-[12px_62px_minmax(0,1fr)_95px_24px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-[0_3px_13px_rgba(15,46,34,0.025)] transition-colors ${notification.read ? "opacity-90" : "hover:border-emerald-200"}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${notification.read ? "bg-slate-300" : "bg-emerald-700"}`} />
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full text-[27px] ${notification.iconClass}`}>{notification.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3"><h2 className="truncate text-[12px] font-bold text-slate-900">{notification.title}</h2><span className={`shrink-0 rounded-md px-2.5 py-1 text-[8px] font-semibold ${notification.iconClass}`}>{notification.category}</span></div>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-600">{notification.description}</p>
                  </div>
                  <div className="text-right text-[9px] leading-5 text-slate-500"><p>{notification.time}</p><p>{notification.date}</p></div>
                  <button type="button" onClick={() => toggleRead(notification.id)} aria-label={notification.read ? `Mark ${notification.title} unread` : `Mark ${notification.title} read`} className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] ${notification.read ? "border-slate-400 text-slate-400" : "border-emerald-700 text-emerald-700"}`}>{notification.read && <LuCheck aria-hidden="true" />}</button>
                </article>
              ))}
              {filteredNotifications.length === 0 && <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-[11px] text-slate-500">No notifications match the selected filters.</div>}
            </section>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-[9px] text-slate-500">
              <span>Showing {firstVisible} to {lastVisible} of {displayTotal} notifications</span>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous page" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 disabled:opacity-40"><LuChevronLeft aria-hidden="true" /></button>
                <span aria-live="polite">Page {currentPage} of {pageCount}</span>
                <button type="button" aria-label="Next page" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 disabled:opacity-40"><LuChevronRight aria-hidden="true" /></button>
              </div>
              <label className="relative"><span className="sr-only">Notifications per page</span><select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[9px] font-semibold outline-none"><option value={10}>10 / page</option><option value={20}>20 / page</option><option value={50}>50 / page</option></select><LuChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" /></label>
            </div>
          </main>

          <aside className="border-l border-slate-200 pl-5" aria-label="Notification summary">
            <label className="relative block"><span className="sr-only">Search notifications</span><LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search notifications..." className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-[11px] outline-none shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /><LuSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" aria-hidden="true" /></label>

            <Panel className="mt-5 p-4"><h2 className="text-[14px] font-bold text-slate-900">Notification Summary</h2><div className="mt-4 grid grid-cols-2 gap-3"><SummaryCard value={String(notifications.length)} label="Total Notifications" icon={<LuBell aria-hidden="true" />} cardClass="bg-gradient-to-br from-emerald-50 to-white" iconClass="bg-emerald-100 text-emerald-700" /><SummaryCard value={String(notificationCount("Unread"))} label="Unread" icon={<LuMail aria-hidden="true" />} cardClass="bg-gradient-to-br from-blue-50 to-white" iconClass="bg-blue-100 text-blue-600" /><SummaryCard value={String(notificationCount("System Alerts"))} label="System Alerts" icon={<LuFlag aria-hidden="true" />} cardClass="bg-gradient-to-br from-red-50 to-white" iconClass="bg-red-100 text-red-500" /><SummaryCard value={String(todayCount)} label="Today" icon={<LuCalendarDays aria-hidden="true" />} cardClass="bg-gradient-to-br from-amber-50 to-white" iconClass="bg-amber-100 text-amber-600" /></div></Panel>

            <Panel className="mt-4 p-4">
              <h2 className="text-[14px] font-bold text-slate-900">Notification Breakdown</h2>
              <div className="mt-4 grid grid-cols-[160px_1fr] items-center gap-3">
                <div className="relative mx-auto h-[145px] w-[145px]">
                  <div aria-hidden="true" className="absolute inset-0 rounded-full" style={{ background: notifications.length ? `conic-gradient(${chartSegments.join(", ")})` : "#e2e8f0" }} />
                  <div className="absolute inset-[34px] flex flex-col items-center justify-center rounded-full bg-white"><strong className="text-[21px] text-slate-950">{notifications.length}</strong><span className="text-[8px] text-slate-500">Total</span></div>
                </div>
                <dl className="space-y-2 text-[8px]">
                  {breakdown.map(({ label, count, color }) => <div key={label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} /><dt className="min-w-0 flex-1 font-semibold text-slate-600">{label}</dt><dd className="text-slate-500">{count} ({notifications.length ? Math.round(count / notifications.length * 100) : 0}%)</dd></div>)}
                </dl>
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}
