"use client";

import { type ReactNode, useState } from "react";
import { HiOutlineCurrencyRupee, HiOutlineMegaphone , LuLeaf,FiBell,FiCheckCircle,FiChevronLeft,
  FiChevronRight,FiFileText,FiInfo,FiMail,FiMoreVertical,FiSettings,FiShield,
} from "@/components/ui/icons";
import { useFetchNotifications } from "@/services/fetchNotification";
import { useVisibleNotifications } from "@/services/visiblenotification";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserNotification, updateNotification,type Filter, type Notification, type NotificationType,
} from "@/features/landowner-Worker/notificationdata";
import { SummaryCard, PageButton } from "@/components/cards/worker/worker-pages-combination";


const filterItems: { label: Filter; icon: ReactNode; style: string }[] = [
  { label: "All Notifications", icon: <FiMail />, style: "bg-emerald-50 text-emerald-600" },
  { label: "Unread", icon: <span className="h-3 w-3 rounded-full bg-blue-600" />, style: "bg-blue-50 text-blue-600" },
  { label: "Announcements", icon: <HiOutlineMegaphone />, style: "bg-amber-50 text-amber-600" },
  { label: "Land Updates", icon: <LuLeaf />, style: "bg-green-50 text-green-600" },
  { label: "Payment Updates", icon: <HiOutlineCurrencyRupee />, style: "bg-red-50 text-red-500" },
  { label: "Documents", icon: <FiFileText />, style: "bg-blue-50 text-blue-600" },
  { label: "System Alerts", icon: <FiShield />, style: "bg-violet-50 text-violet-600" },
];

const typeDesign: Record<NotificationType, { icon: ReactNode; style: string }> = {
  Announcements: { icon: <HiOutlineMegaphone />, style: "bg-amber-50 text-amber-500" },
  "Land Updates": { icon: <LuLeaf />, style: "bg-green-50 text-green-600" },
  "Payment Updates": { icon: <HiOutlineCurrencyRupee />, style: "bg-red-50 text-red-500" },
  Documents: { icon: <FiFileText />, style: "bg-blue-50 text-blue-600" },
  "System Alerts": { icon: <FiShield />, style: "bg-violet-50 text-violet-600" },
};

function notificationTime(notification: Notification) {
  if (notification.time) return notification.time;
  const value = notification.Date ?? notification.createdAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "";
}



export default function WorkerNotifications() {
  const dispatch = useAppDispatch();
  const { role, notifications, status, error } = useFetchNotifications();
  const [search, setSearch] = useState("");
  const { visibleNotifications, filter, setFilter, sort, setSort } = useVisibleNotifications(notifications, search);
  const [page, setPage] = useState(1);
  const [enabled, setEnabled] = useState(false);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(visibleNotifications.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedNotifications = visibleNotifications.slice(pageStart, pageStart + pageSize);

  function notificationCount(category: Filter) {
    return notifications.filter((item) => category === "All Notifications"
      || (category === "Unread" ? item.unread : item.type === category)).length;
  }


  if (!role) return <p className="p-6">Please sign in to view your notifications.</p>;
  if (status === "idle" || status === "loading") return <p className="p-6" role="status">Loading notifications...</p>;
  if (status === "failed") return (
    <div className="p-6">
      <p role="alert">{error || "Unable to load notifications."}</p>
      <button type="button" 
      onClick={() => dispatch(fetchUserNotification(role))} 
      className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  );

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Notifications</h1>
          <p className="mt-1.5 text-sm text-slate-500">Stay updated with important announcements and updates</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
          label="Total Notifications"
          value={String(notifications.length)}
          note="All time"
          icon={<FiBell />}
          style="bg-green-50 text-green-600" />

          <SummaryCard
          label="Unread Notifications"
          value={String(notifications.filter((item) => item.unread).length)}
          note="New notifications" icon={<FiMail />}
          style="bg-blue-50 text-blue-600" />

          <SummaryCard
          label="Announcements"
          value={String(notificationCount("Announcements"))}
          note="Company announcements"
          icon={<HiOutlineMegaphone />}
          style="bg-amber-50 text-amber-500" />

          <SummaryCard
          label="Alerts"
          value={String(notificationCount("System Alerts"))}
          note="Important alerts"
          icon={<FiInfo />}
          style="bg-violet-50 text-violet-600" />

        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Notification Filters</h2>
              <div className="mt-4 space-y-1">
                {filterItems.map((item) => <button
              key={item.label}
              type="button"
              onClick={() => { setFilter(item.label); setPage(1); }}
              aria-pressed={filter === item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${filter === item.label ? "bg-emerald-50" : "hover:bg-slate-50"}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg ${item.style}`}>{item.icon}</span>
              <span className={`flex-1 text-sm font-semibold ${filter === item.label ? "text-emerald-800" : "text-slate-700"}`}>
                {item.label}
                </span>
              <span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500">
                {notificationCount(item.label)}
                </span>
              </button>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <button
            type="button"
            onClick={() => dispatch(fetchUserNotification(role))}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-semibold hover:bg-slate-50">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <FiMail />
            </span>
            Mark all as read
            <FiChevronRight className="ml-auto" />
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-semibold hover:bg-slate-50">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <FiSettings /></span>
            Notification Settings
            <FiChevronRight className="ml-auto" />
            </button>
            </div>

            </section>

            <section className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 text-center shadow-sm">
            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-5xl text-emerald-600">
              <FiBell />
            <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">1</span>
            </div>
            <h2 className="mt-4 font-bold text-slate-900">Never miss important updates!</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">Enable push notifications to stay updated in real-time.</p>
            <button
            type="button"
            onClick={() => setEnabled((value) => !value)}
            className={`mt-5 h-11 w-full rounded-lg border text-sm font-semibold transition ${enabled ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"}`}>
              {enabled ? "Notifications Enabled" : "Enable Notifications"}
              </button>
            </section>
          </aside>

          <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">{filter}</h2>
              <input
                type="search"
                aria-label="Search notifications"
                placeholder="Search notifications..."
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            <label className="flex items-center gap-3 text-xs text-slate-500">Sort by:
              <select
            value={sort}
            onChange={(event) => { setSort(event.target.value === "Oldest First" ? "Oldest First" : "Newest First"); setPage(1); }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
              <option>Newest First</option>
            <option>Oldest First</option>
            </select>
            </label>
            </div>
            <div className="divide-y divide-slate-100 px-5">
              {pagedNotifications.map((notification) => {
                const design = (notification.type && typeDesign[notification.type])
                  || { icon: <FiBell />, style: "bg-slate-50 text-slate-500" };
                return(
              <article key={notification._id}
              className={`flex items-center gap-4 py-5 transition ${notification.unread ? "bg-emerald-50/20" : ""}`}>
              <button
              type="button"
              onClick={() => dispatch(updateNotification({ _id: notification._id, unread: false }))}
              aria-label={`Mark ${notification.title} as read`}
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${design.style}`}>
                {design.icon}
                </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-slate-800">{notification.title}</h3>
              {notification.isNew &&<span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">New</span>}
              </div>

              <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                {notification.message}
                </p>
              </div>
              <time className="hidden shrink-0 text-xs text-slate-500 sm:block">
                {notificationTime(notification)}
              </time>
              {notification.unread && <span  className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />}
              <button
              type="button"
              aria-label={`More actions for ${notification.title}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-50">
                <FiMoreVertical />
              </button>
              </article>
              )})}
              {!visibleNotifications.length && <div className="py-16 text-center">
                <FiCheckCircle className="mx-auto text-4xl text-emerald-400" />
              <h3 className="mt-3 font-semibold">{search.trim() ? "No matching notifications" : "You're all caught up"}</h3>
              <p className="mt-1 text-sm text-slate-500">{search.trim() ? "Try a different search or category." : "There are no notifications in this category."}</p></div>}
            </div>

            <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {visibleNotifications.length ? `${pageStart + 1} to ${pageStart + pagedNotifications.length}` : "0"} of {visibleNotifications.length} notifications</p>
            <div className="flex gap-2">
              <PageButton label="Previous" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><FiChevronLeft /></PageButton>
            <span className="flex items-center px-2" aria-live="polite">Page {currentPage} of {pageCount}</span>
            <PageButton label="Next" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
              <FiChevronRight />
            </PageButton>
            </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

