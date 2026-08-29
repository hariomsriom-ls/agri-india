 "use client";

import { ReactNode, useState, type ChangeEvent, type FormEvent } from "react";
import {FiEye, FiEyeOff, FiMessageSquare,FiShield,FiShoppingCart, FcGoogle, PiPlant, FiUsers} from "@/components/ui/icons";
import { InputField } from "@/components/ui/Input";
import api from "@/utils/services";


type Role = "landowner" | "worker" | "authority" | null;

const roles = [
  { id: "landowner" as Role, name: "Landowner", icon: PiPlant },
  { id: "worker" as Role, name: "Worker", icon: FiShoppingCart },
  { id: "authority" as Role, name: "Authority", icon: FiShield },
];

function ContourLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 900 900"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
      fill="none"
      stroke="#b4b779"
      strokeWidth="1"
    >
      <path d="M150 900C300 760 350 650 510 620c190-35 210-180 190-350" />
      <path d="M210 900C345 775 395 685 540 650c175-43 205-180 180-390" />
      <path d="M275 900C380 805 435 725 570 680c160-53 190-185 165-410" />
      <path d="M340 900C420 830 480 770 610 710c140-65 165-190 135-440" />
      <path d="M405 900C470 855 525 805 650 740c125-65 145-200 110-470" />
      <path d="M470 900C530 875 585 840 695 770c105-65 125-210 80-500" />
      <path d="M535 900C590 885 650 870 740 805c90-65 100-220 55-535" />
    </svg>
  );
}

type FeatureProps = {
  icon: ReactNode;
  label: string;
};

function Feature({ icon, label }: FeatureProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 text-center text-[#c5a94f]">
      <span className="text-4xl">{icon}</span>
      <span className="text-xs font-medium text-[#d9c56e]">{label}</span>
    </div>
  );
}

export default function Loginpage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const [formData, setFormData] = useState({
   login: "",
    password: "",
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const loginData = {
      role: selectedRole,
      login: formData.login,
      password: formData.password,
      keepSignedIn,
    };

    const apiURL = selectedRole === "landowner" ? "/landowner/loginlandowner" : selectedRole === "worker" ? "/worker/login-worker" : "/authority/login-authority";

   // console.log("Login data:", loginData);
     const response = await api.post(apiURL, loginData);
  }

  return (
       <main className="min-h-screen bg-[rgba(229, 231, 228, 0.92)] p-3 sm:p-5">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-[1500px] overflow-hidden rounded-2xl border border-[#d7dad7] shadow-sm lg:grid lg:grid-cols-[56%_44%]">

            <section className="relative hidden min-h-[700px] overflow-hidden bg-[rgba(108, 178, 112, 0.55)] lg:flex lg:items-center">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 80% 100%, rgba(214, 224, 178, 0.65), transparent 28%),
                linear-gradient(135deg, rgb(1, 29, 22) 0%, rgb(6, 45, 19) 48%, rgb(1, 88, 40) 72%, rgb(11, 131, 67) 100%)
              `,
            }}
          />

          {/* Soft aurora glow */}
          <div className="absolute left-[55%] top-[34%] h-44 w-80 -rotate-[18deg] rounded-full bg-[#d5efaa]/25 blur-[55px]" />

          <div className="absolute -bottom-24 right-0 h-72 w-96 rounded-full bg-[#dce4bd]/25 blur-[70px]" />

          <ContourLines />

          <div className="relative z-10 w-full max-w-2xl px-[8%] text-[#f7faf5]">
            <PiPlant className="mb-12 text-6xl text-[#a7ad72]" />

            <h1 className="max-w-xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">
              Cultivating today
              <br />
              for a <span className="text-[#d6bd69]">better tomorrow</span>
            </h1>

            <div className="my-8 h-0.5 w-10 bg-[#d2b45c]" />

            <p className="max-w-md text-lg leading-8 text-[#dbe6df]">
              A unified platform for landowners, workers and authorities to
              build stronger, more productive communities.
            </p>

            <div className="mt-16 grid max-w-lg grid-cols-3 divide-x divide-[#b49d57]/45">
              <Feature icon={<PiPlant />} label="Work together" />
              <Feature icon={<FiUsers />} label="Grow sustainably" />
              <Feature icon={<FiShield />} label="Stronger communities" />
            </div>
          </div>
        </section>
     <section
        className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(82, 72, 48, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h2 className="font-serif text-4xl font-semibold text-[#655140]">
             WELCOME BACK
            </h2>
            <p className="mt-2 text-lg text-[#655140]">
              Pick your role and enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <p className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-[#59634d]">
                I am signing in as
              </p>

              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 transition ${
                        isSelected
                          ? "border-[#667258] bg-[#e5e2ce]"
                          : "border-[#d4d0c7] bg-[#fffdfa] hover:border-[#9b9b84]"
                      }`}
                    >
                      <Icon
                        className={`text-2xl ${
                          isSelected ? "text-[#667258]" : "text-[#332a21]"
                        }`}
                      />
                      <span className="font-medium text-[#332a21]">
                        {role.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
            <InputField
            label="Username, phone or email"
            labelclassName="mb-3 block font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#59634d]"
            name="login"
            placeholder="jane.acresfarm / +91 98xxxxxxx / jane@mail.com"
            className="h-16 w-full rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] px-5 text-lg outline-none placeholder:text-[#a49d89] focus:border-[#667258]"
            value={formData.login}
            onChange={handleInputChange}
              required
              />
            <InputField
            label="Password"
            labelclassName="mb-3 block font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#59634d]"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="h-16 w-full rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] px-5 text-lg outline-none placeholder:text-[#a49d89] focus:border-[#667258]"
            value={formData.password}
            onChange={handleInputChange}
              required
              />
              </div>
               <div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-[#776b5c]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-3 text-[#574b3e]">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(event) => setKeepSignedIn(event.target.checked)}
                  className="h-5 w-5 accent-[#667258]"
                />
                Keep me signed in
              </label>

              <a
                href="/forgot-password"
                className="font-medium text-[#b4562c] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="h-16 w-full rounded-lg bg-[#b4562c] text-lg font-bold text-white transition hover:bg-[#984721]"
            >
              Sign in
            </button>

            <div className="flex items-center gap-4 text-[#aaa28f]">
              <div className="h-px flex-1 bg-[#d9d4c8]" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-[#d9d4c8]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="flex h-14 items-center justify-center gap-3 rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] font-semibold hover:border-[#9b9b84]"
              >
                <FcGoogle className="text-2xl" />
                Google
              </button>

              <button
                type="button"
                className="flex h-14 items-center justify-center gap-3 rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] font-semibold hover:border-[#9b9b84]"
              >
                <FiMessageSquare className="text-xl" />
                Phone OTP
              </button>
            </div>

            <p className="text-center text-[#655746]">
              New here?{" "}
              <a
                href="/register"
                className="font-bold text-[#59634d] hover:underline"
              >
                Register now.
              </a>
            </p>
          </form>
        </div>
      </section>
      </div>
    </main>
  );
}
