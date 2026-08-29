 "use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {FiEye, FiEyeOff, FiMessageSquare,FiShield,FiShoppingCart, FcGoogle, PiPlant} from "@/components/ui/icons";



type Role = "farmer" | "buyer" | "admin";

const roles = [
  { id: "farmer" as Role, name: "Farmer", icon: PiPlant },
  { id: "buyer" as Role, name: "Buyer", icon: FiShoppingCart },
  { id: "admin" as Role, name: "Admin", icon: FiShield },
];

export default function Loginpage() {
  const [selectedRole, setSelectedRole] = useState<Role>("farmer");
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

    console.log("Login data:", loginData);

    // Connect your backend here:
    // const response = await axios.post("/api/login", loginData);
  }

  return (
    <main className="min-h-screen bg-[#f7f0dc] lg:grid lg:grid-cols-2">
     <section
        className="relative hidden min-h-screen overflow-hidden bg-[#19160f] px-[8%] py-[7%] text-white lg:flex lg:flex-col"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(111, 87, 36, 0.25), transparent 40%), repeating-linear-gradient(176deg, transparent 0px, transparent 145px, rgba(126, 119, 94, 0.28) 147px, transparent 149px)",
        }}
      >
        <div className="flex items-center gap-3 font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[#7d886f]">
          <PiPlant className="text-2xl text-[#d4aa23]" />
          Season 2026
        </div>

        <div className="my-auto max-w-[590px]">
          <p className="mb-7 font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[#e4b923]">
            Farm management, in season
          </p>

          <h1 className="font-serif text-[clamp(3.4rem,4vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#f7efd9]">
            Every plot has
            <span className="my-3 block italic text-[#e3b51f]">a story.</span>
            Come read yours.
          </h1>

          <p className="mt-8 max-w-[520px] text-xl leading-8 text-[#c5bfae]">
            Track plantings, weather windows, and yield across every field you
            work — from the first pass of the tiller to the last truck out.
          </p>
        </div>

        <div className="grid max-w-[650px] grid-cols-3 border-t border-[#4a4639] pt-8">
          <div>
            <p className="font-serif text-3xl font-semibold text-[#f5edd8]">
              6,400+
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#7d886f]">
              Farms tracked
            </p>
          </div>

          <div>
            <p className="font-serif text-3xl font-semibold text-[#f5edd8]">
              211
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#7d886f]">
              Crop varieties
            </p>
          </div>

          <div>
            <p className="font-serif text-3xl font-semibold text-[#f5edd8]">
              24/7
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#7d886f]">
              Field reports
            </p>
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
          <div className="mb-12 flex items-center gap-3">
            <PiPlant className="text-4xl text-[#af5a2c]" />
            <p className="font-serif text-3xl font-bold text-[#20170f]">
              Furrow
            </p>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-4xl font-semibold text-[#241b13]">
              Sign in
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
              <label
                htmlFor="login"
                className="mb-3 block font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#59634d]"
              >
                Username, phone or email
              </label>

              <input
                id="login"
                name="login"
                type="text"
                value={formData.login}
                onChange={handleInputChange}
                required
                placeholder="jane.acresfarm / +91 98xxxxxxx / jane@mail.com"
                className="h-16 w-full rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] px-5 text-lg outline-none placeholder:text-[#a49d89] focus:border-[#667258]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-3 block font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#59634d]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="h-16 w-full rounded-lg border-2 border-[#d4d0c7] bg-[#fffdfa] px-5 pr-14 text-lg outline-none placeholder:text-[#a49d89] focus:border-[#667258]"
                />

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
                Register your farm
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
