
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChartNoAxesColumnIncreasing,
  LuCheck,
  LuChevronDown,
  LuCoins,
  LuCreditCard,
  LuFileText,
  LuHandCoins,
  LuIndianRupee,
  LuLeaf,
  LuPercent,
  LuShieldCheck,
  LuSprout,
  LuUsersRound,
  LuClipboardCheck,
  LuHandshake
} from "react-icons/lu";
/*
export const metadata: Metadata = {
  title: "Agricultural Loans",
  description: "Explore agricultural credit, government schemes, eligibility requirements, and the steps to apply for farm finance.",
};*/

const primaryButton = "inline-flex items-center justify-center gap-3 rounded-full bg-[#009849] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08773e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700";
const textLink = "inline-flex items-center gap-1.5 text-sm font-semibold text-[#078a47] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700";

const highlights = [
  { title: "Easy Access", description: "Explore your borrowing options", icon: LuHandCoins },
  { title: "Lower Interest Rates", description: "Concessions on eligible loans", icon: LuPercent },
  { title: "Government Backed", description: "Discover public support schemes", icon: LuCoins },
  { title: "Support for Growth", description: "Invest in a better tomorrow", icon: LuSprout },
];

const benefits = [
  { title: "Improve Productivity", description: "Buy quality seeds, fertilizers and equipment.", icon: LuSprout },
  { title: "Expand Operations", description: "Invest in your farm and adopt modern techniques.", icon: LuChartNoAxesColumnIncreasing },
  { title: "Financial Stability", description: "Plan for seasonal expenses and working capital.", icon: LuShieldCheck },
  { title: "Better Livelihood", description: "Build opportunities for farmers and their families.", icon: LuUsersRound },
];

const policies = [
  { title: "Priority Sector Lending", description: "Agriculture is a priority sector, helping direct bank credit to farming.", icon: LuFileText },
  { title: "Interest Subvention", description: "Eligible borrowers can access interest support under government schemes.", icon: LuIndianRupee },
  { title: "Credit Guarantee", description: "Selected schemes provide guarantees to support eligible agricultural lending.", icon: LuShieldCheck },
];

const schemes = [
  {
    title: "Kisan Credit Card (KCC)",
    description: "Credit for crop production and other eligible agricultural needs.",
    href: "https://www.myscheme.gov.in/schemes/kcc",
    icon: LuCreditCard,
    background: "border-[#d9efe3] bg-[#edf9f2]",
    iconColor: "bg-[#c9f0d6] text-[#128b4c]",
    linkColor: "text-[#078a47]",
  },
  {
    title: "PM-KISAN",
    description: "Income support for eligible landholding farmer families.",
    href: "https://pmkisan.gov.in/",
    icon: LuUsersRound,
    background: "border-[#deedf6] bg-[#edf8fe]",
    iconColor: "bg-[#cceefe] text-[#168abb]",
    linkColor: "text-[#1382b5]",
  },
  {
    title: "Agriculture Infrastructure Fund (AIF)",
    description: "Financing for eligible post-harvest infrastructure and community farming assets.",
    href: "https://agriinfra.dac.gov.in/",
    icon: LuSprout,
    background: "border-[#f4edcc] bg-[#fffbea]",
    iconColor: "bg-[#fff0b7] text-[#8a9525]",
    linkColor: "text-[#078a47]",
  },
];

const eligibility = [
  "Be a farmer or engaged in eligible agricultural activities",
  "Have identity and land, lease or cultivation documents, as applicable",
  "Meet the lender’s credit and repayment requirements",
  "Use the loan for an eligible agricultural purpose",
];

const applicationSteps = [
  { title: "Check Eligibility", description: "Review the selected scheme’s requirements." },
  { title: "Fill Application", description: "Apply through the lender online or at a branch." },
  { title: "Document Verification", description: "Submit the documents requested by your lender." },
  { title: "Get Loan Approval", description: "On approval, receive funds and start your journey." },
];

const faqs = [
  {
    question: "What is an agricultural loan?",
    answer: "An agricultural loan helps finance eligible farming activities, such as crop cultivation, equipment, working capital and agricultural infrastructure. Its purpose and repayment terms depend on the loan product.",
  },
  {
    question: "Who can apply for these loans?",
    answer: "Eligibility depends on the scheme. Kisan Credit Card applicants can include eligible owner-cultivators, tenant farmers, oral lessees, sharecroppers and certain farmer groups. Check the selected scheme and lender’s requirements before applying.",
  },
  {
    question: "What is the interest rate?",
    answer: "Interest rates vary by lender, loan type and scheme. Interest support or repayment incentives may apply to eligible borrowing. Review the current rate, charges and repayment schedule with your lender.",
  },
  {
    question: "Are there any government subsidies?",
    answer: "Some schemes offer interest support, credit guarantees or other assistance, subject to their conditions. PM-KISAN provides income support to eligible farmer families. Follow the official scheme links above for current benefits and eligibility.",
  },
];


export default function AgriculturalLoansPage() {

  return (
    <main className="overflow-hidden bg-white text-[#153e38]">
      <section aria-labelledby="loans-heading" className="relative isolate overflow-hidden border-t-4 border-[#ddf0ed]">
        <Image src="/images/image3.png" alt="Farm workers tending green crops" fill preload sizes="100vw" className="-z-20 object-cover object-[center_24%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#f2fcf6]/98 via-[#f2fcf6]/90 to-[#f2fcf6]/35 lg:via-[#f2fcf6]/75 lg:to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
          <div className="max-w-[640px]">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#1b994e]">Agricultural Loans</p>
            <h1 id="loans-heading" className="mt-3 max-w-xl text-4xl font-bold leading-[1.12] tracking-[-0.03em] sm:text-5xl lg:text-[52px]">
              Financial Support<br className="hidden sm:block" /> for a Brighter Tomorrow
            </h1>
            <p className="mt-5 max-w-[550px] text-base leading-7 text-[#355956]">
              Empowering farmers with access to loans, government schemes,
              and resources for sustainable growth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#loan-schemes" className={primaryButton}>Explore Loan Schemes <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href="#eligibility" className="inline-flex items-center justify-center rounded-full border border-[#139550] bg-white/90 px-7 py-3 text-sm font-semibold text-[#078a47] transition-colors hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">Check Eligibility</a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Agricultural finance at a glance" className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-12">
        {highlights.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e2f6e9] text-[#079a4b]">
              <Icon className="h-8 w-8" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold">{title}</h2>
              <p className="mt-1 text-sm leading-5 text-[#607d80]">{description}</p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="benefits-heading" className="mx-auto grid max-w-7xl gap-8 px-6 pb-8 pt-2 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div className="relative isolate min-h-[300px] overflow-hidden rounded-xl sm:min-h-[340px]">
          <Image src="/images/image1.png" alt="Farmers harvesting a field with agricultural equipment" fill sizes="(max-width: 1023px) 90vw, 520px" className="-z-20 object-cover object-[60%_center]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#102f17]/75 via-[#102f17]/30 to-transparent" />
          <p className="absolute bottom-8 left-7 text-3xl font-bold leading-[1.18] tracking-tight text-white sm:bottom-10 sm:left-9 sm:text-4xl">
            Invest in<br />Farms.<br />Invest in<br />Food Security.
          </p>
        </div>
        <div className="self-center">
          <h2 id="benefits-heading" className="text-2xl font-bold tracking-tight">Benefits of Agricultural Loans</h2>
          <p className="mt-2 text-base leading-6 text-[#607d80]">
            Agricultural loans help farmers meet their financial needs and improve
            productivity. They provide capital for seeds, equipment, irrigation and more.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {benefits.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex items-start gap-3 rounded-xl border border-[#e7eeeb] bg-[#f9fbfa] p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e3f7eb] text-[#0a9d4b]">
                  <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <div className="pt-1">
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-[#607d80]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="policies-heading" className="bg-[#eaf7f0]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.15fr_2fr] lg:px-12">
          <div>
            <h2 id="policies-heading" className="text-2xl font-bold leading-tight tracking-tight">Key Policies for<br />Agricultural Loans</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#607d80]">Public policies and financial institutions support access to agricultural credit for eligible farmers.</p>
            <a href="https://rbi.org.in/scripts/faqview.aspx?id=87" target="_blank" rel="noopener noreferrer" className={`${primaryButton} mt-4`}>View Policy Details <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {policies.map(({ title, description, icon: Icon }) => (
              <article key={title} className="border-t border-[#d2e9de] pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c0ebcf] text-[#0d9750]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#607d80]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-7 sm:px-10 lg:px-12">
        <div className="grid gap-7 lg:grid-cols-[1.65fr_1fr]">
          <section id="loan-schemes" aria-labelledby="schemes-heading" className="scroll-mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="schemes-heading" className="text-2xl font-bold tracking-tight">Popular Government Schemes</h2>
              <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className={textLink}>View All Schemes <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {schemes.map(({ title, description, href, icon: Icon, background, iconColor, linkColor }) => (
                <article key={title} className={`flex flex-col rounded-xl border p-5 ${background}`}>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full ${iconColor}`}><Icon className="h-7 w-7" aria-hidden="true" /></span>
                  <h3 className="mt-4 text-sm font-bold leading-5">{title}</h3>
                  <p className="mb-4 mt-2 text-sm leading-5 text-[#607d80]">{description}</p>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Learn more about ${title}`} className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 ${linkColor}`}>
                    Learn More <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section id="eligibility" aria-labelledby="eligibility-heading" className="scroll-mt-6 rounded-xl bg-[#f0f8f4] p-6">
            <h2 id="eligibility-heading" className="text-xl font-bold tracking-tight">Eligibility Criteria</h2>
            <ul className="mt-4 space-y-3">
              {eligibility.map((requirement) => (
                <li key={requirement} className="flex items-start gap-3 text-sm leading-5 text-[#607d80]">
                  <span className="mt-1 rounded-full bg-[#21aa60] p-0.5 text-white"><LuCheck className="h-3 w-3" strokeWidth={3} aria-hidden="true" /></span>
                  {requirement}
                </li>
              ))}
            </ul>
            <a href="https://www.myscheme.gov.in/schemes/kcc" target="_blank" rel="noopener noreferrer" className={`${primaryButton} mt-5`}>Check Your Eligibility <LuArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section aria-labelledby="apply-heading">
            <h2 id="apply-heading" className="text-2xl font-bold tracking-tight">How to Apply</h2>
            <ol className="mt-5 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 sm:gap-x-4">
              {applicationSteps.map(({ title, description }, index) => (
                <li key={title} className="relative text-center">
                  <span className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#bae3c7] text-lg font-bold text-[#0c9149]">{index + 1}</span>
                  {index < applicationSteps.length - 1 && <div aria-hidden="true" className="absolute left-[calc(50%+28px)] right-[calc(-50%+18px)] top-5 hidden border-t border-[#c7e4da] sm:block"><LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#c7e4da]" /></div>}
                  <h3 className="mt-3 text-sm font-bold leading-5">{title}</h3>
                  <p className="mt-1 text-sm leading-5 text-[#607d80]">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="faq-heading">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="faq-heading" className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <a href="https://www.myscheme.gov.in/schemes/kcc" target="_blank" rel="noopener noreferrer" className={textLink}>View All <LuArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
            </div>
            <div className="space-y-2">
              {faqs.map(({ question, answer }) => (
                <details key={question} name="agricultural-loan-faq" className="group rounded-lg border border-[#e2eae7] bg-[#f8faf9] open:bg-[#f0f8f3]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm text-[#476969] focus-visible:outline-2 focus-visible:outline-green-600 [&::-webkit-details-marker]:hidden">
                    {question}<LuChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="border-t border-[#e2eae7] px-4 py-3 text-sm leading-6 text-[#607d80]">{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="start-heading" className="relative isolate overflow-hidden px-6 pb-7 pt-8 text-center sm:pb-6 sm:pt-10">
        <Image src="/images/registration.png" alt="" fill sizes="100vw" className="-z-20 object-cover object-[center_55%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-[#f7f9ed]/95 via-[#fff9dd]/85 to-[#668c22]/20" />
        <h2 id="start-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Stronger Farmers. A Greener Tomorrow.</h2>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-6 text-[#486a5a]">Explore agricultural loan options and take the next step towards a prosperous future.</p>
        <Link href="/registration" className={`${primaryButton} mt-4`}>Get Started <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        <div className="mx-auto mt-7 flex max-w-7xl justify-center lg:justify-end">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 rounded-2xl bg-[#496c1f]/80 px-5 py-4 text-white backdrop-blur-sm">
            {[
              { label: "Support Farmers", icon: LuHandCoins },
              { label: "Sustain Agriculture", icon: LuLeaf },
              { label: "Build Communities", icon: LuBadgeCheck },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-2 text-xs font-medium"><Icon className="h-7 w-7 shrink-0" aria-hidden="true" /><span className="max-w-20 text-left leading-4">{label}</span></span>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#063e34] text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-5 border-b border-white/10 py-5 sm:flex-row">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <LuSprout className="h-7 w-7" aria-hidden="true" />
            AgriIndia
            </Link>
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-[#d3e6dd]">
              <Link href="/" className="hover:text-white hover:underline">Home</Link>
              <Link href="/#about" className="hover:text-white hover:underline">About</Link>
              <a href="#land-leasing" className="hover:text-white hover:underline">Agricultural Loan</a>
              <a href="#guidelines" className="hover:text-white hover:underline">Policies</a>
            </nav>
            <div className="flex gap-4 text-[#d3e6dd]" aria-label="Responsible agricultural partnerships">
              <LuLeaf className="h-5 w-5" aria-hidden="true" />
              <LuHandshake className="h-5 w-5" aria-hidden="true" />
              <LuClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
          </div>
          <p className="py-4 text-xs text-[#bdd3c9]">© 2026 AgriIndia. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
