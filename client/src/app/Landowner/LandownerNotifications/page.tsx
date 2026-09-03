"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiInfo,
  FiMail,
  FiMoreVertical,
  FiSettings,
  FiShield,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee, HiOutlineMegaphone } from "react-icons/hi2";
import { LuLeaf } from "react-icons/lu";

type NotificationType = "Announcements" | "Land Updates" | "Payment Updates" | "Documents" | "System Alerts";
type Filter = "All Notifications" | "Unread" | NotificationType;

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  unread: boolean;
  isNew?: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, title: "New Feature Update", message: "We've added a new analytics dashboard to help you track your land performance better.", time: "10 min ago", type: "Announcements", unread: true, isNew: true },
  { id: 2, title: "Land Verification Completed", message: 'Your land "Green Valley Farm" has been successfully verified by authority.', time: "1 hour ago", type: "Land Updates", unread: true },
  { id: 3, title: "Payment Received", message: 'Payment of ₹25,000 for land "Sunrise Farm" has been successfully processed.', time: "3 hours ago", type: "Payment Updates", unread: true },
  { id: 4, title: "Document Upload Reminder", message: 'Please upload the required lease document for "Shiv Shakti Farm".', time: "1 day ago", type: "Documents", unread: false },
  { id: 5, title: "Maintenance Notice", message: "System maintenance scheduled on 25th May 2024 from 2:00 AM to 4:00 AM.", time: "2 days ago", type: "Announcements", unread: false },
  { id: 6, title: "Security Alert", message: "New login detected from Chrome on Windows at 192.168.1.1", time: "3 days ago", type: "System Alerts", unread: false },
  { id: 7, title: "Crop Advisory Available", message: "New crop advisory for Wheat is now available in your dashboard.", time: "4 days ago", type: "Land Updates", unread: false },
  { id: 8, title: "Payment Failed", message: 'Payment of ₹15,000 for land "Old Heritage Land" failed. Please try again.', time: "5 days ago", type: "Payment Updates", unread: true },
];

const filterItems: { label: Filter; count: number; icon: ReactNode; style: string }[] = [
  { label: "All Notifications", count: 32, icon: <FiMail />, style: "bg-emerald-50 text-emerald-600" },
  { label: "Unread", count: 5, icon: <span className="h-3 w-3 rounded-full bg-blue-600" />, style: "bg-blue-50 text-blue-600" },
  { label: "Announcements", count: 12, icon: <HiOutlineMegaphone />, style: "bg-amber-50 text-amber-600" },
  { label: "Land Updates", count: 8, icon: <LuLeaf />, style: "bg-green-50 text-green-600" },
  { label: "Payment Updates", count: 4, icon: <HiOutlineCurrencyRupee />, style: "bg-red-50 text-red-500" },
  { label: "System Alerts", count: 3, icon: <FiShield />, style: "bg-violet-50 text-violet-600" },
];

const typeDesign: Record<NotificationType, { icon: ReactNode; style: string }> = {
  Announcements: { icon: <HiOutlineMegaphone />, style: "bg-amber-50 text-amber-500" },
  "Land Updates": { icon: <LuLeaf />, style: "bg-green-50 text-green-600" },
  "Payment Updates": { icon: <HiOutlineCurrencyRupee />, style: "bg-red-50 text-red-500" },
  Documents: { icon: <FiFileText />, style: "bg-blue-50 text-blue-600" },
  "System Alerts": { icon: <FiShield />, style: "bg-violet-50 text-violet-600" },
};

export default function LandownerNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<Filter>("All Notifications");
  const [sort, setSort] = useState("Newest First");
  const [enabled, setEnabled] = useState(false);

  const visibleNotifications = useMemo(() => {
    const filtered = notifications.filter((item) => filter === "All Notifications" || (filter === "Unread" ? item.unread : item.type === filter));
    return sort === "Oldest First" ? [...filtered].reverse() : filtered;
  }, [filter, notifications, sort]);

  function markAllRead() {
    setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
  }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6"><h1 className="text-3xl font-bold tracking-tight text-slate-950">Notifications</h1><p className="mt-1.5 text-sm text-slate-500">Stay updated with important announcements and updates</p></header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Notifications" value="32" note="All time" icon={<FiBell />} style="bg-green-50 text-green-600" />
          <SummaryCard label="Unread Notifications" value={String(notifications.filter((item) => item.unread).length)} note="New notifications" icon={<FiMail />} style="bg-blue-50 text-blue-600" />
          <SummaryCard label="Announcements" value="12" note="Company announcements" icon={<HiOutlineMegaphone />} style="bg-amber-50 text-amber-500" />
          <SummaryCard label="Alerts" value="3" note="Important alerts" icon={<FiInfo />} style="bg-violet-50 text-violet-600" />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Notification Filters</h2>
              <div className="mt-4 space-y-1">{filterItems.map((item) => <button key={item.label} type="button" onClick={() => setFilter(item.label)} className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${filter === item.label ? "bg-emerald-50" : "hover:bg-slate-50"}`}><span className={`grid h-8 w-8 place-items-center rounded-lg ${item.style}`}>{item.icon}</span><span className={`flex-1 text-sm font-semibold ${filter === item.label ? "text-emerald-800" : "text-slate-700"}`}>{item.label}</span><span className="rounded-full bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500">{item.label === "Unread" ? notifications.filter((entry) => entry.unread).length : item.count}</span></button>)}</div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Quick Actions</h2><div className="mt-4 space-y-2"><button type="button" onClick={markAllRead} className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-semibold hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><FiMail /></span>Mark all as read<FiChevronRight className="ml-auto" /></button><button type="button" className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-semibold hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><FiSettings /></span>Notification Settings<FiChevronRight className="ml-auto" /></button></div></section>

            <section className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 text-center shadow-sm"><div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-5xl text-emerald-600"><FiBell /><span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">1</span></div><h2 className="mt-4 font-bold text-slate-900">Never miss important updates!</h2><p className="mt-2 text-xs leading-5 text-slate-500">Enable push notifications to stay updated in real-time.</p><button type="button" onClick={() => setEnabled((value) => !value)} className={`mt-5 h-11 w-full rounded-lg border text-sm font-semibold transition ${enabled ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"}`}>{enabled ? "Notifications Enabled" : "Enable Notifications"}</button></section>
          </aside>

          <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"><h2 className="text-lg font-bold text-slate-900">All Notifications</h2><label className="flex items-center gap-3 text-xs text-slate-500">Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"><option>Newest First</option><option>Oldest First</option></select></label></div>
            <div className="divide-y divide-slate-100 px-5">
              {visibleNotifications.map((notification) => { const design = typeDesign[notification.type]; return <article key={notification.id} className={`flex items-center gap-4 py-5 transition ${notification.unread ? "bg-emerald-50/20" : ""}`}><button type="button" onClick={() => setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, unread: false } : item))} className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl ${design.style}`}>{design.icon}</button><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-bold text-slate-800">{notification.title}</h3>{notification.isNew && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">New</span>}</div><p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">{notification.message}</p></div><time className="hidden shrink-0 text-xs text-slate-500 sm:block">{notification.time}</time>{notification.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />}<button type="button" aria-label={`More actions for ${notification.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-50"><FiMoreVertical /></button></article>; })}
              {!visibleNotifications.length && <div className="py-16 text-center"><FiCheckCircle className="mx-auto text-4xl text-emerald-400" /><h3 className="mt-3 font-semibold">You&apos;re all caught up</h3><p className="mt-1 text-sm text-slate-500">There are no notifications in this category.</p></div>}
            </div>
            <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>Showing {visibleNotifications.length ? `1 to ${visibleNotifications.length}` : "0"} of 32 notifications</p><div className="flex gap-2"><PageButton label="Previous"><FiChevronLeft /></PageButton><PageButton active label="Page 1">1</PageButton><PageButton label="Page 2">2</PageButton><PageButton label="Page 3">3</PageButton><PageButton label="Page 4">4</PageButton><PageButton label="Next"><FiChevronRight /></PageButton></div></footer>
          </main>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, note, icon, style }: { label: string; value: string; note: string; icon: ReactNode; style: string }) {
  return <article className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl ${style}`}>{icon}</div><div><p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-[11px] text-slate-500">{note}</p></div></article>;
}

function PageButton({ children, label, active = false }: { children: ReactNode; label: string; active?: boolean }) {
  return <button type="button" aria-label={label} className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 font-semibold ${active ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>{children}</button>;
}
