"use client";
import Ads from "../comps/nav/ads";
import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import CartDropdown from "../comps/nav/cart";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    { href: "https://tailors.biafricantouch.com/contact-us", icon: "bi-phone", text: "Contact us" },
  ];

  return (
    <header className={`z-50 fixed top-0 bg-white w-full ${isHidden ? 'shadow' : 'shadow-sm'}`}>
      {/* Ads panel */}
      <Ads>
        <p className='text-slate-300 p-1 px-4'>We are hosting new Tailors Dream College soon, book a seat!</p> 
        <Link className='bg-green-400 text-white px-2 py-[4px] m-1 rounded cursor-pointer' href={"https://tailors.biafricantouch.com/apply"}>Register now</Link>
      </Ads>
      {/*
      <WarningPopup message="This platform is still under development ... We promise to be back soon" />
        Navigation */}
      <nav className="flex items-center space-x-9 sm:justify-between px-3 " >
        {/* Logo and search bar */}
        <div className="flex items-center space-x-5 w-1/2 py-2" onClick={() => setIsCartOpen(false)}>
          <div>
            <Image
              src="/imgs/logo.ico"
              alt="Logo"
              width={50}
              height={50}
            />
          </div>
            {/* Button for Mobile */}
           
          <form action={'/search'} method="get" className={`sm:flex ${isSearchOpen ? 'flex fixed left-0 mt-[30%] backdrop-blur-xl w-[90%] justify-between items-center z-50' : 'hidden'} bg-red-100 px-4 py-1 rounded sm:w-full space-x-4`}>
            <input 
              type="search" 
              name="q" 
              id="q" 
              placeholder="Search product, store, category, ..."
              className="text-sm outline-none placeholder:text-slate-400 w-full py-2 px-5 rounded-full"
            />
            <button type="submit" className="">
              <i id="searchBtn" className="bi bi-search cursor-pointer text-white"></i>
            </button>
          </form>
        </div>

        {/* Contact, language, and cart */}
        <div className="flex items-center sm:space-x-4 space-x-3 w-1/2 justify-end text-[14px] sm:w-[33%] sm:justify-between sm:py-0">
           <div className={`items-center rounded-[2px] px-2 sm:hidden`}>
            <i className={`bi bi-${isSearchOpen ? 'x':'search'} text-2xl text-slate-600`} onClick={() => setIsSearchOpen(!isSearchOpen)} ></i>
            </div>
          <div className="text-[12px] font-[100] sm:flex hidden font-serif text-black sm:text-[15px]">
            <i className="bi bi-telephone text-lg text-slate-400"></i>
            <span className="ml-2 mt-1 mr-3 text-slate-600 ">+250788282252</span>
          </div>
          <div>
           <div className="flex items-center rounded-[2px] px-2">
              <i className="bi bi-globe text-xl text-slate-400"></i>
              <select name="" id="lang" className="p-[5px] outline-none text-slate-700 bg-transparent" disabled={true}>
                <option value="">English</option>
                <option value="">Kiny</option>
                <option value="">French</option>
              </select>
            </div>
          </div>
           
          {/* Cart with item count */}
          <div className="relative mx-2">
            <div onClick={() => setIsCartOpen(!isCartOpen)} className="cursor-pointer relative">
              <i className="bi bi-cart sm:text-2xl text-3xl text-gray-800"></i>
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
              <Link href="/auth/login" onClick={() => redirect("/auth/login")} className="flex bg-slate-200 py-1 px-5 rounded-lg text-base text-nowrap">
                Sign in
              </Link>
            )}
          </div>
          
        
        </div>
      </nav>

      <menu className={`flex justify-between pb-2 pl-[25px] transition-transform duration-500 ${isHidden ? 'fixed -translate-y-full opacity-0' : 'opacity-100 -translate-y-0'} w-full small-device-menu`}>
        <div className="hidden sm:flex">
          
        </div>
        <div className="flex justify-end w-full">
        {links.map((link, index) => (
         <Link
          key={index}
          href={link.href}
          onClick={() => redirect(link.href)}
          className="text-[#000a] text-3xl mx-2 sm:mr-[20px] hover:text-orange-600 flex sm:text-[15px] flex-col text-center sm:flex-row"
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
