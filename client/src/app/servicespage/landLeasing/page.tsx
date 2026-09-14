import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
  LuChevronDown,
  LuCircleCheck,
  LuClipboardCheck,
  LuFileText,
  LuHandshake,
  LuHardHat,
  LuLandmark,
  LuLeaf,
  LuScrollText,
  LuShieldCheck,
  LuSprout,
  LuTrees,
  LuUsersRound,
} from "react-icons/lu";

export const metadata: Metadata = {
  title: "Land Leasing | AgriConnect",
  description: "Discover agricultural land leasing, its benefits, rental considerations, and the steps to register your land.",
};

const buttonClass = "inline-flex items-center justify-center gap-3 rounded-full bg-[#009749] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08743d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700";
const modelPolicyUrl = "https://www.niti.gov.in/sites/default/files/2023-02/Report-of-the-Expert-Committee-and-Model-Law-on-Agricultural-Land-Leasing.pdf";

const highlights = [
  { title: "Secure Agreements", description: "Clear, documented terms", icon: LuLeaf },
  { title: "Rental Income", description: "Mutually agreed rental payments", icon: LuHandshake },
  { title: "Productive Use", description: "Supports agricultural growth", icon: LuSprout },
];

const stakeholders = [
  {
    title: "For Landowners",
    icon: LuHardHat,
    color: "bg-[#fff0c9] text-[#9d6b16]",
    benefits: ["An agreed rental income", "Less day-to-day farm management", "Land put to agricultural use", "Clear responsibilities and rental terms"],
  },
  {
    title: "For Companies",
    icon: LuLandmark,
    color: "bg-[#d9f2fc] text-[#237d9f]",
    benefits: ["Access to suitable agricultural land", "Options for longer-term planning", "Support for organized farming", "Opportunities to invest in agri-innovation"],
  },
  {
    title: "For Society",
    icon: LuSprout,
    color: "bg-[#dcf4df] text-[#0e954c]",
    benefits: ["More productive use of farmland", "Opportunities for rural employment", "Better use of underutilized land", "Support for local food production"],
  },
];

const rentalRates = [
  { land: "Irrigated Land", rent: "₹20,000 – ₹40,000", notes: "Access to irrigation" },
  { land: "Semi-Irrigated Land", rent: "₹12,000 – ₹25,000", notes: "Partial irrigation access" },
  { land: "Non-Irrigated Land", rent: "₹8,000 – ₹15,000", notes: "Rain-fed cultivation" },
];

const guidelines = [
  { text: "Agree on the permitted agricultural use of the land.", icon: LuLeaf },
  { text: "Set the lease period in accordance with applicable state law.", icon: LuFileText },
  { text: "Use a written agreement and complete registration where required.", icon: LuShieldCheck },
  { text: "Document the rental amount, payment schedule and any permitted revisions.", icon: LuUsersRound },
  { text: "Clarify ownership, possession and handover terms before signing.", icon: LuTrees },
  { text: "Follow applicable environmental and land-use requirements.", icon: LuCircleCheck },
];

const steps = [
  { title: "Register Your Land", description: "Submit your land details and documents." },
  { title: "Get Verified", description: "Have ownership and land records reviewed." },
  { title: "Connect with Companies", description: "Discuss interest, requirements and proposed terms." },
  { title: "Sign Agreement", description: "Finalize the lease and agreed rental payments." },
];

const faqs = [
  {
    question: "Who can lease their land?",
    answer: "Eligibility depends on the state’s land and tenancy laws, the land category and the owner’s rights. Confirm ownership records, any co-owner consent and local restrictions before offering land for lease.",
  },
  {
    question: "Can the land be used for non-agricultural purposes?",
    answer: "This service is intended for agricultural leasing. Other uses may require separate land-use permissions or conversion approvals under local law and cannot be assumed to be allowed by a farm lease.",
  },
  {
    question: "How is the rental rate decided?",
    answer: "Rent can depend on location, soil quality, irrigation, access, lease duration and local market conditions. Agree on the amount and payment schedule within applicable legal requirements. The figures on this page are illustrative examples.",
  },
  {
    question: "What is the maximum lease period?",
    answer: "There is no single lease period presented here for all states. The permissible duration depends on applicable state law and the land category. Confirm those requirements before agreeing on a term or renewal.",
  },
];

export default function LandLeasingPage() {
  return (
    <main id="land-leasing" className="overflow-hidden bg-white text-[#153e38]">
      <section aria-labelledby="leasing-heading" className="relative isolate overflow-hidden border-t-4 border-[#edf5f3]">
        <Image src="/images/image3.png" alt="Farm workers cultivating a green agricultural field" fill preload sizes="100vw" className="-z-20 object-cover object-[center_20%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#f3fcf7]/98 via-[#f3fcf7]/90 to-[#f3fcf7]/40 lg:via-[#f3fcf7]/75 lg:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-14">
          <div className="max-w-[610px]">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#198f48]">Land Leasing Policy</p>
            <h1 id="leasing-heading" className="mt-3 text-4xl font-bold leading-[1.12] tracking-[-0.03em] sm:text-5xl">Your Land.<br />Greater Possibilities.</h1>
            <p className="mt-4 max-w-[500px] text-base leading-7 text-[#355956]">
              A transparent land leasing framework that connects landowners
              with agricultural companies for productive and sustainable land use.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#overview" className={buttonClass}>Learn About the Policy <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <Link href="/registration" className="inline-flex items-center justify-center rounded-full border border-[#12934e] bg-white/90 px-6 py-3 text-sm font-semibold text-[#078446] transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">Register Your Land</Link>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dff3e5] text-[#0b924a]"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-4 text-[#4f706b]">{description}</p></div>
                </div>
              ))}
            </div>
          </div>
          <p className="absolute right-12 top-9 hidden rotate-[-6deg] rounded-2xl bg-white/85 px-5 py-4 text-center font-serif text-2xl italic leading-8 text-[#236848] xl:block">
            Partnering<br />for a Greener<br />Tomorrow
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-7 sm:px-10 lg:px-12">
        <section id="overview" aria-labelledby="overview-heading" className="grid scroll-mt-6 gap-7 lg:grid-cols-[0.9fr_1.2fr]">
          <div className="relative isolate min-h-[270px] overflow-hidden rounded-xl lg:min-h-[290px]">
            <Image src="/images/registration.png" alt="Tractor working among rows of green crops" fill sizes="(max-width: 1023px) 90vw, 520px" className="-z-20 object-cover object-[center_65%]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-[#102d17]/80 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 right-4 text-2xl font-bold leading-tight text-white sm:text-3xl">“Productive Land,<br />Stronger Communities”</p>
          </div>
          <div className="self-center">
            <h2 id="overview-heading" className="text-3xl font-bold tracking-tight">Overview</h2>
            <p className="mt-3 text-base leading-7 text-[#607d80]">
              Agricultural land leasing connects landowners with operators who
              can put their land to productive use. A clear agreement sets out
              the rental terms, responsibilities and permitted activities,
              helping both parties plan for a sustainable farming partnership.
            </p>
            <div className="mt-4 flex items-start gap-4 rounded-xl bg-[#edf8f2] p-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d8f2e0] text-[#10934d]"><LuScrollText className="h-8 w-8" aria-hidden="true" /></span>
              <div>
                <h3 className="text-base font-bold">Policy Objective</h3>
                <p className="mt-1 text-sm leading-6 text-[#587875]">Encourage responsible agricultural leasing that supports landowners, cultivators and rural communities, within applicable state laws.</p>
                <a href={modelPolicyUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#07894a] hover:underline">Read the model policy <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="stakeholders-heading" className="mt-7">
          <h2 id="stakeholders-heading" className="text-2xl font-bold tracking-tight">Benefits for All Stakeholders</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {stakeholders.map(({ title, icon: Icon, color, benefits }) => (
              <article key={title} className="flex items-start gap-4 rounded-xl border border-[#e0ebe7] bg-[#f7fbfa] p-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color}`}><Icon className="h-8 w-8" aria-hidden="true" /></span>
                <div className="pt-2">
                  <h3 className="text-base font-bold">{title}</h3>
                  <ul className="mt-3 space-y-2">
                    {benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2 text-sm leading-5 text-[#4f706b]"><LuCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#09964a]" aria-hidden="true" />{benefit}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section aria-label="Rental rates and leasing guidelines" className="relative isolate overflow-hidden bg-[#eaf7ef]">
        <Image src="/images/image1.png" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-15" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-[#eaf8f1] via-[#eaf8f1]/95 to-[#eaf8f1]/65" />
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-7 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Rental Rates</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#577671]">Rent depends on location, land quality, irrigation availability and local market conditions.</p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-[#dfeae5] bg-white">
              <table className="w-full min-w-[420px] text-left text-sm">
                <caption className="sr-only">Illustrative annual rental rates per acre, not official rates</caption>
                <thead className="bg-[#f1f7f5] text-xs">
                  <tr><th scope="col" className="px-4 py-3 font-semibold">Land Type</th><th scope="col" className="px-4 py-3 font-semibold">Illustrative Annual Rent<br />(per acre)</th><th scope="col" className="px-4 py-3 font-semibold">Notes</th></tr>
                </thead>
                <tbody>
                  {rentalRates.map(({ land, rent, notes }) => (
                    <tr key={land} className="border-t border-[#e6efeb] text-[#4f706b]"><th scope="row" className="px-4 py-3 font-medium">{land}</th><td className="whitespace-nowrap px-4 py-3">{rent}</td><td className="px-4 py-3">{notes}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#4f706b]">* Example figures for illustration, not government-prescribed rates. Actual rents and leasing rules vary by state and agreement.</p>
          </div>

          <div id="guidelines" className="scroll-mt-6">
            <h2 className="text-2xl font-bold tracking-tight">Key Policy Guidelines</h2>
            <ul className="mt-4 space-y-3 rounded-xl bg-white/85 p-5">
              {guidelines.map(({ text, icon: Icon }) => <li key={text} className="flex items-start gap-4 text-sm leading-5 text-[#4f706b]"><Icon className="h-5 w-5 shrink-0 text-[#0a944b]" aria-hidden="true" />{text}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.5fr_1fr] lg:px-12">
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-2xl font-bold tracking-tight">How It Works</h2>
          <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-4">
            {steps.map(({ title, description }, index) => (
              <li key={title} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#bce6c9] text-xl font-bold text-[#078f45]">{index + 1}</span>
                {index < steps.length - 1 && <div aria-hidden="true" className="absolute left-[calc(50%+28px)] right-[calc(-50%+18px)] top-5 hidden border-t border-[#c9e5dc] sm:block"><LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#c9e5dc]" /></div>}
                <h3 className="mt-3 text-sm font-bold leading-5">{title}</h3>
                <p className="mt-2 text-sm leading-5 text-[#607d80]">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="faq-heading" className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <a href={modelPolicyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#078c48] hover:underline">View Policy <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
          </div>
          <div className="space-y-2">
            {faqs.map(({ question, answer }) => (
              <details key={question} name="land-leasing-faq" className="group rounded-lg border border-[#e0eae6] bg-[#f8fbfa] open:bg-[#edf8f1]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm text-[#476b64] focus-visible:outline-2 focus-visible:outline-green-700 [&::-webkit-details-marker]:hidden">{question}<LuChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <p className="border-t border-[#e0eae6] px-4 py-3 text-sm leading-6 text-[#607d80]">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section aria-labelledby="register-heading" className="relative isolate overflow-hidden px-6 pb-16 pt-10 text-center sm:pb-20 sm:pt-12">
        <Image src="/images/image1.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-[#f7fbef]/95 via-[#f7fbef]/90 to-[#f7fbef]/10" />
        <div className="relative mx-auto max-w-7xl">
          <h2 id="register-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Turn Your Land into Lasting Opportunities</h2>
          <p className="mt-3 text-base text-[#456b5d]">Be a part of a sustainable agricultural future.</p>
          <Link href="/registration" className={`${buttonClass} mt-5`}>Register Your Land <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          <p className="absolute -right-2 top-5 hidden rotate-[-5deg] rounded-2xl bg-[#11733e]/95 px-7 py-5 font-serif text-2xl italic leading-8 text-white xl:block">Cultivating<br />Partnerships<br />for Progress</p>
        </div>
      </section>

      <footer className="bg-[#063e34] text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-5 border-b border-white/10 py-5 sm:flex-row">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold"><LuSprout className="h-7 w-7" aria-hidden="true" />AgriConnect</Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-[#d3e6dd]">
              <Link href="/" className="hover:text-white hover:underline">Home</Link>
              <Link href="/#about" className="hover:text-white hover:underline">About</Link>
              <a href="#land-leasing" className="hover:text-white hover:underline">Land Leasing</a>
              <a href="#guidelines" className="hover:text-white hover:underline">Policies</a>
              <a href={modelPolicyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Resources</a>
            </nav>
            <div className="flex gap-4 text-[#d3e6dd]" aria-label="Responsible agricultural partnerships"><LuLeaf className="h-5 w-5" aria-hidden="true" /><LuHandshake className="h-5 w-5" aria-hidden="true" /><LuClipboardCheck className="h-5 w-5" aria-hidden="true" /></div>
          </div>
          <p className="py-4 text-xs text-[#bdd3c9]">© 2026 AgriConnect. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
