"use client";

import { useMemo, useState } from "react";
import {FiBarChart2,FiCalendar,FiChevronDown,FiChevronLeft,FiChevronRight,FiClock,FiFilter,FiInfo,
  FiSearch,GiWallet
} from "@/components/ui/icons";


type PaymentStatus = "Paid" | "Pending" | "Failed";

type Payment = {
  date: string;
  id: string;
  land: string;
  description: string;
  amount: number;
  status: PaymentStatus;
};

const payments: Payment[] = [
  { date: "05 Jun 2024", id: "PAY20240605001", land: "Green Valley Farm", description: "Monthly rent for May 2024", amount: 12000, status: "Paid" },
  { date: "28 May 2024", id: "PAY20240528002", land: "Sunrise Farm", description: "Monthly rent for May 2024", amount: 8500, status: "Paid" },
  { date: "15 May 2024", id: "PAY20240515003", land: "Shiv Shakti Farm", description: "Irrigation charge reimbursement", amount: 6750, status: "Paid" },
  { date: "30 Apr 2024", id: "PAY20240430004", land: "Old Heritage Land", description: "Quarterly advance payment", amount: 24000, status: "Paid" },
  { date: "20 Apr 2024", id: "PAY20240420005", land: "Green Valley Farm", description: "Monthly rent for April 2024", amount: 12000, status: "Pending" },
  { date: "10 Apr 2024", id: "PAY20240410006", land: "Sunrise Farm", description: "Water usage charges", amount: 3250, status: "Failed" },
];

const monthly = [28500, 32400, 35800, 42700, 38600, 34200, 46100, 47300, 40900, 43200, 45600, 52800];
const cumulative = [28500, 60900, 96700, 139400, 178000, 212200, 258300, 305600, 346500, 389700, 435300, 488100];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function LandownerEarnings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const visiblePayments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return payments.filter((payment) =>
      (!term || [payment.id, payment.land, payment.description].some((value) => value.toLowerCase().includes(term))) &&
      (status === "All" || payment.status === status),
    );
  }, [search, status]);

  const statusClass: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-600",
  };

  const cards = [
    { label: "Total Earnings", value: "₹2,48,500", note: "All time earnings", color: "text-emerald-700", bg: "bg-lime-50", icon: GiWallet },
    { label: "This Month", value: "₹34,200", note: "June 1 – June 30", color: "text-emerald-700", bg: "bg-emerald-50", icon: FiCalendar },
    { label: "Pending Payouts", value: "₹12,000", note: "2 payouts pending", color: "text-amber-600", bg: "bg-amber-50", icon: FiClock },
    { label: "Average Monthly Income", value: "₹41,400", note: "Based on last 12 months", color: "text-blue-600", bg: "bg-blue-50", icon: FiBarChart2 },
  ];

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Earnings</h1>
          <p className="mt-1 text-sm text-slate-500">Track your income, payouts, and payment history</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, note, color, bg, icon: Icon }) => (
            <article key={label} className="flex min-h-32 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${bg} ${color}`}><Icon className="text-3xl" /></div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-700">{label}<FiInfo className="shrink-0 text-slate-400" /></p>
                <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                <p className="mt-1 text-xs text-slate-500">{note}</p>
              </div>
              <MiniTrend color={color} />
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Earnings Overview</h2>
            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-300" /> Monthly Earnings (₹)</span>
              <span className="flex items-center gap-2"><span className="relative h-0.5 w-8 bg-emerald-700"><i className="absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-700" /></span> Cumulative Earnings (₹)</span>
              <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 shadow-sm"><FiCalendar /> This Year <FiChevronDown /></button>
            </div>
          </div>
          <EarningsChart />
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative sm:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search payments..." className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="relative">
                <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter payments by status" className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-semibold outline-none focus:border-emerald-500">
                  <option>All</option><option>Paid</option><option>Pending</option><option>Failed</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </label>
              <button type="button" aria-label="Choose date" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50"><FiCalendar /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr><th className="px-6 py-3">Date</th><th className="px-5 py-3">Payment ID</th><th className="px-5 py-3">Land / Source</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visiblePayments.map((payment, index) => (
                  <tr key={payment.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium">{payment.date}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{payment.id}</td>
                    <td className="whitespace-nowrap px-5 py-3.5"><span className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-full ${index === 3 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>♣</span>{payment.land}</span></td>
                    <td className="px-5 py-3.5 text-slate-600">{payment.description}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold">{money(payment.amount)}</td>
                    <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass[payment.status]}`}><span className="h-2 w-2 rounded-full bg-current" />{payment.status}</span></td>
                    <td className="px-5 py-3.5"><button type="button" className="rounded-lg border border-emerald-300 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">View Details</button></td>
                  </tr>
                ))}
                {!visiblePayments.length && <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No payments match your search.</td></tr>}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Showing {visiblePayments.length ? `1 to ${visiblePayments.length}` : "0"} of {visiblePayments.length} payments</p>
            <div className="flex items-center gap-2"><button type="button" aria-label="Previous page" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200"><FiChevronLeft /></button><span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400 bg-emerald-50 font-semibold text-emerald-700">1</span><button type="button" aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200"><FiChevronRight /></button></div>
            <label className="flex items-center gap-3">Rows per page:<select className="h-9 rounded-lg border border-slate-200 bg-white px-3"><option>10</option><option>20</option></select></label>
          </footer>
        </section>
      </div>
    </div>
  );
}

function MiniTrend({ color }: { color: string }) {
  return <svg viewBox="0 0 70 42" className={`ml-auto hidden w-14 shrink-0 sm:block ${color}`} aria-hidden="true"><path d="M2 37 13 29 22 32 34 17 44 20 54 8 67 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 37 13 29 22 32 34 17 44 20 54 8 67 2V42H2Z" fill="currentColor" opacity=".08" /></svg>;
}

function EarningsChart() {
  const width = 1100;
  const height = 245;
  const left = 48;
  const right = 20;
  const top = 28;
  const bottom = 35;
  const plotHeight = height - top - bottom;
  const step = (width - left - right) / 12;
  const points = cumulative.map((value, index) => `${left + step * index + step / 2},${top + plotHeight - (value / 500000) * plotHeight}`).join(" ");

  return (
    <div className="mt-5 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] min-w-[900px] w-full" role="img" aria-label="Monthly and cumulative earnings chart">
        {[0, 20000, 40000, 60000, 80000].map((value) => {
          const y = top + plotHeight - (value / 80000) * plotHeight;
          return <g key={value}><line x1={left} y1={y} x2={width - right} y2={y} stroke="#e2e8f0" strokeDasharray="3 4" /><text x={left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">{value === 0 ? "0" : `${value / 1000}K`}</text></g>;
        })}
        {monthly.map((value, index) => {
          const barHeight = (value / 80000) * plotHeight;
          const x = left + step * index + step * 0.23;
          return <g key={months[index]}><rect x={x} y={top + plotHeight - barHeight} width={step * 0.54} height={barHeight} rx="5" fill="#8bd9a6" opacity=".9" /><text x={x + step * 0.27} y={top + plotHeight - barHeight - 7} textAnchor="middle" fontSize="9" fill="#475569">{money(value).slice(1)}</text><text x={x + step * 0.27} y={height - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">{months[index]}</text></g>;
        })}
        <polyline points={points} fill="none" stroke="#08783f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {cumulative.map((value, index) => {
          const x = left + step * index + step / 2;
          const y = top + plotHeight - (value / 500000) * plotHeight;
          return <g key={value}><circle cx={x} cy={y} r="4" fill="#08783f" stroke="white" strokeWidth="2" /><text x={x} y={y - 10} textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">{value.toLocaleString("en-IN")}</text></g>;
        })}
      </svg>
    </div>
  );
}
