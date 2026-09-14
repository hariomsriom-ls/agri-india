import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Herosection from "@/components/Herosection";
import Footer from "@/components/footer";
import {
  LuArrowRight,
  LuClock3,
  LuHandshake,
  LuHardHat,
  LuHouse,
  LuLandmark,
  LuLeaf,
  LuMapPinned,
  LuShieldCheck,
  LuSprout,
  LuUsersRound,
} from "react-icons/lu";

const aboutFeatures = [
  { title: "Easy Communication", description: "Connect with the right people.", icon: LuUsersRound },
  { title: "Better Workforce Access", description: "Find skilled and reliable workers.", icon: LuShieldCheck },
  { title: "Transparent Processes", description: "Keep everything organized.", icon: LuLeaf },
  { title: "Sustainable Growth", description: "Support long-term agriculture.", icon: LuSprout },
];

const communityStats = [
  { value: "100+", label: "Registered Users", icon: LuUsersRound },
  { value: "50+", label: "Active Workers", icon: LuHardHat },
  { value: "20+", label: "Areas Covered", icon: LuMapPinned },
  { value: "24/7", label: "Platform Access", icon: LuClock3 },
];

const platformBenefits = [
  {
    title: "Easy Access",
    description: "Find and request services quickly, anytime, anywhere.",
    icon: LuSprout,
    color: "bg-[#dcf5d5] text-[#168c43]",
  },
  {
    title: "Secure Platform",
    description: "Your data and information are always protected.",
    icon: LuShieldCheck,
    color: "bg-[#daf3fa] text-[#23799b]",
  },
  {
    title: "Better Connections",
    description: "Bringing workers, landowners and authorities together.",
    icon: LuHandshake,
    color: "bg-[#dcf5d5] text-[#168c43]",
  },
];

function MissionDiagram() {
  return (
    <figure
      className="relative mx-auto h-[360px] w-full max-w-[520px]"
      aria-label="Our platform connects workers, landowners, and authorities"
    >
      <svg className="absolute inset-0 h-full w-full text-[#21a465]" viewBox="0 0 520 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="mission-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="2" markerStart="url(#mission-arrow)" markerEnd="url(#mission-arrow)">
          <path d="M260 111 V125" />
          <path d="M196 216 L146 246" />
          <path d="M324 216 L374 246" />
        </g>
      </svg>

      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#8dcf85] bg-[#eaf7bf] text-[#188951] shadow-[0_5px_18px_#9aca9c40]">
          <LuHardHat className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="mt-2 text-base font-bold">Worker</p>
        <p className="mt-1 whitespace-nowrap text-xs text-[#587577]">Shares skills &amp; availability</p>
      </div>

      <div className="absolute left-1/2 top-[138px] flex -translate-x-1/2 flex-col items-center text-center">
        <div className="flex h-[104px] w-[104px] flex-col items-center justify-center gap-2 rounded-full bg-[#0caa58] text-white shadow-[0_0_0_9px_#d8f3e1,0_8px_26px_#139c4930]">
          <LuLeaf className="h-9 w-9" strokeWidth={2} aria-hidden="true" />
          <p className="text-sm font-semibold">Our Platform</p>
        </div>
        <p className="mt-4 whitespace-nowrap text-xs text-[#587577]">Connects &amp; manages</p>
      </div>

      <div className="absolute bottom-0 left-0 flex w-[40%] flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9f5c8] text-[#168943] shadow-[0_5px_18px_#9aca9c30]">
          <LuHouse className="h-9 w-9" aria-hidden="true" />
        </span>
        <p className="mt-2 text-base font-bold">Landowner</p>
        <p className="mt-1 max-w-40 text-xs leading-5 text-[#587577]">Posts needs &amp; opportunities</p>
      </div>

      <div className="absolute bottom-0 right-0 flex w-[40%] flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d8f2fa] text-[#24749b] shadow-[0_5px_18px_#7ab6cf30]">
          <LuLandmark className="h-9 w-9" aria-hidden="true" />
        </span>
        <p className="mt-2 text-base font-bold">Authority</p>
        <p className="mt-1 max-w-40 text-xs leading-5 text-[#587577]">Ensures compliance &amp; support</p>
      </div>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Herosection />

        <div id="about" className="scroll-mt-8 overflow-hidden bg-white text-[#163f38]">
          <section aria-labelledby="about-heading" className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#16994d]">About Us</p>
              <h2 id="about-heading" className="mt-3 max-w-xl text-3xl font-bold leading-[1.15] tracking-[-0.025em] sm:text-4xl lg:text-[42px]">
                Building a Better<br className="hidden sm:block" /> Agricultural Ecosystem
              </h2>
              <p className="mt-5 max-w-[460px] text-base leading-7 text-[#617b80]">
                We are a digital platform that connects agricultural workers,
                landowners and authorities. Our goal is to make agricultural
                services easier to access, manage and monitor — creating a
                stronger, more efficient and sustainable farming community.
              </p>

              <div className="mt-8 grid gap-x-5 gap-y-7 sm:grid-cols-2">
                {aboutFeatures.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e7f6eb] text-[#11984f]">
                      <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <div className="pt-1">
                      <h3 className="text-sm font-bold leading-5">{title}</h3>
                      <p className="mt-1 text-sm leading-5 text-[#617b80]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl pr-4 sm:pr-5">
              <div aria-hidden="true" className="absolute -right-2 -top-3 bottom-5 left-10 rotate-2 rounded-[40px] bg-[#d1ebdc]" />
              <div aria-hidden="true" className="absolute -top-2 bottom-8 left-8 right-8 -rotate-3 rounded-[40px] bg-[#ddf2f1]" />
              <LuSprout aria-hidden="true" className="absolute -right-9 top-14 h-36 w-24 rotate-12 text-[#49946c] sm:-right-10" strokeWidth={1.25} />
              <div className="relative aspect-[1.08/1] overflow-hidden rounded-[24px] shadow-[0_8px_30px_#184e3010]">
                <Image
                  src="/images/image3.png"
                  alt="Agricultural workers tending a lush green field"
                  fill
                  sizes="(max-width: 1023px) 90vw, 540px"
                  className="object-cover object-[42%_center]"
                />
              </div>
            </div>
          </section>

          <section id="our-mission" aria-labelledby="mission-heading" className="scroll-mt-8 bg-[#f0f9f4]">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-12 lg:py-14">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#16994d]">Our Mission</p>
                <h2 id="mission-heading" className="mt-3 text-3xl font-bold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
                  Connecting People,<br className="hidden sm:block" /> Land and Opportunity
                </h2>
                <p className="mt-5 max-w-[420px] text-base leading-7 text-[#617b80]">
                  We bridge the gap between agricultural workers, landowners and
                  authorities through technology, creating a transparent,
                  efficient and inclusive ecosystem for everyone.
                </p>
              </div>
              <MissionDiagram />
            </div>
          </section>

          <section aria-label="Our community in numbers" className="relative isolate overflow-hidden">
            <Image src="/images/image1.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-center opacity-55" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,white_22%,white_78%,rgba(255,255,255,0.3)_100%)]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-white via-transparent to-white" />
            <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-y-9 px-6 py-12 sm:grid-cols-4 sm:px-10 sm:py-14">
              {communityStats.map(({ value, label, icon: Icon }, index) => (
                <div key={label} className={`flex flex-col items-center text-center ${index > 0 ? "sm:border-l sm:border-[#dce7e5]" : ""}`}>
                  <Icon className="mb-2 h-8 w-8 text-[#139b50]" strokeWidth={2} aria-hidden="true" />
                  <dt className="order-last mt-1 text-sm text-[#587577]">{label}</dt>
                  <dd className="text-3xl font-bold tracking-tight sm:text-4xl">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="why-us-heading" className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:px-10 lg:grid-cols-[1.65fr_3fr] lg:items-center lg:gap-12 lg:px-12 lg:py-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#16994d]">Why Choose Us</p>
              <h2 id="why-us-heading" className="mt-3 text-3xl font-bold leading-[1.2] tracking-[-0.02em]">
                The Right Platform<br className="hidden sm:block" /> for a Stronger Agriculture
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-[#617b80]">
                We combine technology with a deep understanding of agriculture
                to create real value for everyone involved in the farming ecosystem.
              </p>
              <a href="#our-mission" className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#009c4c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#08773e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#009c4c]">
                Learn More <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {platformBenefits.map(({ title, description, icon: Icon, color }) => (
                <article key={title} className="h-full rounded-xl border border-[#e0e9e6] bg-linear-to-b from-white to-[#fbfdfc] p-5 sm:px-4 sm:py-6 xl:p-6">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#617b80]">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="join-heading" className="relative isolate overflow-hidden px-6 pb-20 pt-10 text-center sm:pb-24 sm:pt-12">
            <Image src="/images/registration.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[center_58%]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-[#ecf7f5]/95 via-[#fffcef]/85 to-white/5" />
            <div className="mx-auto max-w-2xl">
              <h2 id="join-heading" className="text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">Together for Better Agriculture</h2>
              <p className="mx-auto mt-3 max-w-lg text-base leading-6 text-[#496970]">
                Join our growing community and be part of a smarter,<br className="hidden sm:block" /> more sustainable future for agriculture.
              </p>
              <Link href="/registration" className="mt-5 inline-flex items-center gap-4 rounded-full bg-[#009c4c] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08773e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#009c4c]">
                Get Started <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
