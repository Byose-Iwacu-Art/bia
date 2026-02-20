"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import 'bootstrap-icons/font/bootstrap-icons.css';

const links = [
  { href: "/dash", icon: "bi-grid-1x2-fill", text: "Dashboard" },
  { href: "/dash/orders", icon: "bi-bag", text: "My Orders" },
  { href: "/dash/payments", icon: "bi-credit-card", text: "Payments" },
  { href: "/dash/invoices", icon: "bi-receipt", text: "Invoices" },
  { href: "/dash/profile", icon: "bi-person", text: "Profile" },
];

interface SideBarProps {
  toggleButtonId: string;
}

const SideBar: React.FC<SideBarProps> = ({ toggleButtonId }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || 'null');
      if (session?.name) {
        setUserName(session.name);
        setUserInitials(session.name.split(" ").map((p: string) => p[0]).join('').toUpperCase().slice(0, 2));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById(toggleButtonId);
      if (
        sidebar && !sidebar.contains(event.target as Node) &&
        toggleBtn && !toggleBtn.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("click", handleClickOutside);
    else document.removeEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, toggleButtonId]);

  useEffect(() => {
    const toggleBtn = document.getElementById(toggleButtonId);
    const handleToggle = () => setIsOpen((prev) => !prev);
    if (toggleBtn) toggleBtn.addEventListener("click", handleToggle);
    return () => { if (toggleBtn) toggleBtn.removeEventListener("click", handleToggle); };
  }, [toggleButtonId]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {isOpen && (
        <menu
          id="sidebar"
          className="fixed h-screen w-[240px] bg-white border-r border-gray-100 top-0 left-0 z-40 flex flex-col"
        >
          {/* Logo */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="bi bi-grid-1x2-fill text-white text-[12px]"></i>
              </div>
              <span className="text-[16px] font-bold text-gray-900 tracking-tight">Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 space-y-1">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">Menu</p>
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <i className={`bi ${link.icon} text-[15px] ${isActive(link.href) ? "text-white" : "text-gray-400"}`}></i>
                <span>{link.text}</span>
              </Link>
            ))}

            <div className="pt-4">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">Other</p>
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <i className="bi bi-house text-[15px] text-gray-400"></i>
                <span>Back to Store</span>
              </Link>
              <Link
                href="/logout"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <i className="bi bi-box-arrow-right text-[15px] text-gray-400"></i>
                <span>Logout</span>
              </Link>
            </div>
          </div>

          {/* User card */}
          <div className="px-4 py-4 border-t border-gray-100">
            <Link href="/dash/profile" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                {userInitials || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{userName || 'Guest'}</p>
                <p className="text-[11px] text-gray-400 group-hover:text-emerald-600 transition-colors">View Profile</p>
              </div>
            </Link>
          </div>
        </menu>
      )}
    </>
  );
};

export default SideBar;
