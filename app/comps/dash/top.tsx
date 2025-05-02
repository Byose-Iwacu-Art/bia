"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CartDropdown from "../nav/cart";
import { redirect } from "next/navigation";

interface CartItem {
    id: number;
    name: string;
    price: number;
    amount: number;
    image: string;
  }

interface Notification  {
  id: number;
  content_text: string;
  event: string;
  action_required: string;
  created_at: string;
  view: string  | null;
};

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const prefix = Number(hours) >= 12 ? 'PM' : 'AM';

  return `${month}, ${day} ${year} ${hours}:${minutes} ${prefix}`;
};


const Top = ({ onSidebarClick }: { onSidebarClick: (productId: string) => void }) => {
      const [isHidden, setIsHidden] = useState(false);
      const [userInitials, setUserInitials] = useState<string | null>(null);
      const [isOpen, setIsOpen] = useState(false);
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [cartItems, setCartItems] = useState<CartItem[]>([]);
      const [showNotifications, setShowNotifications] = useState(false);
      const [notifications, setNotifications] = useState<Notification[]>([]); 

      const wrapperRef = useRef(null);
  
        // Load initial cart items and user session
        useEffect(() => {
          const handleScroll = () => {
            setIsHidden(window.scrollY > 60 && window.innerWidth > 768);
          };
      
          const loadCartItems = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(storedCart);
          };
      
          const loadUserSession = () => {
            const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
            if (userSession && userSession.name) {
              const initials = userSession.name.split(" ").map((part: string) => part[0]).join('').toUpperCase();
              setUserInitials(initials);
              
            }
          };
      
          loadCartItems();
          loadUserSession();
          window.addEventListener('scroll', handleScroll);
      
          // Listen for storage events to dynamically update UI when cart changes
          const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'cart') {
              loadCartItems(); // Update cartItems state when cart changes in localStorage
            }
          };
      
          window.addEventListener('storage', handleStorageChange);
      
          
        }, [cartItems, userInitials]);
      
        // Calculate total cart items by summing up the amounts
        const totalCartItems = cartItems.reduce((acc, item) => acc + item.amount, 0);
        
        const fetchNotifications = useCallback(async () => {
          try {
            const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
            if (userSession && userSession.id) {
              const userId = userSession.id;
              const res = await fetch(`/api/auth/notification/${userId}`);
              const data = await res.json();
              setNotifications(Array.isArray(data) ? data : []);
            }
          } catch (err) {
            console.error("Failed to load notifications:", err);
            setNotifications([]); // fallback to empty array on error
          }
        }, []);
        
        
  const updateNotifications = async () => {
    try {
      const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (userSession && userSession.id) {
        const userId = userSession.id;
        const res = await fetch(`/api/auth/notification/update/${userId}`);
        if (res.ok) {
          console.log("Notifications updated");
       }
      }
    } catch (err) {
      console.error("Failed to trigger update job:", err);
    }
  };

  
  useEffect(() => {
    // Initial calls
    fetchNotifications();

    // Set interval to repeat every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1000 * 5); // 2000ms = 2 seconds

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => { 
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
        updateNotifications();
        setShowNotifications(false);
        
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => n.view === "Unread").length
  : 0;

    return (
        <div className="z-30 fixed top-0 bg-white sm:ml-[200px] dashbar">
            <div className="flex justify-between px-5 shadow-sm py-2 items-center w-full ">
                <div className="flex items-center space-x-4">
                <button id="menuToggle" className="sm:hidden inline" onClick={() => onSidebarClick("menuToggle")}>
                  <i className="bi bi-list text-2xl"></i>
                </button>

                <Link href={"/"} onClick={() => window.location.assign("/")} className="text-sm text-slate-500">
                <i className="bi bi-chevron-left mr-1"></i>
                 <span className="inline">Back</span>
                </Link>
                </div>
                <div className="flex items-center justify-around w-[60vw] sm:w-auto sm:space-x-5">
                    <div className="relative">
                      <div className="flex mx-2 p-1 text-slate-500" onClick={() => setShowNotifications((prev) => !prev)}>
                        <i className="bi bi-bell-fill text-2xl"></i>
                        {unreadCount > 0 && (
                          <span className="absolute w-4 h-4 text-center bg-red-400 text-white rounded-full ml-3 text-[10px] ">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {/* Notification Dropdown */}
          {showNotifications && (
            <div
              ref={wrapperRef}
              className="absolute sm:-right-28 w-72 mt-2 bg-white shadow-lg rounded-lg p-3 border border-orange-300"
            >
              <div className="text-sm font-semibold text-gray-700">
                Notifications
              </div>
              <ul className="max-h-96 overflow-y-auto divide-y divide-neutral-300">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`py-3 px-4 hover:bg-neutral-100 cursor-pointer space-y-1 text-sm ${
                        n.view === "Unread" ? "font-semibold text-gray-700" : "text-neutral-500"
                      }`}
                    >
                      <div className="text-emerald-700">{n.event}</div>
                      <div>{n.content_text}</div>
                      <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                        <span className="text-orange-900">{formatDate(n.created_at)}</span>
                        <a
                          href={n.action_required || "/dash/"}
                          className="border-b border-emerald-800 px-2 py-[2px] rounded-dull text-emerald-700 flex justify-self-end"
                          target="_blank"
                        >
                          View
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500 text-center">No notifications</li>
                )}
              </ul>
            </div>
          )}
                    </div>

                     {/* Cart with item count */}
          <div className="relative mx-2">
            <div onClick={() => setIsCartOpen(!isCartOpen)} className="cursor-pointer relative">
              <i className="bi bi-cart text-2xl text-gray-800"></i>
              {totalCartItems > 0 && (
                <span className="absolute mt-[-3px] mr-[-3px] top-0 right-0 bg-red-500 text-white px-[5px] rounded-full text-[12px]">
                  {totalCartItems}
                </span>
              )}
            </div>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-[-70px] mt-3 w-80 bg-white shadow-2xl rounded-lg overflow-hidden z-50">
                <CartDropdown setCartItem={setCartItems} onClose={() => setIsCartOpen(!isCartOpen)}/>
              </div>
            )}
          </div>

          <div className="">
            {userInitials ? (
              <div className="relative flex items-center bg-slate-100 rounded-full p-1 cursor-pointer hover:bg-slate-200 transition-all duration-300" onClick={() => setIsOpen(!isOpen)}>
                <div className="bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg" style={{ width: '30px', height: '30px' }}>
                  {userInitials}
                </div>
                
                {isOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-40 bg-white rounded-lg shadow-xl overflow-hidden z-50">
                    <ul className="flex flex-col py-2 px-3 space-y-2">
                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-person mr-2 text-lg text-green-500"></i>
                        <Link href="/dash/profile" onClick={() => redirect("/dash/profile")} className="text-gray-700 hover:text-green-500 transition-colors">Profile</Link>
                      </li>
                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-cart mr-2 text-lg text-teal-500"></i>
                        <Link href="/dash/orders" onClick={() => redirect("/dash/orders")} className="text-gray-700 hover:text-green-500 transition-colors">Orders</Link>
                      </li>

                      <li className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition-all">
                        <i className="bi bi-box-arrow-right mr-2 text-lg text-orange-500"></i>
                        <Link href="/logout" onClick={() => redirect("/logout")} className="text-gray-700 hover:text-orange-500 transition-colors">Logout</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" onClick={() => redirect("/auth/login")} className="flex bg-slate-200 py-1 px-5 rounded-lg text-base">
                Sign in
              </Link>
            )}
          </div>
          
                </div>
            </div>
        </div>
    )
}
export default Top;