"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CartDropdown from "../nav/cart";
import { redirect } from "next/navigation";

interface CartItem {
    id: number;
    name: string;
    price: number;
    amount: number;
    image: string;
  }
  

const Top = () =>{
      const [isHidden, setIsHidden] = useState(false);
      const [userInitials, setUserInitials] = useState<string | null>(null);
      const [isOpen, setIsOpen] = useState(false);
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
    return (
        <div className="fixed bg-white ml-[70px] sm:ml-[200px] top-0 z-40 w-full" style={{ width: "calc(100% - 200px)" }}>
            <div className="flex justify-between p-5 items-center w-full">
                <Link href={"/"} onClick={() => window.location.assign("/")} className="text-sm text-slate-500">
                <i className="bi bi-chevron-left mr-1"></i>
                 <span className="hidden sm:inline">Back to Home</span>
                </Link>
                <div className="flex items-center justify-around w-[60vw] sm:w-auto space-x-5">
                    <div className="flex mx-2 p-1 text-slate-500">
                        <i className="bi bi-chat-dots text-xl"></i>
                        <span className="absolute w-4 h-4 text-center bg-red-400 text-white rounded-full ml-3 text-[10px]">5</span>
                    </div>
                    <div className="flex mx-2 p-1 text-slate-500">
                        <i className="bi bi-bell text-xl"></i>
                        <span className="absolute w-4 h-4 text-center bg-red-400 text-white rounded-full ml-3 text-[10px]">5</span>
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
                <div className="bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg" style={{ width: '40px', height: '40px' }}>
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