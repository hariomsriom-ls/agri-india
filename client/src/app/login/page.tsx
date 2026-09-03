 "use client";
import {useDispatch, useSelector} from "react-redux";
import { ReactNode, useState, type ChangeEvent, type FormEvent } from "react";
import {FiEye, FiEyeOff, FiMessageSquare,FiShield,FiShoppingCart, FcGoogle, PiPlant, FiUsers} from "@/components/ui/icons";
import { InputField } from "@/components/ui/Input";
import api from "@/utils/services";
import { useRouter } from "next/navigation";
import axios from "axios"
import { ResponseCard } from "@/components/cards/registrationlogin/response";
import { updateUserData, updateProfileImage, setUser } from "@/features/user";
import { setAuth } from "@/features/auth";
import { useAppSelector } from "@/store/hooks";


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
      stroke="#bbbf6a"
      strokeWidth="1"
    >
      <path d="M600 900C620 840 700 860 780 700c30-80 100-90 140-120" />
      <path d="M580 900C620 780 700 820 780 660c30-80 100-90 140-120" />
      <path d="M560 900C620 750 700 800 780 640c30-80 100-90 140-120" />
      <path d="M500 900C620 720 700 770 780 620c30-80 100-90 140-120" />
      <path d="M480 900C620 700 700 750 780 610c30-80 100-90 140-120" />
      <path d="M450 900C620 680 700 725 780 590c30-80 100-90 140-120" />
      <path d="M420 900C620 660 700 715 780 570c30-80 100-90 140-120" />

      
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
  const [loginError, setLoginError] = useState<string>("");
   const [showResponse, setShowResponse] = useState(false);
   const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({login: "",password: "",});
  const router = useRouter();
  const dispatch = useDispatch();


  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previousData) => ({ ...previousData,[name]: value,}));
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const loginData = {
      role: selectedRole,
      login: formData.login,
      password: formData.password,
      keepSignedIn,
    };
    if (!selectedRole) {setLoginError("Select a role"); return;}
    const apiURL = selectedRole === "landowner" ? "/landowner/loginlandowner" : selectedRole === "worker" ? "/worker/login-worker" : "/authority/login-authority";
    const renderURL = selectedRole === "landowner" ? "/Landowner/LandownerDashboard" : selectedRole === "worker" ? "/Worker/WorkerDashboard" : "/Authority/authorityDashboard";
   // console.log("Login data:", loginData);
           
    try {
        const response = await api.post(apiURL, loginData);
        const user = response.data.data[selectedRole];
        console.log("Login response:", response.data);
        if (response.data.success) { 
         // router.replace(renderURL);
          dispatch(setAuth({ role: user.role}));
        }

    } 
    catch (error) {
         if(!selectedRole) {setLoginError("Select any Role.");
            setLoading(false);
            setShowResponse(true)
          } 
        else if (axios.isAxiosError(error)) {
           setLoginError( error.response?.data?.message ||"Login failed. Check your credentials.");
       }
        else { setLoginError("An unexpected error occurred.");}
       setShowResponse(true);
      } 
      finally{
        setLoading(false);
      };
  }
  
  return (
       <main className="min-h-screen bg-[rgba(229, 231, 228, 0.92)] p-3 sm:p-5">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-[1500px] overflow-hidden rounded-2xl border border-[#d7dad7] shadow-sm lg:grid lg:grid-cols-[56%_44%]">

            <section className="relative hidden min-h-[700px] overflow-hidden bg-[rgba(108, 178, 112, 0.55)] lg:flex lg:items-center">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 100% 100%, rgba(226, 226, 193, 0.9), transparent 10%),
                radial-gradient(ellipse at 90% 100%, rgba(222, 226, 193, 0.80), transparent 28%),
                linear-gradient(135deg, rgb(1, 29, 17) 0%, rgb(2, 40, 20) 100%)
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
       {showResponse && (
          <ResponseCard
          loading={loading}
          processSuccess= {false}
          callMethod="Login"
          message={loginError}
          onClose={() => {
            setShowResponse(false);
          }}
            />
        )}
      </div>
    </main>
  );
}
