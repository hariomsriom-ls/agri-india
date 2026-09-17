"use client";

import { useState } from "react";
import {FiCalendar,FiChevronDown,FiChevronLeft,FiChevronRight,FiFilter,FiInfo,
  FiSearch,GiWallet
} from "@/components/ui/icons";
import type { PaymentStatus } from "@/features/landowner-Worker/paymenthistory";
import { EarningsChart } from "@/components/cards/worker/worker-landowner-earning";
import { useVisiblePayments, type PaymentFilter } from "@/services/visiblepayments";
import { useFetchPayments } from "@/services/fetchPayments";


export default function WorkerSalaryHistory() {
  const [search, setSearch] = useState("");
  const { role, payments, status, error, retry } = useFetchPayments("worker");
  const { visiblePayments, filterStatus, setFilterStatus } =useVisiblePayments(payments, search);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [year, setYear] = useState(new Date().getFullYear());
  const [paymentDate, setPaymentDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedPayment = payments.find((payment) => payment._id === selectedId);
  const filteredPayments = visiblePayments.filter((payment) => !paymentDate || payment.paymentdate.slice(0, 10) === paymentDate);
  const pageCount = Math.max(1, Math.ceil(filteredPayments.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * rowsPerPage;
  const pagedPayments = filteredPayments.slice(firstIndex, firstIndex + rowsPerPage);
  const years = [...new Set([new Date().getFullYear(), ...payments.map((payment) => new Date(payment.paymentdate).getFullYear()).filter(Number.isFinite)])].sort((a, b) => b - a);
  const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  const totalForStatus = (paymentStatus: PaymentStatus) => payments.filter((payment) => payment.paymentStatus === paymentStatus).reduce((sum, payment) => sum + payment.amount, 0);
    

const statusClass: Record<PaymentStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-600",
};

const cards = [
 { label: "Total Earnings", value: money(totalForStatus("Completed")), note: "All completed payments", color: "text-emerald-700", bg: "bg-lime-50", icon: GiWallet },
 { label: "Pending Payments", value: money(totalForStatus("Pending")), note: "Awaiting payment", color: "text-amber-700", bg: "bg-amber-50", icon: GiWallet },
 { label: "Failed Payments", value: money(totalForStatus("Failed")), note: "Not included in earnings", color: "text-red-700", bg: "bg-red-50", icon: GiWallet },
];
   

  if (role !== "worker") {return <p className="p-6">Sign in as a worker to view your salary history.</p>;}

  if (status === "idle" || status === "loading") {return <p role="status" className="p-6">Loading payments...</p>;}

  if (status === "failed") {return <div className="p-6"><p role="alert" className="text-red-600">{error ?? "Failed to fetch payments."}</p><button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-white">Try again</button></div>; }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-6 text-slate-800 sm:px-7">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Salary History</h1>
          <p className="mt-1 text-sm text-slate-500">Track your income, payouts, and payment history</p>
          <button type="button" onClick={retry} className="mt-3 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700">Refresh payments</button>
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
              <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 shadow-sm">
                <FiCalendar aria-hidden="true" />
                <select aria-label="Earnings year" value={year} onChange={(event) => setYear(Number(event.target.value))}>
                  {years.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
            </div>
          </div>
          <EarningsChart payments={payments} year={year} />
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-900">Payment History</h2>
            <div className="flex flex-col gap-3 sm:flex-row">

              <label className="relative sm:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input aria-label="Search payments" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search payments..." 
                className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>

              <label className="relative">
                <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                <select value={filterStatus} onChange={(event) => { setFilterStatus(event.target.value as PaymentFilter); setPage(1); }}
                aria-label="Filter payments by status" 
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-semibold outline-none focus:border-emerald-500">
                  <option>All</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </label>

              <input type="date" aria-label="Filter by payment date" value={paymentDate} onChange={(event) => { setPaymentDate(event.target.value); setPage(1); }} className="h-11 rounded-xl border border-slate-200 px-3 text-sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-5 py-3">Paid By</th>
                  <th className="px-5 py-3">Payment Type</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment Method</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedPayments.map((payment) => (
                  <tr key={payment._id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                      {new Date(payment.paymentdate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{payment.transactionId}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="flex items-center gap-3">
                      {Array.isArray(payment.PaymentFrom)
                        ? payment.PaymentFrom[0]?.fullName ?? "—"
                        : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{payment.paymentType}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold">{money(payment.amount)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold">{payment.paymentMethod}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass[payment.paymentStatus]}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button type="button" onClick={() => setSelectedId(payment._id)}
                      className="rounded-lg border border-emerald-300 px-4 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50">
                        View Details</button>
                      </td>
                  </tr>
                ))}
                {!filteredPayments.length && <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  {payments.length ? "No payments match your filters." : "No salary payments have been recorded yet."}
                </td>
              </tr>}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Showing {filteredPayments.length ? `${firstIndex + 1} to ${Math.min(firstIndex + rowsPerPage, filteredPayments.length)}` : "0"} of {filteredPayments.length} payments</p>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous page" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 disabled:opacity-40">
                <FiChevronLeft />
                </button>
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400 bg-emerald-50 font-semibold text-emerald-700">
                  {currentPage}</span>
                  <button type="button" aria-label="Next page" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 disabled:opacity-40">
                  <FiChevronRight />
                  </button>
                </div>
            <label className="flex items-center gap-3">Rows per page:
              <select value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="h-9 rounded-lg border border-slate-200 bg-white px-3">
                <option>10</option>
                <option>20</option>
                </select>
            </label>
          </footer>
        </section>
        {selectedPayment && <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Payment details">
          <div className="flex justify-between gap-4"><h2 className="text-xl font-bold">Payment Details</h2><button type="button" onClick={() => setSelectedId(null)} className="text-sm text-emerald-700">Close</button></div>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["Transaction ID", selectedPayment.transactionId], ["Amount", money(selectedPayment.amount)],
              ["Date", new Date(selectedPayment.paymentdate).toLocaleDateString("en-IN")], ["Status", selectedPayment.paymentStatus],
              ["Payment Type", selectedPayment.paymentType], ["Payment Method", selectedPayment.paymentMethod],
              ["Paid By", Array.isArray(selectedPayment.PaymentFrom) ? selectedPayment.PaymentFrom[0]?.fullName ?? "Not available" : "Not available"],
            ].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value}</dd></div>)}
          </dl>
        </section>}
      </div>
    </div>
  );
}

