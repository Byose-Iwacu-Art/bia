import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Careers | Byose Iwacu Art",
  description: "Join the BIA team and help celebrate African art and craftsmanship with the world.",
};

const perks = [
  { icon: "bi-globe-africa", title: "African Impact", desc: "Your work directly supports artisans and helps preserve African cultural heritage." },
  { icon: "bi-laptop", title: "Remote Friendly", desc: "Work from anywhere in Rwanda or East Africa with flexible scheduling." },
  { icon: "bi-graph-up-arrow", title: "Grow with Us", desc: "We're a growing startup — your role and impact expand as BIA scales." },
  { icon: "bi-people-fill", title: "Tight-Knit Team", desc: "A passionate, diverse team that values creativity, honesty, and collaboration." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-6">
            <i className="bi bi-briefcase-fill"></i>
            Careers
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Build Africa&apos;s{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Art Economy
            </span>
          </h1>
          <p className="text-gray-300 text-[16px] sm:text-[17px] leading-relaxed">
            Join a team that's connecting African artisans to the world. We're passionate about culture, creativity, and technology.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-14 px-4 space-y-14">

        {/* Perks */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Why work at BIA?</h2>
            <p className="text-gray-500 text-[14px]">More than a job — a mission.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`bi ${p.icon} text-orange-500 text-2xl`}></i>
                </div>
                <h3 className="font-bold text-gray-800 text-[14px] mb-2">{p.title}</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open positions */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">Open Positions</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <i className="bi bi-briefcase text-orange-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">No open positions right now</h3>
            <p className="text-gray-500 text-[14px] leading-relaxed max-w-md mx-auto mb-6">
              We don&apos;t have any listed positions at the moment, but we&apos;re always interested in hearing from talented people who are passionate about African art and technology.
            </p>
            <p className="text-[13px] text-gray-500 mb-6">
              Send us your CV and a short introduction — we&apos;ll keep you in mind for future opportunities.
            </p>
            <Link
              href="/contact-us"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-full transition-colors inline-flex items-center gap-2"
            >
              <i className="bi bi-send-fill"></i>
              Send Your Application
            </Link>
          </div>
        </div>

        {/* Artisan partnership */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-extrabold mb-3">Are you an artisan?</h2>
              <p className="text-white/80 text-[14px] leading-relaxed mb-5">
                If you create African art, fashion, jewelry, or crafts — we&apos;d love to feature your work on BIA. Join our growing community of artisan partners and reach customers worldwide.
              </p>
              <Link
                href="/contact-us"
                className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors inline-flex items-center gap-2 text-[13px]"
              >
                <i className="bi bi-palette-fill"></i> Partner with Us
              </Link>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-3">
              {[["50+", "Artisan Partners"], ["10+", "Countries Reached"], ["1000+", "Products Sold"], ["100%", "Fair Trade"]].map(([n, l]) => (
                <div key={l} className="bg-white/20 rounded-xl p-4">
                  <p className="text-2xl font-extrabold">{n}</p>
                  <p className="text-white/70 text-[12px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
