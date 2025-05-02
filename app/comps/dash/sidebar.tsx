"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { redirect, usePathname } from "next/navigation";

const links = [
  { href: "/dash", icon: "bi-grid", text: "Dashboard" },
  { href: "/dash/profile", icon: "bi-person", text: "Profile" },
  { href: "/dash/orders", icon: "bi-cart", text: "My Orders" },
  { href: "/dash/payments", icon: "bi-credit-card", text: "My Payments" },
  { href: "/logout", icon: "bi-box-arrow-right", text: "Logout" },
];

interface SideBarProps {
  toggleButtonId: string; // ID of external toggle button
}

const SideBar: React.FC<SideBarProps> = ({ toggleButtonId }) => {
  const router = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Default closed

  useEffect(() => {
    // Detect screen size and set default state
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768); // Open on large screens (>=768px), closed on small screens
    };

    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById(toggleButtonId);

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, toggleButtonId]);

  useEffect(() => {
    const toggleBtn = document.getElementById(toggleButtonId);

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", handleToggle);
    }

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleToggle);
      }
    };
  }, [toggleButtonId]);

  return (
    <>
      {isOpen && (
        <menu
          id="sidebar"
          className="fixed h-screen shadow-lg w-[200px] bg-gradient-to-b bg-white from-white to-gray-100 top-0 left-0 z-40 border border-slate-300"
        >
          <div className="py-4 px-2">
            {/* Logo Section */}
            <div className="logo flex items-center py-4 px-3 font-semibold text-gray-800">
              <i className="bi bi-grid text-2xl text-orange-600 mr-3"></i>
              <span className="text-2xl uppercase text-slate-500 sm:inline">biadash</span>
            </div>

            {/* Links Section */}
            <div className="mt-4 mx-2 space-y-[2px]">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => redirect(link.href)}
                  className={`flex items-center text-gray-600 text-base sm:text-sm md:text-base hover:text-slate-500 px-2 py-2 transition-colors duration-300 rounded-md hover:bg-orange-100
                    ${
                      router === link.href ? "bg-orange-300 text-slate-50 font-semibold" : ""
                    }`}
                >
                  <i className={`bi ${link.icon} text-base sm:text-lg mr-3`}></i>
                  <span className="text-sm sm:inline">{link.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </menu>
      )}
    </>
  );
};

export default SideBar;
