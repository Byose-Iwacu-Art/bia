"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CartDropdown from "../nav/cart";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}

interface Notification {
  id: number;
  content_text: string;
  event: string;
  action_required: string;
  created_at: string;
  view: string | null;
}

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const prefix = Number(hours) >= 12 ? 'PM' : 'AM';
  return `${months[date.getMonth()]} ${day}, ${date.getFullYear()} ${hours}:${minutes} ${prefix}`;
}

const Top = ({ onSidebarClick }: { onSidebarClick: (id: string) => void }) => {
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCartItems = () => {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(stored);
    };
    const loadUserSession = () => {
      try {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        if (session?.name) {
          setUserInitials(session.name.split(" ").map((p: string) => p[0]).join('').toUpperCase().slice(0, 2));
        }
      } catch { /* ignore */ }
    };
    loadCartItems();
    loadUserSession();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') loadCartItems();
      if (e.key === 'userSession') loadUserSession();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.amount, 0);

  const fetchNotifications = useCallback(async () => {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (session?.id) {
        const res = await fetch(`/api/auth/notification/${session.id}`);
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch {
      setNotifications([]);
    }
  }, []);

  const updateNotifications = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (session?.id) await fetch(`/api/auth/notification/update/${session.id}`);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        updateNotifications();
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.view === "Unread").length;

  return (
    <div className="z-30 fixed top-0 bg-white sm:ml-[240px] dashbar h-[64px] border-b border-gray-100">
      <div className="flex justify-between items-center px-5 h-full">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button id="menuToggle" className="sm:hidden w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={() => onSidebarClick("menuToggle")}>
            <i className="bi bi-list text-[18px] text-gray-600"></i>
          </button>
          <Link href="/" className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
            <i className="bi bi-chevron-left text-[10px]"></i>
            <span>Store</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div className="relative" ref={wrapperRef}>
            <button
              className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <i className="bi bi-bell text-[16px] text-gray-600"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-900">Notifications</p>
                  {unreadCount > 0 && (
                    <p className="text-[11px] text-gray-400">{unreadCount} unread</p>
                  )}
                </div>
                <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          n.view === "Unread" ? "bg-gray-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.view === "Unread" ? "bg-gray-900" : "bg-gray-200"}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] ${n.view === "Unread" ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                              {n.content_text}
                            </p>
                            <div className="flex justify-between items-center mt-1.5">
                              <span className="text-[11px] text-gray-400">{formatDate(n.created_at)}</span>
                              <a
                                href={n.action_required || "/dash/"}
                                className="text-[11px] text-gray-500 hover:text-gray-900 font-medium transition-colors"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-8 text-center">
                      <i className="bi bi-bell text-gray-200 text-2xl"></i>
                      <p className="text-[13px] text-gray-400 mt-2">No notifications</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <i className="bi bi-bag text-[15px] text-gray-600"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden z-50">
                <CartDropdown open={isCartOpen} onClose={() => setIsCartOpen(false)} />
              </div>
            )}
          </div>

          {/* User */}
          {userInitials ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-[12px] font-bold hover:bg-gray-800 transition-colors"
              >
                {userInitials}
              </button>
              {isOpen && (
                <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="py-2 px-2">
                    <Link href="/dash/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <i className="bi bi-person text-[15px] text-gray-400"></i>
                      Profile
                    </Link>
                    <Link href="/dash/orders" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <i className="bi bi-bag text-[15px] text-gray-400"></i>
                      Orders
                    </Link>
                    <Link href="/logout" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                      <i className="bi bi-box-arrow-right text-[15px]"></i>
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Top;
