"use client";

import { useState } from "react";
import {FiCalendar,FiChevronDown,FiChevronLeft,FiChevronRight,FiFilter,FiInfo,
  FiSearch,GiWallet
} from "@/components/ui/icons";
import type { PaymentStatus } from "@/features/landowner-Worker/paymenthistory";
import { MiniTrend, EarningsChart } from "@/components/cards/worker/worker-landowner-earning";
import { useVisiblePayments, type PaymentFilter } from "@/services/visiblepayments";
import { useFetchPayments } from "@/services/fetchPayments";


export default function LandownerEarnings() {
  const [search, setSearch] = useState("");
  const { role, payments, status, error } = useFetchPayments();
  const { visiblePayments, filterStatus, setFilterStatus } =
    useVisiblePayments(payments, search);

  const statusClass: Record<PaymentStatus, string> = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-600",
  };

  const cards = [
   { label: "Total Earnings", value: "₹2,48,500", note: "All time earnings", color: "text-emerald-700", bg: "bg-lime-50", icon: GiWallet },]
   

  if (!role) {
    return <p>User role not found.</p>;
  }

  if (status === "idle" || status === "loading") {
    return <p>Loading payments...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-600">{error ?? "Failed to fetch payments."}</p>;
  }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Earnings</h1>
          <p className="mt-1 text-sm text-slate-500">Track your income, payouts, and payment history</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, note, color, bg, icon: Icon }) => (
            <article key={label} className="flex min-h-32 items-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${bg} ${color}`}>
                <Icon className="text-3xl" />
                </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-700">{label}
                  <FiInfo className="shrink-0 text-slate-400" />
                </p>
                <p className={`mt-1 text-2xl font-bold ${color}`}>
                  {value}
                </p>
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
              <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-emerald-300" /> Monthly Earnings (₹)</span>
              <span className="flex items-center gap-2">
              <span className="relative h-0.5 w-8 bg-emerald-700">
              <i className="absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-700" />
              </span> Cumulative Earnings (₹)</span>
              <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 shadow-sm">
                <FiCalendar /> This Year 
                <FiChevronDown />
              </button>
            </div>
          </div>
          <EarningsChart payments={payments} />
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative sm:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} 
                placeholder="Search payments..." 
                className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="relative">
                <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as PaymentFilter) } 
                aria-label="Filter payments by status" 
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-semibold outline-none focus:border-emerald-500">
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </label>
              <button type="button" aria-label="Choose date" className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50">
                <FiCalendar />
                </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-5 py-3">Land / Source</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visiblePayments.map((payment) => (
                  <tr key={payment._id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium">{payment.transactionId}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{new Date(payment.paymentdate).toLocaleDateString("en-IN")}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="flex items-center gap-3">
                      {Array.isArray(payment.PaymentFrom)
                        ? payment.PaymentFrom[0]?.fullName ?? "—"
                        : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{payment.paymentType}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold">{payment.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass[payment.paymentStatus]}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button type="button" 
                      className="rounded-lg border border-emerald-300 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">
                        View Details</button>
                      </td>
                  </tr>
                ))}
                {!visiblePayments.length && <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No payments match your search.
                </td>
              </tr>}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Showing {visiblePayments.length ? `1 to ${visiblePayments.length}` : "0"} of {visiblePayments.length} payments</p>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous page" 
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">
                <FiChevronLeft />
                </button>
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400 bg-emerald-50 font-semibold text-emerald-700">
                  1</span>
                  <button type="button" aria-label="Next page" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200">
                  <FiChevronRight />
                  </button>
                </div>
            <label className="flex items-center gap-3">Rows per page:
              <select className="h-9 rounded-lg border border-slate-200 bg-white px-3">
                <option>10</option>
                <option>20</option>
                </select>
            </label>
          </footer>
        </section>
      </div>
    </div>
  );
}
