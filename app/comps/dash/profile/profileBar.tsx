"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileStatus from "./profileStatus";

const links = [
  { href: "/dash/profile", icon: "bi-person", text: "Personal Information", desc: "View and edit your details" },
];

const ProfileBar = () => {
  const [activeLink, setActiveLink] = useState("/dash/profile");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-max">
      <ProfileStatus completionPercentage={80} />

      <div className="flex flex-col space-y-1 mt-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              activeLink === link.href
                ? "bg-gray-50 border-l-2 border-gray-900"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveLink(link.href)}
          >
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className={`bi ${link.icon} text-[15px] text-gray-500`}></i>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-900">{link.text}</p>
              <p className="text-[11px] text-gray-400">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileBar;
