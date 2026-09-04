"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {LuBell,LuBuilding2,LuCamera,LuCircleCheck,LuFileClock,LuHistory,LuKeyRound,LuLanguages,
  LuLockKeyhole,LuMail,LuMapPin,LuMonitor,LuPalette,LuPencil,LuPhone,LuSave,LuSettings, LuShieldCheck,
  LuUserRound, LuUserRoundCog, LuX,
} from "react-icons/lu";

type ProfileTab = "Personal Information" | "Security" | "Preferences" | "Activity Log";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  district: string;
  designation: string;
};

const initialProfile: ProfileData = {
  fullName: "Anita Sharma",
  email: "anita.sharma@agri.gov.in",
  phone: "+91 98765 43210",
  department: "Department of Agriculture",
  district: "Bhopal",
  designation: "District Authority",
};

const tabs: Array<{ label: ProfileTab; icon: ReactNode }> = [
  { label: "Personal Information", icon: <LuUserRound aria-hidden="true" /> },
  { label: "Security", icon: <LuLockKeyhole aria-hidden="true" /> },
  { label: "Preferences", icon: <LuSettings aria-hidden="true" /> },
  { label: "Activity Log", icon: <LuFileClock aria-hidden="true" /> },
];

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        readOnly={!editing}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-lg border px-3 text-[13px] font-medium text-slate-700 outline-none transition ${
          editing
            ? "border-emerald-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            : "border-slate-200 bg-white shadow-sm"
        }`}
      />
    </label>
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-emerald-700" : "bg-slate-300"}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "left-6" : "left-1"}`} />
    </button>
  );
}

function SettingsRow({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action: ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function AuthorityProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Personal Information");
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [draft, setDraft] = useState<ProfileData>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [compactView, setCompactView] = useState(false);

  function startEditing() {
    setDraft(profile);
    setEditing(true);
    setSaved(false);
  }

  function cancelEditing() {
    setDraft(profile);
    setEditing(false);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setSaved(true);
  }

  function updateDraft(field: keyof ProfileData, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function chooseAvatar(file: File | undefined) {
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  }

  return (
    <div className="min-h-full bg-[#f5f8f7] px-4 py-5 text-slate-800 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1320px]">
        <header className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[30px] text-slate-600 shadow-inner">
            <LuUserRoundCog aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-[29px] font-extrabold tracking-[-0.04em] text-slate-950">My Profile</h1>
            <p className="mt-1 text-[15px] text-slate-500">Manage your personal information and account settings.</p>
          </div>
        </header>

        <nav className="mt-6 flex min-w-max gap-5 overflow-x-auto" aria-label="Profile sections">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              className={`flex min-w-[180px] items-center justify-center gap-2.5 border-b-[3px] px-3 pb-4 pt-2 text-[13px] font-semibold transition-colors ${
                activeTab === tab.label
                  ? "border-emerald-700 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "Personal Information" && (
          <section className="grid overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,46,34,0.05)] lg:grid-cols-[390px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
              <div className="flex flex-col items-center pt-1 text-center">
                <div
                  className="relative flex h-[105px] w-[105px] items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 bg-cover bg-center text-[31px] font-medium text-white shadow-md"
                  style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
                >
                  {!avatarUrl && "AS"}
                  <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-emerald-900 text-sm text-white shadow-md hover:bg-emerald-800" aria-label="Change profile picture">
                    <LuCamera aria-hidden="true" />
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => chooseAvatar(event.target.files?.[0])} />
                  </label>
                </div>
                <h2 className="mt-4 text-[18px] font-bold text-slate-950">{profile.fullName}</h2>
                <p className="mt-0.5 text-[12px] font-medium text-slate-500">{profile.designation}</p>
              </div>

              <dl className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-white px-3 text-[12px] shadow-[0_3px_14px_rgba(15,23,42,0.025)]">
                {[
                  ["Authority ID", "AGRIIN1234"],
                  ["Department", profile.department],
                  ["District", `${profile.district}, Madhya Pradesh`],
                  ["Email", profile.email],
                  ["Phone", profile.phone],
                  ["Joining Date", "12 Jan 2024"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[125px_minmax(0,1fr)] border-b border-slate-100 py-3 last:border-b-0">
                    <dt className="font-medium text-slate-500">{label}</dt>
                    <dd className="truncate font-semibold text-slate-600" title={value}>{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            <form onSubmit={saveProfile} className="p-6 lg:p-7">
              <div className="mb-5 flex min-h-11 items-center justify-end gap-2">
                {saved && !editing && (
                  <span className="mr-auto inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                    <LuCircleCheck aria-hidden="true" />
                    Profile updated successfully
                  </span>
                )}
                {editing ? (
                  <>
                    <button type="button" onClick={cancelEditing} className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
                      <LuX aria-hidden="true" />
                      Cancel
                    </button>
                    <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-emerald-800">
                      <LuSave aria-hidden="true" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={startEditing} className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800">
                    <LuPencil aria-hidden="true" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Field label="Full Name" value={draft.fullName} editing={editing} onChange={(value) => updateDraft("fullName", value)} />
                <Field label="Email Address" value={draft.email} type="email" editing={editing} onChange={(value) => updateDraft("email", value)} />
                <Field label="Phone Number" value={draft.phone} type="tel" editing={editing} onChange={(value) => updateDraft("phone", value)} />

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-500">Department</span>
                  <select
                    value={draft.department}
                    disabled={!editing}
                    onChange={(event) => updateDraft("department", event.target.value)}
                    className={`h-11 w-full rounded-lg border px-3 text-[13px] font-medium text-slate-700 outline-none transition ${editing ? "border-emerald-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" : "cursor-default border-slate-200 bg-white opacity-100 shadow-sm"}`}
                  >
                    <option>Department of Agriculture</option>
                    <option>Department of Land Resources</option>
                    <option>Department of Rural Development</option>
                  </select>
                </label>

                <Field label="District" value={draft.district} editing={editing} onChange={(value) => updateDraft("district", value)} />

                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-slate-500">Designation</span>
                  <select
                    value={draft.designation}
                    disabled={!editing}
                    onChange={(event) => updateDraft("designation", event.target.value)}
                    className={`h-11 w-full rounded-lg border px-3 text-[13px] font-medium text-slate-700 outline-none transition ${editing ? "border-emerald-300 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" : "cursor-default border-slate-200 bg-white opacity-100 shadow-sm"}`}
                  >
                    <option>District Authority</option>
                    <option>Regional Authority</option>
                    <option>State Administrator</option>
                  </select>
                </label>
              </div>
            </form>
          </section>
        )}

        {activeTab === "Security" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,46,34,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700"><LuShieldCheck aria-hidden="true" /></span>
              <div><h2 className="text-[17px] font-bold text-slate-900">Account Security</h2><p className="mt-1 text-[11px] text-slate-500">Manage your password and sign-in protection.</p></div>
            </div>
            <div className="divide-y divide-slate-100">
              <SettingsRow icon={<LuKeyRound aria-hidden="true" />} title="Password" description="Last changed 36 days ago" action={<button type="button" className="rounded-lg border border-emerald-600 px-4 py-2 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">Change Password</button>} />
              <SettingsRow icon={<LuShieldCheck aria-hidden="true" />} title="Two-factor authentication" description="Add an extra layer of security to your account" action={<Toggle enabled={twoFactorEnabled} onChange={() => setTwoFactorEnabled((current) => !current)} label="Toggle two-factor authentication" />} />
              <SettingsRow icon={<LuMonitor aria-hidden="true" />} title="Active sessions" description="Two recognized devices are currently signed in" action={<button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">Manage</button>} />
            </div>
          </section>
        )}

        {activeTab === "Preferences" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,46,34,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700"><LuSettings aria-hidden="true" /></span>
              <div><h2 className="text-[17px] font-bold text-slate-900">Preferences</h2><p className="mt-1 text-[11px] text-slate-500">Customize notifications and your workspace.</p></div>
            </div>
            <div className="divide-y divide-slate-100">
              <SettingsRow icon={<LuMail aria-hidden="true" />} title="Email notifications" description="Receive verification and complaint updates by email" action={<Toggle enabled={emailNotifications} onChange={() => setEmailNotifications((current) => !current)} label="Toggle email notifications" />} />
              <SettingsRow icon={<LuPhone aria-hidden="true" />} title="SMS notifications" description="Receive urgent authority alerts on your phone" action={<Toggle enabled={smsNotifications} onChange={() => setSmsNotifications((current) => !current)} label="Toggle SMS notifications" />} />
              <SettingsRow icon={<LuPalette aria-hidden="true" />} title="Compact dashboard" description="Show more information in a condensed layout" action={<Toggle enabled={compactView} onChange={() => setCompactView((current) => !current)} label="Toggle compact dashboard" />} />
              <SettingsRow icon={<LuLanguages aria-hidden="true" />} title="Language" description="Choose the language used across the authority portal" action={<select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600"><option>English</option><option>Hindi</option><option>Marathi</option></select>} />
            </div>
          </section>
        )}

        {activeTab === "Activity Log" && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,46,34,0.05)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl text-emerald-700"><LuHistory aria-hidden="true" /></span>
              <div><h2 className="text-[17px] font-bold text-slate-900">Recent Account Activity</h2><p className="mt-1 text-[11px] text-slate-500">A record of recent profile and account events.</p></div>
            </div>
            <div className="space-y-1">
              {[
                { icon: <LuPencil aria-hidden="true" />, title: "Profile information reviewed", detail: "Personal information page opened", time: "Today, 10:42 AM" },
                { icon: <LuLockKeyhole aria-hidden="true" />, title: "Successful sign in", detail: "Chrome on Windows • Bhopal, Madhya Pradesh", time: "Today, 9:05 AM" },
                { icon: <LuFileClock aria-hidden="true" />, title: "Document approved", detail: "Land Use Policy 2025.pdf", time: "Yesterday, 4:18 PM" },
                { icon: <LuBuilding2 aria-hidden="true" />, title: "Department record synchronized", detail: "Department of Agriculture", time: "2 Sep 2026, 11:30 AM" },
                { icon: <LuMapPin aria-hidden="true" />, title: "District assignment confirmed", detail: "Bhopal, Madhya Pradesh", time: "1 Sep 2026, 2:15 PM" },
                { icon: <LuBell aria-hidden="true" />, title: "Notification preferences updated", detail: "Email notifications enabled", time: "29 Aug 2026, 5:40 PM" },
              ].map((activity) => (
                <div key={activity.title} className="grid grid-cols-[42px_minmax(0,1fr)_145px] items-center gap-4 border-b border-slate-100 py-3.5 last:border-b-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-700">{activity.icon}</span>
                  <div><p className="text-[12px] font-semibold text-slate-800">{activity.title}</p><p className="mt-1 text-[10px] text-slate-500">{activity.detail}</p></div>
                  <time className="text-right text-[10px] text-slate-400">{activity.time}</time>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
