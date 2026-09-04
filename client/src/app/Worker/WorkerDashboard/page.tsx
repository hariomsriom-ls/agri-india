"use client";

import { useState, type ReactNode } from "react";
import {LuArrowRight,LuCalendar,LuCalendarDays,LuCircleCheck,LuCircleCheckBig,LuFilePlus2,LuFileText,
  LuGraduationCap,LuHeadphones,LuIndianRupee,LuLandPlot,LuMail,LuPhone,LuShieldCheck,LuSprout, LuTractor, 
  LuUserRound,LuX,
} from "@/components/ui/icons";

type Task = {
  title: string;
  location: string;
  date: string;
};

const plots = [
  ["PLT-003", "Bhawanipur", "3.0", "Mohan Singh"],
  ["PLT-008", "Rampur", "2.2", "Kavita Singh"],
  ["PLT-011", "Kalyanpur", "1.5", "Rajesh Kumar"],
  ["PLT-015", "Devganj", "2.8", "Anita Sharma"],
  ["PLT-021", "Rampur", "1.0", "Sita Devi"],
];

const currentTasks: Task[] = [
  { title: "Land Preparation - PLT-003", location: "Bhawanipur", date: "20 Aug 2025" },
  { title: "Irrigation Check - PLT-008", location: "Rampur", date: "22 Aug 2025" },
  { title: "Fertilizer Application - PLT-011", location: "Kalyanpur", date: "25 Aug 2025" },
  { title: "Weed Removal - PLT-015", location: "Devganj", date: "28 Aug 2025" },
];

const completedTasks: Task[] = [
  { title: "Soil Testing - PLT-003", location: "Bhawanipur", date: "12 Aug 2025" },
  { title: "Boundary Inspection - PLT-008", location: "Rampur", date: "09 Aug 2025" },
  { title: "Seed Bed Preparation - PLT-011", location: "Kalyanpur", date: "05 Aug 2025" },
  { title: "Equipment Check - PLT-015", location: "Devganj", date: "01 Aug 2025" },
];

const payments = [
  ["01 Aug 2025", "PLT-003", "Mohan Singh", "8,000"],
  ["15 Jul 2025", "PLT-008", "Kavita Singh", "6,500"],
  ["01 Jul 2025", "PLT-011", "Rajesh Kumar", "7,000"],
  ["15 Jun 2025", "PLT-015", "Anita Sharma", "5,000"],
];

const schemes = [
  { name: "PM-KISAN Samman Nidhi", detail: "Financial support to farmers", icon: <LuSprout />, color: "bg-emerald-100 text-emerald-600" },
  { name: "Crop Insurance Scheme", detail: "Insurance against crop loss", icon: <LuShieldCheck />, color: "bg-blue-100 text-blue-600" },
  { name: "Agricultural Equipment Subsidy", detail: "Subsidy for farm equipment", icon: <LuTractor />, color: "bg-orange-100 text-orange-600" },
];

const deadlines = [
  ["PLT-003 Lease Renewal", "31 Dec 2025"],
  ["PLT-008 Lease Renewal", "30 Sep 2025"],
  ["Submit Work Report", "15 Sep 2025"],
  ["Scheme Application Deadline", "30 Aug 2025"],
];

function PanelTitle({ title, onViewAll }: { title: string; onViewAll: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <button type="button" onClick={onViewAll} className="flex items-center gap-1 text-xs font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition hover:text-emerald-900">
        View All <LuArrowRight />
      </button>
    </div>
  );
}

function MetricCard({ icon, label, value, note, iconClass, cardClass }: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  iconClass: string;
  cardClass: string;
}) {
  return (
    <section className={`flex min-h-28 items-center gap-5 rounded-xl border p-5 shadow-sm ${cardClass}`}>
      <div className={`grid size-16 shrink-0 place-items-center rounded-xl text-[34px] ${iconClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-950 sm:text-[28px]">{value}</p>
        <p className="mt-2 text-xs font-semibold text-emerald-600">{note}</p>
      </div>
    </section>
  );
}

function QuickAction({ icon, label, className, onClick }: {
  icon: ReactNode;
  label: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm ${className}`}>
      <span className="text-2xl">{icon}</span>
      {label}
    </button>
  );
}

export default function WorkerDashboard() {
  const [taskTab, setTaskTab] = useState<"current" | "completed">("current");
  const [appliedSchemes, setAppliedSchemes] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const tasks = taskTab === "current" ? currentTasks : completedTasks;

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function applyForScheme(schemeName: string) {
    if (appliedSchemes.includes(schemeName)) return;
    setAppliedSchemes((current) => [...current, schemeName]);
    showNotice(`Application started for ${schemeName}.`);
  }

  return (
    <div className="min-h-full bg-[#f5f8f9] px-2 py-4 text-slate-700 sm:px-4 lg:px-5">
      {notice && (
        <div className="fixed right-6 top-20 z-50 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>
      )}

      <div className="mx-auto max-w-[1480px]">
        <section
          className="relative min-h-44 overflow-hidden rounded-xl bg-cover bg-center shadow-sm"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1800&q=85')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#e4eadc]/95 via-[#dfe9d8]/55 to-[#002f20]/50" />
          <div className="relative flex min-h-44 items-center justify-between gap-6 px-7 py-6 sm:px-11">
            <div className="max-w-xl text-slate-950">
              <p className="text-xl font-semibold sm:text-2xl">Good Morning,</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-[38px]">Ramesh Kumar!</h1>
              <p className="mt-2 text-base font-medium sm:text-lg">Your hard work grows a better tomorrow.</p>
              <LuSprout className="mt-2 text-3xl text-emerald-700" />
            </div>
            <blockquote className="hidden max-w-48 border-l-4 border-emerald-400 pl-5 text-lg font-medium italic leading-relaxed text-white drop-shadow md:block">
              “Agriculture<br />feeds today,<br />for a greener<br />tomorrow.”
            </blockquote>
          </div>
        </section>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<LuLandPlot />} label="Assigned Plots" value="5" note="↑ 1 new this month" iconClass="bg-emerald-100 text-emerald-600" cardClass="border-emerald-100 bg-gradient-to-r from-emerald-50 to-white" />
          <MetricCard icon={<LuCircleCheckBig />} label="Tasks Completed" value="12" note="↑ 20% from last month" iconClass="bg-blue-100 text-blue-500" cardClass="border-blue-100 bg-gradient-to-r from-blue-50 to-white" />
          <MetricCard icon={<LuIndianRupee />} label="Total Earnings" value="₹ 28,500" note="↑ 12% from last month" iconClass="bg-orange-100 text-orange-600" cardClass="border-orange-100 bg-gradient-to-r from-orange-50 to-white" />
          <MetricCard icon={<LuCalendarDays />} label="Active Leases" value="3" note="2 ending this year" iconClass="bg-violet-100 text-violet-600" cardClass="border-violet-100 bg-gradient-to-r from-violet-50 to-white" />
        </div>

        <div className="mt-3 grid items-start gap-3 xl:grid-cols-[minmax(0,2.95fr)_minmax(310px,1fr)]">
          <main className="grid gap-3 lg:grid-cols-[1.45fr_0.9fr]">
            <section className="min-h-[310px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PanelTitle title="My Plots" onViewAll={() => showNotice("Showing all assigned plots.")} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[610px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600"><tr>{["Plot ID", "Location", "Area (Acre)", "Landowner", "Status"].map((heading) => <th key={heading} className="px-2 py-3 font-semibold">{heading}</th>)}</tr></thead>
                  <tbody>{plots.map((plot) => <tr key={plot[0]} className="border-b border-slate-100 transition hover:bg-slate-50/70"><td className="px-2 py-2.5 font-semibold text-slate-700">{plot[0]}</td><td className="px-2 py-2.5">{plot[1]}</td><td className="px-2 py-2.5">{plot[2]}</td><td className="px-2 py-2.5">{plot[3]}</td><td className="px-2 py-2.5"><span className="rounded-md bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">Active</span></td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section className="min-h-[310px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PanelTitle title="Task Overview" onViewAll={() => showNotice("Showing your complete task list.")} />
              <div className="grid grid-cols-2 border-b border-slate-200 text-center text-xs">
                <button type="button" onClick={() => setTaskTab("current")} className={`border-b-2 py-2 font-semibold transition ${taskTab === "current" ? "border-emerald-700 text-emerald-700" : "border-transparent text-slate-500"}`}>Current Tasks</button>
                <button type="button" onClick={() => setTaskTab("completed")} className={`border-b-2 py-2 font-semibold transition ${taskTab === "completed" ? "border-emerald-700 text-emerald-700" : "border-transparent text-slate-500"}`}>Completed</button>
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <div key={task.title} className="grid grid-cols-[26px_1fr_auto] items-center gap-2 py-3 text-xs">
                    <LuCircleCheck className={`text-xl ${taskTab === "completed" ? "fill-emerald-600 text-emerald-600" : "text-emerald-600"}`} />
                    <div><p className="font-semibold text-slate-700">{task.title}</p><p className="mt-0.5 text-slate-500">{task.location}</p></div>
                    <div className="text-right"><p className="text-slate-500">{taskTab === "completed" ? "Done" : "Due"}</p><p className={`mt-0.5 font-semibold ${taskTab === "completed" ? "text-emerald-600" : "text-red-500"}`}>{task.date}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PanelTitle title="Recent Payments" onViewAll={() => showNotice("Showing your full payment history.")} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600"><tr>{["Date", "Plot ID", "Landowner", "Amount (₹)", "Status"].map((heading) => <th key={heading} className="px-2 py-2.5 font-semibold">{heading}</th>)}</tr></thead>
                  <tbody>{payments.map((payment) => <tr key={`${payment[0]}-${payment[1]}`} className="border-b border-slate-100">{payment.map((value, index) => <td key={`${value}-${index}`} className={`px-2 py-2.5 ${index === 3 ? "font-semibold" : ""}`}>{value}</td>)}<td className="px-2 py-2.5"><span className="rounded-md bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">Paid</span></td></tr>)}</tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PanelTitle title="Government Schemes" onViewAll={() => showNotice("Showing all available government schemes.")} />
              <div className="space-y-2">
                {schemes.map((scheme) => {
                  const applied = appliedSchemes.includes(scheme.name);
                  return (
                    <div key={scheme.name} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg p-1 transition hover:bg-slate-50">
                      <div className={`grid size-11 place-items-center rounded-lg text-2xl ${scheme.color}`}>{scheme.icon}</div>
                      <div><p className="text-sm font-semibold text-slate-800">{scheme.name}</p><p className="mt-0.5 text-xs text-slate-500">{scheme.detail}</p></div>
                      <button type="button" onClick={() => applyForScheme(scheme.name)} disabled={applied} className={`min-w-20 rounded-md px-4 py-2 text-xs font-semibold text-white transition ${applied ? "cursor-default bg-emerald-400" : "bg-emerald-700 hover:bg-emerald-800"}`}>{applied ? "Applied" : "Apply"}</button>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          <aside className="space-y-3">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-emerald-800 text-2xl text-white">R</div>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900">Ramesh Kumar</h2>
                  <p className="mt-1 text-xs text-slate-500">Worker ID: WRK-2024-015</p>
                  <p className="mt-2 flex items-center gap-2 text-xs"><LuPhone /> 98765 43210</p>
                  <p className="mt-2 flex items-center gap-2 truncate text-xs"><LuMail /> ramesh.kumar@example.com</p>
                </div>
              </div>
              <button type="button" onClick={() => setProfileOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">View Profile <LuArrowRight /></button>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-slate-900">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                <QuickAction icon={<LuFileText />} label="View My Plots" className="bg-emerald-50 text-emerald-700" onClick={() => showNotice("Opening your assigned plots.")} />
                <QuickAction icon={<LuFilePlus2 />} label="Apply for Scheme" className="bg-blue-50 text-blue-600" onClick={() => showNotice("Choose a scheme from the dashboard.")} />
                <QuickAction icon={<LuGraduationCap />} label="Training Resources" className="bg-violet-50 text-violet-700" onClick={() => showNotice("Opening training resources.")} />
                <QuickAction icon={<LuHeadphones />} label="Raise a Request" className="bg-orange-50 text-orange-600" onClick={() => showNotice("Request form opened.")} />
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PanelTitle title="Upcoming Deadlines" onViewAll={() => showNotice("Showing all upcoming deadlines.")} />
              <div className="divide-y divide-slate-100">
                {deadlines.map(([title, date]) => (
                  <div key={title} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 py-2.5 text-xs">
                    <LuCalendar className="text-base text-slate-600" />
                    <p className="font-medium text-slate-600">{title}</p>
                    <p className="whitespace-nowrap text-slate-500">{date}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <footer className="relative mt-3 overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 px-7 py-5">
          <div className="flex items-center justify-between gap-6">
            <p className="flex items-center gap-4 text-sm font-bold text-emerald-950 sm:text-base"><LuSprout className="text-4xl text-emerald-600" /> Skilled hands. Sustainable lands. Stronger communities.</p>
            <div className="hidden items-center gap-5 border-l-2 border-emerald-400 pl-5 text-sm text-emerald-800 md:flex"><LuTractor className="text-4xl text-emerald-600" /><p>Together<br />for a better tomorrow</p></div>
          </div>
        </footer>
      </div>

      {profileOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[2px]" onMouseDown={() => setProfileOpen(false)}>
          <section role="dialog" aria-modal="true" aria-label="Worker profile" className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4"><h2 className="text-xl font-bold text-slate-950">Worker Profile</h2><button type="button" onClick={() => setProfileOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close profile"><LuX className="text-xl" /></button></div>
            <div className="p-6">
              <div className="mb-5 flex flex-col items-center"><div className="grid size-20 place-items-center rounded-full bg-emerald-800 text-3xl font-semibold text-white"><LuUserRound /></div><h3 className="mt-3 text-xl font-bold text-slate-900">Ramesh Kumar</h3><p className="mt-1 text-sm text-slate-500">Agricultural Field Worker</p></div>
              <dl className="divide-y divide-slate-100 text-sm">
                {[["Worker ID", "WRK-2024-015"], ["Mobile", "98765 43210"], ["Email", "ramesh.kumar@example.com"], ["Assigned Plots", "5 active plots"], ["Completed Tasks", "12 this month"]].map(([label, value]) => <div key={label} className="flex justify-between gap-5 py-3"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-800">{value}</dd></div>)}
              </dl>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
