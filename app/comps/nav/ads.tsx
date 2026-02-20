"use client";
import React, { useEffect, useState, ReactNode } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface AdsProps {
  children: ReactNode;
}

const Ads: React.FC<AdsProps> = ({ children }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('ads-dismissed') === 'true';
    setIsDismissed(dismissed);

    const handleScroll = () => {
      setIsHidden(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ads-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div
      className={`w-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-500 ease-in-out hidden sm:flex items-center justify-between px-4 py-[6px] ${
        isHidden ? 'opacity-0 -translate-y-full h-0 overflow-hidden py-0' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-white text-[13px] font-medium">
        <i className="bi bi-megaphone-fill text-white/80 text-base"></i>
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="text-white/70 hover:text-white transition-colors ml-3 text-lg leading-none"
      >
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  );
};

export default Ads;
