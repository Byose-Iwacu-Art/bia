"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import 'bootstrap-icons/font/bootstrap-icons.css';

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
    }
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Story", href: "/about" },
        { label: "Tailors College", href: "https://tailors.biafricantouch.com", external: true },
        { label: "Developers", href: "https://kamero.rw", external: true },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products" },
        { label: "Categories", href: "/products" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact-us" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns & Refunds", href: "/returns" },
        { label: "Track Order", href: "/dash/orders" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "bi-instagram", href: "#", color: "hover:text-pink-400", label: "Instagram" },
    { icon: "bi-facebook", href: "#", color: "hover:text-blue-400", label: "Facebook" },
    { icon: "bi-youtube", href: "#", color: "hover:text-red-400", label: "YouTube" },
    { icon: "bi-linkedin", href: "#", color: "hover:text-blue-300", label: "LinkedIn" },
    { icon: "bi-twitter-x", href: "#", color: "hover:text-gray-200", label: "X/Twitter" },
  ];

  const paymentMethods = [
    { icon: "bi-phone-fill", label: "MTN MoMo", color: "text-yellow-400" },
    { icon: "bi-phone-fill", label: "Airtel Money", color: "text-red-400" },
    { icon: "bi-credit-card-fill", label: "Visa", color: "text-blue-400" },
    { icon: "bi-credit-card", label: "Mastercard", color: "text-orange-400" },
    { icon: "bi-bank2", label: "Bank Transfer", color: "text-green-400" },
  ];

  return (
    <div className="w-full">
      {/* ── NEWSLETTER SECTION ──────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#0a0800] py-16 px-4 sm:px-10">
        {/* Gold glow blobs — matching logo metallic palette */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-yellow-600/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 rounded-full bg-amber-400/8 blur-2xl" />
        {/* Subtle gold shimmer line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5"
          >
            <i className="bi bi-envelope-heart-fill"></i>
            Newsletter
          </motion.div>

          {/* Heading */}
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight"
          >
            Stay in the{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              loop
            </span>
          </motion.h3>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-stone-400 text-[14px] mb-8 leading-relaxed"
          >
            Get the latest products, exclusive deals, and African art inspiration delivered to your inbox.
          </motion.p>

          {/* Form / Success */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.26 }}
          >
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold px-6 py-3 rounded-full text-[15px]">
                <i className="bi bi-check-circle-fill text-xl"></i>
                You&apos;re subscribed! Thank you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3 rounded-full text-white text-[14px] outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/5 border border-white/10 placeholder:text-stone-600 backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-black font-bold px-6 py-3 rounded-full text-[14px] transition-all whitespace-nowrap shadow-lg shadow-amber-500/25"
                >
                  Subscribe <i className="bi bi-arrow-right ml-1"></i>
                </button>
              </form>
            )}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[12px] text-stone-500"
          >
            <span className="flex items-center gap-1.5"><i className="bi bi-people-fill text-amber-500/70"></i>2,000+ subscribers</span>
            <span className="hidden sm:block w-px h-3 bg-stone-800"></span>
            <span className="flex items-center gap-1.5"><i className="bi bi-shield-check text-amber-500/70"></i>No spam, ever</span>
            <span className="hidden sm:block w-px h-3 bg-stone-800"></span>
            <span className="flex items-center gap-1.5"><i className="bi bi-x-circle text-amber-500/70"></i>Unsubscribe anytime</span>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN FOOTER LINKS ────────────────────────────────────── */}
      <div className="bg-gray-900 text-white pt-12 pb-6 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-1 sm:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image src="/imgs/logo.ico" alt="BIA Logo" width={44} height={44} />
                <div>
                  <p className="font-bold text-white text-[16px] leading-tight">Byose Iwacu Art</p>
                  <p className="text-orange-400 text-[12px] font-medium">Made in Rwanda</p>
                </div>
              </Link>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-5">
                Celebrating African creativity, culture, and craftsmanship. Connecting artisans to the world.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 ${s.color} transition-all duration-200 text-[16px]`}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h5 className="text-white font-semibold text-[13px] uppercase tracking-widest mb-4">
                  {col.title}
                </h5>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="text-gray-400 hover:text-orange-400 transition-colors text-[13px] flex items-center gap-1.5 group"
                      >
                        <i className="bi bi-chevron-right text-[10px] text-gray-600 group-hover:text-orange-400 transition-colors"></i>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── PAYMENT METHODS ─────────────────────────────────── */}
          <div className="border-t border-gray-800 pt-6 pb-4">
            <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-3 font-medium">
              Accepted Payment Methods
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.label}
                  className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-750 px-3 py-2 rounded-lg text-[12px] transition-colors"
                >
                  <i className={`bi ${pm.icon} ${pm.color} text-base`}></i>
                  <span className="text-gray-300">{pm.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM BAR ──────────────────────────────────────── */}
          <div className="border-t border-gray-800 mt-4 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-500">
            <p>
              © {new Date().getFullYear()} Byose Iwacu Art. All rights reserved. Made with{" "}
              <i className="bi bi-heart-fill text-orange-500"></i> in Rwanda.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">Cookies</Link>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <i className="bi bi-globe2 text-gray-600"></i>
                <select className="bg-transparent outline-none text-gray-500 cursor-pointer text-[12px]">
                  <option>English</option>
                  <option>Français</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleBackToTop}
              className="flex items-center gap-2 border border-gray-700 hover:border-orange-500 hover:text-orange-400 px-3 py-1.5 rounded-full transition-all text-[12px]"
            >
              <i className="bi bi-arrow-up-circle-fill"></i> Back to top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
