"use client";

import { FormEvent, useState } from "react";
import {
  FiBarChart2,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiList,
  FiMic,
  FiPaperclip,
  FiPlus,
  FiSend,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { GiPlantWatering } from "react-icons/gi";
import { LuDroplets, LuLeaf, LuSparkles } from "react-icons/lu";

const quickActions = [
  { label: "Summarize crop status", icon: LuLeaf },
  { label: "Draft message to workers", icon: FiUsers },
  { label: "Plan irrigation schedule", icon: LuDroplets },
  { label: "Analyze land productivity", icon: FiBarChart2 },
];

const recentChats = [
  { title: "North Field crop condition", preview: "How is the current crop condition...", date: "10:32 AM", active: true },
  { title: "Irrigation schedule – May", preview: "Create irrigation plan for all fields...", date: "Yesterday" },
  { title: "Pest control guidance", preview: "What's the best way to control...", date: "May 18" },
  { title: "Fertilizer recommendation", preview: "Recommend fertilizer for cotton...", date: "May 17" },
  { title: "Worker attendance summary", preview: "Show this week's attendance...", date: "May 16" },
  { title: "Land productivity analysis", preview: "Analyze productivity of my lands...", date: "May 15" },
];

export default function LandownerChat() {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const nextMessage = message.trim();
    if (!nextMessage) return;
    setSentMessages((current) => [...current, nextMessage]);
    setMessage("");
  }

  return (
    <div className="min-h-full bg-[#f8faf8] p-4 text-slate-800 lg:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-950">AgriLand AI Assistant</h1>
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Your intelligent partner for farming insights and land management.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm hover:bg-slate-50">
              <LuSparkles className="text-lg text-indigo-500" /> AgriLand GPT-4o <FiChevronDown />
            </button>
            <button type="button" onClick={() => setSentMessages([])} className="flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
              <FiPlus className="text-lg" /> New Chat
            </button>
          </div>
        </header>

        <div className="grid min-h-[720px] gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <main className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex gap-3 overflow-x-auto border-b border-slate-100 p-4">
              {quickActions.map(({ label, icon: Icon }) => (
                <button key={label} type="button" onClick={() => setMessage(label)} className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium transition hover:border-emerald-300 hover:bg-emerald-50">
                  <Icon className="text-lg text-emerald-600" /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-white to-[#fbfdfb] p-5 lg:p-7">
              <div className="ml-auto flex max-w-xl items-end gap-3">
                <div className="rounded-2xl rounded-br-md bg-emerald-50 px-5 py-3 text-sm leading-6 text-slate-700">
                  How is the current crop condition in my 120-acre North Field and what actions do you recommend?
                  <p className="mt-1 text-right text-[11px] text-slate-400">10:32 AM <FiCheck className="ml-1 inline text-emerald-600" /></p>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">RP</div>
              </div>

              <div className="flex max-w-3xl items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-700 text-white"><LuLeaf className="text-xl" /></div>
                <div className="w-full rounded-2xl rounded-tl-md border border-slate-200 bg-white p-4 text-sm shadow-sm">
                  <p className="leading-6">Here&apos;s the current crop condition for your North Field (120 acres) based on the latest data from field sensors, satellite imagery, and weather updates.</p>
                  <section className="mt-3 rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-bold text-slate-900">North Field – Crop Overview <span className="font-normal text-slate-500">(120 acres)</span></h2>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">● Overall: Good</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <InfoCard icon={<LuLeaf />} label="Crop" value="Cotton" />
                      <InfoCard icon={<GiPlantWatering />} label="Growth Stage" value="Boll Formation" />
                      <InfoCard icon={<span className="text-lg">°C</span>} label="Avg. Temperature" value="32.4° C" />
                      <InfoCard icon={<LuDroplets />} label="Soil Moisture" value="28%" warning="Low" />
                    </div>
                    <div className="mt-4 text-xs leading-5">
                      <h3 className="font-bold text-emerald-700">Key Observations</h3>
                      <ul className="mt-1 list-disc pl-5 text-slate-700">
                        <li>Vegetation index is above normal for this stage.</li><li>Soil moisture is slightly below optimal in the western zone.</li><li>No major pest or disease risk detected.</li><li>Weather forecast shows no rainfall in the next 5 days.</li>
                      </ul>
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5">
                      <h3 className="font-bold text-emerald-700">Recommended Actions</h3>
                      <p><Check /> Irrigate within the next 2 days, focusing on western blocks.</p>
                      <p><Check /> Apply potassium fertilizer (0-0-60) in split dose for better boll development.</p>
                      <p><Check /> Monitor for whitefly in the coming week.</p>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-slate-400">10:33 AM</p>
                  </section>
                </div>
              </div>

              <div className="ml-auto flex max-w-lg items-end gap-3">
                <div className="rounded-2xl rounded-br-md bg-emerald-50 px-5 py-3 text-sm">Please create an irrigation plan for this field. <span className="ml-3 text-[11px] text-slate-400">10:34 AM <FiCheck className="inline text-emerald-600" /></span></div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">RP</div>
              </div>

              {sentMessages.map((item, index) => (
                <div key={`${item}-${index}`} className="ml-auto max-w-xl rounded-2xl rounded-br-md bg-emerald-50 px-5 py-3 text-sm">{item}</div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="m-4 rounded-2xl border border-emerald-400 bg-white p-3 shadow-sm">
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask anything about your farms, crops, workers, or requests..." className="w-full bg-transparent px-1 pb-3 text-sm outline-none placeholder:text-slate-400" />
              <div className="flex items-center justify-between">
                <button type="button" aria-label="Attach file" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><FiPaperclip /></button>
                <div className="flex gap-2">
                  <button type="button" aria-label="Use microphone" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"><FiMic /></button>
                  <button type="submit" aria-label="Send message" className="grid h-11 w-11 place-items-center rounded-full bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"><FiSend /></button>
                </div>
              </div>
            </form>
            <p className="pb-2 text-center text-[11px] text-slate-400">AI responses may not always be 100% accurate. Please verify critical information.</p>
          </main>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:h-full">
            <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><FiClock /> Recent Chats</h2><button type="button" aria-label="Chat settings" className="text-slate-500"><FiSettings /></button></div>
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <button key={chat.title} type="button" className={`w-full rounded-xl border p-3 text-left transition hover:border-emerald-300 ${chat.active ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{chat.title}</span><span className="shrink-0 text-[10px] text-slate-400">{chat.date}</span></span>
                  <span className="mt-2 block truncate text-xs text-slate-500">You: {chat.preview}</span>
                </button>
              ))}
            </div>
            <button type="button" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-slate-50"><FiList /> View all chats</button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, warning }: { icon: React.ReactNode; label: string; value: string; warning?: string }) {
  return <div className="rounded-xl border border-slate-200 p-3"><div className="flex items-center gap-2 text-emerald-600"><span className="text-lg">{icon}</span><span className="text-[11px] text-slate-500">{label}</span></div><p className="mt-2 font-semibold text-slate-800">{value}</p>{warning && <p className="text-[11px] font-semibold text-amber-500">{warning}</p>}</div>;
}

function Check() {
  return <FiCheck className="mr-1 inline rounded-full bg-emerald-600 p-0.5 text-white" />;
}
