"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LuBriefcaseBusiness,
  LuBuilding2,
  LuCalendarDays,
  LuCheck,
  LuCircleHelp,
  LuClipboardList,
  LuHouse,
  LuLogOut,
  LuPartyPopper,
  LuUserRound,
} from "react-icons/lu";
import { clearAuth } from "@/features/auth";
import { clearUser } from "@/features/user";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import api from "@/utils/services";

const application = {
  company: "ABC Construction Pvt. Ltd.",
  approvedOn: "12 Mar 2025",
  approvedAt: "2025-03-12",
};

const navigation = [
  { label: "Home", href: "/", icon: LuHouse },
  {
    label: "My Application",
    href: "/pendingWorker",
    icon: LuClipboardList,
  },
  { label: "Profile", href: "/Worker/WorkerProfile", icon: LuUserRound },
  {
    label: "Support",
    href: "/Worker/WorkerRegisterComplaint",
    icon: LuCircleHelp,
  },
];

export default function PendingWorkerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      if (role) {
        const logoutUrl =
          role === "worker" ? "/worker/logout-worker" : `/${role}/logout`;

        await api.post(logoutUrl);
      }

      dispatch(clearUser());
      dispatch(clearAuth());
      router.replace("/login");
    } catch {
      setLogoutError("We couldn’t log you out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f0f5fb] p-4 font-sans text-[#1e293b] sm:p-8 lg:p-12">
      <a
        href="#application"
        className="sr-only rounded-lg bg-white px-4 py-3 text-blue-700 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:outline-2 focus:outline-blue-600"
      >
        Skip to application
      </a>

      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#dfe9f5] bg-white shadow-[0_12px_50px_-24px_rgba(54,85,127,0.18)] md:min-h-170 md:flex-row">
        <aside className="flex shrink-0 flex-col border-b border-[#e6eef8] bg-[#f6f9fd] p-4 sm:p-6 md:w-60 md:border-r md:border-b-0 md:px-4 md:py-8">
          <Link
            href="/"
            aria-label="WorkConnect home"
            className="flex w-fit items-center gap-3 rounded-md px-2 text-base font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:mx-1"
          >
            <LuBriefcaseBusiness
              aria-hidden="true"
              className="size-7 text-[#2182e6]"
              strokeWidth={2.5}
            />
            WorkConnect
          </Link>

          <nav aria-label="Main navigation" className="mt-6 md:mt-10">
            <ul className="grid grid-cols-2 gap-1.5 md:grid-cols-1 md:gap-2">
              {navigation.map(({ label, href, icon: Icon }) => {
                const isActive = href === "/pendingWorker";

                return (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isActive
                          ? "bg-[#e5efff] font-semibold text-[#2378d4]"
                          : "font-medium text-[#526175] hover:bg-[#eaf0f8] hover:text-[#263c59]"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`size-5 shrink-0 ${isActive ? "text-[#2378d4]" : "text-[#75869b]"}`}
                        strokeWidth={2}
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 border-t border-[#e6eef8] pt-3 md:mt-auto md:border-0 md:pt-12">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#526175] transition-colors outline-none hover:bg-[#eaf0f8] hover:text-[#263c59] focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-wait disabled:opacity-60"
            >
              <LuLogOut aria-hidden="true" className="size-5 text-[#75869b]" />
              {isLoggingOut ? "Logging out…" : "Log out"}
            </button>
            {logoutError && (
              <p role="alert" className="mt-2 px-3 text-xs leading-relaxed text-red-700">
                {logoutError}
              </p>
            )}
          </div>
        </aside>

        <main id="application" tabIndex={-1} className="min-w-0 flex-1 p-5 outline-none sm:p-8 lg:p-10">
          <header>
            <h1 className="text-2xl font-bold tracking-tight text-[#182332] sm:text-[28px]">
              My Worker Application
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#68778a]">
              Here is the current status of your request with the company.
            </p>
          </header>

          <section
            aria-labelledby="application-status"
            className="mt-7 rounded-2xl bg-[#f0faf5] p-5 sm:p-7 lg:px-8 lg:py-7"
          >
            <div className="text-center">
              <div className="mx-auto flex size-26 items-center justify-center rounded-full bg-[#c9eddb] sm:size-28">
                <div className="flex size-18 items-center justify-center rounded-full bg-linear-to-br from-[#13a56b] to-[#43bc7c] shadow-[0_3px_12px_rgba(24,158,100,0.12)] sm:size-19">
                  <LuCheck aria-hidden="true" className="size-11 text-white" strokeWidth={3} />
                </div>
              </div>

              <h2
                id="application-status"
                className="mt-6 text-xl font-bold tracking-tight text-[#087a4c] sm:text-2xl"
              >
                You are an Active Worker!
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5e6e7e]">
                Your request has been accepted by the company.
              </p>
            </div>

            <dl className="mt-6 space-y-5 border-t border-[#d9eee3] pt-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7f3ed]">
                  <LuBuilding2 aria-hidden="true" className="size-6 text-[#718394]" />
                </div>
                <div className="min-w-0">
                  <dt className="text-sm font-semibold text-[#394a59]">Company</dt>
                  <dd className="mt-1 text-sm leading-5 text-[#657587]">
                    {application.company}
                  </dd>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7f3ed]">
                  <LuCalendarDays aria-hidden="true" className="size-6 text-[#718394]" />
                </div>
                <div>
                  <dt className="text-sm font-semibold text-[#394a59]">Approved On</dt>
                  <dd className="mt-1 text-sm leading-5 text-[#657587]">
                    <time dateTime={application.approvedAt}>{application.approvedOn}</time>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-7 flex items-start gap-4 rounded-xl bg-[#dff3e8] p-5">
              <LuPartyPopper aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-[#149660]" />
              <div>
                <h3 className="text-sm font-bold text-[#196447]">Welcome to the team!</h3>
                <p className="mt-1 text-sm leading-6 text-[#5f7580]">
                  You can now access company projects and start working.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
