"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuthModal } from '../auth/AuthModalContext';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: string | number;
  size: string | number;
  color: string;
  details: string;
  hashed_id: string;
  promotion: number;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

const ProductCard: React.FC<ProductCardProps> = ({ id, name, image, price, hashed_id, promotion }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { openLogin } = useAuthModal();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.find((item: any) => item.id === id)) setIsInCart(true);

    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (session?.id) {
      fetch(`/api/wishlist?user_id=${session.id}`)
        .then(r => r.ok ? r.json() : [])
        .then((items: Array<{ product_id: number }>) => {
          if (items.find(i => i.product_id === id)) setIsWished(true);
        })
        .catch(() => {
          const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
          if (wl.includes(id)) setIsWished(true);
        });
    } else {
      const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (wl.includes(id)) setIsWished(true);
    }
  }, [id]);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((item: any) => item.id === id);
    if (idx !== -1) {
      cart[idx].amount += 1;
    } else {
      cart.push({ id, name, image, price, amount: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
    setIsInCart(true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);

    // Sync to DB if logged in
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (session?.id) {
      const qty = idx !== -1 ? cart[idx].amount : 1;
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session.id, product_id: id, quantity: qty }),
      }).catch(() => {});
    }
  };

  const doWishlistAdd = () => {
    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (!session?.id) return;
    const wl: number[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wl.includes(id)) {
      localStorage.setItem("wishlist", JSON.stringify([...wl, id]));
      setIsWished(true);
      window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist' }));
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session.id, product_id: id }),
      }).catch(() => {});
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (!session?.id) {
      // Not logged in — open login modal; on success, add to wishlist
      openLogin(doWishlistAdd);
      return;
    }

    // Logged in — instant toggle
    const wl: number[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const updated = isWished ? wl.filter((i: number) => i !== id) : [...wl, id];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setIsWished(!isWished);
    window.dispatchEvent(new StorageEvent('storage', { key: 'wishlist' }));

    fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: session.id, product_id: id }),
    }).catch(() => {});
  };

  const discountPrice = promotion > 0
    ? Number(price) - (Number(price) * promotion / 100)
    : Number(price);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col relative">

      {/* Image link — no interactive children inside */}
      <Link href={`/products/${hashed_id}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={image || '/imgs/logo.ico'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          />

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover "View product" pill */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View product
            </span>
          </div>

          {/* Discount badge */}
          {promotion > 0 && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              -{promotion}%
            </span>
          )}
        </div>
      </Link>

      {/* Wishlist button — outside Link, absolutely positioned over image top-right */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
          isWished
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-400 hover:text-red-500 hover:bg-white'
        }`}
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <i className={`bi ${isWished ? 'bi-heart-fill' : 'bi-heart'} text-[11px]`}></i>
      </button>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/products/${hashed_id}`}>
          <p className="text-[12px] text-gray-700 font-medium line-clamp-2 leading-snug hover:text-orange-600 transition-colors mb-2">
            {name}
          </p>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-[16px] font-extrabold text-orange-600">
            {fmt(discountPrice)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">RWF</span>
          {promotion > 0 && (
            <span className="text-[10px] text-gray-400 line-through ml-auto">
              {fmt(Number(price))} RWF
            </span>
          )}
        </div>

        {/* Cart button */}
        <button
          onClick={!isInCart ? addToCart : undefined}
          className={`mt-auto w-full py-2 rounded-xl text-[11px] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
            justAdded
              ? 'bg-green-500 text-white scale-95'
              : isInCart
              ? 'bg-orange-500 text-white cursor-default'
              : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-500 hover:text-white hover:border-transparent hover:shadow-md hover:shadow-orange-200'
          }`}
        >
          <i className={`bi text-[12px] ${justAdded ? 'bi-check-lg' : isInCart ? 'bi-check2' : 'bi-cart-plus'}`}></i>
          {justAdded ? 'Added!' : isInCart ? 'In Cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
