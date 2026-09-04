"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LuBellRing,
  LuCalendarCheck,
  LuCheckCheck,
  LuChevronRight,
  LuClipboardCheck,
  LuFileChartColumn,
  LuFileSearch,
  LuFileText,
  LuHistory,
  LuNotebookText,
  LuPaperclip,
  LuRefreshCw,
  LuSearchCheck,
  LuSend,
  LuShieldCheck,
  LuSparkles,
  LuSquarePen,
  LuUserRoundPlus,
} from "react-icons/lu";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  time: string;
};

const promptSuggestions = [
  {
    label: "Check pending verifications",
    prompt: "Show me all pending landowner verifications in my mandal.",
    response: "There are 42 pending landowner verifications. 12 are high priority and 8 are due within the next 3 days.",
    icon: <LuCalendarCheck aria-hidden="true" />,
  },
  {
    label: "Summarize complaints",
    prompt: "Summarize the currently open complaints.",
    response: "There are 18 open complaints. Five are escalated, seven concern land records, and six concern worker payments.",
    icon: <LuNotebookText aria-hidden="true" />,
  },
  {
    label: "Find worker request",
    prompt: "Find the latest pending worker registration requests.",
    response: "I found 16 pending worker requests. Four were submitted today and three require additional identity documents.",
    icon: <LuUserRoundPlus aria-hidden="true" />,
  },
  {
    label: "Draft notice",
    prompt: "Help me draft a notice for pending document submissions.",
    response: "I can draft that notice. Please specify the submission deadline and the village or group it should be addressed to.",
    icon: <LuSquarePen aria-hidden="true" />,
  },
];

const assistantTools = [
  {
    title: "Land Verification Lookup",
    description: "Search and verify landowners",
    icon: <LuSearchCheck aria-hidden="true" />,
    iconClass: "bg-indigo-100 text-indigo-600",
    route: "/Authority/authorityVerifiedLandowners",
  },
  {
    title: "Worker Verification Lookup",
    description: "Find worker registration requests",
    icon: <LuCalendarCheck aria-hidden="true" />,
    iconClass: "bg-blue-100 text-blue-600",
    route: "/Authority/authorityVerifiedWorkers",
  },
  {
    title: "Complaint Intelligence",
    description: "Analyze and summarize complaints",
    icon: <LuFileChartColumn aria-hidden="true" />,
    iconClass: "bg-red-100 text-red-500",
    route: "/Authority/authorityComplaints",
  },
  {
    title: "Document Review",
    description: "Review and extract document info",
    icon: <LuFileSearch aria-hidden="true" />,
    iconClass: "bg-violet-100 text-violet-600",
    route: "/Authority/authorityLeaseDocuments",
  },
  {
    title: "Draft Notice Generator",
    description: "Create notices and communications",
    icon: <LuClipboardCheck aria-hidden="true" />,
    iconClass: "bg-amber-100 text-amber-600",
    route: "/Authority/authorityNotifications",
  },
];

const recentInsights = [
  {
    title: "Pending Verifications",
    lines: ["42 pending verifications", "12 high priority"],
    time: "Just now",
    icon: <LuSearchCheck aria-hidden="true" />,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Open Complaints",
    lines: ["18 open complaints", "5 escalated"],
    time: "10 min ago",
    icon: <LuBellRing aria-hidden="true" />,
    iconClass: "bg-red-100 text-red-500",
  },
  {
    title: "Document Reviews",
    lines: ["7 documents pending review", "3 require attention"],
    time: "1 hr ago",
    icon: <LuFileText aria-hidden="true" />,
    iconClass: "bg-blue-100 text-blue-600",
  },
];

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-[0_7px_24px_rgba(15,46,34,0.045)] ${className}`}>
      {children}
    </section>
  );
}

function AssistantAvatar() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xl text-white shadow-sm">
      <LuSparkles aria-hidden="true" />
    </span>
  );
}

function UserBubble({ children, time }: { children: ReactNode; time: string }) {
  return (
    <div className="flex justify-end">
      <div className="w-fit max-w-[72%] rounded-2xl rounded-br-sm bg-gradient-to-br from-[#e8f8ed] to-[#dff3e6] px-5 py-4 text-[14px] leading-6 text-slate-800 shadow-[0_2px_8px_rgba(15,78,49,0.04)]">
        <div>{children}</div>
        <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-slate-500">
          {time}
          <LuCheckCheck className="text-base text-emerald-700" aria-label="Delivered and read" />
        </div>
      </div>
    </div>
  );
}

function AssistantBubble({ children, time }: { children: ReactNode; time: string }) {
  return (
    <div className="flex items-start gap-4">
      <AssistantAvatar />
      <div className="w-fit max-w-[76%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-4 text-[14px] leading-6 text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div>{children}</div>
        <div className="mt-2 text-right text-[10px] text-slate-500">{time}</div>
      </div>
    </div>
  );
}

function SectionHeading({ icon, children, action }: { icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
      <h2 className="flex items-center gap-2.5 text-[17px] font-bold text-slate-900">
        <span className="text-xl text-emerald-700">{icon}</span>
        {children}
      </h2>
      {action}
    </div>
  );
}

export default function AuthorityChat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>([]);
  const [lastUpdated, setLastUpdated] = useState("10:24 AM");

  function getCurrentTime() {
    return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date());
  }

  function addConversation(prompt: string, response: string) {
    const time = getCurrentTime();
    setSentMessages((current) => [
      ...current,
      { role: "user", text: prompt, time },
      { role: "assistant", text: response, time },
    ]);
  }

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    addConversation(
      trimmedMessage,
      "I’ve received your request. I can help search records, review verification queues, summarize complaints, or draft an official notice.",
    );
    setMessage("");
  }

  function refreshStatus() {
    setLastUpdated(getCurrentTime());
  }

  return (
    <div className="min-h-full bg-[#f6f9f8] px-3 py-4 text-slate-800 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1460px]">
        <header className="relative mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="relative mt-1 flex h-10 w-10 items-center justify-center text-[34px] text-emerald-700">
              <LuSparkles aria-hidden="true" />
              <LuSparkles className="absolute -right-1 -top-1 text-xs" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-[27px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[30px]">AI Assistant Chat</h1>
              <p className="mt-1 text-[14px] text-slate-500">Your intelligent assistant for land management and citizen services</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHistoryOpen((current) => !current)}
            aria-expanded={historyOpen}
            className="inline-flex h-12 w-fit items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 text-[14px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <LuHistory className="text-xl text-slate-600" aria-hidden="true" />
            Chat History
          </button>

          {historyOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-[300px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Recent chats</p>
              {[
                ["Pending landowner cases", "Today, 10:24 AM"],
                ["Irrigation complaint summary", "Yesterday, 4:10 PM"],
                ["Worker documents review", "2 Sep, 11:30 AM"],
              ].map(([title, time]) => (
                <button key={title} type="button" onClick={() => setHistoryOpen(false)} className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-slate-50">
                  <span className="block text-[12px] font-semibold text-slate-700">{title}</span>
                  <span className="mt-1 block text-[10px] text-slate-400">{time}</span>
                </button>
              ))}
            </div>
          )}
        </header>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="flex h-[calc(100dvh-11.5rem)] min-h-[780px] flex-col overflow-hidden">
            <div className="grid shrink-0 gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {promptSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => addConversation(suggestion.prompt, suggestion.response)}
                  className="flex min-h-14 items-center justify-center gap-3 rounded-xl border border-emerald-100 bg-white px-3 text-[12px] font-semibold text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <span className="text-[22px]">{suggestion.icon}</span>
                  <span className="text-left leading-4">{suggestion.label}</span>
                </button>
              ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] sm:px-6">
              <div className="mx-auto w-full max-w-[900px] space-y-4">
                <div className="flex items-center gap-5 py-1 text-[12px] text-slate-400">
                  <span className="h-px flex-1 bg-slate-100" />
                  Today
                  <span className="h-px flex-1 bg-slate-100" />
                </div>

                <UserBubble time="10:24 AM">Show me all pending landowner verifications in my mandal.</UserBubble>

                <AssistantBubble time="10:24 AM">
                  <p>Here are the pending landowner verifications in Rampur Mandal:</p>
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    {[
                      ["Total Pending Verifications", "42", "text-slate-700"],
                      ["High Priority (> 7 days)", "12", "text-red-500"],
                      ["Due in next 3 days", "8", "text-amber-500"],
                      ["New Today", "5", "text-sky-600"],
                    ].map(([label, value, color]) => (
                      <div key={label} className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 last:border-b-0">
                        <span className="text-[12px] font-medium text-slate-600">{label}</span>
                        <span className={`text-[13px] font-bold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3">Would you like me to show the list or apply any filters?</p>
                </AssistantBubble>

                <UserBubble time="10:25 AM">Yes, show high priority cases first.</UserBubble>

                <AssistantBubble time="10:25 AM">
                  <p>Here are the high priority pending verifications:</p>
                  <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[520px] text-left text-[11px]">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Landowner</th>
                          <th className="px-3 py-2 font-semibold">Survey No.</th>
                          <th className="px-3 py-2 font-semibold">Village</th>
                          <th className="px-3 py-2 font-semibold">Pending Since</th>
                          <th className="px-3 py-2 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Ramesh Babu", "123/2B", "Kothapally", "12 days"],
                          ["Lakshmi Devi", "45/1A", "Rampur", "10 days"],
                          ["Mallaiah", "98/3", "Bheemkunta", "9 days"],
                        ].map(([name, survey, village, pending]) => (
                          <tr key={name} className="border-t border-slate-200">
                            <td className="px-3 py-2 font-medium text-slate-700">{name}</td>
                            <td className="px-3 py-2">{survey}</td>
                            <td className="px-3 py-2">{village}</td>
                            <td className="px-3 py-2 font-semibold text-red-500">{pending}</td>
                            <td className="px-3 py-1.5">
                              <button
                                type="button"
                                onClick={() => router.push("/Authority/authorityVerifiedLandowners")}
                                className="rounded-md border border-slate-200 px-4 py-1 font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/Authority/authorityVerifiedLandowners")}
                    className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    View all 12 high priority cases
                    <LuChevronRight aria-hidden="true" />
                  </button>
                </AssistantBubble>

                {sentMessages.map((chatMessage, index) => chatMessage.role === "user" ? (
                  <UserBubble key={`${chatMessage.time}-${index}`} time={chatMessage.time}>{chatMessage.text}</UserBubble>
                ) : (
                  <AssistantBubble key={`${chatMessage.time}-${index}`} time={chatMessage.time}>{chatMessage.text}</AssistantBubble>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="flex h-[70px] shrink-0 items-center gap-3 border-t border-slate-100 bg-white px-4">
              <label className="cursor-pointer rounded-lg p-2 text-[22px] text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Attach a file">
                <LuPaperclip aria-hidden="true" />
                <input type="file" className="sr-only" />
              </label>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
                className="min-w-0 flex-1 bg-transparent px-1 text-[14px] outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xl text-white shadow-md shadow-emerald-900/15 transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <LuSend aria-hidden="true" />
              </button>
            </form>
          </Card>

          <aside className="space-y-5" aria-label="AI assistant information">
            <Card className="overflow-hidden pb-3">
              <SectionHeading icon={<LuClipboardCheck aria-hidden="true" />}>Assistant Tools</SectionHeading>
              <div className="px-4">
                {assistantTools.map((tool) => (
                  <button
                    key={tool.title}
                    type="button"
                    onClick={() => router.push(tool.route)}
                    className="group grid w-full grid-cols-[48px_minmax(0,1fr)_18px] items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-[22px] ${tool.iconClass}`}>{tool.icon}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-bold text-slate-800">{tool.title}</span>
                      <span className="mt-1 block truncate text-[11px] text-slate-500">{tool.description}</span>
                    </span>
                    <LuChevronRight className="text-lg text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden pb-3">
              <SectionHeading
                icon={<LuFileChartColumn aria-hidden="true" />}
                action={
                  <button type="button" onClick={() => router.push("/Authority/authorityDashboard")} className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-900">
                    View all
                  </button>
                }
              >
                Recent Insights
              </SectionHeading>
              <div className="px-4">
                {recentInsights.map((insight) => (
                  <div key={insight.title} className="grid grid-cols-[48px_minmax(0,1fr)_60px] items-start gap-3 rounded-xl px-1 py-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-[21px] ${insight.iconClass}`}>{insight.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-slate-800">{insight.title}</p>
                      {insight.lines.map((line) => <p key={line} className="mt-0.5 truncate text-[11px] text-slate-500">{line}</p>)}
                    </div>
                    <span className="pt-0.5 text-right text-[10px] text-slate-500">{insight.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden px-5 pb-4">
              <div className="flex items-center gap-2.5 pb-4 pt-5">
                <LuShieldCheck className="text-[22px] text-emerald-700" aria-hidden="true" />
                <h2 className="text-[17px] font-bold text-slate-900">System Status</h2>
              </div>
              <dl className="space-y-3 text-[11px]">
                {["AI Service", "Document OCR", "Data Sync"].map((service) => (
                  <div key={service} className="flex items-center justify-between">
                    <dt className="font-medium text-slate-600">{service}</dt>
                    <dd className="rounded-lg bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-700">Operational</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                <span>Last updated: {lastUpdated}</span>
                <button type="button" onClick={refreshStatus} aria-label="Refresh system status" className="rounded-md p-1.5 text-base text-slate-500 hover:bg-slate-100 hover:text-emerald-700">
                  <LuRefreshCw aria-hidden="true" />
                </button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
