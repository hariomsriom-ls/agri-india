"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LuArrowRight,
  LuCalendarDays,
  LuChartNoAxesColumnIncreasing,
  LuChevronDown,
  LuCircleAlert,
  LuFileText,
  LuHardHat,
  LuMegaphone,
  LuTriangleAlert,
  LuUserRoundCheck,
} from "react-icons/lu";

type RequestStatus = "Pending" | "Under Review" | "Approved";
type ComplaintStatus = "Open" | "In Progress" | "Resolved";

type RequestRow = {
  name: string;
  type: string;
  submitted: string;
  status: RequestStatus;
};

const chartData = [
  { date: "28 Aug", landowners: 20, workers: 20 },
  { date: "29 Aug", landowners: 25, workers: 17 },
  { date: "30 Aug", landowners: 23, workers: 12 },
  { date: "31 Aug", landowners: 24, workers: 13 },
  { date: "1 Sep", landowners: 21, workers: 14 },
  { date: "2 Sep", landowners: 27, workers: 17 },
  { date: "3 Sep", landowners: 32, workers: 29 },
];

const requestData: Record<string, RequestRow[]> = {
  "Landowner Requests": [
    { name: "Ramesh Kumar", type: "Landowner", submitted: "03 Sep 2026", status: "Pending" },
    { name: "Sita Devi", type: "Landowner", submitted: "03 Sep 2026", status: "Pending" },
    { name: "Arjun Patel", type: "Worker", submitted: "02 Sep 2026", status: "Pending" },
    { name: "Meena Yadav", type: "Worker", submitted: "02 Sep 2026", status: "Under Review" },
    { name: "Vikram Singh", type: "Landowner", submitted: "01 Sep 2026", status: "Pending" },
  ],
  "Worker Requests": [
    { name: "Arjun Patel", type: "Worker", submitted: "02 Sep 2026", status: "Pending" },
    { name: "Meena Yadav", type: "Worker", submitted: "02 Sep 2026", status: "Under Review" },
    { name: "Deepak Roy", type: "Worker", submitted: "01 Sep 2026", status: "Pending" },
    { name: "Sunita Rao", type: "Worker", submitted: "31 Aug 2026", status: "Approved" },
  ],
  "Document Submissions": [
    { name: "Ramesh Kumar", type: "Land Record", submitted: "03 Sep 2026", status: "Under Review" },
    { name: "Sita Devi", type: "Identity Proof", submitted: "03 Sep 2026", status: "Pending" },
    { name: "Vikram Singh", type: "Lease Document", submitted: "01 Sep 2026", status: "Pending" },
  ],
};

const requestTabs = Object.keys(requestData);

const complaints: Array<{
  title: string;
  ownerType: string;
  id: string;
  time: string;
  status: ComplaintStatus;
}> = [
  { title: "Payment not received", ownerType: "Landowner", id: "COMP-1023", time: "2 hours ago", status: "Open" },
  { title: "Land document not uploaded", ownerType: "Landowner", id: "COMP-1022", time: "5 hours ago", status: "Open" },
  { title: "Incorrect land details", ownerType: "Worker", id: "COMP-1021", time: "1 day ago", status: "In Progress" },
  { title: "Account activation issue", ownerType: "Landowner", id: "COMP-1020", time: "1 day ago", status: "Open" },
  { title: "Other management issue", ownerType: "Worker", id: "COMP-1019", time: "2 days ago", status: "Resolved" },
];

const announcements = [
  { title: "New guideline for land document verification", time: "2 days ago" },
  { title: "System maintenance on 6th Sep, 10 PM - 2 AM", time: "3 days ago" },
  { title: "Updated land record format released", time: "5 days ago" },
];

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white shadow-[0_8px_28px_rgba(15,46,34,0.045)] ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 px-5 pt-2.5">
      <h2 className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">{title}</h2>
      {action}
    </div>
  );
}

function ViewAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 rounded-lg px-1 py-2 text-[13px] font-semibold text-emerald-700 transition-colors hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      View All
      <LuArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  );
}

function StatCard({
  value,
  label,
  icon,
  cardClass,
  iconClass,
  accentClass,
  onClick,
}: {
  value: number;
  label: string;
  icon: ReactNode;
  cardClass: string;
  iconClass: string;
  accentClass: string;
  onClick: () => void;
}) {
  return (
    <article className={`group flex min-h-[128px] items-center gap-5 rounded-2xl border border-white/70 p-4 shadow-[0_7px_24px_rgba(15,46,34,0.035)] ${cardClass}`}>
      <div className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full text-[29px] ${iconClass}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[31px] font-extrabold leading-none tracking-[-0.04em] text-slate-950">{value}</p>
        <p className="mt-2 max-w-[165px] text-[14px] font-medium leading-5 text-slate-800">{label}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${label}`}
        className={`mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white/60 text-lg shadow-sm transition-transform hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${accentClass}`}
      >
        <LuArrowRight aria-hidden="true" />
      </button>
    </article>
  );
}

function StatusBadge({ status }: { status: RequestStatus | ComplaintStatus }) {
  const color = {
    Pending: "bg-amber-100 text-amber-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Open: "bg-rose-50 text-rose-500",
    "In Progress": "bg-blue-50 text-blue-600",
    Resolved: "bg-emerald-100 text-emerald-700",
  }[status];

  return (
    <span className={`inline-flex min-w-[72px] items-center justify-center rounded-md px-2.5 py-1.5 text-[12px] font-semibold ${color}`}>
      {status}
    </span>
  );
}

export default function AuthorityDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Landowner Requests");
  const [chartRange, setChartRange] = useState("Last 7 Days");

  const requestRoute = activeTab === "Worker Requests"
    ? "/Authority/authorityVerifiedWorkers"
    : activeTab === "Document Submissions"
      ? "/Authority/authorityLeaseDocuments"
      : "/Authority/authorityVerifiedLandowners";

  const quickActions = [
    {
      label: "Verify Landowner",
      icon: <LuUserRoundCheck aria-hidden="true" />,
      card: "bg-gradient-to-br from-emerald-50 to-[#eff9f4]",
      iconBg: "bg-emerald-100 text-emerald-700",
      route: "/Authority/authorityVerifiedLandowners",
    },
    {
      label: "Verify Worker",
      icon: <LuHardHat aria-hidden="true" />,
      card: "bg-gradient-to-br from-sky-50 to-[#eef8ff]",
      iconBg: "bg-sky-100 text-sky-600",
      route: "/Authority/authorityVerifiedWorkers",
    },
    {
      label: "Review Documents",
      icon: <LuFileText aria-hidden="true" />,
      card: "bg-gradient-to-br from-violet-50 to-[#f6f1ff]",
      iconBg: "bg-violet-100 text-violet-600",
      route: "/Authority/authorityLeaseDocuments",
    },
    {
      label: "View Complaints",
      icon: <LuTriangleAlert aria-hidden="true" />,
      card: "bg-gradient-to-br from-rose-50 to-[#fff1f3]",
      iconBg: "bg-rose-100 text-rose-500",
      route: "/Authority/authorityComplaints",
    },
    {
      label: "Generate Report",
      icon: <LuChartNoAxesColumnIncreasing aria-hidden="true" />,
      card: "bg-gradient-to-br from-amber-50 to-[#fff8e8]",
      iconBg: "bg-amber-100 text-amber-500",
      route: "print",
    },
  ];

  return (
    <div className="min-h-full bg-[#f4f7f7] px-4 py-5 text-slate-800 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1460px]">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-[27px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[30px]">
              Welcome, Anita Sharma
            </h1>
            <p className="mt-1 text-[15px] text-slate-500">
              Here&apos;s an overview of land management activities today.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 shadow-sm">
            <LuCalendarDays className="text-[18px] text-slate-500" aria-hidden="true" />
            <time dateTime="2026-09-04">Thursday, 4 September 2026</time>
          </div>
        </header>

        <section aria-label="Pending activity summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            value={28}
            label="Pending Landowner Verifications"
            icon={<LuUserRoundCheck aria-hidden="true" />}
            cardClass="bg-gradient-to-br from-[#e9f8ee] to-[#f1f9f4]"
            iconClass="bg-[#d2f2db] text-emerald-700"
            accentClass="border-emerald-100 text-emerald-700 focus-visible:outline-emerald-600"
            onClick={() => router.push("/Authority/authorityVerifiedLandowners")}
          />
          <StatCard
            value={16}
            label="Pending Worker Verifications"
            icon={<LuHardHat aria-hidden="true" />}
            cardClass="bg-gradient-to-br from-[#e8f6ff] to-[#f1f9ff]"
            iconClass="bg-[#d7edff] text-sky-600"
            accentClass="border-sky-100 text-sky-600 focus-visible:outline-sky-600"
            onClick={() => router.push("/Authority/authorityVerifiedWorkers")}
          />
          <StatCard
            value={12}
            label="Pending Land Document Reviews"
            icon={<LuFileText aria-hidden="true" />}
            cardClass="bg-gradient-to-br from-[#fff6dc] to-[#fffaf0]"
            iconClass="bg-[#ffedbd] text-amber-700"
            accentClass="border-amber-100 text-amber-700 focus-visible:outline-amber-600"
            onClick={() => router.push("/Authority/authorityLeaseDocuments")}
          />
          <StatCard
            value={5}
            label="Open Complaints"
            icon={<LuCircleAlert aria-hidden="true" />}
            cardClass="bg-gradient-to-br from-[#ffe9ec] to-[#fff3f4]"
            iconClass="bg-[#ffd3d8] text-rose-500"
            accentClass="border-rose-100 text-rose-500 focus-visible:outline-rose-500"
            onClick={() => router.push("/Authority/authorityComplaints")}
          />
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.42fr_0.98fr]">
          <SectionCard className="min-h-[307px] overflow-hidden">
            <SectionHeader
              title="Verification Trends"
              action={
                <label className="relative block">
                  <span className="sr-only">Chart date range</span>
                  <select
                    value={chartRange}
                    onChange={(event) => setChartRange(event.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-[12px] font-medium text-slate-600 shadow-sm outline-none transition focus:border-emerald-500"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 14 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                  <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                </label>
              }
            />

            <div className="flex items-center justify-center gap-6 pt-1 text-[12px] text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-800" />
                Landowners
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
                Workers
              </span>
            </div>

            <div className="px-4 pb-4 pt-4 sm:px-5">
              <div className="grid grid-cols-[28px_1fr] gap-2">
                <div className="flex h-[176px] flex-col justify-between text-right text-[11px] leading-none text-slate-500">
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
                <div>
                  <div
                    className="relative flex h-[176px] items-end justify-around border-b border-l border-slate-200 px-1 sm:px-3"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #dce4e7 1px, transparent 1px), linear-gradient(to right, #e7ecee 1px, transparent 1px)",
                      backgroundSize: "100% 25%, 14.285% 100%",
                    }}
                    role="img"
                    aria-label={`${chartRange} verification chart. Landowner verifications range from 20 to 32 and worker verifications range from 12 to 29.`}
                  >
                    {chartData.map((item) => (
                      <div key={item.date} className="flex h-full flex-1 items-end justify-center gap-0.5 sm:gap-1">
                        <div
                          title={`${item.date}: ${item.landowners} landowners`}
                          className="w-[9px] rounded-t-[2px] bg-emerald-800 sm:w-[16px]"
                          style={{ height: `${(item.landowners / 40) * 100}%` }}
                        />
                        <div
                          title={`${item.date}: ${item.workers} workers`}
                          className="w-[9px] rounded-t-[2px] bg-emerald-300 sm:w-[16px]"
                          style={{ height: `${(item.workers / 40) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 pt-2 text-center text-[10px] text-slate-500 sm:text-[11px]">
                    {chartData.map((item) => <span key={item.date}>{item.date}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="min-h-[307px] overflow-hidden">
            <SectionHeader title="Land Records Overview" />
            <div className="grid items-center gap-7 px-5 pb-5 pt-2 sm:grid-cols-[1fr_0.95fr] xl:gap-5">
              <div className="relative mx-auto h-[190px] w-[190px]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "conic-gradient(#08754f 0 68%, #8ddaa6 68% 88%, #c5cdd4 88% 96%, #f04452 96% 100%)" }}
                  role="img"
                  aria-label="Land records: 68 percent verified, 20 percent under review, 8 percent pending, and 4 percent rejected"
                />
                <div className="absolute inset-[34px] flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
                  <span className="text-[24px] font-extrabold tracking-[-0.04em] text-slate-950">1,240</span>
                  <span className="text-[12px] font-medium text-slate-600">Total Records</span>
                </div>
              </div>

              <dl className="space-y-4 text-[13px]">
                {[
                  ["Verified", "68%", "bg-emerald-700"],
                  ["Under Review", "20%", "bg-emerald-300"],
                  ["Pending", "8%", "bg-slate-300"],
                  ["Rejected", "4%", "bg-rose-500"],
                ].map(([label, value, dot]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${dot}`} />
                    <dt className="min-w-0 flex-1 font-medium text-slate-700">{label}</dt>
                    <dd className="font-semibold text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.32fr_0.98fr]">
          <SectionCard className="overflow-hidden">
            <SectionHeader title="Recent Requests" action={<ViewAllButton onClick={() => router.push(requestRoute)} />} />
            <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1">
              {requestTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap rounded-lg border-b-2 px-3 py-2 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 ${
                    activeTab === tab
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                      : "border-transparent bg-slate-50 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto px-3 pb-4">
              <table className="w-full min-w-[570px] border-separate border-spacing-0 text-left text-[12px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    {["Name", "Type", "Submitted On", "Status", "Action"].map((heading, index) => (
                      <th
                        key={heading}
                        className={`px-3 py-3 font-semibold ${index === 0 ? "rounded-l-lg" : ""} ${index === 4 ? "rounded-r-lg" : ""}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requestData[activeTab].map((request) => (
                    <tr key={`${request.name}-${request.submitted}`} className="text-slate-600">
                      <td className="border-b border-slate-100 px-3 py-[7px] font-semibold text-slate-800">{request.name}</td>
                      <td className="border-b border-slate-100 px-3 py-[7px]">{request.type}</td>
                      <td className="border-b border-slate-100 px-3 py-[7px]">{request.submitted}</td>
                      <td className="border-b border-slate-100 px-3 py-[7px]"><StatusBadge status={request.status} /></td>
                      <td className="border-b border-slate-100 px-3 py-[7px]">
                        <button
                          type="button"
                          onClick={() => router.push(requestRoute)}
                          className="min-w-[76px] rounded-md border border-emerald-600 px-3 py-1.5 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden">
            <SectionHeader title="Recent Complaints" action={<ViewAllButton onClick={() => router.push("/Authority/authorityComplaints")} />} />
            <div className="px-4 pb-3">
              {complaints.map((complaint) => (
                <button
                  key={complaint.id}
                  type="button"
                  onClick={() => router.push("/Authority/authorityComplaints")}
                  className="grid w-full grid-cols-[30px_minmax(0,1fr)_80px_88px] items-center gap-3 border-b border-slate-100 py-[10px] text-left transition-colors last:border-b-0 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-sm text-white">
                    <LuCircleAlert aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-bold text-slate-900">{complaint.title}</span>
                    <span className="mt-1 block truncate text-[11px] text-slate-500">{complaint.ownerType} &nbsp;•&nbsp; ID: {complaint.id}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">{complaint.time}</span>
                  <StatusBadge status={complaint.status} />
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-4 grid gap-4 pb-2 xl:grid-cols-[1.32fr_0.98fr]">
          <SectionCard className="overflow-hidden pb-4">
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3 px-4 pt-2 sm:grid-cols-3 lg:grid-cols-5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => action.route === "print" ? window.print() : router.push(action.route)}
                  className={`flex min-h-[116px] flex-col items-center justify-center gap-2 rounded-xl border border-white/80 p-3 text-center shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${action.card}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full text-[26px] ${action.iconBg}`}>
                    {action.icon}
                  </span>
                  <span className="max-w-[90px] text-[12px] font-bold leading-5 text-slate-800">{action.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="overflow-hidden pb-3">
            <SectionHeader title="Announcements" action={<ViewAllButton onClick={() => router.push("/Authority/authorityNotifications")} />} />
            <div className="px-5 pt-1">
              {announcements.map((announcement) => (
                <button
                  key={announcement.title}
                  type="button"
                  onClick={() => router.push("/Authority/authorityNotifications")}
                  className="grid w-full grid-cols-[26px_minmax(0,1fr)_70px] items-center gap-3 border-b border-slate-100 py-3 text-left last:border-b-0 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <LuMegaphone className="text-[20px] text-emerald-600" aria-hidden="true" />
                  <span className="truncate text-[12px] font-medium text-slate-800">{announcement.title}</span>
                  <span className="text-right text-[11px] text-slate-500">{announcement.time}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
