"use client";

import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";
import { ImLeaf } from "react-icons/im";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#06291f] text-white">
      {/* Decorative farm background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[82px] h-52 opacity-20">
        <svg
          viewBox="0 0 1440 220"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 180 C150 130 260 140 390 180 C520 215 620 145 760 160 C900 175 1000 230 1140 175 C1250 130 1360 140 1440 120 V220 H0 Z"
            fill="#73c365"
          />

          <path
            d="M0 205 C160 165 280 165 430 205"
            stroke="#73c365"
            strokeWidth="3"
            fill="none"
          />

          <path
            d="M920 220 C1080 145 1250 120 1440 125"
            stroke="#73c365"
            strokeWidth="3"
            fill="none"
          />

          <path
            d="M980 220 C1120 160 1260 145 1440 150"
            stroke="#73c365"
            strokeWidth="3"
            fill="none"
          />

          <path
            d="M1040 220 C1160 175 1300 170 1440 178"
            stroke="#73c365"
            strokeWidth="3"
            fill="none"
          />

          {/* simple barn */}
          <rect x="190" y="155" width="100" height="55" fill="#73c365" />
          <polygon points="180,155 240,115 300,155" fill="#73c365" />
          <rect x="225" y="180" width="30" height="30" fill="#06291f" />

          {/* silo */}
          <rect x="305" y="125" width="28" height="85" fill="#73c365" />
          <ellipse cx="319" cy="125" rx="14" ry="9" fill="#73c365" />

          {/* trees */}
          <circle cx="55" cy="170" r="24" fill="#73c365" />
          <rect x="52" y="170" width="6" height="40" fill="#73c365" />

          <circle cx="120" cy="183" r="18" fill="#73c365" />
          <rect x="117" y="183" width="6" height="28" fill="#73c365" />

          <circle cx="360" cy="180" r="18" fill="#73c365" />
          <rect x="357" y="180" width="6" height="30" fill="#73c365" />

          {/* right plant */}
          <path
            d="M1280 190 V110"
            stroke="#73c365"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <ellipse
            cx="1262"
            cy="135"
            rx="26"
            ry="10"
            fill="#73c365"
            transform="rotate(-35 1262 135)"
          />
          <ellipse
            cx="1300"
            cy="155"
            rx="25"
            ry="10"
            fill="#73c365"
            transform="rotate(35 1300 155)"
          />
        </svg>
      </div>

      {/* Main footer */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-14 md:px-10 lg:px-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_0.8fr_1.15fr_1.35fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600/15">
                <ImLeaf className="text-4xl text-green-400" />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  Agri<span className="text-green-400">Connect</span>
                </h2>
                <p className="text-sm text-slate-300">
                  Farms Today. Brighter Tomorrows.
                </p>
              </div>
            </div>

            <p className="mt-7 max-w-sm text-[15px] leading-7 text-slate-300">
              Connecting farmers, landowners, buyers and service providers for a
              stronger, more sustainable agricultural ecosystem.
            </p>

            <div className="mt-7 flex gap-3">
              <SocialIcon>
                <FiLinkedin />
              </SocialIcon>

              <SocialIcon>
                <FiTwitter />
              </SocialIcon>

              <SocialIcon>
                <FiInstagram />
              </SocialIcon>

              <SocialIcon>
                <FiYoutube />
              </SocialIcon>
            </div>

            <p className="mt-9 rotate-[-4deg] text-xl italic text-slate-200">
              Growing Together
              <br />
              for a Better Tomorrow
            </p>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/products">Products</FooterLink>
            <FooterLink href="/storage">Storage Services</FooterLink>
            <FooterLink href="/farm-services">Farm Services</FooterLink>
            <FooterLink href="/equipment">Equipment Rental</FooterLink>
            <FooterLink href="/farmers">For Farmers</FooterLink>
            <FooterLink href="/landowners">For Landowners</FooterLink>
            <FooterLink href="/buyers">For Buyers</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
          </FooterColumn>

          {/* Services */}
          <FooterColumn title="Our Services">
            <FooterLink href="/products">Buy Agricultural Products</FooterLink>
            <FooterLink href="/sell">List Your Produce</FooterLink>
            <FooterLink href="/equipment">
              Rent Agricultural Equipment
            </FooterLink>
            <FooterLink href="/contract-services">
              Contract Farming Services
            </FooterLink>
            <FooterLink href="/warehouse">Warehouse Storage</FooterLink>
            <FooterLink href="/irrigation">Irrigation Services</FooterLink>
            <FooterLink href="/ploughing">Ploughing & Tilling</FooterLink>
            <FooterLink href="/harvesting">Harvesting Services</FooterLink>
            <FooterLink href="/crop-advisory">Crop Advisory</FooterLink>
            <FooterLink href="/soil-testing">Soil Testing</FooterLink>
            <FooterLink href="/transport">
              Transportation & Logistics
            </FooterLink>
          </FooterColumn>

          {/* Company */}
          <FooterColumn title="Company">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/mission">Our Mission</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/press">Press & Media</FooterLink>
            <FooterLink href="/partner">Partner With Us</FooterLink>
            <FooterLink href="/stories">Success Stories</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/cookies">Cookie Policy</FooterLink>
            <FooterLink href="/refund">Refund & Cancellation</FooterLink>
            <FooterLink href="/sitemap">Sitemap</FooterLink>
          </FooterColumn>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold">Get in Touch</h3>

            <div className="space-y-6 text-sm text-slate-300">
              <div className="flex gap-4">
                <FiMapPin className="mt-1 shrink-0 text-2xl text-white" />

                <p className="leading-6">
                  123 Green Valley Road
                  <br />
                  New Delhi, India – 110001
                </p>
              </div>

              <div className="flex gap-4">
                <FiPhone className="mt-1 shrink-0 text-2xl text-white" />

                <div>
                  <p className="text-base text-white">+91 98765 43210</p>
                  <p className="mt-1 text-xs">
                    Mon – Sat, 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FiMail className="shrink-0 text-2xl text-white" />

                <p>support@agriconnect.com</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold">Download Our App</h3>

              <p className="mt-2 text-sm text-slate-300">
                Manage your farm, anytime, anywhere.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <StoreButton
                  small="GET IT ON"
                  big="Google Play"
                />

                <StoreButton
                  small="Download on the"
                  big="App Store"
                />
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-l border-white/10 pl-0 lg:pl-8">
            <h3 className="text-xl font-bold">
              Subscribe to Our Newsletter
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Get the latest updates, market insights and farming tips.
            </p>

            <form
              className="mt-6 flex overflow-hidden rounded-lg bg-white"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 items-center gap-3 px-4">
                <FiMail className="text-xl text-slate-500" />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent py-4 text-sm text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-green-700 px-5 font-semibold text-white transition hover:bg-green-600"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-8 border-t border-white/30 pt-6">
              <div className="flex items-start gap-4">
                <ImLeaf className="mt-1 shrink-0 text-2xl text-green-400" />

                <p className="text-sm leading-6 text-slate-300">
                  No spam. Only useful updates
                  <br />
                  for a better tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/20 bg-black/10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-6 py-6 text-sm text-slate-300 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <p>© 2026 AgriConnect. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/terms" className="hover:text-white">
              Terms of Service
            </a>

            <span className="hidden text-white/30 md:block">|</span>

            <a href="/privacy" className="hover:text-white">
              Privacy Policy
            </a>

            <span className="hidden text-white/30 md:block">|</span>

            <a href="/cookies" className="hover:text-white">
              Cookie Policy
            </a>

            <span className="hidden text-white/30 md:block">|</span>

            <a href="/refund" className="hover:text-white">
              Refund Policy
            </a>

            <span className="hidden text-white/30 md:block">|</span>

            <a href="/sitemap" className="hover:text-white">
              Sitemap
            </a>
          </div>

          <div className="flex items-center gap-3 text-green-300">
            <ImLeaf className="text-3xl" />

            <span>
              Sustainable Agriculture. Stronger Communities.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-6 text-xl font-bold">{title}</h3>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm text-slate-300 transition hover:translate-x-1 hover:text-green-300"
    >
      {children}
    </a>
  );
}

function SocialIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-green-600">
      {children}
    </button>
  );
}

function StoreButton({
  small,
  big,
}: {
  small: string;
  big: string;
}) {
  return (
    <button className="min-w-[170px] rounded-md border border-sky-400 bg-black px-4 py-2 text-left transition hover:bg-neutral-900">
      <span className="block text-[10px] leading-none text-white">
        {small}
      </span>

      <span className="mt-1 block text-xl font-semibold leading-none">
        {big}
      </span>
    </button>
  );
}