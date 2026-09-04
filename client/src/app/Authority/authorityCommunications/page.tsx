"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LuArrowLeft,
  LuCalendarClock,
  LuCheckCheck,
  LuChevronDown,
  LuCircleCheck,
  LuClipboardCheck,
  LuDownload,
  LuEllipsisVertical,
  LuFileSpreadsheet,
  LuFileText,
  LuImage,
  LuMapPinned,
  LuPaperclip,
  LuSearch,
  LuSend,
  LuSlidersHorizontal,
  LuSmile,
  LuUserRound,
} from "react-icons/lu";

type ConversationFilter = "All" | "Unread" | "Priority";

type Conversation = {
  initials: string;
  name: string;
  status: "Online" | "Offline";
  time: string;
  preview: string;
  unread?: number;
  priority?: boolean;
  avatarClass: string;
  workerId: string;
  village: string;
};

const conversations: Conversation[] = [
  {
    initials: "RK",
    name: "Ramesh Kumar",
    status: "Online",
    time: "2m ago",
    preview: "Documents uploaded as requested.",
    unread: 2,
    priority: true,
    avatarClass: "bg-emerald-100 text-emerald-800",
    workerId: "W-AGRI-10435",
    village: "Bhairavwadi",
  },
  {
    initials: "SP",
    name: "Sita Devi",
    status: "Online",
    time: "15m ago",
    preview: "Field update: Crop sowing completed.",
    unread: 1,
    avatarClass: "bg-emerald-50 text-emerald-800",
    workerId: "W-AGRI-10462",
    village: "Khandala",
  },
  {
    initials: "MG",
    name: "Mahesh Giri",
    status: "Offline",
    time: "1h ago",
    preview: "Complaint resolved. Thank you.",
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10398",
    village: "Neral",
  },
  {
    initials: "PW",
    name: "Pooja Waghmare",
    status: "Online",
    time: "2h ago",
    preview: "Verification pending for Plot 45.",
    unread: 3,
    priority: true,
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10504",
    village: "Karjat",
  },
  {
    initials: "TB",
    name: "Tukaram Bende",
    status: "Offline",
    time: "3h ago",
    preview: "Requesting clarification on boundary...",
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10356",
    village: "Chowk",
  },
  {
    initials: "AS",
    name: "Anita Sawant",
    status: "Offline",
    time: "5h ago",
    preview: "Shared new document.",
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10287",
    village: "Kalamb",
  },
  {
    initials: "DK",
    name: "Dinesh Kale",
    status: "Online",
    time: "1d ago",
    preview: "Inspection date confirmed.",
    avatarClass: "bg-emerald-50 text-emerald-800",
    workerId: "W-AGRI-10481",
    village: "Shelu",
  },
  {
    initials: "HB",
    name: "Harish Bade",
    status: "Offline",
    time: "1d ago",
    preview: "Complaint status update request.",
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10192",
    village: "Vangani",
  },
  {
    initials: "SL",
    name: "Sanjay Lokhande",
    status: "Online",
    time: "2d ago",
    preview: "Land record has been submitted.",
    unread: 1,
    avatarClass: "bg-emerald-50 text-emerald-800",
    workerId: "W-AGRI-10148",
    village: "Badlapur",
  },
  {
    initials: "NP",
    name: "Neha Patil",
    status: "Offline",
    time: "2d ago",
    preview: "Visit notes are ready for review.",
    priority: true,
    avatarClass: "bg-slate-100 text-slate-700",
    workerId: "W-AGRI-10093",
    village: "Ambernath",
  },
];

const sharedDocuments = [
  {
    name: "7_12_Extract.pdf",
    meta: "Uploaded on May 20, 2025",
    size: "1.2 MB",
    icon: <LuFileText aria-hidden="true" />,
    iconClass: "bg-red-500 text-white",
  },
  {
    name: "Land_Mutation_2024.pdf",
    meta: "Uploaded on May 10, 2025",
    size: "820 KB",
    icon: <LuFileSpreadsheet aria-hidden="true" />,
    iconClass: "bg-emerald-600 text-white",
  },
  {
    name: "field_update_1.jpg",
    meta: "Uploaded on May 20, 2025",
    size: "2.4 MB",
    icon: <LuImage aria-hidden="true" />,
    iconClass: "bg-blue-500 text-white",
  },
];

function Avatar({
  initials,
  className,
  large = false,
}: {
  initials: string;
  className: string;
  large?: boolean;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${large ? "h-14 w-14 text-base" : "h-9 w-9 text-xs"} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function OnlineStatus({ status }: { status: "Online" | "Offline" }) {
  const online = status === "Online";

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${online ? "text-emerald-700" : "text-slate-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-600" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function DateSeparator({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center py-1">
      <span className="rounded-full bg-white px-4 py-2 text-[10px] font-semibold text-slate-600 shadow-[0_1px_8px_rgba(15,23,42,0.08)]">
        {children}
      </span>
    </div>
  );
}

function AttachmentCard({ type }: { type: "pdf" | "image" }) {
  const isPdf = type === "pdf";

  return (
    <div className="mt-3 flex min-w-[235px] items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <span className={`flex h-8 w-8 items-center justify-center rounded text-base text-white ${isPdf ? "bg-red-500" : "bg-blue-500"}`}>
        {isPdf ? <LuFileText aria-hidden="true" /> : <LuImage aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold text-slate-800">
          {isPdf ? "7_12_Extract.pdf" : "field_update_1.jpg"}
        </span>
        <span className="mt-0.5 block text-[10px] text-slate-500">
          {isPdf ? "1.2 MB • PDF" : "2.4 MB • JPG"}
        </span>
      </span>
      {isPdf && (
        <button type="button" aria-label="Download 7/12 extract" className="rounded p-1.5 text-slate-600 hover:bg-slate-100">
          <LuDownload aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function IncomingMessage({ children, time }: { children: ReactNode; time: string }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar initials="RK" className="bg-emerald-100 text-emerald-800" />
      <div className="max-w-[72%] rounded-xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <div className="text-[12px] leading-[1.55] text-slate-800">{children}</div>
        <div className="mt-1 text-right text-[9px] text-slate-500">{time}</div>
      </div>
    </div>
  );
}

function OutgoingMessage({ children, time }: { children: ReactNode; time: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-xl rounded-tr-sm bg-[#e6f5eb] px-4 py-3 shadow-[0_2px_8px_rgba(15,78,49,0.035)]">
        <div className="text-[12px] leading-[1.55] text-slate-800">{children}</div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-500">
          {time}
          <LuCheckCheck className="text-xs text-emerald-700" aria-label="Delivered and read" />
        </div>
      </div>
    </div>
  );
}

export default function AuthorityCommunications() {
  const router = useRouter();
  const [activeConversation, setActiveConversation] = useState("Ramesh Kumar");
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("All");
  const [detailsTab, setDetailsTab] = useState<"Details" | "Activity">("Details");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Array<{ text: string; time: string }>>([]);

  const selected = conversations.find((conversation) => conversation.name === activeConversation) ?? conversations[0];

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = `${conversation.name} ${conversation.preview}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All"
      || (activeFilter === "Unread" && Boolean(conversation.unread))
      || (activeFilter === "Priority" && Boolean(conversation.priority));

    return matchesSearch && matchesFilter;
  });

  const visibleConversations = showAll ? filteredConversations : filteredConversations.slice(0, 8);

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setSentMessages((current) => [
      ...current,
      {
        text: trimmedMessage,
        time: new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      },
    ]);
    setMessage("");
  }

  return (
    <div className="h-[87.5dvh] min-h-[720px] overflow-x-auto bg-[#f8faf9] text-slate-800">
      <div className="grid h-full min-w-[1030px] grid-cols-[260px_minmax(440px,1fr)_320px] overflow-hidden border-y border-slate-200 bg-white">
        <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-[#fbfcfc]" aria-label="Conversations">
          <div className="flex h-[48px] shrink-0 items-center justify-between border-b border-slate-100 px-3">
            <h1 className="text-[15px] font-bold text-slate-900">Conversations</h1>
            <button type="button" aria-label="Conversation filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
              <LuSlidersHorizontal aria-hidden="true" />
            </button>
          </div>

          <div className="shrink-0 space-y-3 px-2.5 py-3">
            <label className="relative block">
              <span className="sr-only">Search workers</span>
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search workers..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-[11px] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <LuSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500" aria-hidden="true" />
            </label>

            <div className="grid grid-cols-3 gap-2">
              {([
                ["All", "24"],
                ["Unread", "8"],
                ["Priority", ""],
              ] as Array<[ConversationFilter, string]>).map(([filter, count]) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`flex h-8 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-semibold transition-colors ${
                    activeFilter === filter
                      ? "border-emerald-700 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                  {count && (
                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 ${filter === "Unread" ? "bg-amber-100 text-amber-700" : "bg-emerald-700 text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-1.5 pb-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            {visibleConversations.map((conversation) => {
              const active = conversation.name === activeConversation;

              return (
                <button
                  key={conversation.name}
                  type="button"
                  onClick={() => setActiveConversation(conversation.name)}
                  className={`grid w-full grid-cols-[36px_minmax(0,1fr)] gap-2 rounded-xl border px-2 py-2.5 text-left transition-colors ${
                    active
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Avatar initials={conversation.initials} className={conversation.avatarClass} />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-1">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[11px] font-bold text-slate-900">{conversation.name}</span>
                        <OnlineStatus status={conversation.status} />
                      </span>
                      <span className="shrink-0 text-[9px] text-slate-500">{conversation.time}</span>
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-slate-600">{conversation.preview}</span>
                      {conversation.unread && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-emerald-700 px-1 text-[9px] font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}

            {visibleConversations.length === 0 && (
              <div className="px-4 py-10 text-center text-[11px] text-slate-500">No conversations found.</div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="flex h-12 shrink-0 items-center justify-center gap-2 border-t border-slate-100 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
          >
            {showAll ? "Show fewer conversations" : "Load more conversations"}
            <LuChevronDown className={`transition-transform ${showAll ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col bg-white">
          <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-slate-200 px-3">
            <button type="button" onClick={() => router.back()} aria-label="Go back" className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100">
              <LuArrowLeft aria-hidden="true" />
            </button>
            <Avatar initials={selected.initials} className={selected.avatarClass} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[13px] font-bold text-slate-900">{selected.name}</h2>
                <OnlineStatus status={selected.status} />
              </div>
              <p className="mt-1 truncate text-[10px] text-slate-600">
                Worker ID: {selected.workerId} &nbsp;•&nbsp; Village: {selected.village}
              </p>
            </div>
            <button type="button" aria-label="More conversation options" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
              <LuEllipsisVertical aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#fcfdfc] px-3 py-3 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <div className="mx-auto max-w-[610px] space-y-3">
              <DateSeparator>May 20, 2025</DateSeparator>

              <IncomingMessage time="10:32 AM">
                <p>Namaste Sir, as per your request, I am submitting the pending documents.</p>
                <AttachmentCard type="pdf" />
              </IncomingMessage>

              <OutgoingMessage time="10:34 AM">
                Thank you, Ramesh. Please also update the current field status and share recent field photos.
              </OutgoingMessage>

              <IncomingMessage time="10:38 AM">
                <p>Field update: Sowing is completed on 2.5 acres. Please find the photos.</p>
                <div className="mt-3 flex gap-2">
                  <AttachmentCard type="image" />
                  <button type="button" className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] text-slate-600 shadow-sm hover:bg-slate-50">
                    <span className="text-[12px] font-bold text-slate-800">+3</span>
                    More
                  </button>
                </div>
              </IncomingMessage>

              <DateSeparator>May 21, 2025</DateSeparator>

              <OutgoingMessage time="11:15 AM">
                Complaint #C-7821 regarding irrigation issue has been resolved. Please confirm.
              </OutgoingMessage>

              <IncomingMessage time="11:18 AM">
                Yes Sir, the issue is resolved. Water flow restored. Thank you for the support.
              </IncomingMessage>

              <OutgoingMessage time="11:20 AM">
                Your records are under verification. Status will be updated soon.
              </OutgoingMessage>

              {sentMessages.map((sentMessage, index) => (
                <OutgoingMessage key={`${sentMessage.time}-${index}`} time={sentMessage.time}>
                  {sentMessage.text}
                </OutgoingMessage>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="flex h-[64px] shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3">
            <label className="cursor-pointer rounded-lg p-2 text-lg text-slate-600 hover:bg-slate-100" aria-label="Attach a file">
              <LuPaperclip aria-hidden="true" />
              <input type="file" className="sr-only" multiple />
            </label>
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-inner focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400"
              />
              <button type="button" aria-label="Add emoji" className="rounded-full p-1 text-lg text-slate-500 hover:text-slate-800">
                <LuSmile aria-hidden="true" />
              </button>
            </div>
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-lg text-white shadow-md shadow-emerald-900/15 transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!message.trim()}
            >
              <LuSend aria-hidden="true" />
            </button>
          </form>
        </main>

        <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-[#fbfcfc] [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]" aria-label="Worker information">
          <div className="sticky top-0 z-10 grid h-[42px] grid-cols-2 border-b border-slate-200 bg-white">
            {(["Details", "Activity"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDetailsTab(tab)}
                className={`border-b-2 text-[11px] font-semibold transition-colors ${
                  detailsTab === tab ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {detailsTab === "Details" ? (
            <div className="space-y-3 p-2.5">
              <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                <div className="flex items-center gap-4 px-1 pb-3">
                  <Avatar initials={selected.initials} className={selected.avatarClass} large />
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-bold text-slate-900">{selected.name}</h3>
                    <div className="mt-1"><OnlineStatus status={selected.status} /></div>
                  </div>
                </div>

                <dl className="text-[10px]">
                  {[
                    ["Worker ID", selected.workerId],
                    ["Mobile", "+91 98765 43210"],
                    ["Village", selected.village],
                    ["Taluka", "Karjat"],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[92px_1fr] border-b border-slate-100 px-1 py-2 last:border-b-0">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-medium text-slate-700">{value}</dd>
                    </div>
                  ))}
                </dl>

                <button
                  type="button"
                  onClick={() => router.push("/Authority/authorityVerifiedWorkers")}
                  className="mt-1 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-emerald-700 text-[10px] font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  <LuUserRound aria-hidden="true" />
                  View Full Profile
                </button>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                <h3 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold text-slate-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <LuMapPinned aria-hidden="true" />
                  </span>
                  Assigned Land
                </h3>
                <dl className="space-y-2 text-[10px]">
                  <div className="grid grid-cols-[1fr_110px]"><dt className="text-slate-500">Total Area</dt><dd className="font-medium">2.50 acres</dd></div>
                  <div className="grid grid-cols-[1fr_110px]"><dt className="text-slate-500">Plots</dt><dd className="font-medium">2 (45, 46)</dd></div>
                  <div className="grid grid-cols-[1fr_110px]"><dt className="text-slate-500">Land Type</dt><dd className="font-medium">Irrigated</dd></div>
                  <div className="grid grid-cols-[1fr_110px] items-center">
                    <dt className="text-slate-500">Verification Status</dt>
                    <dd><span className="rounded-md bg-amber-100 px-2 py-1 font-medium text-amber-700">Under Verification</span></dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h3 className="flex items-center gap-2 text-[12px] font-bold text-slate-900">
                    <LuPaperclip aria-hidden="true" />
                    Shared Documents
                  </h3>
                  <button type="button" onClick={() => router.push("/Authority/authorityLeaseDocuments")} className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900">View All</button>
                </div>
                <div className="space-y-1.5">
                  {sharedDocuments.map((document) => (
                    <div key={document.name} className="grid grid-cols-[30px_minmax(0,1fr)_42px_22px] items-center gap-2 rounded-lg border border-slate-100 p-2 shadow-sm">
                      <span className={`flex h-7 w-7 items-center justify-center rounded text-sm ${document.iconClass}`}>{document.icon}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[9px] font-semibold text-slate-800">{document.name}</span>
                        <span className="mt-0.5 block truncate text-[8px] text-slate-500">{document.meta}</span>
                      </span>
                      <span className="text-right text-[8px] text-slate-500">{document.size}</span>
                      <button type="button" aria-label={`Download ${document.name}`} className="rounded p-1 text-xs text-slate-600 hover:bg-slate-100">
                        <LuDownload aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(15,23,42,0.025)]">
                <h3 className="mb-3 text-[12px] font-bold text-slate-900">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Send Notice", icon: <BellActionIcon />, className: "bg-blue-100 text-blue-600", route: "/Authority/authorityNotifications" },
                    { label: "Create Task", icon: <LuCircleCheck aria-hidden="true" />, className: "bg-emerald-100 text-emerald-700", route: "/Authority/authorityProjects" },
                    { label: "Schedule Visit", icon: <LuCalendarClock aria-hidden="true" />, className: "bg-amber-100 text-amber-600", route: "/Authority/authorityProjects" },
                    { label: "View Land", icon: <LuMapPinned aria-hidden="true" />, className: "bg-emerald-100 text-emerald-800", route: "/Authority/authorityVerifiedLandowners" },
                  ].map((action) => (
                    <button key={action.label} type="button" onClick={() => router.push(action.route)} className="group flex min-w-0 flex-col items-center gap-2 text-center">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform group-hover:-translate-y-0.5 ${action.className}`}>{action.icon}</span>
                      <span className="text-[8px] font-semibold leading-3 text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <h3 className="text-[13px] font-bold text-slate-900">Recent Activity</h3>
              {[
                ["Document uploaded", "7_12_Extract.pdf", "May 20, 10:32 AM"],
                ["Field update received", "Sowing completed on 2.5 acres", "May 20, 10:38 AM"],
                ["Complaint resolved", "Irrigation issue C-7821", "May 21, 11:18 AM"],
                ["Verification started", "Land records are under review", "May 21, 11:20 AM"],
              ].map(([title, description, time]) => (
                <div key={title} className="relative border-l-2 border-emerald-100 pl-4">
                  <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <p className="text-[11px] font-semibold text-slate-800">{title}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{description}</p>
                  <p className="mt-1 text-[9px] text-slate-400">{time}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function BellActionIcon() {
  return (
    <span className="relative">
      <LuClipboardCheck aria-hidden="true" />
      <LuCheckCheck className="absolute -bottom-1 -right-1 text-[9px]" aria-hidden="true" />
    </span>
  );
}
