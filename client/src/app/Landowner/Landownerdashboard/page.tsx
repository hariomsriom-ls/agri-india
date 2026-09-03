"use client";
import { ReactNode } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiMessageSquare,
  FiPlusCircle,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { LuLeaf } from "react-icons/lu";
import {
  LandownerActivePlotcard,
  LandownerActiveServicecard,
  LandownerTotalIncomecard,
  LandownerTotalPlotcard,
} from "@/components/cards/landowner/landowner-dashboard";


export default function LandownerDashboard() {
  return (
    <div className="min-h-full overscroll-none bg-[#f7f9f8] p-4 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LandownerTotalPlotcard />
          <LandownerActivePlotcard />
          <LandownerTotalIncomecard />
          <LandownerActiveServicecard />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)]">
          <EarningsOverview />
          <RecentActivity />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(300px,.9fr)_minmax(340px,.9fr)_minmax(420px,1.2fr)]">
          <LandStatusOverview />
          <TopPerformingLands />
          <UpcomingReminders />
        </div>

        <QuickAccess />
      </div>
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function EarningsOverview() {
  const thisMonth = [8, 20, 20, 41, 48, 51, 61, 70, 70, 82, 83, 91, 102, 102, 113, 114, 124, 125, 125, 140, 147, 150];
  const lastMonth = [8, 8, 9, 15, 26, 29, 36, 36, 36, 46, 50, 53, 62, 62, 61, 71, 72, 78, 84, 91, 96, 110];
  const line = (values: number[]) => values.map((value, index) => `${35 + index * 42},${225 - value * 1.25}`).join(" ");

  return (
    <SectionCard>
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-slate-900">Earnings Overview</h2><button type="button" className="flex h-10 items-center gap-3 rounded-lg border border-slate-200 px-4 text-sm font-semibold">This Month <FiChevronDown /></button></div>
      <div className="mt-3 flex gap-6 text-sm text-slate-500"><span className="flex items-center gap-2"><i className="h-0.5 w-9 bg-emerald-700" />This Month</span><span className="flex items-center gap-2"><i className="h-0.5 w-9 border-t-2 border-dashed border-emerald-300" />Last Month</span></div>
      <div className="mt-2 overflow-x-auto"><svg viewBox="0 0 960 275" className="h-72 min-w-[760px] w-full" aria-label="Monthly earnings comparison chart" role="img">{[0, 25, 50, 75, 100, 125, 150].map((value) => <g key={value}><line x1="35" x2="930" y1={225 - value * 1.25} y2={225 - value * 1.25} stroke="#e5e7eb" /><text x="27" y={230 - value * 1.25} textAnchor="end" className="fill-slate-500 text-[11px]">{value ? `₹${value}K` : "₹0"}</text></g>)}<polyline points={line(lastMonth)} fill="none" stroke="#9bcdb8" strokeWidth="3" strokeDasharray="8 7" /><polyline points={line(thisMonth)} fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="665" cy="69" r="7" fill="#15803d" stroke="white" strokeWidth="3" /><rect x="510" y="10" width="140" height="62" rx="10" fill="white" stroke="#e5e7eb" /><text x="530" y="35" className="fill-slate-500 text-[12px]">20 May 2024</text><text x="530" y="59" className="fill-slate-900 text-[15px] font-bold">● ₹1,28,500</text>{["1 May", "5 May", "10 May", "15 May", "20 May", "25 May", "30 May"].map((label, index) => <text key={label} x={55 + index * 145} y="257" textAnchor="middle" className="fill-slate-500 text-[11px]">{label}</text>)}</svg></div>
    </SectionCard>
  );
}

const activity = [
  { title: 'Payment received for “Green Valley Farm”', detail: "₹25,000 received from Authority", time: "10 min ago", icon: <FiCheckCircle />, style: "bg-emerald-50 text-emerald-600" },
  { title: 'Document “Lease Agreement” uploaded', detail: "Document is under review", time: "1 hour ago", icon: <FiFileText />, style: "bg-violet-50 text-violet-600" },
  { title: "New worker assigned", detail: 'Ramesh Kumar assigned to “Sunrise Farm”', time: "2 hours ago", icon: <FiUsers />, style: "bg-amber-50 text-amber-500" },
  { title: "New message from Authority", detail: "Regarding land verification process", time: "3 hours ago", icon: <FiMessageSquare />, style: "bg-blue-50 text-blue-600" },
  { title: "Crop update", detail: 'Wheat crop health is good in “Shiv Shakti Farm”', time: "5 hours ago", icon: <LuLeaf />, style: "bg-green-50 text-green-600" },
];

function RecentActivity() {
  return <SectionCard><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Recent Activity</h2><button type="button" className="text-sm font-semibold text-emerald-700">View All</button></div><div className="mt-4 space-y-4">{activity.map((item) => <article key={item.title} className="flex items-center gap-4"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl ${item.style}`}>{item.icon}</span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{item.title}</h3><p className="mt-1 truncate text-sm text-slate-500">{item.detail}</p></div><time className="shrink-0 text-xs text-slate-500">{item.time}</time></article>)}</div></SectionCard>;
}

function LandStatusOverview() {
  return <SectionCard><h2 className="text-xl font-bold text-slate-900">Land Status Overview</h2><div className="mt-7 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row"><div className="grid h-44 w-44 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#4caf5a 0 75%, #ffb51b 75% 100%)" }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center"><span><strong className="block text-3xl text-slate-950">4</strong><small className="text-slate-500">Total Lands</small></span></div></div><div className="w-full space-y-4 text-sm"><Legend color="bg-green-600" label="Active" value="3 (75%)" /><Legend color="bg-amber-400" label="Pending" value="1 (25%)" /><Legend color="bg-red-500" label="Inactive" value="0 (0%)" /><Legend color="bg-blue-600" label="Under Maintenance" value="0 (0%)" /></div></div><Link href="/Landowner/LandownerMyLands" className="mx-auto mt-6 flex h-11 max-w-52 items-center justify-center gap-3 rounded-lg border border-slate-200 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">View All Lands <FiChevronRight /></Link></SectionCard>;
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return <div className="flex items-center gap-3"><i className={`h-3 w-3 rounded-full ${color}`} /><span className="flex-1 text-slate-600">{label}</span><strong className="text-slate-600">{value}</strong></div>;
}

const lands = [
  { name: "Green Valley Farm", detail: "12 Acres • Wheat", earnings: "₹45,600", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=150&q=80" },
  { name: "Sunrise Farm", detail: "8 Acres • Soybean", earnings: "₹32,400", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=150&q=80" },
  { name: "Shiv Shakti Farm", detail: "6 Acres • Gram", earnings: "₹28,300", image: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=150&q=80" },
  { name: "Old Heritage Land", detail: "6 Acres • Maize", earnings: "₹22,200", image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=150&q=80" },
];

function TopPerformingLands() {
  return <SectionCard><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Top Performing Lands</h2><button type="button" className="text-sm font-semibold text-emerald-700">View All</button></div><div className="mt-5 space-y-4">{lands.map((land) => <article key={land.name} className="flex items-center gap-3"><div className="h-12 w-14 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${land.image})` }} /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{land.name}</h3><p className="mt-1 text-sm text-slate-500">{land.detail}</p></div><div className="text-right"><strong className="text-sm">{land.earnings}</strong><p className="mt-1 text-xs text-slate-500">Earnings</p></div></article>)}</div></SectionCard>;
}

const reminders = [
  { title: "Land verification for Sunrise Farm", due: "Due on 25 May 2024", left: "5 days left", icon: <FiFileText />, style: "bg-amber-50 text-amber-500", badge: "bg-red-50 text-red-500" },
  { title: "Lease document renewal", due: "Due on 30 May 2024", left: "10 days left", icon: <FiFileText />, style: "bg-slate-100 text-slate-600", badge: "bg-amber-50 text-amber-600" },
  { title: "Irrigation schedule update", due: "Due on 05 Jun 2024", left: "16 days left", icon: <LuLeaf />, style: "bg-green-50 text-green-600", badge: "bg-green-50 text-green-700" },
];

function UpcomingReminders() {
  return <SectionCard><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Upcoming Reminders</h2><button type="button" className="text-sm font-semibold text-emerald-700">View All</button></div><div className="mt-4 divide-y divide-slate-100">{reminders.map((item) => <article key={item.title} className="flex items-center gap-4 py-4"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl ${item.style}`}>{item.icon}</span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.due}</p></div><span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${item.badge}`}>{item.left}</span></article>)}</div></SectionCard>;
}

const quickLinks = [
  { label: "Add New Land", href: "/Landowner/LandownerMyLands", icon: <FiPlusCircle />, style: "bg-green-50 text-green-600" },
  { label: "Search Worker", href: "#", icon: <FiUser />, style: "bg-violet-50 text-violet-600" },
  { label: "Register Complaint", href: "/Landowner/LandownerRegisterComplaint", icon: <FiAlertCircle />, style: "bg-red-50 text-red-500" },
  { label: "Upload Document", href: "/Landowner/Documents", icon: <FiFileText />, style: "bg-blue-50 text-blue-600" },
  { label: "View Payments", href: "/Landowner/LandownerEarnings", icon: <HiOutlineCurrencyRupee />, style: "bg-green-50 text-green-700" },
  { label: "Chat with Authority", href: "/Landowner/LandownerChat", icon: <FiMessageSquare />, style: "bg-violet-50 text-violet-600" },
];

function QuickAccess() {
  return <SectionCard className="mt-5"><h2 className="text-xl font-bold text-slate-900">Quick Access</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">{quickLinks.map((item) => <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${item.style}`}>{item.icon}</span>{item.label}</Link>)}</div></SectionCard>;
}
