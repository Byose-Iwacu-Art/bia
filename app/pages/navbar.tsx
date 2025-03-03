"use client";
import Ads from "../comps/nav/ads";
import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import CartDropdown from "../comps/nav/cart";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import WarningPopup from "./access";

interface CartItem {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}

const NavBar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const router = useRouter()
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

  const links = [
    { href: "/", icon: "bi-house", text: "Home" },
    { href: "/products", icon: "bi-bag", text: "Products" },
    { href: "https://tailors.biafricantouch.com", icon: "bi-mortarboard", text: "Tailors Dream College" },
    /*{ href: "/stores", icon: "bi-shop", text: "Stores" }, */
    { href: "https://tailors.biafricantouch.com/contact-us", icon: "bi-telephone", text: "Contact us" },
  ];

  return (
    <header className={`z-50 fixed top-0 bg-white w-full ${isHidden ? 'shadow' : 'shadow-sm'}`}>
      {/* Ads panel */}
      <Ads>
        <p className='text-slate-300 p-1 px-4'>We are hosting new Tailors Dream College soon, book a seat!</p> 
        <Link className='bg-green-400 text-white px-2 py-[4px] m-1 rounded cursor-pointer' href={"https://tailors.biafricantouch.com/apply"}>Register now</Link>
      </Ads>
      <WarningPopup message="This platform is still under development ... We promise to be back soon" />
      {/* Navigation */}
      <nav className="flex justify-start items-center px-2 flex-col-reverse sm:flex-row sm:justify-between sm:pb-0 sm:px-10" >
        {/* Logo and search bar */}
        <div className="flex items-center justify-between w-full py-1 sm:w-3/6 sm:justify-between" onClick={() => setIsCartOpen(false)}>
          <div>
            <Image
              src="/imgs/logo.ico"
              alt="Logo"
              width={50}
              height={50}
            />
          </div>
          <form action={'/search'} method="get" className="flex sm:shadow rounded-[2px] sm:rounded w-[70%] mx-2 border border-slate-200 h-min mt-1 sm:w-[80%] sm:border-0">
            <input 
              type="search" 
              name="q" 
              id="q" 
              placeholder="Search product, store, category, ..."
              className="px-[15px] py-1 w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="bg-red-400 h-full gap-4 py-[7px] px-1 sm:py-[10px]">
              <i id="searchBtn" className="bi bi-search px-[16px] cursor-pointer text-[15px] text-white"></i>
            </button>
          </form>
        </div>

        {/* Contact, language, and cart */}
        <div className="flex items-center justify-around w-full text-[14px] sm:w-[33%] sm:justify-between sm:py-0">
          <div className="text-[12px] font-[100] font-serif text-black sm:text-[15px]">
            <i className="bi bi-telephone text-lg text-slate-400"></i>
            <span className="ml-2 mt-1 mr-3 text-slate-600 ">+250788282252</span>
          </div>
          <div>
            <div className="flex items-center rounded-[2px] px-2">
              <i className="bi bi-globe text-lg text-slate-400"></i>
              <select name="" id="lang" className="p-[5px] outline-none text-slate-600" disabled={true}>
                <option value="">English</option>
                <option value="">Kiny</option>
                <option value="">French</option>
              </select>
            </div>
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
                        <Link href="/dash" onClick={() => redirect("/dash")} className="text-gray-700 hover:text-green-500 transition-colors">Dashboard</Link>
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
      </nav>

      <menu className={`flex justify-between pb-1 pl-[25px] transition-transform duration-500 ${isHidden ? 'fixed -translate-y-full opacity-0' : 'opacity-100 -translate-y-0'} w-full small-device-menu`}>
        <div className="hidden sm:flex">
          <span className="text-[#000a] hidden">
           <i className="bi bi-grid"></i>
           <span>MENU</span>
          </span>
        </div>
        <div className="flex justify-end w-full">
        {links.map((link, index) => (
         <Link
          key={index}
          href={link.href}
          onClick={() => redirect(link.href)}
          className="text-[#000a] text-[30px] mx-2 sm:mr-[20px] hover:text-orange-600 flex sm:text-[15px] flex-col text-center sm:flex-row"
          >
           <i className={`bi ${link.icon} mr-2`}></i>
           <span className="hidden sm:block md:flex lg:flex">{link.text}</span>
          </Link>
        ))}
      </div>
     </menu>
    </header>
  );
};

export default NavBar;
