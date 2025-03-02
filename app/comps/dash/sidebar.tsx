import Link from "next/link";
import React from "react";
import { redirect, usePathname } from "next/navigation";


const links = [
  { href: "/dash", icon: "bi-grid", text: "Dashboard" },
  { href: "/dash/profile", icon: "bi-person", text: "Profile" },
  { href: "/dash/orders", icon: "bi-cart", text: "My Orders" },
  { href: "/dash/payments", icon: "bi-credit-card", text: "My Payments" },
  //{ href: "/dash/messages", icon: "bi-envelope", text: "Messages" },
  { href: "/logout", icon: "bi-box-arrow-right", text: "Logout" },
];

const SideBar = () => {
  const router = usePathname();
  return (
    <menu className="fixed h-screen shadow-lg w-min sm:w-[200px] bg-gradient-to-b from-white to-gray-100 top-0 left-0 z-30">
      <div className="py-4 px-2">
        {/* Logo Section */}
        <div className="logo flex items-center py-4 px-3 font-semibold text-gray-800">
          <i className="bi bi-grid text-2xl text-red-600 mr-3"></i>
          <span className="text-2xl uppercase text-slate-500 hidden sm:inline">biadash</span>
        </div>

        {/* Links Section */}
        <div className="mt-4 mx-2 space-y-[2px]">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => redirect(link.href)}
              className={`flex items-center text-gray-600 text-base sm:text-sm md:text-base hover:text-slate-500 px-2 py-2 transition-colors duration-300 rounded-md hover:bg-red-100
                ${ router === link.href ? "bg-red-300 text-slate-50 font-semibold" : ""
                }`}
            >
              <i className={`bi ${link.icon} text-base sm:text-lg mr-3`}></i>
              <span className="hidden text-sm sm:inline">{link.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </menu>
  );
};

export default SideBar;
