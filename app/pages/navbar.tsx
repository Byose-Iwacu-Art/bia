"use client";
import Ads from "../comps/nav/ads";
import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react';
import CartDrawer from "../comps/nav/cart";
import { usePathname, useRouter } from "next/navigation";
import { useAuthModal } from "../comps/auth/AuthModalContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openLogin } = useAuthModal();

  const [scrolled, setScrolled] = useState(false);
  const [topBarHidden, setTopBarHidden] = useState(false);
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("EN");
  const [currency, setCurrency] = useState("RWF");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setTopBarHidden(y > 55);
    };

    const loadCartItems = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(stored);
      } catch { setCartItems([]); }
    };

    const loadUserSession = () => {
      try {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        if (session?.name) {
          const initials = session.name.split(" ").map((p: string) => p[0]).join('').toUpperCase().slice(0, 2);
          setUserInitials(initials);
        } else {
          setUserInitials(null);
        }
      } catch { setUserInitials(null); }
    };

    loadCartItems();
    loadUserSession();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const loadWishlist = () => {
      try {
        const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(Array.isArray(wl) ? wl.length : 0);
      } catch { setWishlistCount(0); }
    };

    loadWishlist();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') loadCartItems();
      if (e.key === 'wishlist') loadWishlist();
      if (e.key === 'userSession') loadUserSession();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.amount, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: "bi-house-fill" },
    { href: "/products", label: "Products", icon: "bi-bag-fill" },
    { href: "/contact-us", label: "Contact Us", icon: "bi-telephone-fill" },
    { href: "https://tailors.biafricantouch.com", label: "Tailors College", icon: "bi-mortarboard-fill", external: true },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ═══ HEADER ══════════════════════════════════════════════ */}
      <header className={`z-50 fixed top-0 left-0 right-0 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>

        {/* ── Announcement bar ────────────────────────────────── */}
        <Ads>
          <span className="text-white/90 text-[13px]">
            Tailors College Dream is live — become a leading tailor across Africa!
          </span>
          <a
            href="https://tailors.biafricantouch.com/apply"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-600 font-bold px-3 py-[3px] rounded-full text-[11px] hover:bg-orange-50 transition-colors ml-2 whitespace-nowrap tracking-wide"
          >
            Apply →
          </a>
        </Ads>

        {/* ── Slim info bar (desktop, collapses on scroll) ─────── */}
        <div className={`hidden sm:flex items-center justify-between px-6 bg-gray-50 border-b border-gray-100 text-[12px] text-gray-500 transition-all duration-300 overflow-hidden ${topBarHidden ? 'max-h-0 opacity-0 border-0' : 'max-h-9 opacity-100 py-[5px]'}`}>
          <span className="flex items-center gap-1.5">
            <i className="bi bi-truck text-orange-500"></i>
            Free shipping on orders over <strong className="text-gray-700 ml-1">50,000 RWF</strong>
          </span>
          <div className="flex items-center gap-5">
            <a href="tel:+250788282252" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
              <i className="bi bi-telephone-fill text-orange-400"></i>
              +250 788 282 252
            </a>
            <div className="flex items-center gap-1">
              <i className="bi bi-globe2 text-gray-400"></i>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent outline-none cursor-pointer text-[12px] text-gray-600">
                <option value="EN">English</option>
                <option value="FR">Français</option>
                <option value="RW">Kinyarwanda</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <i className="bi bi-currency-exchange text-gray-400"></i>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent outline-none cursor-pointer text-[12px] text-gray-600">
                <option value="RWF">RWF</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <Link href="/dash/orders" className="hover:text-orange-600 transition-colors flex items-center gap-1">
              <i className="bi bi-box-seam text-gray-400"></i>
              Track Order
            </Link>
          </div>
        </div>

        {/* ── Main bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 border-b border-gray-100">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 mr-2">
            <div className="relative">
              <Image src="/imgs/logo.ico" alt="BIA" width={40} height={40} priority className="rounded-lg" />
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-gray-900 text-[16px] leading-none tracking-tight">BIA</p>
              <p className="text-amber-500 text-[11px] font-semibold tracking-widest uppercase">African Touch</p>
            </div>
          </Link>

          {/* Search — desktop */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-full overflow-hidden border-2 border-gray-200 bg-white hover:border-orange-300 focus-within:border-orange-500 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.12)] transition-all duration-200">
              <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 px-5 py-2.5 text-[14px] outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors px-5 text-white flex items-center gap-2 text-[13px] font-semibold rounded-r-full">
                <i className="bi bi-search text-[14px]"></i>
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>
          </div>

          {/* Right actions */}
          <div ref={wrapperRef} className="flex items-center gap-1 sm:gap-2 ml-auto">

            {/* Mobile search */}
            <button className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
              <i className="bi bi-search text-[19px]"></i>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors relative" aria-label="Wishlist">
              <i className="bi bi-heart text-[19px]"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-extrabold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => { setIsCartOpen(!isCartOpen); setIsUserMenuOpen(false); }}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors relative"
              aria-label="Cart"
            >
              <i className="bi bi-cart2 text-[21px]"></i>
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-extrabold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              {userInitials ? (
                <>
                  <button
                    onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsCartOpen(false); }}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-orange-50 transition-colors rounded-full pl-0.5 pr-3 py-0.5 border border-transparent hover:border-orange-200"
                  >
                    <div className="bg-gradient-to-br from-orange-500 to-amber-400 text-white rounded-full flex items-center justify-center text-[12px] font-extrabold shadow-sm" style={{ width: '32px', height: '32px' }}>
                      {userInitials}
                    </div>
                    <i className={`bi bi-chevron-${isUserMenuOpen ? 'up' : 'down'} text-[10px] text-gray-400`}></i>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-[46px] w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-[fadeIn_0.15s_ease]">
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                        <p className="text-[10px] text-orange-400 uppercase font-semibold tracking-wider">Signed in as</p>
                        <p className="font-bold text-gray-800 text-[14px] truncate">{userInitials}</p>
                      </div>
                      <ul className="py-1.5">
                        <li>
                          <Link href="/dash" className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <i className="bi bi-speedometer2"></i> Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link href="/dash/orders" className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <i className="bi bi-bag-check"></i> My Orders
                          </Link>
                        </li>
                        <li className="border-t border-gray-100 mt-1">
                          <Link href="/logout" className="flex items-center gap-2 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                            <i className="bi bi-box-arrow-right"></i> Sign Out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => openLogin()}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors text-white font-bold text-[13px] px-4 py-2 rounded-full shadow-sm hover:shadow-md"
                >
                  <i className="bi bi-person-fill"></i>
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Category nav (desktop, collapses on scroll) ───────── */}
        <nav className={`hidden sm:flex items-center gap-1 px-6 bg-gray-50 border-b border-gray-200 transition-all duration-300 overflow-hidden ${topBarHidden ? 'max-h-0 opacity-0 border-0' : 'max-h-11 opacity-100 py-1.5'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150 whitespace-nowrap ${
                isActive(link.href) && !link.external
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <i className={`bi ${link.icon} text-[12px]`}></i>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ═══ MOBILE SEARCH OVERLAY ════════════════════════════════ */}
      {isSearchOpen && (
        <div ref={searchRef} className="sm:hidden fixed top-[62px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg px-4 py-3 animate-[fadeIn_0.15s_ease]">
          <form onSubmit={handleSearchSubmit} className="flex rounded-full overflow-hidden border-2 border-orange-400 bg-gray-50 focus-within:border-orange-500">
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 text-[15px] outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
            />
            <button type="submit" className="bg-orange-500 text-white px-5 rounded-r-full flex items-center justify-center">
              <i className="bi bi-search text-lg"></i>
            </button>
          </form>
        </div>
      )}

      {/* ═══ CART DRAWER ══════════════════════════════════════════ */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ═══ MOBILE BOTTOM NAV ════════════════════════════════════ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-stretch">
        {([
          { href: "/", icon: "bi-house-fill", label: "Home" },
          { href: "/products", icon: "bi-bag-fill", label: "Products" },
          { href: "#search", icon: "bi-search", label: "Search", action: () => setIsSearchOpen(true) },
          { href: "/checkout", icon: "bi-cart2", label: "Cart", badge: totalCartItems },
          { href: userInitials ? "/dash" : "#", icon: userInitials ? "bi-person-fill" : "bi-person", label: userInitials ?? "Account", action: userInitials ? undefined : () => openLogin() },
        ] as Array<{ href: string; icon: string; label: string; badge?: number; action?: () => void }>).map((item) => {
          const active = !item.action && isActive(item.href);
          return item.action ? (
            <button
              key={item.label}
              onClick={item.action}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-gray-400 hover:text-orange-500 transition-colors relative"
            >
              <i className={`bi ${item.icon} text-[20px]`}></i>
              <span className="text-[9px] font-semibold tracking-wide uppercase">{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
            >
              <span className="relative inline-block">
                <i className={`bi ${item.icon} text-[20px]`}></i>
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[8px] font-extrabold min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-[9px] font-semibold tracking-wide uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default NavBar;
